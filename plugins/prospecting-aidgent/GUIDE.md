# Prospecting Aidgent

An Aidgentic assistant for finding people worth talking to, understanding why, and writing a thoughtful first move. It starts with your business and relationships, then finds new prospects online. You correct its judgment and send every message yourself.

## What you do

1. Start a fresh **Local** Codex project and choose Prospecting Aidgent. Say: “Set up Prospecting Aidgent for my business. My name is … and my website is …”
2. Correct its short best guess about your business and desired conversations.
3. If available, drop your LinkedIn export into the folder it creates and links. You can also supply useful sales notes, examples and your own methodology. Public research can begin without an export.
4. Make your own copy of the [blank Sheet template](https://docs.google.com/spreadsheets/d/1D3qZ6uWJMIYYJC1EvHVHSYV8Ow_T793rbAYzLvmYhHY/copy) and give the assistant that URL. Connect Google Drive in Codex if needed.
5. Review the Leads tab. Add Feedback and Status. Ask “Find more people like these” or “Refresh my leads using my feedback.” The assistant maintains research and preserves your decisions.

After you supply the targeting correction, archive (if any) and working Sheet, the assistant proceeds directly into research and delivery. You should not need to say “go” after an import. It investigates customers and partners where relevant, rather than assuming every fractional operator can only be a referral partner.

The target is at least 15 useful, reasoned recommendations, not a guaranteed count at the expense of quality. Known contacts, older conversations and newly discovered people can all qualify. Real access or evidence shortfalls are reported. No messages are sent automatically.

## Using it every week

After the first useful list, the assistant offers a weekly refresh, a short recap linking to your Sheet, and a manageable review session. Approve a day/time and reporting preference if you want it scheduled; installation alone does not start a routine or change an existing one. The recap appears in the scheduled task, not an automatically sent email. The assistant should verify the first actual scheduled run before calling it tested.

Each refresh reads your feedback, revisits worthwhile relationships, and searches for people outside your supplied network. It maintains your active list rather than automatically adding 15 more every week. You can request a specific weekly new-contact target instead. Promising conversations stay active; archiving follows your instructions and preserves the whole record.

You review, choose and send. The assistant explains useful approaches through your actual leads, adapts to your sales methodology, and helps improve drafts. Say things like “More buyers, fewer partners” or “Find people like these around my city”; it saves the correction for future runs. Your uploaded archive is not live LinkedIn reply tracking.

The current schedule workflow is instruction-based and requires the product's scheduling tools. An actual unattended research-and-Sheet run remains a release acceptance test, not a capability proven by unit tests. See TESTING.md.

## A useful colleague, not just a list

The assistant adapts to your voice and experience, explains useful next moves, and challenges weak assumptions respectfully. It helps you follow through on commitments you chose, without assuming an unchanged Sheet means you did nothing. Coaching stays optional; it does not impose a five- or ten-lead ceiling.

Ask “Help me prepare for this conversation” for a concise, sourced brief with thoughtful questions and a possible useful contribution. Afterward, give a rough recap: it separates confirmed promises from tentative ideas and saves relevant professional notes privately for the next task. Tell it when you've spoken to someone elsewhere so it can stop relying on stale outreach advice. It cannot see unshared texts or automatically infer outcomes.

No new tabs or onboarding forms are required. Research and Sheet protections are unchanged. It still does not send messages, book meetings, offer access, make introductions or spend money for you. Briefs and debriefs are instruction-guided capabilities; the behavioral scenarios in TESTING.md must be checked in real use, not inferred from unit tests.

## Feedback, voice and optional help

The assistant saves corrections in your project's business notes and reads them alongside current Sheet feedback on later runs. It should tell you what it saved and how the recommendation or draft changes. Say “shorter for this person” for a one-off adjustment, or “keep all my openings short” for a general preference. You can replace or withdraw a preference. Examples you actually wrote help it learn your voice; it should not copy someone else's writing style from an export.

After the first list, expect a short explanation of a real opportunity, how to give feedback, what the assistant can do next, and the optional weekly routine and inbox cross-reference. Ask “what's next?” when you want a recommendation. You can ask for a small comparison table or a brief explanation without learning a set of commands.

Sales guidance can help with relevant openings, discovery questions, a reply or objection you supply, and follow-up decisions. Sometimes the right action is to wait or accept a decline. A potential fit does not establish a need or willingness to buy. You choose the conversations and what to send.

An optional practical tip can accompany an approved weekly recap; a midweek check-in requires agreement on its own timing and scope. You can choose fewer tips or no coaching. These choices are saved so the agent need not repeatedly offer something you declined. Inbox cross-referencing likewise needs an agreed mailbox, people and period, and an available authorized connection. Neither option is required to continue prospecting.

## The Sheet

Optional visual HTML relationship maps, briefs and weekly plans can live privately in your project and be revisited in later tasks. They include an update date and Sheet link. The Sheet remains the main working record; local visuals are not automatically hosted or accessible from another device.

The assistant should help you discover useful next steps, not wait for you to know every feature. Depending on your needs, it can recommend explained lead priorities, safe Sheet sorting and next actions, a map of your relationships, or a useful follow-up artifact. It should use what works in your existing network to source similar new people, without assuming a full list means discovery must stop.

An optional, scoped inbox review can clarify actual contact history through available authorized email tools. It is not required, does not modify email, and distinguishes sent messages/replies from drafts and automated notices. Sheet layout changes and broader recurring access need your agreement. These are connector-dependent, instruction-guided operations, not a new bundled email service or guarantee of access.

Three tabs: **Start Here**, **Leads**, **Archive**. Useful fields come first: Person, Role, Fit, Why now, Message, Feedback, Status, then URLs and extra context. Links are bare and clickable. You may reorder/rename columns while keeping their header notes/identity markers. Added custom columns are preserved. If you erase all markers, the assistant may need you to identify a field. Changing tab names requires rebinding.

When a connection exposes values but not cell metadata, the assistant can still add new leads under clear headings, using formula-aware reads, exact research-cell writes and readback. This fallback does not change existing records or perform lossless archiving. Those operations can wait for richer tools without blocking new research and safe additions.

## What is installed

One skill with concise instructions, focused research references and dependency-free Node.js helpers. No database service, scraped-profile service, service-account wizard, old Prospecting Aidgent OS runtime or First Customer Finder installation is needed. Node.js 20+ and working Codex public-research/Google Drive tools are prerequisites. The assistant runs the helpers for you.

The plugin is instructions plus local utilities, not an always-running server. Codex does the reasoning and connector work when you ask or when an approved routine runs. Scheduled access must be checked in that actual environment. Local routines need the computer awake and able to run Codex.

Local storage keeps the archive in your project; it does **not** mean offline AI processing. Content read by Codex is processed by the model, and public research uses cloud services. No private exports should be committed or included in this plugin's repository.

## Installing and updating

See the [installation guide](https://github.com/ColtraneK/prospecting-aidgent/blob/main/INSTALL.md) for this public repository marketplace. Start a new task after installing or updating.

## Tests and limits

Run `npm test` (no install needed). Tests exercise the actual bundled importer, folder initialization, flexible field mapping, protected human cells, duplicate checks, template-write rejection, stale snapshots and readback verification. They do not prove every prospect is good, every Google account has connector access, every future LinkedIn export parses, or every scheduled run will work. Sheet preflight checks are not locks against simultaneous edits.

Before a public webinar: run the complete fresh-task setup with a real export and a private Sheet copy, judge the actual recommendations, give feedback, then ask for a refresh and archive one selected record. See TESTING.md. That human quality check is required even if software tests pass.

See THIRD-PARTY-NOTICES.md for attribution to First Customer Finder's evidence-led research method.
