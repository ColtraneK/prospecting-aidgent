import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {initializeWorkspace} from '../skills/prospecting-aidgent/scripts/workspace.mjs';

function workspace(t) {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'prospecting-continuity-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  return root;
}

test('new workspace does not claim onboarding, offers, tips or schedule approval',t=>{
  const root=workspace(t); initializeWorkspace(root);
  const p=JSON.parse(fs.readFileSync(path.join(root,'state/progress.json'),'utf8'));
  assert.equal(p.setupComplete,false);
  assert.equal(p.continuity.firstDeliveryExplained,false);
  assert.equal(p.continuity.feedbackMemoryExplained,false);
  for(const choice of Object.values(p.continuity.offers)) assert.equal(choice.status,'not_offered');
  assert.deepEqual(p.continuity.coaching.recentTips,[]);
  assert.equal(p.schedule,undefined);
});

test('upgrade preserves preferences, declined offers, tips, scope and unknown fields; repeat is byte-stable',t=>{
  const root=workspace(t); fs.mkdirSync(path.join(root,'state'));
  const file=path.join(root,'state/progress.json');
  const voice='Short openings. No meeting request. More direct buyers. Keep coaching brief.\n';
  fs.writeFileSync(path.join(root,'state/business.md'),voice);
  const old={schema:'prospecting-progress-1',setupComplete:true,target:30,coverage:{offset:40},
    custom:{keep:['unknown fields']},schedule:{id:'synthetic-routine',tips:false},
    continuity:{firstDeliveryExplained:true,offers:{inbox:{status:'declined',date:'2026-09-18'},
      weeklyRoutine:{status:'accepted',scope:'read-only recap'}},
      coaching:{recentTips:[{topic:'one relevant question',date:'2026-09-18'}]},custom:'retain'}};
  fs.writeFileSync(file,JSON.stringify(old));
  assert.equal(initializeWorkspace(root).continuityUpgraded,true);
  const after=JSON.parse(fs.readFileSync(file,'utf8'));
  for(const key of ['schema','setupComplete','target','coverage','custom','schedule']) assert.deepEqual(after[key],old[key]);
  assert.deepEqual(after.continuity.offers.inbox,old.continuity.offers.inbox);
  assert.deepEqual(after.continuity.offers.weeklyRoutine,old.continuity.offers.weeklyRoutine);
  assert.deepEqual(after.continuity.coaching,old.continuity.coaching);
  assert.equal(after.continuity.custom,'retain');
  assert.equal(after.continuity.offers.midweekCheckIn.status,'not_offered');
  assert.equal(after.continuity.firstDeliveryExplained,true);
  assert.equal(fs.readFileSync(path.join(root,'state/business.md'),'utf8'),voice);
  const bytes=fs.readFileSync(file);
  assert.equal(initializeWorkspace(root).continuityUpgraded,false);
  assert.deepEqual(fs.readFileSync(file),bytes);
});

test('old workspace gains missing continuity without invented history',t=>{
  const root=workspace(t); fs.mkdirSync(path.join(root,'state'));
  const file=path.join(root,'state/progress.json');
  fs.writeFileSync(file,JSON.stringify({decisions:[{id:'synthetic-person',action:'exclude'}],nextAction:'Resume offset 12'}));
  initializeWorkspace(root);
  const p=JSON.parse(fs.readFileSync(file,'utf8'));
  assert.deepEqual(p.decisions,[{id:'synthetic-person',action:'exclude'}]);
  assert.equal(p.nextAction,'Resume offset 12');
  assert.equal(p.continuity.feedbackMemoryExplained,false);
});

test('malformed JSON and invalid continuity containers leave original state untouched',t=>{
  const root=workspace(t); fs.mkdirSync(path.join(root,'state'));
  const file=path.join(root,'state/progress.json');
  for(const content of ['{broken','null','[]','{"continuity":null}','{"continuity":{"offers":[]}}','{"continuity":{"offers":{"inbox":"declined"}}}']) {
    fs.writeFileSync(file,content);
    assert.throws(()=>initializeWorkspace(root),/not valid JSON|must be an object/);
    assert.equal(fs.readFileSync(file,'utf8'),content);
  }
});
