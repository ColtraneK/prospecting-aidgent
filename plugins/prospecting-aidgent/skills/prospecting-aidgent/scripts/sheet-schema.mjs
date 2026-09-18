// Small, dependency-free adapter for the new template. No network or legacy runtime.
export const FIELDS = ['person','role','fit','why_now','message','feedback','status','evidence_url','contact_url','opportunity_type','comment','context'];
export const HUMAN_FIELDS = new Set(['feedback','status']);
const aliases = {person:['person','name'],role:['role / company','role','role & company'],fit:['fit','why this person'],why_now:['why now','why reach out now'],message:['message','suggested message','tailored message'],feedback:['feedback','your notes'],status:['status'],evidence_url:['evidence url'],contact_url:['linkedin / contact url','linkedin url'],opportunity_type:['opportunity','opportunity type'],comment:['suggested comment','optional comment'],context:['context / evidence date','evidence / prior context']};
const normal = x => String(x ?? '').trim().toLowerCase();
export function resolveFields(workbook, sheetId, headerCells) {
  const candidates = new Map();
  function add(key,col) {
    if(!FIELDS.includes(key)) return;
    if(!Number.isInteger(col)||col<0||col>=headerCells.length) throw Error('Invalid field location: '+key);
    if(!candidates.has(key)) candidates.set(key,new Set());
    candidates.get(key).add(col);
  }
  for(const n of workbook.namedRanges ?? []) {
    const match = /^PA_(leads|archive)_(.+)$/.exec(n.name);
    if(match && n.range.sheetId===sheetId) {
      if(n.range.endColumnIndex !== n.range.startColumnIndex+1) throw Error('Field spans multiple columns');
      add(match[2],n.range.startColumnIndex);
    }
  }
  headerCells.forEach((c,i) => {
    const key = /Prospecting Aidgent field: ([a-z_]+);/.exec(c.note ?? '')?.[1];
    if(key) add(key,i);
  });
  for(const key of FIELDS) if(!candidates.has(key)) {
    headerCells.forEach((c,i) => {if(aliases[key].includes(normal(c.userEnteredValue?.stringValue))) add(key,i);});
  }
  const fields = {}, used = new Set();
  for(const [key,cols] of candidates) {
    if(cols.size!==1) throw Error('Ambiguous field: '+key);
    const col=[...cols][0];
    if(used.has(col)) throw Error('Two fields resolve to one column');
    used.add(col); fields[key]=col;
  }
  for(const key of ['person','feedback','status']) if(fields[key]===undefined) throw Error('Required field missing: '+key);
  return fields;
}
export function planResearchUpdates(workbook,sheetId,headerCells,rowIndex,changes) {
  if(!Number.isInteger(rowIndex)||rowIndex<1) throw Error('Refusing to overwrite headings');
  const fields=resolveFields(workbook,sheetId,headerCells);
  return Object.entries(changes).map(([key,value])=>{
    if(HUMAN_FIELDS.has(key)) throw Error('Human-owned field: '+key);
    if(fields[key]===undefined) throw Error('Missing or unknown field: '+key);
    if(typeof value!=='string') throw Error('Expected text');
    const cell={userEnteredValue:{stringValue:value}};
    const isURL=['evidence_url','contact_url'].includes(key);
    if(isURL && value) {
      if(!/^https?:\/\/\S+$/.test(value)) throw Error('URL must be bare');
      const url=new URL(value); if(url.username||url.password) throw Error('Credentials in URL');
      cell.userEnteredFormat={textFormat:{link:{uri:value}}};
    }
    return {updateCells:{range:{sheetId,startRowIndex:rowIndex,endRowIndex:rowIndex+1,startColumnIndex:fields[key],endColumnIndex:fields[key]+1},rows:[{values:[cell]}],fields:'userEnteredValue'+(isURL?',userEnteredFormat.textFormat.link':'')}};
  });
}

