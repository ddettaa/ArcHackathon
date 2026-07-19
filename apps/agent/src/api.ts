import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { createPublicClient, http } from "viem";
import { arc } from "./config.js";

const app = new Hono();

// CORS for Next.js frontend
app.use("*", cors({ origin: ["http://129.212.238.245:3000", "http://localhost:3000"] }));

// Arc network client
const publicClient = createPublicClient({
  chain: arc,
  transport: http(),
});

// Mock agent state
let agentState = {
  running: true,
  rulesCount: 4,
  balance: "865,034,306.42",
  walletAddress: "0x742d35Cd6634C0532925a3b8D4C9db96C4b4d8b6",
  lastSignalCheck: "2 min ago",
  network: "Arc Testnet",
  chainId: 5042002,
  blockNumber: 0,
  uptime: "0h 0m",
  startTime: Date.now(),
};

// Load rules from config
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rulesPath = path.join(__dirname, "../config/rules.json");

let rules: any[] = [];
try {
  const raw = fs.readFileSync(rulesPath, "utf-8");
  const parsed = JSON.parse(raw);
  rules = Array.isArray(parsed) ? parsed : parsed.rules || [];
} catch (e) {
  rules = [
    { id: "1", name: "Auto Bug Bounty", description: "Pay when PR with 'fix' label is merged", signal: { source: "github", trigger: "pull_request.merged", conditions: { label: "fix" } }, action: { type: "pay", recipient: "0x1234...5678", amount: 50, currency: "USDC" }, enabled: false, cooldown: 3600 },
    { id: "2", name: "Flight Delay Refund", description: "Refund when flight delayed > 2 hours", signal: { source: "api", trigger: "flight.delayed", conditions: { delay_hours: 2 } }, action: { type: "refund", recipient: "0xabcd...ef12", amount: 100, currency: "USDC" }, enabled: false, cooldown: 86400 },
    { id: "3", name: "Content Tip Stream", description: "Tip writer when content hits 1000 reads", signal: { source: "api", trigger: "page.views", conditions: { threshold: 1000 } }, action: { type: "tip", recipient: "0x9876...5432", amount: 5, currency: "USDC" }, enabled: false, cooldown: 604800 },
  ];
}

// Payments log (mock)
let payments: any[] = [];

// Health check
app.get("/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }));

// Agent status
app.get("/api/status", async (c) => {
  try {
    const blockNumber = await publicClient.getBlockNumber();
    agentState.blockNumber = Number(blockNumber);
    agentState.uptime = formatUptime(Date.now() - agentState.startTime);
  } catch (e) {
    // fallback if RPC unreachable
  }
  return c.json(agentState);
});

// Get rules
app.get("/api/rules", (c) => c.json(rules));

// Create rule
app.post("/api/rules", async (c) => {
  try {
    const body = await c.req.json();
    const newRule = { ...body, id: String(rules.length + 1), enabled: false };
    rules.push(newRule);
    agentState.rulesCount = rules.length;
    // Persist to file
    fs.writeFileSync(rulesPath, JSON.stringify(rules, null, 2));
    return c.json(newRule, 201);
  } catch (e) {
    return c.json({ error: "Invalid rule" }, 400);
  }
});

// Toggle rule
app.patch("/api/rules/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const rule = rules.find(r => r.id === id);
  if (!rule) return c.json({ error: "Not found" }, 404);
  Object.assign(rule, body);
  fs.writeFileSync(rulesPath, JSON.stringify(rules, null, 2));
  return c.json(rule);
});

// Get payments
app.get("/api/payments", (c) => c.json(payments));

// Execute payment (mock for now)
app.post("/api/payments/execute", async (c) => {
  const body = await c.req.json();
  const payment = {
    id: String(payments.length + 1),
    txHash: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
    rule: body.ruleName || "Manual",
    recipient: body.recipient,
    amount: body.amount,
    status: "confirmed",
    timestamp: new Date().toISOString(),
  };
  payments.push(payment);
  return c.json(payment, 201);
});

// Signal feed (SSE)
app.get("/api/signals/stream", (c) => {
  return c.newResponse(new ReadableStream({
    start(controller) {
      const interval = setInterval(() => {
        const signal = {
          type: "signal",
          source: ["github", "api", "oracle"][Math.floor(Math.random() * 3)],
          timestamp: new Date().toISOString(),
          data: { message: "Signal detected" },
        };
        controller.enqueue(`data: ${JSON.stringify(signal)}\n\n`);
      }, 5000);
      setTimeout(() => { clearInterval(interval); controller.close(); }, 300000);
    },
  }), {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
  });
});

function formatUptime(ms: number): string {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}h ${m}m`;
}

const port = parseInt(process.env.AGENT_PORT || "3001");
console.log(`🤖 ArcGent API running on port ${port}`);

serve({ fetch: app.fetch, port });
