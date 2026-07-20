import { NextResponse } from "next/server";
import { agentPost } from "../_lib";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const wallet = req.headers.get("x-wallet-address") || undefined;
    const res = await agentPost("/api/my-agent", body, wallet);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Agent unavailable" }));
      return NextResponse.json(err, { status: res.status });
    }
    return NextResponse.json(await res.json(), { status: 201 });
  } catch {
    return NextResponse.json({ error: "Cannot connect" }, { status: 503 });
  }
}
