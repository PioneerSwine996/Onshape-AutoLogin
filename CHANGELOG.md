## [1.1.0] - 2026-10-19

### Features

- GitHub Releases: pushing a `v*` tag signs the add-on as unlisted on addons.mozilla.org and publishes the `.xpi` plus `updates.json`.
- Automatic updates via `update_url` pointing at the latest release's `updates.json`.

### Design Rationale

- `updates.json` is a release asset served from `releases/latest/download/`, so nothing has to be committed back to the repo on each release.
- The `.xpi` keeps the same filename every release, so `releases/latest/download/onshape-autologin.xpi` is a permanent install link.

### Notes & Caveats

- Release downloads and update checks only work for other people if the repository is public.
- Copies installed from 1.0.0 (no `update_url`) won't auto-update; reinstall once from the latest release.
- `web-ext lint` must be run with `--self-hosted`, since `update_url` isn't allowed for listed add-ons.

## [1.0.0] - 2026-10-19

### Features

- Fills and submits Onshape's two-step sign-in form with saved credentials.
- Toolbar popup for entering email and password.
