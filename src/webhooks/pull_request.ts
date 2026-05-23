import type { EmitterWebhookEvent } from "@octokit/webhooks";
import { loadConfig, getInstallationOctokit } from "../github/app.js";
import { postPullRequestComment } from "../services/comments.js";

export async function handlePullRequest(
  event: EmitterWebhookEvent<"pull_request">
): Promise<void> {
  const action = event.payload.action;
  if (!["opened", "reopened", "synchronize"].includes(action)) {
    return;
  }

  const pr = event.payload.pull_request;
  const repo = event.payload.repository;
  const installation =
    "installation" in event.payload ? event.payload.installation : undefined;

  if (!installation?.id || !repo) return;

  const config = loadConfig();
  const octokit = await getInstallationOctokit(installation.id);

  const owner = repo.owner.login;
  const accountId = repo.owner.id;

  await postPullRequestComment(
    octokit,
    owner,
    repo.name,
    pr.number,
    accountId,
    config.actionRepo
  );

  console.log(`PR comment upserted: ${owner}/${repo.name}#${pr.number}`);
}
