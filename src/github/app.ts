import { readFileSync, existsSync } from "node:fs";
import { App } from "@octokit/app";
import type { Octokit } from "@octokit/rest";

let appInstance: App | null = null;

function loadPrivateKey(): string {
  const inline = process.env.GITHUB_APP_PRIVATE_KEY?.trim();
  if (inline) {
    return inline.replace(/\\n/g, "\n");
  }
  const privateKeyPath = process.env.GITHUB_APP_PRIVATE_KEY_PATH;
  if (privateKeyPath && existsSync(privateKeyPath)) {
    return readFileSync(privateKeyPath, "utf8");
  }
  throw new Error(
    "Set GITHUB_APP_PRIVATE_KEY or GITHUB_APP_PRIVATE_KEY_PATH to a readable PEM file"
  );
}

export function loadConfig() {
  const appId = process.env.GITHUB_APP_ID;
  const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;

  if (!appId || !webhookSecret) {
    throw new Error("Missing GITHUB_APP_ID or GITHUB_WEBHOOK_SECRET");
  }

  const privateKey = loadPrivateKey();
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
