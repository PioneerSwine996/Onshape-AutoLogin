# Onshape AutoLogin

A Firefox extension that fills in and submits the Onshape sign-in form for you.

## Install

1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on…** and pick `manifest.json`
3. Click the Extensions (puzzle piece) button in the toolbar → **Onshape AutoLogin**, then enter your email and password and click **Save**. Right-click it → **Pin to Toolbar** to keep the key icon visible.

A temporary add-on is removed when Firefox restarts. To keep it installed, either:
- sign it as an unlisted add-on at addons.mozilla.org (free; `npx web-ext sign`), or
- use Firefox Developer Edition/Nightly, set `xpinstall.signatures.required` to `false` in `about:config`, and install a zip of this folder.

## Notes

- Your credentials are stored **unencrypted** in this Firefox profile's extension storage.
- Accounts with 2FA or SSO still need you to finish signing in by hand.
- After an attempt, it waits 60 seconds before trying again, so a wrong password won't put it in a loop.
