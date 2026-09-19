# Authorized LinkedIn exports

Use the bundled scripts/relationship_index.mjs with absolute paths. It reads ZIP/folder/CSV, including LinkedIn's Notes-prefixed header. No network service or npm install is needed. Node.js 20+ is required.

    node <skill>/scripts/relationship_index.mjs index --archive <authorized-path> --self <full-name> --output <workspace>/research/private/relationship-index.json
    node <skill>/scripts/relationship_index.mjs list --index <index> --offset 0 --limit 40
    node <skill>/scripts/relationship_index.mjs list --index <index> --query "operations|consult" --offset 0 --limit 40
    node <skill>/scripts/relationship_index.mjs context --index <index> --id <person-id> --offset 0 --limit 12

Run these for the user. Reindex changed archives into a new file; do not overwrite the prior index. Report connection/message counts separately and unreadable/rejected inputs honestly. This indexes messages/connections, not every profile export file. Read supplied profile, positions and credentials separately when useful to infer positioning.

Before a first pass, inspect the verified import folder and explicitly supplied paths for archives already present. Reuse the saved fingerprint/index when current; import authorized new material before deciding the network is unavailable. Report actual review coverage separately from file counts. If an earlier pass missed supplied history, repair it by continuing into the already-authorized relationship assessment, not by stopping at indexing.

Scan the whole connection inventory in bounded batches to prioritize research, not just alphabetical first rows or recent messages. Review relevant older exchanges as well as new ones. A keyword miss or sparse title is not an exclusion. The index stores metadata and source locators, not bodies. Retrieve only promising threads, newest first to check outcomes, then earlier pages for substance. Save concise conclusions and locators, not copied transcripts. Index coverage is not conversation review coverage.

Two-way messages are not necessarily substantive conversations. Distinguish actual prior discussion, unanswered outreach, connection without conversation, and unresolved identity. Name-only joins are provisional; verify before using private history with a public profile. Do not attribute group conversations to one person. Read the latest outcome, respect declines, and do not treat an old “not now” as proof of present need. The export is a dated snapshot, not live reply or acceptance status.

Use prior history to make a specific, honest opening, then research current professional fit and meaningful signals using references/research.md. Do not manufacture familiarity. Never paste private message text or export emails into public searches or a shared Sheet; use the minimum authorized business-relevant summary. No LinkedIn inbox automation. Public profile checks reveal public activity only, not private replies.

For each recommendation, answer four distinct questions: why this person fits the offer or partnership; what the prior exchange actually established and its latest outcome; why a conversation would be useful now (or an honestly uncertain check-in); and what specific, low-pressure message to send. “We connected before” is not a reason. A prior stated need does not prove current urgency. A fresh problem, complementary project, relevant post or legitimate question about an unresolved need can supply context. Honor stricter workspace rules about current triggers.

Import completion is not research completion. After reporting import counts briefly, inspect relevant histories, search current sources, draft and write the first useful batch, then continue toward the target. Do not ask the user to authorize research again after they supplied the archive for this setup. If warm opportunities are sparse or disqualified, broaden into new public prospects rather than forcing the network to fill the list.

Record archive fingerprint, inventory offsets, threads read, unresolved identities, sources checked, included/watch/rejected/deferred decisions and next action in state/progress.json. A fresh task resumes that state. Selected excerpts processed by Codex enter the model conversation even though files are stored locally.
