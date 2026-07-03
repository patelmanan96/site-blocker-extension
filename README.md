# Focus Blocker

A minimal Chrome extension to block distracting sites, or restrict browsing to a whitelist only.

## Features
- **Block mode**: block a list of sites
- **Whitelist mode**: only allow sites on the list, block everything else
- **Built-in adult content filter**: ~500K known adult domains (sourced from [blocklistproject/porn.txt](https://github.com/blocklistproject/Lists)), always blocked in every mode, and not editable from the UI
- Pretty popup UI to manage settings
- Custom block page with motivational quotes on money, success, and resilience

## Install (unpacked)
1. Go to `chrome://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select this folder
5. Click **Details** on the extension card → enable **Allow in Incognito**. Chrome requires this manual step for every extension — there's no way to enable it programmatically. Without it, the extension (including the adult content filter) will not run in Incognito windows.

## Usage
Click the extension icon, choose **Block** or **Whitelist**, list domains (one per line, e.g. `facebook.com`), and click **Save Settings**. The adult content filter runs automatically and always — no setup needed.
