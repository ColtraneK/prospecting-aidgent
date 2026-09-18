import test from 'node:test';
import assert from 'node:assert/strict';
import {snapshotFromValues,makePlan,check} from '../skills/prospecting-aidgent/scripts/sheet.mjs';
const headings=['Person','Role / company','Fit','Why now','Message','Feedback','Status','Evidence URL','LinkedIn / contact URL','Opportunity','Suggested comment','Context / evidence date'];
const workbook={spreadsheetId:'synthetic-values-copy',sheets:[{properties:{sheetId:123,title:'Leads',gridProperties:{rowCount:1000,columnCount:13}}}]};
const candidate={person:'TEST ONLY',fit:'Synthetic fit',why_now:'Synthetic timing',message:'Synthetic draft',contact_url:'https://example.com/person',evidence_url:'https://example.com/news'};
function snapshot(values=[headings],range='Leads!A1:L4') {return snapshotFromValues(workbook,123,{range,values,majorDimension:'ROWS'},'FORMULA');}
function apply(s,p) {const next=structuredClone(s);for(const {updateCells:u} of p.requests) next.rows[u.range.startRowIndex].values[u.range.startColumnIndex].userEnteredValue=u.rows[0].values[0].userEnteredValue;return next;}
test('values-only capability can deliver without notes, named ranges or link metadata',()=>{
  const s=snapshot(),p=makePlan(s,[{rowIndex:1,fields:candidate}]);
  assert.equal(check(p,s).verified,true);assert.equal(check(p,apply(s,p),'after').verified,true);
  assert.ok(p.requests.every(r=>r.updateCells.fields==='userEnteredValue'));
  assert.ok(p.requests.every(r=>!('userEnteredFormat' in r.updateCells.rows[0].values[0])));
  assert.equal(p.valuesBody.valueInputOption,'RAW');
  assert.equal(p.valuesBody.data.find(x=>x.range==="'Leads'!I2").values[0][0],candidate.contact_url);
});
test('adding a second row preserves feedback, status, formulas and custom values on existing records',()=>{
  const s=snapshot([[...headings,'My extra field'],['Existing','Role','','','','Keep this feedback','Interested','','https://example.com/existing','','','','=1+1']], 'Leads!A1:M4');
  const p=makePlan(s,[{rowIndex:2,fields:candidate}]),next=apply(s,p);
  assert.deepEqual(next.rows[1],s.rows[1]);assert.equal(check(p,next,'after').verified,true);
  assert.ok(p.requests.every(r=>![5,6,12].includes(r.updateCells.range.startColumnIndex)));
});
test('reordered recognized headings still protect human columns without metadata',()=>{
  const moved=['Status','Person','Feedback',...headings.filter(x=>!['Status','Person','Feedback'].includes(x))];
  const s=snapshot([moved]),p=makePlan(s,[{rowIndex:1,fields:candidate}]);
  assert.ok(p.requests.every(r=>![0,2].includes(r.updateCells.range.startColumnIndex)));
  assert.equal(check(p,apply(s,p),'after').verified,true);
});
test('ambiguous headings and arbitrary renamed human fields require clarification',()=>{
  const ambiguous=[...headings];ambiguous[9]='Feedback';
  assert.throws(()=>makePlan(snapshot([ambiguous]),[{rowIndex:1,fields:candidate}]),/Ambiguous/);
  const missing=[...headings];missing[5]='My mystery field';
  assert.throws(()=>makePlan(snapshot([missing]),[{rowIndex:1,fields:candidate}]),/missing/);
});
test('fallback cannot revise occupied records or overwrite blank-displaying formulas',()=>{
  const s=apply(snapshot(),makePlan(snapshot(),[{rowIndex:1,fields:candidate}]));
  assert.throws(()=>makePlan(s,[{rowIndex:1,expectedPerson:candidate.person,expectedContact:candidate.contact_url,fields:{fit:'Changed'}}]),/adds new rows/);
  const formulas=snapshot([headings,['=""']]);
  assert.throws(()=>makePlan(formulas,[{rowIndex:1,fields:candidate}]),/identity/);
});
test('display-only reads, mismatched tabs and out-of-grid responses are rejected',()=>{
  assert.throws(()=>snapshotFromValues(workbook,123,{range:'Leads!A1:L4',values:[headings]},'FORMATTED_VALUE'),/FORMULA/);
  assert.throws(()=>snapshot([headings],'Archive!A1:L4'),/verified/);
  assert.throws(()=>snapshot([headings],'Leads!A1:Z4'),/bounds/);
});
test('concurrent edits and unexpected readback are detected without metadata',()=>{
  const s=snapshot(),p=makePlan(s,[{rowIndex:1,fields:candidate}]),changed=structuredClone(s);
  changed.rows[1].values[5]={userEnteredValue:{stringValue:'Human feedback'}};
  assert.throws(()=>check(p,changed),/changed/);assert.throws(()=>check(p,s,'after'),/differs/);
});
test('fifteen complete synthetic recommendations can be delivered in one bounded plan',()=>{
  const s=snapshot([headings],'Leads!A1:L16');
  const changes=Array.from({length:15},(_,i)=>({rowIndex:i+1,fields:{...candidate,person:'Synthetic '+i,contact_url:'https://example.com/person/'+i}}));
  const p=makePlan(s,changes);assert.equal(check(p,apply(s,p),'after').verified,true);
  assert.equal(new Set(p.requests.map(r=>r.updateCells.range.startRowIndex)).size,15);
});
