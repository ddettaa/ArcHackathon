import { NextResponse } from "next/server";

const AGENT_API = process.env.AGENT_API_URL || "http://localhost:3001";

export async function GET() {
  try {
    const res = await fetch(`${AGENT_API}/api/payments`, { next: { revalidate: 5 } });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json([]);
  }
}
