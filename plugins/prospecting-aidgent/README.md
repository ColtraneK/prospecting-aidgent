# Prospecting Aidgent

**Find the right people. Have something useful to say.**

Prospecting Aidgent learns your business, researches existing relationships and new people, and keeps a Google Sheet with reasons to reach out and thoughtful message drafts. You correct its judgment, choose the conversations, and send every message yourself.

## What you need

- The Codex desktop app, signed in, with support for plugins and a **Local** project.
- A Google account and the Google Drive connection in Codex for your Sheet.
- Internet access for research. Git and Node.js 20 or newer must be available on your computer; ask Codex to check these for you.

## Install

Paste this into a Codex task:

> Install Prospecting Aidgent from https://github.com/ColtraneK/prospecting-aidgent. Add that repository as a Codex plugin marketplace, then install prospecting-aidgent@prospecting-aidgent. Verify the installed version and tell me how to start a fresh Local task for setup. Stop if approval or a missing requirement needs my action.

Approve installation or computer access if Codex asks. This is a community plugin distributed through its GitHub marketplace, not a listing in OpenAI's public directory. Installation may take more than one step. Start a **new task** after installing so it can load the skill. If it does not appear, restart the app. [Installation details and test status](https://github.com/ColtraneK/prospecting-aidgent/blob/main/INSTALL.md).

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

## Current limits and feedback

This is a **release candidate**. Package checks do not prove prospect quality or every live Google Drive operation. See [verification status](https://github.com/ColtraneK/prospecting-aidgent/blob/main/VERIFICATION.md) before presenting it as webinar-ready.

For help or a bug, [open an issue](https://github.com/ColtraneK/prospecting-aidgent/issues). Describe what happened without including private messages, exports, credentials, or your working Sheet link.

By [Aidgentic](https://aidgentic.com). [MIT license](https://github.com/ColtraneK/prospecting-aidgent/blob/main/LICENSE) · [Attribution](https://github.com/ColtraneK/prospecting-aidgent/blob/main/THIRD-PARTY-NOTICES.md).
