// ArcGent Approval Engine — 3-tier payment approval system
// AUTO: <$10 → execute immediately
// REVIEW: $10-$100 → notify Telegram, execute after 5min if no objection
// MANUAL: >$100 → require manual approval in dashboard

export type ApprovalTier = "AUTO" | "REVIEW" | "MANUAL";
export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED" | "EXECUTED" | "CANCELLED";

export interface ApprovalRequest {
  id: string;
  ruleId: string;
  amount: number;
  to: string;
  reason: string;
  tier: ApprovalTier;
  status: ApprovalStatus;
  createdAt: number;
  expiresAt: number;
  approvedBy?: string;
  executedAt?: number;
  txHash?: string;
}

const AUTO_LIMIT = 10;
const REVIEW_LIMIT = 100;
const REVIEW_TIMEOUT = 5 * 60 * 1000; // 5 minutes
const MANUAL_TIMEOUT = 60 * 60 * 1000; // 1 hour

class ApprovalEngine {
  private requests: Map<string, ApprovalRequest> = new Map();
  private reviewCallbacks: Map<string, (req: ApprovalRequest) => void> = new Map();
  private telegramBotToken: string;
  private telegramChatId: string;

  constructor() {
    this.telegramBotToken = process.env.TELEGRAM_BOT_TOKEN || "";
    this.telegramChatId = process.env.TELEGRAM_CHAT_ID || "";
    this.loadFromDb();
  }

  /** Load pending approvals from DB on startup */
  private async loadFromDb() {
    try {
      const { getDb, schema } = await import("../db/index.js");
      const { eq } = await import("drizzle-orm");
      const db = getDb();
      const rows = await db.select().from(schema.approvals).where(eq(schema.approvals.status, "pending")).all();
      for (const r of rows) {
        this.requests.set(r.id, {
          id: r.id,
          ruleId: r.ruleId || "",
          amount: 0, // amount stored in payment, not approval
          to: "",
          reason: r.reason || "",
          tier: r.tier as ApprovalTier,
          status: r.status as ApprovalStatus,
          createdAt: r.createdAt ? new Date(r.createdAt).getTime() : Date.now(),
          expiresAt: r.expiresAt ? new Date(r.expiresAt).getTime() : Date.now() + MANUAL_TIMEOUT,
        });
      }
      if (rows.length) console.log(`[Approval] Loaded ${rows.length} pending from DB`);
    } catch { /* table may not exist yet */ }
  }

  /** Persist approval to DB */
  private async saveToDb(req: ApprovalRequest) {
    try {
      const { getDb, schema } = await import("../db/index.js");
      const db = getDb();
      await db.insert(schema.approvals).values({
        id: req.id,
        ruleId: req.ruleId || null,
        paymentId: null,
        tier: req.tier,
        status: req.status.toLowerCase(),
        reason: req.reason,
        expiresAt: req.expiresAt ? new Date(req.expiresAt) : undefined,
        createdAt: req.createdAt ? new Date(req.createdAt) : undefined,
      }).onConflictDoUpdate({
        target: schema.approvals.id,
        set: { status: req.status.toLowerCase(), reviewedAt: req.status !== "PENDING" ? new Date() : undefined },
      }).run();
    } catch (e) { console.error("[Approval] DB save failed:", e); }
  }

  determineTier(amount: number): ApprovalTier {
    if (amount < AUTO_LIMIT) return "AUTO";
    if (amount < REVIEW_LIMIT) return "REVIEW";
    return "MANUAL";
  }

  createRequest(
    ruleId: string,
    amount: number,
    to: string,
    reason: string,
    onExecute: (req: ApprovalRequest) => Promise<{ txHash?: string; error?: string }>
  ): ApprovalRequest {
    const tier = this.determineTier(amount);
    const id = `${ruleId}-${Date.now()}`;
    const now = Date.now();

    const request: ApprovalRequest = {
      id,
      ruleId,
      amount,
      to,
      reason,
      tier,
      status: "PENDING",
      createdAt: now,
      expiresAt: now + (tier === "REVIEW" ? REVIEW_TIMEOUT : MANUAL_TIMEOUT),
    };

    this.requests.set(id, request);
    this.saveToDb(request);

    if (tier === "AUTO") {
      this.executeRequest(request, onExecute);
    } else if (tier === "REVIEW") {
      this.notifyTelegram(request);
      // Schedule auto-execution after timeout
      setTimeout(() => {
        const req = this.requests.get(id);
        if (req && req.status === "PENDING") {
          this.executeRequest(req, onExecute);
        }
      }, REVIEW_TIMEOUT);
    } else {
      // MANUAL — wait for explicit approval
      this.notifyTelegram(request);
    }

    return request;
  }

  async approve(id: string, approvedBy: string = "dashboard"): Promise<ApprovalRequest | null> {
    const request = this.requests.get(id);
    if (!request || request.status !== "PENDING") return null;

    request.status = "APPROVED";
    request.approvedBy = approvedBy;
    this.saveToDb(request);
    return request;
  }

  reject(id: string): ApprovalRequest | null {
    const request = this.requests.get(id);
    if (!request || request.status !== "PENDING") return null;

    request.status = "REJECTED";
    this.saveToDb(request);
    return request;
  }

  getPending(): ApprovalRequest[] {
    return [...this.requests.values()].filter(r => r.status === "PENDING");
  }

  getById(id: string): ApprovalRequest | undefined {
    return this.requests.get(id);
  }

  getAll(): ApprovalRequest[] {
    return [...this.requests.values()].sort((a, b) => b.createdAt - a.createdAt);
  }

  private async executeRequest(
    request: ApprovalRequest,
    onExecute: (req: ApprovalRequest) => Promise<{ txHash?: string; error?: string }>
  ) {
    try {
      const result = await onExecute(request);
      if (result.error) {
        request.status = "CANCELLED";
      } else {
        request.status = "EXECUTED";
        request.executedAt = Date.now();
        request.txHash = result.txHash;
      }
    } catch (e) {
      request.status = "CANCELLED";
    }
  }

  private async notifyTelegram(request: ApprovalRequest) {
    if (!this.telegramBotToken || !this.telegramChatId) return;

    const emoji = request.tier === "REVIEW" ? "⏳" : "🔐";
    const text = `${emoji} *${request.tier} APPROVAL REQUIRED*\n\n` +
      `💰 Amount: *${request.amount} USDC*\n` +
      `📍 To: \`${request.to}\`\n` +
      `📋 Rule: \`${request.ruleId}\`\n` +
      `📝 Reason: ${request.reason}\n\n` +
      `🆔 ID: \`${request.id}\`\n` +
      (request.tier === "REVIEW"
        ? `⏰ Auto-executes in 5 minutes unless rejected`
        : `🔴 Manual approval required in dashboard`);

    try {
      await fetch(`https://api.telegram.org/bot${this.telegramBotToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: this.telegramChatId,
          text,
          parse_mode: "Markdown",
        }),
      });
    } catch (e) {
      console.error("[Approval] Telegram notification failed:", e);
    }
  }
}

// Singleton
let approvalEngine: ApprovalEngine | null = null;
export function getApprovalEngine(): ApprovalEngine {
  if (!approvalEngine) approvalEngine = new ApprovalEngine();
  return approvalEngine;
}
