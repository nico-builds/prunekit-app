import type { EmitterWebhookEvent } from "@octokit/webhooks";
import { loadConfig, getInstallationOctokit } from "../github/app.js";
import { postInstallationComment } from "../services/comments.js";
import { setOrgPlan } from "../services/plan-store.js";

export async function handleInstallationCreated(
  event: EmitterWebhookEvent<"installation">
): Promise<void> {
  const installation = event.payload.installation;
  const account = installation.account;

  if (!account || !("id" in account) || !("login" in account)) return;

  setOrgPlan(account.id, account.login, "free");
  console.log(`Installation created: ${account.login} (${installation.id})`);

  const config = loadConfig();
  const octokit = await getInstallationOctokit(installation.id);

  if (event.payload.repositories && event.payload.repositories.length > 0) {
    const first = event.payload.repositories[0];
    try {
      await postInstallationComment(
        octokit,
        first.full_name.split("/")[0],
        first.full_name.split("/")[1],
        config.actionRepo,
        config.supportEmail
      );
    } catch (err) {
      console.warn("Could not create setup issue:", err);
    }
  }
}

export async function handleInstallationDeleted(
  event: EmitterWebhookEvent<"installation">
): Promise<void> {
  const account = event.payload.installation.account;
  if (account && "login" in account) {
    console.log(`Installation deleted: ${account.login}`);
  }
}
