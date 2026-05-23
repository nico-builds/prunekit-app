import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { OrgPlan, PlanTier } from "./plans.js";

const DATA_FILE = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../data/org-plans.json"
);

interface Store {
  orgs: Record<string, OrgPlan>;
}

function load(): Store {
  if (!existsSync(DATA_FILE)) {
    return { orgs: {} };
  }
  return JSON.parse(readFileSync(DATA_FILE, "utf8")) as Store;
}

function save(store: Store): void {
  mkdirSync(dirname(DATA_FILE), { recursive: true });
  writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
}

export function getOrgPlan(accountId: number): OrgPlan | undefined {
  return load().orgs[String(accountId)];
}

export function setOrgPlan(
  accountId: number,
  login: string,
  plan: PlanTier,
  marketplacePurchaseId?: number
): OrgPlan {
  const store = load();
  const record: OrgPlan = {
    githubAccountId: accountId,
    login,
    plan,
    marketplacePurchaseId,
    updatedAt: new Date().toISOString(),
  };
  store.orgs[String(accountId)] = record;
  save(store);
  return record;
}

export function listOrgPlans(): OrgPlan[] {
  return Object.values(load().orgs);
}
