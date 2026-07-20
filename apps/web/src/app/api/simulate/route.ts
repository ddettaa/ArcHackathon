import { NextRequest, NextResponse } from "next/server";
import { agentPost } from "../_lib";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await agentPost("/api/simulate", body);
  return NextResponse.json(await res.json(), { status: res.status });
}
