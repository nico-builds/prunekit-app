import express, { type Request, type Response } from "express";
import { loadConfig } from "./github/app.js";
import { listOrgPlans } from "./services/plan-store.js";
import { createWebhookHandler } from "./webhooks/router.js";
import { Webhooks } from "@octokit/webhooks";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.get("/health", (_req, res) => {
  res.json({ ok: true, product: "PruneKit", version: "0.1.0" });
});

app.get("/setup", (_req, res) => {
  res.redirect("https://github.com/apps/prunekit/installations/new");
});

app.get("/setup/complete", (_req, res) => {
  res.send(`<!DOCTYPE html>
<html><body style="font-family:system-ui;max-width:640px;margin:40px auto;padding:0 16px">
  <h1>PruneKit installed</h1>
  <p>Add <code>CURSOR_API_KEY</code> to your repository secrets, then add the PruneKit workflow.</p>
  <p><a href="https://github.com/nico-builds/prunekit-cleanup-action">Workflow documentation</a></p>
</body></html>`);
});

app.get("/admin/stats", (req, res) => {
  const token = process.env.ADMIN_TOKEN;
  if (token && req.headers.authorization !== `Bearer ${token}`) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const installs = listOrgPlans();
  res.json({
    installCount: installs.length,
    targetForPaidPlans: 100,
    installs,
  });
});

function mountWebhooks(webhooks: Webhooks): void {
  app.post(
    "/webhooks/github",
    express.raw({ type: "application/json" }),
    async (req: Request, res: Response) => {
      const signature = req.headers["x-hub-signature-256"];
      const delivery = req.headers["x-github-event"];
      const id = req.headers["x-github-delivery"];

      if (
        typeof signature !== "string" ||
        typeof delivery !== "string" ||
        typeof id !== "string"
      ) {
        res.status(400).send("Missing webhook headers");
        return;
      }

      try {
        await webhooks.verifyAndReceive({
          id,
          name: delivery as Parameters<typeof webhooks.verifyAndReceive>[0]["name"],
          signature,
          payload: (req.body as Buffer).toString("utf8"),
        });
        res.status(200).send("OK");
      } catch (err) {
        console.error("Webhook error:", err);
        res.status(401).send("Webhook verification failed");
      }
    }
  );
}

try {
  loadConfig();
  const webhooks = createWebhookHandler();
  mountWebhooks(webhooks);
  console.log("GitHub webhooks enabled");
} catch (err) {
  console.warn("Webhooks disabled:", (err as Error).message);
  app.post("/webhooks/github", (_req, res) => {
    res.status(503).json({ error: "Configure GITHUB_APP_ID, key path, and webhook secret" });
  });
}

app.listen(port, () => {
  console.log(`PruneKit listening on http://localhost:${port}`);
});
