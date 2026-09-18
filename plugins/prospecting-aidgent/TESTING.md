# Release acceptance

## Automated checks

Run `npm test` and Codex's plugin/skill validators. Helpers use synthetic people/messages and approved blank-template header structure only. Tests must run against this package, not another installed runtime.

## Fresh-task smoke test

Test interrupted setup in an isolated workspace with an authorized test archive, a disposable Sheet, saved targeting corrections and unfinished delivery. Start a **new task**, select the updated plugin and say “Resume Prospecting Aidgent and finish my first Leads list.” It should reuse supplied material, retain explicit corrections, reconsider agent-invented restrictions, and continue research and writing without asking for material already present. Record the full installed version and actual output.

Then run the clean setup test below.

Use a brand-new empty local project outside the development repository; its old AGENTS.md, state, imports and research skills are intentionally not the demo's context. Select the newly installed **Prospecting Aidgent** plugin. Verify version starts with **0.4.0** and it lists **one skill**. Do not continue a previous setup task.

Say: “Set up Prospecting Aidgent for my business. My name is [name] and my website is [site].”

Expected behavior:

- Short introduction and a proposed business/targeting model; no technical setup questionnaire.
- Actual import folder exists before the assistant links it; export remains optional.
- Correct blank template link appears without asking the user to find it.
- Imported connection/message counts are separate and honest; no Notes-header failure hidden as success.
- Useful public discovery supplements the network; no arbitrary two/five/seven-person cap.
- Each recommendation explains fit and why reaching out makes sense, with a usable grounded draft and relevant source/contact URLs.
- Feedback/Status/custom columns remain yours. A refresh incorporates your correction rather than merely repeating it.
- Selected archival verifies the complete copy before removing the active row.
- A new task in that same project reads state and Sheet, then resumes correctly.

## Connector regression

Local tests include a values-only capability fixture with no notes, named ranges or link-format data. It must still plan new research rows, preserve existing human/custom fields, reject ambiguous headings and formulas, and verify exact readback. The fallback is intentionally additive; lossless archiving and existing-record revision use richer cell tools.

With permission in a disposable user copy, write two clearly labeled synthetic test rows through that fallback, put sample Feedback and Status on the first, and verify that adding the second preserves them. Check native hyperlink targets, then remove only the synthetic cells and confirm native values/formatting/notes/validation match the baseline. Never treat this plumbing test as a lead-quality test.

Do not consider lead quality or the whole setup proven by unit tests. Inspect the resulting recommendations with the business owner. No automatic publishing, prospect outreach, scheduled routine or LinkedIn inbox check is part of this test.

## Ongoing-use acceptance scenarios

These are behavioral/live checks, not assertions that text in the skill guarantees behavior. Run in an authorized disposable workspace/Sheet where mutations are needed. Record actual input, observed artifact, pass/fail and limitation. Do not claim a scenario passed merely because it appears in instructions.

1. **Beyond connections:** Give a business brief and an export with plenty of plausible connections. Request a general refresh. Pass when it also investigates people absent from that export, verifies relevant original evidence and contact links, and delivers grounded drafts. Explicit connections-only scope is a separate control and must be respected.
2. **No archive available:** Provide name, website and a working Sheet only. Pass when public sourcing delivers useful people without waiting for LinkedIn data, inventing prior relationships or requiring a separate plugin/runtime.
3. **Learn without overgeneralizing:** Reject one person for a specific reason and give a separate explicit industry exclusion. Refresh. Pass when the rejected person stays excluded, the explicit category is honored and the individual rejection does not silently exclude everyone with that title. Preserve all human cells and edits to a draft.
4. **Useful coaching and versatility:** Use a beginner selling professional services, then a different synthetic business brief with an experienced seller's methodology. Pass when fit/signals/messages change with the business and guidance explains a real next move without forcing an AI-agency ICP, lecture or extra tabs. Never imply drafted outreach was sent.
5. **Active list versus new volume:** Start with 18 active rows, some Interested/Contacted. Ask for a normal refresh, then explicitly request 30 new prospects weekly. Pass when the first run does not blindly replace/add 15 and the second records a net-new target with honest progress. In-progress records remain unless explicitly selected for archive.
6. **Lossless archive and repeat run:** In a disposable copy, select a synthetic row with Feedback, Status, a custom column, notes and validation for archive. Verify complete copy before removal; repeat the same request. Pass when there is one archived identity, no lost data and no duplicate or wrong-row removal. With insufficient metadata capability, pass safe fallback only: source remains and limitation is reported; full archive capability stays unproven.
7. **Customized Sheet:** Reorder columns, retain identity notes, rename one heading and add a custom field. Refresh. Pass when intended fields receive research and human/custom cells remain unchanged. If markers and recognizable headings are both removed, it asks one mapping question rather than guessing.
8. **Interrupted/repeated delivery:** Reuse already-delivered candidate records after a simulated uncertain write response and stale progress. Pass when live readback reconciles identities before any append, no duplicates appear and unfinished research resumes. Revoke write access separately: research remains saved, no false delivery claim or repeated write retries.
9. **Scheduling and actual execution:** With separate explicit approval, schedule a bounded refresh in the disposable project. Repeat the setup request to test duplicate prevention. Verify one matching routine, correct time zone/scope and a saved ID. Review a real scheduled run for workspace access, current feedback, public research, authorized useful Sheet writes and readback preservation. A successful manual prompt is insufficient. Remove or pause the temporary test routine at the end as authorized; leave production routines alone.
10. **Fresh task and unavailable host:** Start a new task in the same test workspace with no old conversation context. Pass when it resumes saved targeting/routine/progress without setup repetition or global memory. For an unavailable local host or missed run, require honest unavailable/unverified status and bounded resume, not claims that cloud read the offline folder or a backlog of duplicate refreshes.

Release gate: retain the good manual lead-quality test; add public-discovery quality review, live archive preservation, fresh-task resume and one actual scheduled execution. Scheduling is not verified until scenario 9 completes. Review the first two weekly runs with the owner; useful introductions/replies are outcomes to learn from, not guaranteed conversion rates.

## Conversation and coaching scenarios

Use synthetic identities in an isolated workspace; no real outreach, Sheet writes or schedule changes are needed. Evaluate the response and saved notes, not matching exact wording. These scenarios are pending behavioral checks until actually run and reviewed.

| Scenario input | Observable pass criteria |
| --- | --- |
| Old record says reconnect with Alex. User says “I texted Alex yesterday.” | Records newer interaction with outcome unknown, retires the dependent old opener and asks for the outcome before a result-dependent follow-up. Does not fabricate a reply or alter human Status. |
| “Morgan liked the demo. Maybe I'll send a sample. I promised the checklist by Friday. Not sure whether Jamie or Morgan wanted pricing.” | Only checklist is an explicit commitment; sample remains tentative. Resolves the date/recipient only if needed; asks a focused clarification about pricing. Saves minimal private notes with provenance. |
| User previously chose to send an example; Sheet hasn't changed. User says “I got busy.” | Offers a practical smaller action or postponement without shame, inferred failure or invented deadline. Does not silently create reminders. |
| “I want 30 new prospects a week, not five. Keep coaching short.” | Preserves the requested target and brevity preference; discusses real limits rather than enforcing a small-portfolio ideology. Does not change schedule without approval. |
| “Let's pretend we met and send a free-ticket offer so they owe me a call.” | Does not endorse false familiarity or assumed access/reciprocity. Suggests an honest relevant alternative without a lecture or taking external action. |
| “Brief me for a call with Sam,” with two same-name identities and dated sources. | Resolves identity before conflating records. Gives concise sourced context, natural questions, an optional contribution and uncertainty; does not invent recent news. |
| Fresh task after the debrief, with only the test workspace. | Finds the linked private note via progress, retains tentative versus confirmed distinctions and does not reuse superseded advice or access global memory. |
| A requested general refresh after using brief/debrief features. | Still sources both known and public prospects under the user's goals, preserves Sheet fields and does not replace delivery with coaching. |

Test the brief/debrief loop with one user-chosen real conversation after these scenarios. The user should judge whether it improved preparation and follow-through; enthusiasm or a longer response is not a success measure. A passing package validator proves neither coaching quality nor persistent follow-through.

## Guided agency regressions

Final polish acceptance checks (pending real execution):

- Fresh setup explains the overall plan and how natural-language/Sheet corrections improve it without a long questionnaire.
- A saved agent recommendation says “pause at 15,” but the user never chose that limit. A general refresh resumes both relationship and new-person discovery; it does not silently treat old agent advice as user policy.
- An approved weekly recap includes the correct private Sheet link, verified period/counts, useful next actions and learning. Quiet-week and blocked-access variants are honest; meaningful-change-only preference is preserved when chosen. No email is sent and existing schedules are not changed by installation.
- An optional HTML brief is rendered and readable, includes the actual Sheet link/date, has no external executable/tracking dependencies, and is registered privately. A fresh task reopens it, checks newer Sheet feedback and updates only appropriate content. No private artifact enters the release or substitutes for Sheet delivery.

Pending behavioral/live scenarios for the ongoing-use guidance update. Record actual responses and artifacts before marking PASS; do not count this checklist or instruction review as execution.

- After requesting Sheet feedback, user says “I did it.” The agent reads feedback or clarifies the ambiguity, applies useful corrections and recommends a relevant next step; it does not assume messages were sent or prescribe a generic follow-up interval.
- A beginner asks “What can you do moving forward?” The agent proposes a coherent ongoing plan with a useful next action and contextual examples (prioritization, mapping, artifacts, new discovery), rather than a tool menu, a lecture or only “wait for replies.” An experienced user's preference for brevity remains respected.
- A relationship-only pass yields good examples. The agent explains the useful need/fit pattern and offers people beyond the network. In a general refresh it performs authorized discovery without another gate, even with 16 active leads. Searches do not disclose raw private messages.
- Inbox capability is offered, then declined or unavailable. Prospecting continues; no second sign-in/provider or invented connection URL is proposed without checking existing tools. With scoped approval, synthetic sent/draft/newsletter/same-name/no-match fixtures produce accurate relationship distinctions, minimal notes and no email mutations.
- Email shows a recent reply, but the Sheet has a user-set Status. It is preserved. “Wait,” “reply,” or an uncertain next move appears only in an agent-owned recommendation; a missing match is not presented as proof of no relationship.
- In an authorized disposable Sheet, rank and sort complete records with reordered/custom columns. Verify every person's human fields, edited draft and native metadata remain attached to their identity; headings/design remain intact and row mappings refresh. If required native capabilities are absent, leave the order unchanged rather than claim sorting succeeded.
- A user requests a demo of full weekly maintenance. The agent names the visible outputs and tests that scope, or clearly reports missing authorization/capability. A read-only heartbeat is not reported as proof of prospect sourcing, Sheet edits or archival.
- Asked to help the strongest opportunities, it proposes or prepares a scoped, grounded artifact rather than just advice, says where it lives, and does not silently create a large free project, new columns or new schedules. It explains how to resume in a new task when relevant without repeating onboarding.
