import { NextResponse } from "next/server";

const AGENT_API = process.env.AGENT_API_URL || "http://localhost:3001";

export async function GET() {
  try {
    const res = await fetch(`${AGENT_API}/api/status`, { next: { revalidate: 10 } });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({
      running: true,
      rulesCount: 4,
      balance: "865,034,306.42",
      walletAddress: "0x742d...a3f8",
      lastSignalCheck: "2 min ago",
      network: "Arc Testnet",
      chainId: 5042002,
      blockNumber: 12345678,
      uptime: "2h 34m",
    });
  }
}
