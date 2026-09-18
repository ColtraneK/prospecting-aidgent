import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {initializeWorkspace} from '../skills/prospecting-aidgent/scripts/workspace.mjs';
import {FIELDS,resolveFields,planResearchUpdates} from '../skills/prospecting-aidgent/scripts/sheet-schema.mjs';
import {makePlan,check} from '../skills/prospecting-aidgent/scripts/sheet.mjs';
const template=JSON.parse(fs.readFileSync(new URL('../skills/prospecting-aidgent/template.json',import.meta.url),'utf8'));
function snapshot(order=FIELDS) {
  return {spreadsheetId:'synthetic-test-copy',sheetId:123,startRowIndex:0,workbook:{sheets:[{properties:{sheetId:123,title:'Leads'}}]},rows:[{values:order.map(key=>({userEnteredValue:{stringValue:'Custom '+key},note:`Prospecting Aidgent field: ${key}; owner: ${['feedback','status'].includes(key)?'human':'agent'}.`}))},{values:order.map(()=>({}))},{values:order.map(()=>({}))}]};
}
const recommendation={person:'Synthetic Person',role:'Example operator',fit:'Synthetic fit',why_now:'Synthetic trigger',message:'Synthetic draft',evidence_url:'https://example.com/news',contact_url:'https://example.com/person'};
function apply(s,p) {
  const after=structuredClone(s);
  for(const {updateCells:u} of p.requests) {
    const c=after.rows[u.range.startRowIndex].values[u.range.startColumnIndex], n=u.rows[0].values[0];
    c.userEnteredValue=n.userEnteredValue;
    if(u.fields.includes('textFormat.link')) {c.userEnteredFormat??={};c.userEnteredFormat.textFormat={link:n.userEnteredFormat?.textFormat?.link};}
  }
  return after;
}
test('setup makes the actual import folder and a second run preserves learned state',t=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'prospecting-workspace-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const first=initializeWorkspace(root); assert.ok(fs.statSync(first.linkedinFolder).isDirectory());
  fs.writeFileSync(path.join(root,'state/business.md'),'User corrections');
  assert.equal(initializeWorkspace(root).created.length,0);
  assert.equal(fs.readFileSync(path.join(root,'state/business.md'),'utf8'),'User corrections');
  assert.throws(()=>initializeWorkspace('relative'),/absolute/);
});
test('create plan, preflight and readback work with real request shapes',()=>{
  const s=snapshot(), p=makePlan(s,[{rowIndex:1,fields:recommendation}]);
  assert.equal(check(p,s).verified,true);assert.equal(check(p,apply(s,p),'after').verified,true);
  assert.ok(p.requests.every(r=>![5,6].includes(r.updateCells.range.startColumnIndex)));
});
test('moved and renamed human columns are never written',()=>{
  const order=['status','feedback',...FIELDS.filter(k=>!['status','feedback'].includes(k))],s=snapshot(order);
  const p=makePlan(s,[{rowIndex:1,fields:recommendation}]);
  assert.ok(p.requests.every(r=>r.updateCells.range.startColumnIndex>=2));
  assert.equal(check(p,apply(s,p),'after').verified,true);
});
test('user feedback and custom columns survive existing-row research updates',()=>{
  let s=snapshot();s=apply(s,makePlan(s,[{rowIndex:1,fields:recommendation}]));
  s.rows[0].values.push({userEnteredValue:{stringValue:'My custom column'}});
  s.rows[1].values[5]={userEnteredValue:{stringValue:'Keep this'}};
  s.rows[1].values[6]={userEnteredValue:{stringValue:'Interested'}};
  s.rows[1].values.push({userEnteredValue:{stringValue:'Custom detail'}});
  const p=makePlan(s,[{rowIndex:1,expectedPerson:recommendation.person,expectedContact:recommendation.contact_url,fields:{fit:'Updated fit'}}]);
  const after=apply(s,p);assert.equal(check(p,after,'after').verified,true);
  assert.deepEqual(after.rows[1].values.slice(5,7),s.rows[1].values.slice(5,7));
  assert.deepEqual(after.rows[1].values[12],s.rows[1].values[12]);
});
test('stale user edits, validation changes and wrong readback stop the process',()=>{
  const s=snapshot(),p=makePlan(s,[{rowIndex:1,fields:recommendation}]);
  const edited=structuredClone(s);edited.rows[1].values[5]={userEnteredValue:{stringValue:'New feedback'}};
  assert.throws(()=>check(p,edited),/changed/);
  const validated=structuredClone(s);validated.rows[1].values[6].dataValidation={strict:true};
  assert.throws(()=>check(p,validated),/changed/);
  assert.throws(()=>check(p,s,'after'),/differs/);
});
test('master template, wrong workbook and unknown target sheet are rejected',()=>{
  const s=snapshot();s.spreadsheetId=template.spreadsheetId;
  assert.throws(()=>makePlan(s,[{rowIndex:1,fields:recommendation}]),/master/);
  const wrong=snapshot();wrong.workbook.spreadsheetId='other';
  assert.throws(()=>makePlan(wrong,[{rowIndex:1,fields:recommendation}]),/identity/);
  const a=snapshot();a.workbook.sheets[0].properties.title='Archive';
  assert.throws(()=>makePlan(a,[{rowIndex:1,fields:recommendation}]),/Leads/);
});
test('missing useful fields, unknown fields, human writes and invalid rows rejected',()=>{
  const s=snapshot();
  assert.throws(()=>makePlan(s,[{rowIndex:1,fields:{person:'Only a name'}}]),/missing/);
  for(const key of ['feedback','status']) assert.throws(()=>planResearchUpdates(s.workbook,123,s.rows[0].values,1,{[key]:'oops'}),/Human-owned/);
  assert.throws(()=>makePlan(s,[{rowIndex:0,fields:recommendation}]),/below headings/);
  assert.throws(()=>makePlan(s,[{rowIndex:1,fields:{...recommendation,unknown:'oops'}}]),/unknown/);
});
test('duplicate contact variants and unsafe row replacement are rejected',()=>{
  let s=snapshot();s=apply(s,makePlan(s,[{rowIndex:1,fields:recommendation}]));
  assert.throws(()=>makePlan(s,[{rowIndex:2,fields:{...recommendation,contact_url:recommendation.contact_url+'/?utm_source=x'}}]),/already exists/);
  assert.throws(()=>makePlan(s,[{rowIndex:1,fields:{fit:'oops'}}]),/identity/);
});
test('bare URLs only, native link targets and clearing links',()=>{
  const s=snapshot();
  for(const url of ['Profile: https://example.com','https://user:secret@example.com']) assert.throws(()=>planResearchUpdates(s.workbook,123,s.rows[0].values,1,{contact_url:url}),/bare|Credentials/);
  const req=planResearchUpdates(s.workbook,123,s.rows[0].values,1,{contact_url:'https://example.com'})[0];
  assert.equal(req.updateCells.rows[0].values[0].userEnteredFormat.textFormat.link.uri,'https://example.com');
  const clear=planResearchUpdates(s.workbook,123,s.rows[0].values,1,{contact_url:''})[0];
  assert.match(clear.updateCells.fields,/textFormat.link/);assert.equal(clear.updateCells.rows[0].values[0].userEnteredFormat,undefined);
});
test('conflicting mappings and erased human markers fail rather than guess',()=>{
  const s=snapshot();s.workbook.namedRanges=[{name:'PA_leads_status',range:{sheetId:123,startColumnIndex:2,endColumnIndex:3}}];
  assert.throws(()=>resolveFields(s.workbook,123,s.rows[0].values),/Ambiguous/);
  const missing=snapshot();missing.rows[0].values[5]={userEnteredValue:{stringValue:'Mystery'}};
  assert.throws(()=>resolveFields(missing.workbook,123,missing.rows[0].values),/missing/);
});
test('actual approved template headings and dropdown data work without named-range metadata',()=>{
  const s=JSON.parse(fs.readFileSync(new URL('./template-headers.json',import.meta.url),'utf8'));
  const p=makePlan(s,[{rowIndex:1,fields:recommendation}]);
  // Google omits trailing blank cells; fill only those already read in the fixture.
  for(const row of s.rows) while(row.values.length<12) row.values.push({});
  assert.equal(check(p,s).verified,true);
  assert.equal(check(p,apply(s,p),'after').verified,true);
  assert.deepEqual(resolveFields(s.workbook,s.sheetId,s.rows[0].values),Object.fromEntries(FIELDS.map((k,i)=>[k,i])));
});
