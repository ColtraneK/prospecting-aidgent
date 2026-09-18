# The user's working Sheet

Read `template.json` beside SKILL.md for the canonical copy link. The master is a blank example, never a write target. Ask the person to make their private copy and share its URL. Bind that copy in `state/sheet.json`: spreadsheet ID, observed URL, tab IDs/roles and field mapping. Never choose a Sheet from memory, a prior demo or a search result when the person supplied a URL.

Discover the available Google Drive/Sheets read and write actions and inspect their schemas; use the connected Google Sheets skill when available. Do not assume a tool is missing merely because it was not initially shown. These local helpers do not authenticate or write remotely. Do not ask for a service-account key or install the old runtime. Never replace this deliverable with HTML.

Use the simplest verified path that preserves the person's data. Prefer CellData reads when available. If only values can be read, use the values-only addition path below when headings and empty destination rows are verified. Header notes, named ranges and rich hyperlink metadata are not prerequisites for adding ordinary text rows under clear headings. A blocked advanced operation (such as lossless archiving) must not block independent research or safe additions. Report separately what was researched, what was written and what needs a stronger connection.

## Layout and customization

Keep Start Here, Leads, Archive and their existing design. Read all current headings and their notes, not hardcoded letters. The template defines semantic field identities in header notes and named ranges. A column can move and its heading can change as long as its identity marker remains. `scripts/sheet-schema.mjs` resolves these and rejects conflicting or missing human fields. Familiar headings are only a fallback when markers are unavailable. Preserve unknown custom columns. If someone removes all identifying metadata and renames a field arbitrarily, ask what it means rather than guessing. Renamed tabs need an explicit binding update; the standard writer requires the Leads title.

Feedback and Status are human-owned. The research writer cannot change them, including setting an initial status. A blank status means new/unreviewed; the person may use the dropdown. Learn from Feedback before every refresh. Respect their custom statuses and methodology. Do not rewrite a draft the user changed: compare with the last verified agent-written draft and ask or preserve it.

Evidence URL and LinkedIn / contact URL contain one bare URL each. Use the relevant post, article, job or meaningful source for evidence and the person's verified LinkedIn profile for contact when available. No Markdown or labels in URL cells. Put source dates, caveats and secondary sources in Context. If the evidence is a private exchange, say so in Context rather than publishing the exchange or inventing a public URL. Do not fabricate an email or profile from a name. A verified contact page is a disclosed fallback; an email may be explained separately in Context when authorized.

## Optional prioritization and visible guidance

When the user wants a maintained working queue, propose a simple arrangement that preserves their design: explained priority, a concrete next action and selective highlighting for the strongest opportunities. Reuse agreed agent-owned fields or a bounded Start Here section where possible. Adding columns or changing the standing sort/archive policy needs agreement; do not silently treat an unknown custom column as yours. Optional fields are not automatically supported by the bundled research writer: use a verified direct connector operation with explicit ownership/mapping, rather than weakening the helper's unknown-field rejection.

A priority is a recommendation, not human Status. Put “wait for reply” in an agent-owned next action, never change Status to Hold/Contacted yourself. For a sort, use a supported native operation on complete occupied records, including all custom columns; never sort only agent-owned cells or rebuild rows as values. Inspect formulas, merged cells and protected ranges first, preserve header/design, and verify by stable person/contact identity that feedback, statuses, drafts, custom data, notes and links stayed with the right person. Refresh all row mappings after a sort or archive; row numbers are not identity. If preservation cannot be verified, leave the Sheet order intact and provide a ranked recommendation instead.

Honor a user's agreed rule such as archiving Not a fit/Archive statuses using the lossless procedure below; a status label alone does not authorize inventing a broader policy. Show where current next actions and requested artifact links live, and report actual changes. Never turn a chat-only summary into a claim that the Sheet was maintained.

## Normal update: read, plan, apply, verify

These helpers are available for reliable planning and checks; their exact JSON snapshot format is not a user-facing setup requirement. A direct connector implementation is also valid when it performs the same bounded read, field/row matching, human-field preservation and readback. Do not turn helper plumbing into repeated permission prompts or leave a ready batch unwritten merely because one helper needs richer metadata.

1. Read metadata and the actual headings. Read bounded current records and Archive for deduplication/exclusions, paging as necessary. Keep raw snapshots in `research/private/`. A local index is not a substitute for current human edits. Verify the copy has the expected three tabs; do not erase unfamiliar tabs or repair by clearing the workbook.
2. Read CellData including `userEnteredValue,note,userEnteredFormat.textFormat.link,dataValidation`. Include every column through the last used/custom column. Read row 1 through each affected row in bounded pages and assemble a contiguous snapshot, filling omitted trailing empty cells/rows with `{}`. Do not fabricate missing reads. Rows/columns in scripts are zero-based; row 0 is the header. Snapshot JSON shape:

```json
{
  "spreadsheetId": "USER_COPY_ID",
  "workbook": {"spreadsheetId":"USER_COPY_ID", "sheets":[{"properties":{"sheetId":123,"title":"Leads"}}], "namedRanges":[]},
  "sheetId":123,
  "startRowIndex":0,
  "rows":[{"values":["ACTUAL_CELL_DATA_OBJECTS_NOT_STRINGS"]}]
}
```

Use actual connector `structuredContent` properties and `sheets[].data[].rowData` with their startRow/startColumn offsets. `get_spreadsheet_metadata` may not expose named ranges; header notes are sufficient. Never assume a missing metadata field means the Sheet has no metadata. Do not perform dummy edits merely to fetch metadata. The example above is a shape illustration, not runnable data.

3. Stage qualified, deduplicated research. For an empty row, provide fields `person`, `fit`, `why_now`, `message`, `contact_url` plus other known research fields. Add `evidence_url` when the actual supporting source is public. An evidence-backed opportunity still needs a contact path. Do not append into a row with existing content or human notes. Example changes structure (actual grounded content replaces placeholders):

```json
[{"rowIndex":1,"fields":{"person":"...","fit":"...","why_now":"...","message":"...","contact_url":"https://..."}}]
```

For an update, also provide `expectedPerson` and `expectedContact` exactly from that row. If changing `message`, provide `lastVerifiedMessage` from the saved, previously verified agent-written draft. The helper requires that baseline to match the current message; if it is missing or differs, preserve the draft and continue independent research updates. Never manufacture the baseline by copying the current human-edited cell. If the user requests a revision to their edited draft, prepare it for review and use a separately authorized exact-cell update with fresh readback. A change of identity/contact requires separate review, not replacing a person in place. Compare against all active and archived identities; the script only deduplicates within the supplied snapshot. Never overwrite rows merely to achieve a target count.

4. Run these commands yourself, using absolute paths and new plan filenames:

```
node <skill>/scripts/sheet.mjs plan --snapshot <snapshot.json> --changes <changes.json> --output <plan.json>
node <skill>/scripts/sheet.mjs preflight --plan <plan.json> --snapshot <fresh-same-bounds.json>
```

5. Immediately before writing, reread identical bounds and metadata, run preflight, and execute only the plan's `requests` against its spreadsheet ID using the connected batch-update action. Ask users not to edit during that brief write. The preflight is a stale-read check, not a database lock: Google Sheets can still change between read and write. Never blindly retry after an uncertain response; read first.
6. Reread identical bounds/metadata and run:

```
node <skill>/scripts/sheet.mjs verify --plan <plan.json> --snapshot <readback.json>
```

It verifies research content, link targets, notes and validations, including untouched human/custom cells. On mismatch inspect what changed, preserve user edits and report the real outcome. On success save the verified last-written values/identities, coverage and next action. Report actual rows, not cell-request count. Preserve design and inspect presentation in the Sheet after the first write.

## When only value reads are available

This path adds new recommendations into verified empty rows. It does not revise existing research, rebuild formatting, move rows or claim to verify unavailable cell metadata. That limited capability is enough to deliver the first list and add new prospects while preserving existing records.

1. Read current metadata and all relevant Lead/Archive identities and human feedback. Read the full table width, including custom columns, and clear headings. Use a bounded values read with `FORMULA` rendering so a formula displaying an empty string is not mistaken for a blank destination. A blank template does not require named-range or link-format inspection. If a heading was renamed beyond recognition and no markers can be read, clarify that mapping instead of guessing.
2. Convert the real metadata and value response (with its actual A1 range) using the helper. This uses headings only, not made-up notes. Only omitted trailing cells inside the successfully read bounds are treated as empty.

```
node <skill>/scripts/sheet.mjs snapshot-values --metadata <metadata.json> --values <values.json> --sheet-id <id> --read-mode FORMULA --output <snapshot.json>
node <skill>/scripts/sheet.mjs plan --snapshot <snapshot.json> --changes <changes.json> --output <plan.json>
```

3. Reread the same bounds in FORMULA mode, convert again and run preflight. The generated plan has two alternative representations: use `requests` with a native spreadsheet batch-update tool, OR `valuesBody` with a values-batch-update tool that supports `RAW`. Never send both, never send values-API fields to the native batch-update endpoint, and never use USER_ENTERED parsing for prospect text. Each operation targets research cells only; Feedback, Status and custom columns are omitted, not rewritten as blanks. The native mask is only `userEnteredValue`, retaining unrelated formatting, validation and notes.
4. Read back identically and verify. Each URL is one bare URL value, with no labels or Markdown. Do not require explicit hyperlink styling to write the lead. Check clickability visually or through link metadata when available; if unavailable, say link appearance is unverified rather than withholding the entire list. If actual formatting prevents clicking, repair only the affected links through an available native method.

If FORMULA reads cannot be obtained, use CellData or a supported, verified native insertion into new rows; don't overwrite cells based only on blank display text. Permission failures, ambiguous headings, and inability to identify safe destinations are real blockers. Missing optional styling metadata is not. Save complete research and continue sourcing if writing is blocked.

## Archive without losing history

Archive only user-selected rows (for example Status = Archive) or a clearly agreed policy. Do not move Contacted/Interested rows simply because a week passed. Read source and destination fresh, resolve each field separately in both tabs, and inspect custom columns and formulas. Save the original complete row locally.

Copy the whole record, including Feedback, Status, custom fields, links, notes and validation. Never use the research-only writer for this: it intentionally rejects human fields. With identical column mappings, use a bounded native copy/paste of the full occupied row to a verified empty Archive row; with different mappings, build an explicit field-by-field copy preserving native cell data and custom headings. Ambiguous custom columns or relative formulas require clarification/review before moving. Never silently drop columns to force a match.

For field-mapped native copies, include `textFormatRuns` or `chipRuns` in a cell's write mask only when the source has those fields. A live test using a blanket mask with absent rich-text fields lost whole-cell link targets. Verify each native link URI, not just its visible URL text. If a copied whole-cell link is missing, restore the exact source `userEnteredFormat.textFormat.link` with that dedicated field mask, then repeat complete destination and unchanged-source verification before removal.

Verify the complete archived record, then reread the Leads source and ensure it is still unchanged. Only then remove that exact source row. A failure or concurrent edit leaves the original intact; report a pending move, not success. A temporarily duplicated row is safer than losing feedback. Update deduplication state only after readback. No bulk clearing, deleting tabs, or rewriting the entire workbook as a sync strategy.

## Acceptance checks in a user's copy

- One grounded recommendation has Fit, Why now, a useful Message and bare clickable URLs.
- Feedback and Status survive research refresh unchanged, including user-entered custom values.
- Move Status before Person and rename it: identity markers still resolve it; the writer leaves it alone.
- Add a custom column: refresh does not touch it, and archiving preserves it.
- Fresh local task reads business/progress/binding, reads feedback, and resumes without setup repetition.
- Master template stays blank. No lead/private data enters the plugin package.
