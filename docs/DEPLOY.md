# Deploy PruneKit App to Fly.io

## Prerequisites

- [Fly.io account](https://fly.io/app/sign-up)
- GitHub App private key (after registering the app)

## Option A — Local deploy

```bash
fly auth login
cd github-marketplace/prunekit-app
fly launch --copy-config --yes   # uses fly.toml app name nico-builds-prunekit
```

After creating the GitHub App (see below), set secrets:

```bash
fly secrets set \
  GITHUB_APP_ID="YOUR_APP_ID" \
  GITHUB_WEBHOOK_SECRET="YOUR_WEBHOOK_SECRET" \
  --app nico-builds-prunekit

fly secrets set GITHUB_APP_PRIVATE_KEY="$(cat prunekit.private-key.pem)" --app nico-builds-prunekit
fly deploy
```

Verify: `curl https://nico-builds-prunekit.fly.dev/health`

## Option B — GitHub Actions deploy

1. Create Fly token: `fly tokens create deploy -x 999999h`
2. Add org/repo secret `FLY_API_TOKEN` on `nico-builds/prunekit-app`
3. Push to `main` — workflow `.github/workflows/deploy-fly.yml` deploys automatically

## Register GitHub App (org-owned)

Once Fly is live and `app.manifest.json` is on `main`:

**One-click:**  
https://github.com/organizations/nico-builds/settings/apps/new?manifest_url=https://raw.githubusercontent.com/nico-builds/prunekit-app/main/app.manifest.json

1. Create the app → download private key PEM
2. Copy **App ID** and **Webhook secret** into Fly secrets
3. Redeploy if needed

Install URL (after creation): `https://github.com/apps/prunekit/installations/new`

## Free Marketplace listing

1. https://github.com/marketplace/new → select **PruneKit** GitHub App
2. Free plan: $0 — dry-run audits + PR comments
3. Privacy: `https://github.com/nico-builds/prunekit-app/blob/main/docs/PRIVACY_POLICY.md`
4. Support: `https://github.com/nico-builds/prunekit-app/issues`
5. Submit for review

Copy from [`../prunekit-cleanup-action/listing/APP_LISTING_DRAFT.md`](../prunekit-cleanup-action/listing/APP_LISTING_DRAFT.md).

## Verified publisher

See [`VERIFIED_PUBLISHER_ROADMAP.md`](VERIFIED_PUBLISHER_ROADMAP.md).
