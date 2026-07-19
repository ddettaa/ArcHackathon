import { NextResponse } from "next/server";

const AGENT_API = process.env.AGENT_API_URL || "http://localhost:3001";

export async function GET() {
  try {
    const res = await fetch(`${AGENT_API}/api/rules`, { next: { revalidate: 5 } });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json([
      { id: "1", name: "Auto Bug Bounty", description: "Pay when PR with 'fix' label is merged", signal: { source: "github", trigger: "pull_request.merged", conditions: { label: "fix" } }, action: { type: "pay", recipient: "0x1234...5678", amount: 50, currency: "USDC" }, enabled: false, cooldown: 3600 },
      { id: "2", name: "Flight Delay Refund", description: "Refund when flight delayed > 2 hours", signal: { source: "api", trigger: "flight.delayed", conditions: { delay_hours: 2 } }, action: { type: "refund", recipient: "0xabcd...ef12", amount: 100, currency: "USDC" }, enabled: false, cooldown: 86400 },
      { id: "3", name: "Content Tip Stream", description: "Tip writer when content hits 1000 reads", signal: { source: "api", trigger: "page.views", conditions: { threshold: 1000 } }, action: { type: "tip", recipient: "0x9876...5432", amount: 5, currency: "USDC" }, enabled: false, cooldown: 604800 },
    ]);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await fetch(`${AGENT_API}/api/rules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return NextResponse.json(await res.json());
  } catch (e) {
    return NextResponse.json({ error: "Agent API unavailable" }, { status: 503 });
  }
}
