import type { Octokit } from "@octokit/rest";
import { getOrgPlan } from "./plan-store.js";
import { PLANS } from "./plans.js";

const MARKER = "<!-- prunekit-comment -->";

export function buildWelcomeComment(actionRepo: string, supportEmail: string): string {
  return `${MARKER}
## 🌿 PruneKit — repository cleanup

Thanks for installing **PruneKit**. We help you **prune dead code**, remove unused files, and **merge redundant documentation** using the Cursor SDK (Composer 2.5).

### Get started (dry run — safe, no file changes)

1. Add a [Cursor API key](https://cursor.com/dashboard/integrations) as repository secret \`CURSOR_API_KEY\`
2. Add this workflow as \`.github/workflows/prunekit-audit.yml\`:

\`\`\`yaml
name: PruneKit audit
on:
  pull_request:
  workflow_dispatch:
permissions:
  contents: read
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ${actionRepo}@v1
        with:
          cursor-api-key: \${{ secrets.CURSOR_API_KEY }}
          mode: dry-run
\`\`\`

3. Open a PR — review reports under \`.cleanup/\`

### Plans

| Plan | Highlights |
|------|------------|
| **Free** | Dry-run audits, PR guidance |
| **Pro** | Weekly cleanup PRs, doc merges |
| **Team** | Org rules, dashboard |

[Upgrade on GitHub Marketplace](https://github.com/marketplace) · Support: ${supportEmail}
`;
}

export function buildPrComment(
  actionRepo: string,
  planLabel: string,
  prNumber: number
): string {
  return `${MARKER}
## 🌿 PruneKit audit reminder (PR #${prNumber})

**Plan:** ${planLabel}

Run a cleanup audit on this branch:

\`\`\`yaml
- uses: ${actionRepo}@v1
  with:
    cursor-api-key: \${{ secrets.CURSOR_API_KEY }}
    mode: dry-run
\`\`\`

Reports appear in \`.cleanup/CLEANUP_PLAN.md\` and \`.cleanup/DOC_CORRELATION_MAP.md\`.

> Pro users: weekly scheduled cleanup PRs are enabled at the org level.
`;
}

export async function upsertPrComment(
  octokit: Octokit,
  owner: string,
  repo: string,
  issueNumber: number,
  body: string
): Promise<void> {
  const { data: comments } = await octokit.issues.listComments({
    owner,
    repo,
    issue_number: issueNumber,
    per_page: 100,
  });

  const existing = comments.find((c) => c.body?.includes(MARKER));

  if (existing) {
    await octokit.issues.updateComment({
      owner,
      repo,
      comment_id: existing.id,
      body,
    });
    return;
  }

  await octokit.issues.createComment({
    owner,
    repo,
    issue_number: issueNumber,
    body,
  });
}

export async function postPullRequestComment(
  octokit: Octokit,
  owner: string,
  repo: string,
  pullNumber: number,
  accountId: number,
  actionRepo: string
): Promise<void> {
  const orgPlan = getOrgPlan(accountId);
  const planLabel = PLANS[orgPlan?.plan ?? "free"].label;
  const body = buildPrComment(actionRepo, planLabel, pullNumber);
  await upsertPrComment(octokit, owner, repo, pullNumber, body);
}

export async function postInstallationComment(
  octokit: Octokit,
  owner: string,
  repo: string,
  actionRepo: string,
  supportEmail: string
): Promise<void> {
  const body = buildWelcomeComment(actionRepo, supportEmail);
  await octokit.issues.create({
    owner,
    repo,
    title: "PruneKit installed — setup repository cleanup",
    body,
  });
}
