# Installation details

Ask Codex to perform these steps for you. They register this repository's catalog, then install its plugin:

```sh
codex plugin marketplace add ColtraneK/prospecting-aidgent
codex plugin add prospecting-aidgent@prospecting-aidgent
codex plugin list
```

The repository contains `.agents/plugins/marketplace.json`. Its only entry points to `./plugins/prospecting-aidgent`. The marketplace and plugin are both named `prospecting-aidgent`. The plugin includes a portable `plugin.json` and the native `.codex-plugin/plugin.json` compatibility manifest.

No npm installation, service-account key, private source folder, or existing personal installation is required. Git is needed for the repository marketplace. Node.js 20+ runs the bundled helpers. The Google Drive connection is separate and requires the attendee's own consent.

Approve requested installation/computer-access permissions. If your organization blocks custom plugins, ask its administrator; this prompt cannot override that policy. Start a new Local task after installation. Restart the app if its plugin list is stale. The prompt does not promise an approval-free or one-task setup.

Use a new business folder, not this repository, for prospecting. Installing does not create a Sheet, schedule anything, or send messages.

For updates, ask Codex to refresh this marketplace, reinstall the plugin, verify the version, and then start a new task. It should preserve unrelated plugins and settings.

Packaging follows [OpenAI's plugin documentation](https://developers.openai.com/plugins/build/plugins). CLI command availability was checked on Codex CLI 0.155.0-alpha.2.6. See [verification status](VERIFICATION.md) for what was actually exercised.

The README's exact attendee prompt successfully installed version `0.4.0+codex.20260918170326` from this GitHub repository in an isolated Windows Codex profile. A separate fresh task discovered the skill and began setup for a fictional business. Automatic approval review was enabled for the test; attendees may need to approve access themselves. The desktop plugin-picker UI, other operating systems, and completed prospect research were not covered by that test.
