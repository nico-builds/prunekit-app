# PruneKit

**Prune dead code. Merge redundant docs. Keep repos lean.**

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/nico-builds/prunekit-app)

GitHub App for AI-powered repository cleanup, built on the [Cursor SDK](https://cursor.com/docs/sdk) (Composer 2.5).

| Component | Repository | Role |
|-----------|------------|------|
| **GitHub Action** | [prunekit-cleanup-action](https://github.com/nico-builds/prunekit-cleanup-action) | CI audits & optional apply |
| **GitHub App** | This repo | PR comments, installs, Marketplace billing |

## Features

- Multi-phase cleanup: audit → doc correlation map → plan → apply
- Dead code & unused file detection
- Documentation merge mapping (mermaid clusters)
- PR comments with setup guidance
- Marketplace purchase webhooks (Pro / Team)

## Quick start (App)

### 1. Deploy the server

```bash
cp .env.example .env
# Fill GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY_PATH, GITHUB_WEBHOOK_SECRET
npm install
npm run dev
```

Expose `https://YOUR_HOST/webhooks/github` (use ngrok for local dev).

### 2. Create the GitHub App

Option A — use manifest (`app.manifest.example.json`) after updating URLs.

Option B — manual: https://github.com/settings/apps/new

| Setting | Value |
|---------|-------|
| Name | PruneKit |
| Webhook URL | `https://YOUR_HOST/webhooks/github` |
| Webhook secret | Same as `GITHUB_WEBHOOK_SECRET` |
| Events | `pull_request`, `installation`, `marketplace_purchase` |

Download private key → save as `prunekit.private-key.pem` (gitignored).

### 3. Install on a test repo

https://github.com/apps/YOUR_APP_SLUG/installations/new

Open a PR → PruneKit posts an audit reminder comment.

### 4. Connect the Action

Add `CURSOR_API_KEY` secret and copy [`templates/prunekit-audit.yml`](templates/prunekit-audit.yml).

## Verified publisher path

See [`docs/VERIFIED_PUBLISHER_ROADMAP.md`](docs/VERIFIED_PUBLISHER_ROADMAP.md).

## API endpoints

| Route | Description |
|-------|-------------|
| `GET /health` | Liveness |
| `POST /webhooks/github` | GitHub events |
| `GET /admin/stats` | Install count (Bearer `ADMIN_TOKEN` if set) |

## Environment

See [`.env.example`](.env.example).

## License

MIT
