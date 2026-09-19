# Verification status

Release candidate. Publication is not a claim that the complete webinar workflow passed.

For the original publication, the source and installed package both reported `0.4.0+codex.20260918164013`; all 29 source files matched byte for byte before packaging. Helpers, skill instructions, research references, template configuration and synthetic tests are preserved. Changes are limited to distribution metadata and documentation.

## Current conversation and continuity patch

Version: `0.4.0+codex.20260918215526`. This patch changes conversation instructions, adds continuity-default migration, and expands the public guide. Original publication results below are historical, not proof of the changed behavior.

- All **42 synthetic package tests passed**, including upgrade preservation, unknown fields, declined choices, saved business notes, repeated initialization and refusal to replace malformed state.
- The two plugin manifests share the same version and interface. The publication allowlist includes the new synthetic continuity test.
- Official plugin-creator and skill-creator validators passed. An allowlist audit covered **42 public files**; no private workspace paths, exports, credentials or personal Sheet links were found. Eight unchanged core files, including Sheet helpers, archive helpers, qualification framework and template configuration, match the previously installed release byte for byte.
- New behavioral scenarios cover first-delivery guidance, remembered voice/preferences in a fresh task, optional inbox scope, opt-in tips/check-ins and respectful sales recommendations. These scenarios are **pending the next conversation retest**; no live inbox, business Sheet, or schedule was used for this patch.
- Automated state tests verify file handling, not whether the model consistently learns or follows a writing preference. Actual unattended execution remains unverified by this patch.

## Original publication checks

- Public blank template: read-only check on 2026-09-18 found only headers in Leads and Archive; Start Here held setup guidance and counts.
- Opening explanation: instruction review confirms a short orientation, correction examples, and optional export. Behavioral execution is tracked separately below.
- Weekly recap: instruction review confirms opt-in scheduling, Sheet link, verified counts, quiet/blocked variants, and private continuity. No real schedule was created or modified.
- Reusable HTML: instruction review confirms private storage, date and Sheet link, later reconciliation, escaped text, no remote scripts/trackers, and visual verification or an explicit limitation. No live HTML scenario is claimed from that review.

Checks executed on 2026-09-18:

- All **38 synthetic package tests passed** against the publication copy.
- Official plugin-creator and skill-creator validators passed. Their YAML dependency and UTF-8 mode were supplied in the validation environment only; no dependency was added to the plugin.
- Explicit allowlist audit covered **41 publication files**, with no unresolved credentials, personal Sheet IDs, exports, private state, correspondence, demo artifacts or machine-specific paths. The public blank-template link, synthetic fixtures and required attribution are intentional. Git attributes preserve the audited bytes across platforms, including the source's existing line endings.
- A separate Codex home/profile and empty business folder installed the local repository marketplace and discovered exactly one Prospecting Aidgent skill, enabled at version `0.4.0+codex.20260918170326`. The personal plugin installation and business workspace were not used.
- A second, empty Codex profile added `ColtraneK/prospecting-aidgent` from GitHub and installed the plugin. All **41 downloaded repository file hashes** and **31 installed plugin file hashes** matched the audited publication. All **38 tests passed again from the installed copy**.
- The **exact installation prompt in README.md passed** in another fresh profile on Windows with Codex CLI **0.155.0-alpha.2.6** and automatic approval review. It registered the GitHub marketplace, installed the plugin, verified enabled version `0.4.0+codex.20260918170326`, and explained the new Local task step. It used the signed-in account for model access, but no personal plugin installation or business context. Unrelated user skills were disabled. Temporary authentication was removed afterward.
- A **fresh task began setup** from that installed skill using a fictional consultancy, no website, no export, and an empty business folder. It gave a concise orientation, proposed targeting for correction, created the real import folder, saved parseable progress, and supplied the canonical template link. It discovered an active Sheets connector but had no working Sheet binding. This proves setup began; it does not prove completed research/delivery or every wording detail of the new opening.
- With explicit permission, a separate disposable template copy received **two clearly labeled synthetic records** through the bundled plan/preflight/readback helpers and the live Google Drive connector. A research refresh preserved simulated human Feedback, Status, an edited draft, a custom field, notes, validation and native links. The helper rejected replacing the edited draft with a stale baseline.
- The live archive check copied the selected **complete 13-cell record**, verified native data and the unchanged source, then removed only its source row. Readback showed one surviving Lead and one intact Archive record. A repeat identity check found no source record to move again. This is a synthetic integration check, not an autonomous research or lead-quality test.
- Visual Sheet verification remains limited: native values/formatting/metadata were read back, but the browser required Google sign-in, so no login was attempted and no Google-rendered visual check is claimed.

The prompt succeeded once in this tested environment. An attendee can still encounter installation approval, missing Git/Node, organizational restrictions, Google Drive consent, or an app restart. The desktop plugin-picker UI and other operating systems were not tested. This is not a guaranteed one-prompt, approval-free experience.

## Outstanding acceptance gates

The scenarios in [TESTING.md](plugins/prospecting-aidgent/TESTING.md) remain pending unless explicitly recorded as passed. In particular: complete setup and lead-quality review, autonomous feedback-driven sourcing and archive decisions, fresh-task resume of unfinished delivery, actual scheduled research and Sheet writing, weekly recap delivery, and rendered/reopened HTML behavior. The synthetic connector checks above cover preservation mechanics, not those broader behavioral gates.

No real business Sheet, email, schedule, export or demo data was modified for publication. The approved disposable Sheet contains synthetic test records only; its ID, snapshots, test transcripts and local artifacts are excluded from the repository. Scheduling still requires a separately approved temporary routine and a real scheduled execution. Until the outstanding checks pass, do not describe the full workflow as webinar-ready or unattended maintenance as verified.
