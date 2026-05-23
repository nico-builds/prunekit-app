# GitHub Marketplace — PruneKit free listing (submit after App is registered)

Use at: https://github.com/marketplace/new → select **PruneKit** GitHub App.

---

## Listing fields

| Field | Value |
|-------|-------|
| **Name** | PruneKit |
| **Category** | Code quality |
| **Introduction** | Prune dead code, merge redundant docs, and audit repo hygiene on GitHub. Powered by Cursor Composer. Free dry-run audits via Action + App PR guidance. |
| **Support URL** | https://github.com/nico-builds/prunekit-app/issues |
| **Privacy policy** | https://github.com/nico-builds/prunekit-app/blob/main/docs/PRIVACY_POLICY.md |
| **Homepage** | https://github.com/nico-builds/prunekit-app |

## Free plan

| | |
|--|--|
| **Name** | Free |
| **Price** | $0 |
| **Features** | Dry-run cleanup audits, PR setup comments, `.cleanup/` reports via Action |

## Detailed description (paste into listing)

PruneKit helps teams keep repositories lean on GitHub.

**What you get (Free)**
- Install the PruneKit GitHub App for PR guidance and onboarding
- Run `nico-builds/prunekit-cleanup-action` in CI for AI-powered audits
- Detect dead code, unused files, and overlapping documentation
- Structured reports under `.cleanup/` in your repo

**Requirements**
- [Cursor API key](https://cursor.com/dashboard/integrations) as repository secret `CURSOR_API_KEY`
- Cursor SDK usage billed to your Cursor account

**How it works**
1. Install PruneKit on your org or repo
2. Add the PruneKit workflow (see App install comment)
3. Review dry-run reports on pull requests
4. Optionally run apply mode on a branch with human review

Built by [nico.builds](https://github.com/nico-builds) using the Cursor SDK (Composer 2.5).

## Submit

1. Complete App registration + Fly deploy (webhooks must respond)
2. Create draft at https://github.com/marketplace/new
3. Add **Free** plan only initially
4. Submit for review

Paid Pro/Team plans: enable after [verified publisher](https://github.com/organizations/nico-builds/settings/developer_settings) + 100 installs.
