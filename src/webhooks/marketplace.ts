import type { EmitterWebhookEvent } from "@octokit/webhooks";
import { planFromMarketplacePlanName } from "../services/plans.js";
import { setOrgPlan } from "../services/plan-store.js";

export async function handleMarketplacePurchase(
  event: EmitterWebhookEvent<"marketplace_purchase">
): Promise<void> {
  const purchase = event.payload.marketplace_purchase;
  const account = purchase.account;
  if (!account?.id || !account.login) {
    console.warn("marketplace_purchase missing account");
    return;
  }

  const plan = planFromMarketplacePlanName(purchase.plan?.name);
  const purchaseId =
    "id" in purchase && typeof purchase.id === "number" ? purchase.id : undefined;
  setOrgPlan(account.id, account.login, plan, purchaseId);

  console.log(
    `Marketplace purchase: ${account.login} (${account.id}) → ${plan}` +
      (purchaseId ? ` (purchase ${purchaseId})` : "")
  );
}

export async function handleMarketplaceCancellation(
  event: EmitterWebhookEvent<"marketplace_purchase">
): Promise<void> {
  const purchase = event.payload.marketplace_purchase;
  const account = purchase.account;
  if (!account?.id || !account.login) return;

  setOrgPlan(account.id, account.login, "free");
  console.log(`Marketplace cancelled: ${account.login} → free`);
}
