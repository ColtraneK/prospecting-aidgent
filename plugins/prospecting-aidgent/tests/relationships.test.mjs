import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { buildIndex, listPeople, contextFor, main } from '../skills/prospecting-aidgent/scripts/relationship_index.mjs';
import { importLinkedInArchive } from '../skills/prospecting-aidgent/scripts/lib/linkedinArchive.mjs';
import { normalizeText } from '../skills/prospecting-aidgent/scripts/lib/url.mjs';

function fixture(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'finder-relationship-test-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.writeFileSync(path.join(dir, 'Connections.csv'), 'Notes:\nExport notes\n\nFirst Name,Last Name,URL,Company,Position,Connected On\nAlex,Smith,https://www.linkedin.com/in/alex-one,One,Fractional COO,2024-01-01\nAlex,Smith,https://www.linkedin.com/in/alex-two,Two,Founder,2023-01-01\nJamie,Park,https://www.linkedin.com/in/jamie,Three,Operator,2023-01-01\nLee,Tan,https://www.linkedin.com/in/lee,Four,Consultant,2020-01-01\nJamie,Park,https://www.linkedin.com/in/jamie,Three,Operator,2023-01-01\n');
  fs.writeFileSync(path.join(dir, 'messages.csv'), 'CONVERSATION ID,FROM,TO,DATE,CONTENT\n1,Self Person,Jamie Park,2025-01-01,"Private first message\nwith another line"\n1,Jamie Park,Self Person,2025-01-02,Private reply\n1,Self Person,Jamie Park,2025-01-03,Private follow-up\n2,Self Person,Alex Smith,2024-01-01,Private ambiguous\n3,Self Person,Lee Tan,2024-02-01,Private unanswered\n4,Self Person,"Jamie Park;Alex Smith",2025-01-01,Private group\n');
  const archive = importLinkedInArchive(dir, { selfName: 'Self Person' });
  return { dir, archive, index: buildIndex(archive, 'Self Person') };
}
test('Notes-prefixed connections import fully and deduplicate', t => {
  const { index } = fixture(t);
  assert.equal(index.counts.connections, 4);
  assert.equal(index.counts.messages, 6);
  assert.deepEqual(index.coverage, { connections: true, messages: true });
  assert.equal(index.import_status, 'complete');
});
test('metadata contains no raw message bodies; two-way is not declared substantive', t => {
  const { index } = fixture(t);
  assert.ok(!JSON.stringify(index).includes('Private reply'));
  const jamie = index.people.find(p => p.name === 'Jamie Park');
  assert.equal(jamie.inbound_count, 1);
  assert.equal(jamie.outbound_count, 2);
  assert.equal(jamie.history_status, 'two-way messages; substance not reviewed');
  assert.match(jamie.identity_match, /name-only/);
});
test('same-name connection identities remain separate; messages stay unresolved', t => {
  const { index } = fixture(t);
  const alex = index.people.filter(p => p.name === 'Alex Smith');
  assert.equal(alex.length, 3);
  assert.ok(alex.filter(p => p.connection_record).every(p => !p.messages.length));
  assert.match(alex.find(p => !p.connection_record).identity_match, /ambiguous/);
});
test('unanswered outreach and group messages never become warm relationships', t => {
  const { index } = fixture(t);
  assert.equal(index.people.find(p => p.name === 'Lee Tan').history_status, 'outbound only; no verified reply');
  assert.ok(index.warnings.some(w => w.includes('1 group')));
});
test('inventory pagination covers every person exactly once and query is literal', t => {
  const { index } = fixture(t);
  let offset = 0;
  const ids = [];
  do {
    const page = listPeople(index, { offset, limit: 2 });
    ids.push(...page.people.map(p => p.id));
    assert.ok(page.people.every(p => !('messages' in p)));
    offset = page.next_offset;
  } while (offset !== null);
  assert.equal(new Set(ids).size, index.people.length);
  assert.equal(listPeople(index, { query: 'Fractional|Consultant' }).matched, 2);
  assert.equal(listPeople(index, { query: '.*' }).matched, 0);
});
test('bounded history retrieval preserves multiline bodies and explicit older-page offsets', t => {
  const { index } = fixture(t);
  const id = index.people.find(p => p.name === 'Jamie Park').id;
  const page = contextFor(index, id, { limit: 2 });
  assert.equal(page.excerpts.length, 2);
  assert.equal(page.excerpts[0].content, 'Private follow-up');
  assert.equal(page.next_offset, 2);
  const older = contextFor(index, id, { offset: page.next_offset, limit: 2 });
  assert.equal(older.excerpts[0].content, 'Private first message\nwith another line');
  assert.equal(older.next_offset, null);
});
test('archive changes invalidate context locators', t => {
  const { dir, index } = fixture(t);
  fs.appendFileSync(path.join(dir, 'messages.csv'), '\n');
  assert.throws(() => contextFor(index, index.people[2].id), /Archive changed/);
});
test('wrong self identity and malformed messages are visible, not a complete import', t => {
  const { dir } = fixture(t);
  const wrong = buildIndex(importLinkedInArchive(dir, { selfName: 'Nobody Here' }), 'Nobody Here');
  assert.ok(wrong.warnings.some(w => w.includes('Self name')));
  fs.writeFileSync(path.join(dir, 'messages.csv'), 'wrong,headers\nno,message');
  const partial = buildIndex(importLinkedInArchive(dir, { selfName: 'Self Person' }), 'Self Person');
  assert.equal(partial.import_status, 'partial');
  assert.equal(partial.coverage.messages, false);
  assert.equal(partial.rejected.length, 1);
});
test('CLI refuses to overwrite an existing index and rejects invalid paging', t => {
  const { dir } = fixture(t);
  const output = path.join(dir, 'index.json');
  const args = ['index', '--archive', dir, '--self', 'Self Person', '--output', output];
  main(args);
  assert.throws(() => main(args), /Output exists/);
  assert.throws(() => main(['list', '--index', output, '--offset', '-1']), /nonnegative/);
});
test('international names do not collapse to the same empty identity', () => {
  assert.notEqual(normalizeText('王小明'), '');
  assert.notEqual(normalizeText('王小明'), normalizeText('李小明'));
  assert.equal(normalizeText('José'), normalizeText('Jose'));
});
