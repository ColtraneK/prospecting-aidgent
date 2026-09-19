# Release candidate 0.4.0

This package is prepared for review, not a claim that every release acceptance gate has passed. This public release candidate keeps the behavioral and live checks in TESTING.md pending until actually executed; publication does not satisfy them. An actual scheduled run is required to verify unattended access; a manual run does not establish it.

## Conversation and continuity patch

Current package version: `0.4.0+codex.20260918215526`.

First delivery now explicitly connects actual opportunities to ongoing use, saved feedback, optional inbox context and opt-in routines. The assistant adapts explanation depth and writing voice, explains saved changes, and provides practical sales guidance through the user's real decisions. Optional recap tips and a separately agreed midweek check-in respect existing schedule scope and declined offers. Recommendations favor relevant questions, proportionate contributions, accurate claims and room to decline.

Workspace initialization adds missing continuity defaults while preserving existing preferences, decisions and unknown fields; malformed state is reported rather than replaced. The public README and user guide include practical use cases, the weekly rhythm and clear limits. Research qualification, Sheet schema and outbound restrictions are unchanged. The behavioral and live scenarios in TESTING.md remain separate from automated helper tests.

## Reliability corrections

- Equivalent LinkedIn profile URL variants share the existing identity normalization used by the importer.
- Distinct query-selected professional contact pages remain distinct.
- Replacing an existing draft requires its previously verified agent-written value. Missing or changed baselines preserve the draft.
- Values-only readback accepts Google's omission of intentionally empty optional cells, while still detecting nonempty changes.
- The archive procedure checks native link targets and documents the verified repair before source removal when a mapped copy loses link metadata.
- Drafting guidance distinguishes a source's publication date from an upcoming release date, addressing ambiguous wording observed in a synthetic behavior test.

The detailed research framework, qualification standards, relationship/public discovery mix and first-use target are unchanged. No new product mode or outreach capability was added.

## Guided ongoing use

The assistant now explains relevant next-step capabilities after feedback and useful delivery: prioritization, safe Sheet organization, optional scoped inbox relationship mapping, useful follow-up artifacts and finding new people from learned need/fit patterns. It resolves ambiguous “I did it” updates without assuming outreach occurred, preserves human Status when suggesting next actions, and distinguishes read-only scheduled summaries from actual maintenance. Existing helpers, qualification standards and template schema are unchanged. These behavior additions require the acceptance scenarios in TESTING.md; package tests alone do not prove them.

## Install and first use

Final guidance polish adds a concise opening plan with correction examples, an opt-in weekly recap linking to the Sheet, and reusable private HTML companions. Existing schedules are unchanged by installation. Saved agent suggestions are not user-approved sourcing limits; the active-list target is not a hard ceiling. The runtime helpers and template remain unchanged.

1. Add the public repository marketplace with `codex plugin marketplace add ColtraneK/prospecting-aidgent`. See the repository INSTALL.md for prerequisites and tested scope.
2. Install Prospecting Aidgent from that marketplace. For a configured local marketplace, the supported CLI command is `codex plugin add prospecting-aidgent@prospecting-aidgent`.
3. Start a new Local task in a separate folder for your business. Select Prospecting Aidgent and say: “Set up Prospecting Aidgent. My name is … and my website is …” A short business description works if you have no website.
4. Correct its targeting hypothesis, make a private copy of the blank template it links, and give it your copy's URL. Connect Google Drive when needed. The LinkedIn export is optional; if supplied, use the actual import folder it creates.
5. Review the delivered people and drafts. You send messages yourself and use Feedback and Status to guide future research. Scheduling is optional and needs approval.

Prerequisites: Node.js 20+, local file access, permitted public research and a working Google Drive connection for Sheet delivery. Installation alone does not start a routine. Start a new task after each update.

## Distribution boundary

Distribute only the plugin manifest, skill and bundled helpers/references, blank-template configuration, README/TESTING/RELEASE documentation, synthetic tests and license/attribution files. Exclude archives, business state, credential files, personal Sheet IDs, test-run transcripts, captured sources, backups and demo artifacts. The public blank-template ID is intentional configuration, not a personal working Sheet.

Do not publish private test evidence with the release. A clean folder and passing validators are packaging checks, not proof of research quality or agent behavior.

## Known operational limits

Sheet preflight detects stale snapshots but cannot lock Google Sheets against simultaneous edits. Deduplication needs current Leads and Archive reads; the helper can check only its supplied snapshot. Draft protection depends on honestly retained prior-write provenance. Lossless archiving and research/brief/debrief/scheduling are instruction-guided agent operations and need live or behavioral acceptance checks. An offline local computer cannot supply files to a cloud task.

## Public packaging

Original publication version: `0.4.0+codex.20260918170326`. Distribution-only update: repository marketplace, portable manifest, beginner README and explicit publication allowlist. Runtime helpers, skill instructions, references, template configuration and synthetic tests are unchanged from the compared source. No private workspace or original Git history is included. See repository VERIFICATION.md for tested results and release blockers.
