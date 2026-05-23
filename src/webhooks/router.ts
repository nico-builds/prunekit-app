import { Webhooks } from "@octokit/webhooks";
import { loadConfig } from "../github/app.js";
import { handleInstallationCreated, handleInstallationDeleted } from "./installation.js";
import {
  handleMarketplaceCancellation,
  handleMarketplacePurchase,
} from "./marketplace.js";
import { handlePullRequest } from "./pull_request.js";

export function createWebhookHandler(): Webhooks {
  const { webhookSecret } = loadConfig();
  const webhooks = new Webhooks({ secret: webhookSecret });

  webhooks.on("pull_request", handlePullRequest);
  webhooks.on("installation.created", handleInstallationCreated);
  webhooks.on("installation.deleted", handleInstallationDeleted);
  webhooks.on("marketplace_purchase.purchased", handleMarketplacePurchase);
  webhooks.on("marketplace_purchase.changed", handleMarketplacePurchase);
  webhooks.on("marketplace_purchase.cancelled", handleMarketplaceCancellation);

  return webhooks;
}
