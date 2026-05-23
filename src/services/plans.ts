export type PlanTier = "free" | "pro" | "team";

export interface OrgPlan {
  githubAccountId: number;
  login: string;
  plan: PlanTier;
  marketplacePurchaseId?: number;
  updatedAt: string;
}

export const PLANS: Record<
  PlanTier,
  { label: string; monthlyUsd: number; annualUsd: number; features: string[] }
> = {
  free: {
    label: "Free",
    monthlyUsd: 0,
    annualUsd: 0,
    features: ["Dry-run Action", "PR setup comments", ".cleanup/ reports"],
  },
  pro: {
    label: "Pro",
    monthlyUsd: 19,
    annualUsd: 190,
    features: ["Weekly cleanup PRs", "Doc merge automation", "Priority support"],
  },
  team: {
    label: "Team",
    monthlyUsd: 49,
    annualUsd: 490,
    features: ["Custom exclude rules", "Org dashboard (roadmap)", "Usage credit TBD"],
  },
};

export function planFromMarketplacePlanName(name: string | undefined): PlanTier {
  const normalized = (name ?? "free").toLowerCase();
  if (normalized.includes("team")) return "team";
  if (normalized.includes("pro")) return "pro";
  return "free";
}
