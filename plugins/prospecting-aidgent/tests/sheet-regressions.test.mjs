import test from 'node:test';
import assert from 'node:assert/strict';
import {FIELDS} from '../skills/prospecting-aidgent/scripts/sheet-schema.mjs';
import {makePlan,check,snapshotFromValues} from '../skills/prospecting-aidgent/scripts/sheet.mjs';

const candidate={person:'Synthetic Regression Person',fit:'Synthetic fit',why_now:'Synthetic timing',message:'Original synthetic draft',contact_url:'https://www.linkedin.com/in/synthetic-regression-person'};
function snapshot(order=FIELDS) {
  return {spreadsheetId:'synthetic-regression-copy',sheetId:321,startRowIndex:0,workbook:{sheets:[{properties:{sheetId:321,title:'Leads'}}]},rows:[{values:order.map(key=>({userEnteredValue:{stringValue:'Renamed '+key},note:`Prospecting Aidgent field: ${key};`}))},...Array.from({length:3},()=>({values:order.map(()=>({}))}))]};
}
function apply(snapshot,plan,limit=plan.requests.length) {
  const after=structuredClone(snapshot);
  for(const {updateCells:u} of plan.requests.slice(0,limit)) {
    const cell=after.rows[u.range.startRowIndex].values[u.range.startColumnIndex], update=u.rows[0].values[0];
    cell.userEnteredValue=structuredClone(update.userEnteredValue);
    if(u.fields.includes('textFormat.link')) {
      cell.userEnteredFormat??={}; cell.userEnteredFormat.textFormat??={};
      if(update.userEnteredFormat?.textFormat?.link) cell.userEnteredFormat.textFormat.link=structuredClone(update.userEnteredFormat.textFormat.link);
      else delete cell.userEnteredFormat.textFormat.link;
    }
  }
  return after;
}
function populated() {const s=snapshot();return apply(s,makePlan(s,[{rowIndex:1,fields:candidate}]));}
const update=fields=>({rowIndex:1,expectedPerson:candidate.person,expectedContact:candidate.contact_url,fields});

test('LinkedIn host, encoded slug and activity suffix variants cannot duplicate a delivered identity',()=>{
  const s=populated();
  for(const contact_url of ['https://uk.linkedin.com/in/synthetic-regression-person','https://www.linkedin.com/in/%73ynthetic-regression-person','https://www.linkedin.com/in/synthetic-regression-person/recent-activity/all/']) {
    assert.throws(()=>makePlan(s,[{rowIndex:2,fields:{...candidate,contact_url}}]),/already exists/,contact_url);
  }
});

test('distinct query-selected contacts are not collapsed into the same person',()=>{
  const s=snapshot(), first={...candidate,contact_url:'https://example.com/contact?id=person-one'};
  const after=apply(s,makePlan(s,[{rowIndex:1,fields:first}]));
  assert.doesNotThrow(()=>makePlan(after,[{rowIndex:2,fields:{...candidate,person:'Synthetic Other Person',contact_url:'https://example.com/contact?id=person-two'}}]));
});

test('changed drafts require the saved verified draft and preserve user edits',()=>{
  const s=populated(), messageColumn=FIELDS.indexOf('message');
  assert.throws(()=>makePlan(s,[update({message:'Replacement'})]),/lastVerifiedMessage/);
  assert.doesNotThrow(()=>makePlan(s,[{...update({message:'Replacement'}),lastVerifiedMessage:candidate.message}]));
  s.rows[1].values[messageColumn].userEnteredValue.stringValue='User revised this draft';
  assert.throws(()=>makePlan(s,[{...update({message:'Replacement'}),lastVerifiedMessage:candidate.message}]),/draft|message/i);
  assert.doesNotThrow(()=>makePlan(s,[update({fit:'Fresh fit'})]));
});

test('uncertain complete write is reconciled and partial write cannot be retried blindly',()=>{
  const s=snapshot(), plan=makePlan(s,[{rowIndex:1,fields:candidate}]);
  const complete=apply(s,plan);
  assert.equal(check(plan,complete,'after').verified,true);
  assert.throws(()=>check(plan,complete,'before'),/changed/);
  assert.throws(()=>makePlan(complete,[{rowIndex:2,fields:candidate}]),/already exists/);
  const partial=apply(s,plan,2);
  assert.throws(()=>check(plan,partial,'before'),/changed/);
  assert.throws(()=>check(plan,partial,'after'),/differs/);
  assert.throws(()=>makePlan(partial,[{rowIndex:1,fields:candidate}]),/identity/);
});

test('reordered renamed columns retain human cells, edited drafts and custom native metadata',()=>{
  const order=['status','message','feedback',...FIELDS.filter(f=>!['status','message','feedback'].includes(f))];
  let s=snapshot(order);s=apply(s,makePlan(s,[{rowIndex:1,fields:candidate}]));
  s.rows[0].values.push({userEnteredValue:{stringValue:'Private custom field'}});
  for(const row of s.rows.slice(1))row.values.push({});
  s.rows[1].values[0]={userEnteredValue:{stringValue:'My custom pending status'},note:'Keep status note',dataValidation:{strict:true,condition:{type:'ONE_OF_LIST',values:[{userEnteredValue:'My custom pending status'}]}}};
  s.rows[1].values[1].userEnteredValue.stringValue='Human-edited draft';
  s.rows[1].values[2]={userEnteredValue:{stringValue:'Keep my feedback'},note:'Human note'};
  s.rows[1].values[12]={userEnteredValue:{formulaValue:'=1+1'},note:'Custom note',userEnteredFormat:{backgroundColor:{red:1},textFormat:{bold:true,link:{uri:'https://example.com/custom'}}},dataValidation:{strict:false}};
  const p=makePlan(s,[update({fit:'Fresh synthetic fit'})]),after=apply(s,p);
  assert.equal(check(p,after,'after').verified,true);
  for(const col of [0,1,2,12])assert.deepEqual(after.rows[1].values[col],s.rows[1].values[col]);
});

test('research planner cannot be mistaken for a lossless archive mover',()=>{
  const s=populated();s.workbook.sheets[0].properties.title='Archive';
  assert.throws(()=>makePlan(s,[{rowIndex:2,fields:candidate}]),/Leads/);
});

test('values readback normalizes omitted empty optional fields but still detects nonempty edits',()=>{
  const headings=['Person','Role / company','Fit','Why now','Message','Feedback','Status','Evidence URL','LinkedIn / contact URL','Opportunity','Suggested comment','Context / evidence date'];
  const workbook={spreadsheetId:'synthetic-blank-copy',sheets:[{properties:{sheetId:123,title:'Leads',gridProperties:{rowCount:20,columnCount:12}}}]};
  const read=values=>snapshotFromValues(workbook,123,{range:'Leads!A1:L3',values},'FORMULA');
  const s=read([headings]);
  const p=makePlan(s,[{rowIndex:1,fields:{...candidate,comment:'',context:''}}]);
  // Actual values APIs omit trailing empty fields even when RAW writes included ''.
  const row=[candidate.person,'',candidate.fit,candidate.why_now,candidate.message,'','','',candidate.contact_url];
  assert.equal(check(p,read([headings,row]),'after').verified,true);
  const changed=[...row,'','Human added a comment'];
  assert.throws(()=>check(p,read([headings,changed]),'after'),/differs/);
});
