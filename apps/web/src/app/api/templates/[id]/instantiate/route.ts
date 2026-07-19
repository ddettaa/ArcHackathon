import { NextResponse } from "next/server";
import { agentPost } from "../../../_lib";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const res = await agentPost(`/api/templates/${id}/instantiate`, body);
    if (!res.ok) return NextResponse.json({ error: "Agent unavailable" }, { status: 503 });
    return NextResponse.json(await res.json(), { status: 201 });
  } catch {
    return NextResponse.json({ error: "Cannot connect" }, { status: 503 });
  }
}