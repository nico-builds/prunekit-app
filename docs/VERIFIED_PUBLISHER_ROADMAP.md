# Verified Publisher Roadmap — PruneKit

Goal: list **PruneKit** on [GitHub Marketplace](https://github.com/marketplace) with paid plans.

GitHub requires a **verified publisher organization** before paid App plans. This doc is your checklist.

---

## Phase 0 — Brand & repos (now)

| Item | Status | Notes |
|------|--------|-------|
| Product name **PruneKit** | ✅ | Prune dead code + docs |
| Action repo `prunekit-cleanup-action` | ✅ | Free Marketplace Action |
| App repo `prunekit-app` | ✅ | Webhooks + billing scaffold |
| Privacy policy | ✅ | `docs/PRIVACY_POLICY.md` |

---

## Phase 1 — Publish free Action (Week 1)

**Why:** Distribution, credibility, install funnel toward App.

1. Push `prunekit-cleanup-action` → `github.com/nico-builds/prunekit-cleanup-action`
2. Accept [Marketplace Developer Agreement](https://docs.github.com/en/site-policy/github-terms/github-marketplace-developer-agreement)
3. Release **v1.0.0** with **Publish to Marketplace** checked
4. Categories: Code quality + CI
5. Share README / social / README badge in your projects

**Checklist:** [`../prunekit-cleanup-action/listing/PUBLISH_CHECKLIST.md`](../prunekit-cleanup-action/listing/PUBLISH_CHECKLIST.md)

---

## Phase 2 — Create publisher organization (Week 1–2)

Paid apps **must be owned by an organization**, not a personal account.

### Recommended: create `PruneKit` org

1. Go to https://github.com/account/organizations/new
2. Organization name: **`PruneKit`** (or `prunekit-dev` if taken)
3. Contact email: your support address
4. Transfer repos when ready:
   - `nico-builds/prunekit-cleanup-action` → `PruneKit/prunekit-cleanup-action`
   - `nico-builds/prunekit-app` → `PruneKit/prunekit-app`
5. Transfer **GitHub App ownership** to the org after creation

### Publisher verification (required for paid plans)

In **Org Settings → Developer settings → Publisher verification**:

| Requirement | Action |
|-------------|--------|
| Profile accurate | Org display name, description, avatar (use `branding/logo.svg`) |
| Support email | Real inbox (e.g. `support@yourdomain.com`) |
| **Org 2FA required** | Settings → Security → Require 2FA for all members |
| **Verified domain** | Add DNS TXT record; see [Verify org domain](https://docs.github.com/en/organizations/managing-organization-settings/verifying-or-approving-a-domain-for-your-organization) |
| Request verification | Click **Request verification** — GitHub reviews |

Docs: [Applying for publisher verification](https://docs.github.com/en/apps/github-marketplace/github-marketplace-overview/applying-for-publisher-verification-for-your-organization)

---

## Phase 3 — Deploy PruneKit App (Week 2–3)

1. **Register GitHub App** from `app.manifest.example.json`  
   - https://github.com/settings/apps/new?manifest_url=... (after hosting manifest)  
   - Or manual create: name **PruneKit**, webhook URL `https://YOUR_HOST/webhooks/github`

2. **Deploy** `prunekit-app` (Railway, Fly.io, Render, etc.)
   ```bash
   cd prunekit-app
   cp .env.example .env
   # Add GITHUB_APP_ID, private key PEM, webhook secret
   npm install && npm run build && npm start
   ```

3. **Smoke test**
   - `GET /health` → `{ ok: true }`
   - Install app on a test repo
   - Open PR → PruneKit comment appears
   - `GET /admin/stats` → install count

4. **Marketplace webhooks** — already handled in `src/webhooks/marketplace.ts`

---

## Phase 4 — Free App listing (Week 3–4)

1. https://github.com/marketplace/new → select **PruneKit** GitHub App
2. Draft listing using [`../prunekit-cleanup-action/listing/APP_LISTING_DRAFT.md`](../prunekit-cleanup-action/listing/APP_LISTING_DRAFT.md)
3. Upload logo (200×200 PNG from action `branding/logo.svg`)
4. **Free plan only** at first
5. Submit for review (onboarding expert contacts you)

Requirements: [Listing an app](https://docs.github.com/en/apps/github-marketplace/listing-an-app-on-github-marketplace/drafting-a-listing-for-your-app)

---

## Phase 5 — Reach 100 installs (Weeks 4–12)

Paid plans require **≥100 GitHub App installations** ([requirements](https://docs.github.com/en/apps/github-marketplace/creating-apps-for-github-marketplace/requirements-for-listing-an-app)).

**Tactics:**

- Action README → “Install PruneKit App” CTA
- Free tier on Marketplace
- Dev.to / HN post: “PruneKit — AI repo cleanup for GitHub”
- Add workflow template to App repo (`templates/prunekit-audit.yml`)
- Track progress: `GET /admin/stats` on deployed app

---

## Phase 6 — Enable paid plans (after verification + 100 installs)

1. Confirm **verified publisher** badge on org
2. In Marketplace listing → **Pricing plans**
   - Pro: $19/mo, $190/yr
   - Team: $49/mo, $490/yr
3. Test purchase flow with Marketplace sandbox
4. Implement Pro features:
   - Scheduled workflow dispatch (weekly cleanup PR)
   - Doc merge apply mode

Billing API: [Using the Marketplace API](https://docs.github.com/en/apps/github-marketplace/using-the-github-marketplace-api-in-your-app)

---

## Timeline summary

```
Week 1   Publish Action (free) + create org
Week 2   Publisher verification + deploy App
Week 3   Submit free App listing
Week 4+  Drive installs → 100
Week 12+ Enable paid plans (if verified + 100 installs)
```

---

## Your next actions (today)

- [ ] Create GitHub repos (or confirm push succeeded)
- [ ] Publish Action v1.0.0 to Marketplace
- [ ] Create **PruneKit** GitHub organization
- [ ] Start domain verification for org
- [ ] Deploy app to staging URL
- [ ] Register GitHub App **PruneKit** pointing at staging webhooks

---

## Links

- [GitHub Marketplace](https://github.com/marketplace)
- [Marketplace Developer Agreement](https://docs.github.com/en/site-policy/github-terms/github-marketplace-developer-agreement)
- [Publisher verification](https://docs.github.com/en/apps/github-marketplace/github-marketplace-overview/applying-for-publisher-verification-for-your-organization)
- [PruneKit Action](../prunekit-cleanup-action/)
