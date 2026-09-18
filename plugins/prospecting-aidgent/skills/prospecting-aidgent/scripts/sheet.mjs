// Pure plans and verification. Google Drive connector performs actual operations.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {resolveFields,planResearchUpdates} from './sheet-schema.mjs';
import {canonicalizeLinkedInUrl} from './lib/url.mjs';
const template=JSON.parse(fs.readFileSync(new URL('../template.json',import.meta.url),'utf8'));
const stable=x=>JSON.stringify(sort(x));
function sort(x) { return Array.isArray(x)?x.map(sort):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,sort(x[k])])):x; }
const digest=x=>crypto.createHash('sha256').update(stable(x)).digest('hex');
const value=c=>c?.userEnteredValue?.stringValue??'';
function contactKey(text) {
  const linkedin=canonicalizeLinkedInUrl(text);
  if (linkedin) return linkedin;
  try {
    const u=new URL(text);
    // Preserve identity-bearing query parameters on non-LinkedIn contact pages.
    for (const key of [...u.searchParams.keys()]) if (/^utm_/i.test(key)) u.searchParams.delete(key);
    u.searchParams.sort();
    return u.host.toLowerCase().replace(/^www\./,'')+u.pathname.replace(/\/$/,'')+u.search;
  }
  catch { return text; }
}
function writable(s) {
  if (!s.spreadsheetId || s.spreadsheetId===template.spreadsheetId) throw Error('A private copy is required; refusing the master template');
  if (!Number.isInteger(s.sheetId)||s.startRowIndex!==0||!Array.isArray(s.rows)||s.rows.length<2) throw Error('Snapshot must include header row 0 through the affected rows');
  if (!Array.isArray(s.rows[0]?.values)||!s.rows[0].values.length) throw Error('Missing headings');
  if (s.workbook?.spreadsheetId && s.workbook.spreadsheetId!==s.spreadsheetId) throw Error('Workbook identity mismatch');
  const sheet=s.workbook?.sheets?.find(x=>x.properties?.sheetId===s.sheetId);
  if (!sheet || sheet.properties.title!=='Leads') throw Error('Research writes require the bound Leads tab; resolve renamed tabs explicitly first');
}
function view(s) {
  writable(s);
  const width=s.rows[0].values.length;
  if (s.rows.some(r=>(r.values?.length??0)>width)) throw Error('Snapshot headings must cover every occupied column');
  const rows=s.rows.map(r=>Array.from({length:width},(_,i)=>{
    const c=r.values?.[i]??{};
    return s.mode==='values' ? {value:c.userEnteredValue??null} : {value:c.userEnteredValue??null,note:c.note??'',link:c.userEnteredFormat?.textFormat?.link??null,validation:c.dataValidation??null};
  }));
  return {spreadsheetId:s.spreadsheetId,sheetId:s.sheetId,mode:s.mode??'cells',fields:resolveFields(s.workbook,s.sheetId,s.rows[0].values),rows};
}
export function fingerprint(snapshot) { return digest(view(snapshot)); }

// Values reads must use FORMULA so formulas displaying blank cannot look empty.
// Missing formatting metadata is deliberately not invented or required here.
export function snapshotFromValues(workbook,sheetId,response,readMode) {
  if (readMode!=='FORMULA') throw Error('Use a FORMULA value read, not display-only values');
  const sheet=workbook.sheets?.find(s=>s.properties?.sheetId===sheetId)?.properties;
  const match=/^(?:'((?:[^']|'')+)'|([^!]+))!A1:([A-Z]+)([1-9][0-9]*)$/.exec(response.range??'');
  if (!sheet||!match||(match[1]?.replace(/''/g,"'")??match[2])!==sheet.title) throw Error('Need a verified bounded A1 range from row 1 for this tab');
  const width=[...match[3]].reduce((n,c)=>n*26+c.charCodeAt(0)-64,0), height=Number(match[4]);
  if (!Number.isInteger(sheet.gridProperties?.rowCount)||!Number.isInteger(sheet.gridProperties?.columnCount)||height<2||height*width>50000||height>sheet.gridProperties.rowCount||width>sheet.gridProperties.columnCount) throw Error('Snapshot bounds exceed the verified grid or read budget');
  if (response.majorDimension && response.majorDimension!=='ROWS') throw Error('Expected row-major values');
  const values=response.values??[];
  if (values.length>height||values.some(r=>!Array.isArray(r)||r.length>width)) throw Error('Values exceed the declared read bounds');
  const rows=Array.from({length:height},(_,r)=>({values:Array.from({length:width},(_,c)=>{
    const v=values[r]?.[c]; if(v===undefined||v===null||v==='') return {};
    if(typeof v==='number') return {userEnteredValue:{numberValue:v}};
    if(typeof v==='boolean') return {userEnteredValue:{boolValue:v}};
    if(typeof v!=='string') throw Error('Unsupported cell value');
    return {userEnteredValue:{[v.startsWith('=')?'formulaValue':'stringValue']:v}};
  })}));
  // Only actual visible headings are available to this path, never guessed notes.
  return {spreadsheetId:workbook.spreadsheetId,workbook:{...workbook,namedRanges:[]},sheetId,startRowIndex:0,mode:'values',rows};
}

export function makePlan(snapshot,changes) {
  writable(snapshot);
  const before=view(snapshot), expected=structuredClone(before), requests=[], touched=new Set();
  if (!Array.isArray(changes)||!changes.length) throw Error('Provide a nonempty changes array');
  for (const item of changes) {
    const row=item.rowIndex;
    if (!Number.isInteger(row)||row<1||row>=snapshot.rows.length||touched.has(row)) throw Error('Rows must be unique, visible in the snapshot, and below headings');
    touched.add(row);
    const current=before.rows[row], fields=before.fields;
    const occupied=current.some(c=>c.value!==null||c.note||c.link);
    const person=value(snapshot.rows[row].values?.[fields.person]);
    const contact=value(snapshot.rows[row].values?.[fields.contact_url]);
    if (occupied) {
      if (!person || item.expectedPerson!==person || item.expectedContact!==contact) throw Error('Existing row identity must match person and contact URL');
      if (item.fields.person!==undefined && item.fields.person!==person) throw Error('Cannot replace an existing person');
      if (item.fields.contact_url!==undefined && item.fields.contact_url!==contact) throw Error('Contact identity changes require separate review');
      const message=value(snapshot.rows[row].values?.[fields.message]);
      if (item.fields.message!==undefined && item.fields.message!==message) {
        if (typeof item.lastVerifiedMessage!=='string') throw Error('Changing an existing draft requires lastVerifiedMessage from the saved verified write; otherwise preserve it');
        if (item.lastVerifiedMessage!==message) throw Error('Existing message differs from the last verified draft; preserve the user edit');
      }
    } else {
      for (const key of ['person','fit','why_now','message','contact_url']) if (!item.fields?.[key]?.trim()) throw Error('New recommendation missing '+key);
      const duplicate=expected.rows.slice(1).some(r=>contactKey(r[fields.contact_url]?.value?.stringValue??'')===contactKey(item.fields.contact_url));
      if (duplicate) throw Error('Contact URL already exists in this snapshot');
    }
    const rowRequests=planResearchUpdates(snapshot.workbook,snapshot.sheetId,snapshot.rows[0].values,row,item.fields);
    for (const request of rowRequests) {
      const u=request.updateCells, col=u.range.startColumnIndex, cell=u.rows[0].values[0];
      if (snapshot.rows[row].values?.[col]?.userEnteredValue?.formulaValue!==undefined) throw Error('Refusing to overwrite an existing formula');
      if (snapshot.mode==='values') {
        if (occupied) throw Error('Values-only fallback adds new rows; use CellData to revise existing research');
        if (cell.userEnteredValue.stringValue.startsWith('=')) throw Error('Formula-like text needs a CellData write/readback');
        delete cell.userEnteredFormat; u.fields='userEnteredValue';
      }
      // Values reads omit empty strings, including optional fields explicitly
      // written as RAW ''. Match snapshotFromValues without hiding real edits.
      expected.rows[row][col].value=snapshot.mode==='values'&&cell.userEnteredValue.stringValue===''?null:cell.userEnteredValue;
      if (u.fields.includes('textFormat.link')) expected.rows[row][col].link=cell.userEnteredFormat?.textFormat?.link??null;
    }
    requests.push(...rowRequests);
  }
  const valuesData=requests.map(({updateCells:u})=>({range:"'"+snapshot.workbook.sheets.find(s=>s.properties.sheetId===snapshot.sheetId).properties.title.replace(/'/g,"''")+"'!"+columnLetter(u.range.startColumnIndex)+(u.range.startRowIndex+1),values:[[u.rows[0].values[0].userEnteredValue.stringValue]]}));
  return {schema:'prospecting-write-plan-1',mode:snapshot.mode??'cells',spreadsheetId:snapshot.spreadsheetId,sheetId:snapshot.sheetId,rowCount:snapshot.rows.length,columnCount:snapshot.rows[0].values.length,before:fingerprint(snapshot),after:digest(expected),requests,...(snapshot.mode==='values'?{valuesBody:{valueInputOption:'RAW',data:valuesData}}:{})};
}
function columnLetter(index) { let result='';for(let n=index+1;n>0;n=Math.floor((n-1)/26)) result=String.fromCharCode(65+(n-1)%26)+result;return result; }
export function check(plan,snapshot,phase='before') {
  if (!['before','after'].includes(phase)||plan.schema!=='prospecting-write-plan-1') throw Error('Invalid plan or phase');
  if (plan.spreadsheetId!==snapshot.spreadsheetId||plan.sheetId!==snapshot.sheetId) throw Error('Plan targets a different Sheet');
  if (fingerprint(snapshot)!==plan[phase]) throw Error(phase==='before'?'Sheet changed; reread and rebuild the plan':'Readback differs; stop and inspect without retrying writes');
  return {verified:true,phase,requests:plan.requests.length};
}
export function main(args) {
  const [command,...rest]=args, options={};
  for(let i=0;i<rest.length;i+=2) { if(!rest[i]?.startsWith('--')||!rest[i+1]) throw Error('Use --snapshot path, --changes path, --output path or --plan path'); options[rest[i].slice(2)]=rest[i+1]; }
  const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
  if (command==='snapshot-values') {
    const snapshot=snapshotFromValues(read(options.metadata),Number(options['sheet-id']),read(options.values),options['read-mode']);
    fs.writeFileSync(options.output,JSON.stringify(snapshot,null,2)+'\n',{flag:'wx'});return {snapshot:options.output};
  }
  if (command==='plan') {
    const plan=makePlan(read(options.snapshot),read(options.changes));
    fs.writeFileSync(options.output,JSON.stringify(plan,null,2)+'\n',{flag:'wx'}); return {plan:options.output,requests:plan.requests.length};
  }
  if (command==='preflight'||command==='verify') return check(read(options.plan),read(options.snapshot),command==='verify'?'after':'before');
  throw Error('Use snapshot-values, plan, preflight or verify');
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) {
  try {console.log(JSON.stringify(main(process.argv.slice(2)),null,2));}
  catch(error) {console.error(error.message);process.exitCode=1;}
}
