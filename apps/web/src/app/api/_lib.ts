const AGENT_API = process.env.AGENT_API_URL || "http://localhost:3001";
const API_KEY = process.env.ARC_ADMIN_KEY || "";

export function agentFetch(path: string, options: RequestInit = {}, wallet?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };
  if (API_KEY) {
    headers["Authorization"] = `Bearer ${API_KEY}`;
  }
  if (wallet) {
    headers["X-Wallet-Address"] = wallet;
  }
  return fetch(`${AGENT_API}${path}`, { ...options, headers });
}

export function agentGet(path: string, wallet?: string) {
  return agentFetch(path, { next: { revalidate: 10 } }, wallet);
}

export function agentPost(path: string, body?: any, wallet?: string) {
  return agentFetch(path, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  }, wallet);
}
