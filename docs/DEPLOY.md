# Deploy PruneKit App

## Prerequisites

- GitHub App private key (after registering the app)
- Hosting: **Render** (free) or **Fly.io**

---

## Option A — Render (free, use if Fly billing is blocked)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/nico-builds/prunekit-app)

1. Click **Deploy to Render** above (uses `render.yaml` in this repo)
2. Wait for deploy — note your URL (e.g. `https://prunekit-xxxx.onrender.com`)
3. Update webhook URLs in `app.manifest.json` on `main` to your Render URL, **or** set them manually when creating the GitHub App
4. Register the GitHub App (below)
5. In Render → **Environment**, add:
   - `GITHUB_APP_ID`
   - `GITHUB_WEBHOOK_SECRET`
   - `GITHUB_APP_PRIVATE_KEY` (paste full PEM file contents)

Verify: `curl https://YOUR-APP.onrender.com/health`

> Free Render services spin down after 15 min idle; first webhook may take ~1 min to wake.

---

## Option B — Fly.io

```bash
fly auth login
cd github-marketplace/prunekit-app
fly launch --copy-config --yes
fly deploy
```

**Billing error?** Pay overdue invoices: https://fly.io/dashboard/nicholas-chikuji/billing

Secrets:

```bash
fly secrets set \
  GITHUB_APP_ID="YOUR_APP_ID" \
  GITHUB_WEBHOOK_SECRET="YOUR_WEBHOOK_SECRET" \
  GITHUB_APP_PRIVATE_KEY="$(cat prunekit.private-key.pem)" \
  --app nico-builds-prunekit
fly deploy
```

Verify: `curl https://nico-builds-prunekit.fly.dev/health`

### GitHub Actions deploy (Fly)

1. `fly tokens create deploy -x 999999h`
2. Add `FLY_API_TOKEN` secret on `nico-builds/prunekit-app`
3. Push to `main`

---

## Register GitHub App (org-owned)

After your host URL is live, update `app.manifest.json` hooks to point at  
`https://YOUR-HOST/webhooks/github`, then:

https://github.com/organizations/nico-builds/settings/apps/new?manifest_url=https://raw.githubusercontent.com/nico-builds/prunekit-app/main/app.manifest.json

1. Create app → download PEM
2. Add secrets to Render or Fly
3. Redeploy / wait for Render auto-deploy

Install: `https://github.com/apps/prunekit/installations/new`

---

## Free Marketplace listing

1. https://github.com/marketplace/new → **PruneKit** app
2. Free plan $0 — copy from [`MARKETPLACE_FREE_LISTING.md`](MARKETPLACE_FREE_LISTING.md)
3. Submit for review

## Verified publisher

[`VERIFIED_PUBLISHER_ROADMAP.md`](VERIFIED_PUBLISHER_ROADMAP.md)
