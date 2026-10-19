# Onshape AutoLogin

A Firefox extension that fills in and submits the Onshape sign-in form for you.

## Install

1. Open **https://github.com/PioneerSwine996/Onshape-AutoLogin/releases/latest/download/onshape-autologin.xpi** in Firefox and click **Allow**, then **Add**.
2. Click the Extensions (puzzle piece) button in the toolbar → **Onshape AutoLogin**, then enter your email and password and click **Save**. Right-click it → **Pin to Toolbar** to keep the key icon visible.

Firefox checks for new versions and updates it automatically.

### For development

Open `about:debugging#/runtime/this-firefox` → **Load Temporary Add-on…** → pick `manifest.json`. It's removed when Firefox restarts.

## Releasing

One-time setup: create API credentials at https://addons.mozilla.org/developers/addon/api/key/ and add them as repo secrets:

```sh
gh secret set AMO_API_KEY
gh secret set AMO_API_SECRET
```

For each release:

1. Bump `"version"` in `manifest.json` (Mozilla rejects a version it has already signed) and commit.
2. Tag and push: `git tag v1.2.0 && git push origin main v1.2.0`

The Release workflow signs the add-on as unlisted, then publishes a GitHub Release with `onshape-autologin.xpi` and `updates.json`. Lint locally with `npx web-ext lint --self-hosted`.

## Notes

- Your credentials are stored **unencrypted** in this Firefox profile's extension storage.
- Accounts with 2FA or SSO still need you to finish signing in by hand.
- After an attempt, it waits 60 seconds before trying again, so a wrong password won't put it in a loop.
