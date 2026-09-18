import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
test('one self-contained skill with all bundled references and helpers',()=>{
  const manifest=JSON.parse(fs.readFileSync(path.join(root,'.codex-plugin/plugin.json'),'utf8'));
  assert.equal(manifest.name,'prospecting-aidgent');assert.match(manifest.version,/^0\.4\.0(?:\+|$)/);
  assert.deepEqual(fs.readdirSync(path.join(root,'skills')),['prospecting-aidgent']);
  for(const name of ['SKILL.md','template.json','references/research.md','references/research-framework.md','references/relationships.md','references/sheets.md','references/continuing.md','references/conversations.md','scripts/workspace.mjs','scripts/relationship_index.mjs','scripts/sheet.mjs','scripts/sheet-schema.mjs']) assert.ok(fs.statSync(path.join(root,'skills/prospecting-aidgent',name)).isFile());
  for(const name of ['runtime','data','state','plans','node_modules']) assert.equal(fs.existsSync(path.join(root,name)),false);
});
test('one canonical template is used in configuration and setup instructions',()=>{
  const config=JSON.parse(fs.readFileSync(path.join(root,'skills/prospecting-aidgent/template.json'),'utf8'));
  const readme=fs.readFileSync(path.join(root,'README.md'),'utf8');
  assert.ok(readme.includes(config.copyUrl));
  assert.deepEqual(config.humanFields,['feedback','status']);
});
