import { readFileSync } from "node:fs";
import { App } from "@octokit/app";
import type { Octokit } from "@octokit/rest";

let appInstance: App | null = null;

export function loadConfig() {
  const appId = process.env.GITHUB_APP_ID;
  const privateKeyPath = process.env.GITHUB_APP_PRIVATE_KEY_PATH;
  const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;

  if (!appId || !privateKeyPath || !webhookSecret) {
    throw new Error(
      "Missing GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY_PATH, or GITHUB_WEBHOOK_SECRET"
    );
  }

  const privateKey = readFileSync(privateKeyPath, "utf8");
  return {
    appId: Number(appId),
    privateKey,
    webhookSecret,
    actionRepo: process.env.ACTION_REPO ?? "nico-builds/prunekit-cleanup-action",
    supportEmail: process.env.SUPPORT_EMAIL ?? "support@example.com",
    appBaseUrl: process.env.APP_BASE_URL ?? "http://localhost:3000",
  };
}

export function getGitHubApp(): App {
  if (!appInstance) {
    const { appId, privateKey } = loadConfig();
    appInstance = new App({ appId, privateKey });
  }
  return appInstance;
}

export async function getInstallationOctokit(installationId: number): Promise<Octokit> {
  const octokit = await getGitHubApp().getInstallationOctokit(installationId);
  return octokit as Octokit;
}
