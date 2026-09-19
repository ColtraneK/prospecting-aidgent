# Prospecting Aidgent

**Find the right people. Have something useful to say.**

Prospecting Aidgent learns your business, researches existing relationships and new people, and keeps a Google Sheet with reasons to reach out and thoughtful message drafts. You correct its judgment, choose the conversations, and send every message yourself.

## Where it helps most

| Your situation | A useful request | What you get |
| --- | --- | --- |
| A consultant or solo service business needs direct clients | “Find owners with a specific reason to need my service. Explain the evidence and what we still don't know.” | A researched shortlist, contact routes and openings grounded in the person's work. |
| An agency or specialist wants complementary partners | “Find firms that could use my delivery work under their own brand or alongside their services.” | Potential partners with a concrete fit hypothesis and questions to check whether that fit is real. |
| You have an older professional network | “Review my supplied LinkedIn history for worthwhile people to reconnect with.” | Relevant past context, current evidence and a reason to reopen the conversation when one exists. |
| You're unsure who to approach first | “Compare the strongest three. Explain why, the uncertainty, and the next move.” | A short comparison that helps you decide, rather than an unexplained score. |
| You have a call coming up | “Help me prepare for this person. What should I understand and ask?” | A concise brief, useful questions and a relevant contribution to consider. |
| You have rough notes after a conversation | “Here is what happened. Help me decide what to do next.” | Confirmed commitments separated from tentative ideas, with saved context for later. |
| You're unsure whether you already contacted someone | “Can we cross-reference these people with my inbox?” | An optional read-only review within an agreed mailbox, people and date range, using an available email connection. |

These are illustrative workflows, not customer results or guarantees of buying intent. The best fit is someone who wants thoughtful, researched conversations and will review recommendations and send messages themselves. It is not a bulk outreach or automatic messaging service.

## What you need

- The Codex desktop app, signed in, with support for plugins and a **Local** project.
- A Google account and the Google Drive connection in Codex for your Sheet.
- Internet access for research. Git and Node.js 20 or newer must be available on your computer; ask Codex to check these for you.

## Install

Paste this into a Codex task:

> Install Prospecting Aidgent from https://github.com/ColtraneK/prospecting-aidgent. Add that repository as a Codex plugin marketplace, then install prospecting-aidgent@prospecting-aidgent. Verify the installed version and tell me how to start a fresh Local task for setup. Stop if approval or a missing requirement needs my action.

Approve installation or computer access if Codex asks. This is a community plugin distributed through its GitHub marketplace, not a listing in OpenAI's public directory. Installation may take more than one step. Start a **new task** after installing so it can load the skill. If it does not appear, restart the app. [Installation details and test status](INSTALL.md).

## Start with your business

1. Create a new empty folder, such as **My Prospecting**, and open it as a **Local** project in Codex. Keep it separate from the downloaded plugin.
2. Start a new task, choose Prospecting Aidgent, and say: **“Set up Prospecting Aidgent. My name is … and my website is …”** A short business description works if you have no website.
3. Correct its best guess about your business and the people you want to meet.
4. Make your own copy of the [blank Google Sheet](https://docs.google.com/spreadsheets/d/1D3qZ6uWJMIYYJC1EvHVHSYV8Ow_T793rbAYzLvmYhHY/copy), then give Codex **your copy's link**. Connect Google Drive when prompted.
5. Optionally add your LinkedIn export to the folder the assistant creates and links. It can research new people while you wait for an export.

The assistant aims for at least 15 useful recommendations, with evidence and honest shortfalls when good matches are scarce. Review **Leads**, leave **Feedback**, and update **Status**. Those decisions stay yours. Say “More buyers, fewer partners” or “This message doesn't sound like me” to improve the next pass.

## Keep it useful

Ask **“Refresh my leads using my feedback.”** You can also ask for a conversation brief, a recap after a meeting, or a private visual plan. Resume in a new task in the same project to keep using your saved context and Sheet.

After a useful first run, you can approve a weekly refresh and a short recap linking to your Sheet. Installation starts no schedule. Recaps appear in the scheduled task; the plugin does not send email. Local schedules need your computer on, the app running, and the project available. An offline computer cannot supply local files to a cloud task. Unattended research and Sheet maintenance still need a successful scheduled test in your environment.

Your files stay in your project, but content Codex reads is processed by the AI service. Do not publish your business folder. An export is a snapshot, not live LinkedIn reply tracking.

## It remembers your corrections

Tell it “more direct buyers,” “exclude this person,” “keep my openings under 50 words,” or “explain the reasoning, but keep sales tips brief.” It saves the relevant preference in your project, tells you what changed, and uses it in future work. Feedback in the Sheet works too. A preference about one person or message should not silently become a rule for every prospect.

Supply a few messages you wrote if you want closer voice matching. You can change or withdraw a preference later. Start a new task in the **same Local project** to resume the saved business context, writing preferences and current Sheet; another project does not automatically inherit them. Saving preferences is project continuity, not training a personal model. Tell it about calls or messages elsewhere—it cannot infer unshared outcomes.

## A simple weekly rhythm

| Moment | Your part | How the assistant helps |
| --- | --- | --- |
| Review | Choose a manageable set and give candid fit feedback. | Explain priorities, revise research and help refine a message. |
| Have the conversation | Send manually and listen for what matters to the other person. | Prepare questions or a useful resource when requested. |
| Capture what changed | Share rough notes or update the Sheet. | Save relevant context, distinguish promises from ideas, and recommend a next move. |
| Refresh | Request a refresh or approve a schedule. | Revisit relevant relationships, research new people and recap verified changes. |

The assistant offers an optional weekly refresh and recap after useful delivery. You can choose a short practical prospecting tip within that recap, or a separate midweek check-in to help with an action you chose. Timing, scope and tips are opt-in; an update never changes an existing schedule silently. Ask for less coaching at any time. A useful tip explains a decision in your actual work, not a motivational slogan or a promised response rate.

## Optional inbox context

If a supported email connection is available, you can approve a scoped review to see who you actually contacted, what was discussed and whether a proposed opener is out of date. The assistant first agrees the mailbox, people and time range. It distinguishes drafts, sent messages, replies and automated notices, and treats no match as unknown history. It saves minimal relevant notes; it does not send, label, archive or otherwise modify email. Declining inbox access leaves the export, your updates and public research available.

For more detail, see the [user guide](plugins/prospecting-aidgent/GUIDE.md) and [installation guide](INSTALL.md).

## Current limits and feedback

This is a **release candidate**. Package checks do not prove prospect quality or every live Google Drive operation. See [verification status](VERIFICATION.md) before presenting it as webinar-ready.

For help or a bug, [open an issue](https://github.com/ColtraneK/prospecting-aidgent/issues). Describe what happened without including private messages, exports, credentials, or your working Sheet link.

By [Aidgentic](https://aidgentic.com). [MIT license](LICENSE) · [Attribution](THIRD-PARTY-NOTICES.md).
