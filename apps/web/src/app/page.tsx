"use client";

import { useState } from "react";

// Types
interface Rule {
  id: string;
  name: string;
  description?: string;
  signal: { source: string; trigger: string; conditions: Record<string, any> };
  action: { type: string; recipient: string; amount: number; currency: string; memo?: string };
  enabled: boolean;
  cooldown?: number;
}

interface AgentStatus {
  running: boolean;
  rulesCount: number;
  balance: string;
  walletAddress: string;
  lastSignalCheck: string;
}

export default function Dashboard() {
  const defaultRules: Rule[] = [
    { id: "bug-bounty-1", name: "Auto Bug Bounty", description: "Pay when PR with 'fix' label is merged", signal: { source: "github", trigger: "pull_request.merged", conditions: { label: "fix" } }, action: { type: "pay", recipient: "0x1234...5678", amount: 50, currency: "USDC" }, enabled: false, cooldown: 3600 },
    { id: "flight-delay-1", name: "Flight Delay Refund", description: "Refund when flight delayed > 2 hours", signal: { source: "api", trigger: "flight.delayed", conditions: { delay_hours: 2 } }, action: { type: "refund", recipient: "0xabcd...ef12", amount: 100, currency: "USDC" }, enabled: false, cooldown: 86400 },
    { id: "tip-stream-1", name: "Content Tip Stream", description: "Tip writer when content hits 1000 reads", signal: { source: "api", trigger: "page.views", conditions: { threshold: 1000 } }, action: { type: "tip", recipient: "0x9876...5432", amount: 5, currency: "USDC" }, enabled: false, cooldown: 604800 },
  ];

  const defaultStatus: AgentStatus = { running: true, rulesCount: 4, balance: "865,034,306.42", walletAddress: "0x742d...a3f8", lastSignalCheck: "2 min ago" };

  const [rules, setRules] = useState<Rule[]>(defaultRules);
  const [status] = useState<AgentStatus>(defaultStatus);
  const [activeTab, setActiveTab] = useState<"overview" | "rules" | "payments">("overview");
  const [showNewRule, setShowNewRule] = useState(false);

  const toggleRule = (id: string) => setRules(rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));

  const signalSourceColors: Record<string, { bg: string; text: string }> = {
    github: { bg: "#1b3158", text: "#f4f0e6" },
    api: { bg: "#ff4b31", text: "#f4f0e6" },
    oracle: { bg: "#9f72ff", text: "#f4f0e6" },
    onchain: { bg: "#5acda7", text: "#1b3158" },
    webhook: { bg: "#f2a43a", text: "#1b3158" },
  };

  const tabClass = (tab: string) => `px-4 py-2 rounded-t-lg text-sm font-medium transition-colors border-0 cursor-pointer ${
    activeTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-blue-800 hover:text-gray-900"
  }`;

  return (
    <div style={{ minHeight: "100vh", background: "#f4f0e6" }}>
      {/* HEADER */}
      <header style={{ background: "#0b1a33", color: "#f4f0e6", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "36px", height: "36px", background: "#1b3158", borderRadius: "8px", display: "grid", placeItems: "center", fontWeight: 900, fontSize: "14px" }}>AG</div>
          <div>
            <h1 style={{ fontWeight: 700, fontSize: "18px", margin: 0 }}>ArcGent</h1>
            <p style={{ fontSize: "12px", opacity: 0.6, margin: 0 }}>Signal-to-Payment Agent</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 12px", borderRadius: "9999px", fontSize: "12px", fontWeight: 500, background: "rgba(90,205,167,0.2)", color: "#5acda7" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#5acda7", animation: "pulse 2s infinite" }} />
            RUNNING
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "12px", opacity: 0.6, margin: 0 }}>Balance</p>
            <p style={{ fontWeight: 700, fontSize: "14px", margin: 0 }}>{status.balance} USDC</p>
          </div>
        </div>
      </header>

      {/* TABS */}
      <div style={{ padding: "16px 24px 0", display: "flex", gap: "4px" }}>
        {["overview", "rules", "payments"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab as any)} className={tabClass(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <main style={{ padding: "0 24px 24px" }}>
        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginTop: "16px" }}>
              <div style={{ background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <p style={{ fontSize: "12px", color: "#2f578c", margin: "0 0 4px" }}>Active Rules</p>
                <p style={{ fontSize: "30px", fontWeight: 800, color: "#0b1a33", margin: 0 }}>{status.rulesCount}</p>
              </div>
              <div style={{ background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <p style={{ fontSize: "12px", color: "#2f578c", margin: "0 0 4px" }}>Wallet Balance</p>
                <p style={{ fontSize: "30px", fontWeight: 800, color: "#5acda7", margin: 0 }}>{status.balance.split(".")[0]} USDC</p>
              </div>
              <div style={{ background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <p style={{ fontSize: "12px", color: "#2f578c", margin: "0 0 4px" }}>Last Signal Check</p>
                <p style={{ fontSize: "30px", fontWeight: 800, color: "#2f578c", margin: 0 }}>{status.lastSignalCheck}</p>
              </div>
              <div style={{ background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <p style={{ fontSize: "12px", color: "#2f578c", margin: "0 0 4px" }}>Network</p>
                <p style={{ fontSize: "18px", fontWeight: 700, color: "#1b3158", margin: 0 }}>Arc Testnet</p>
                <p style={{ fontSize: "12px", color: "#2f578c", margin: 0 }}>Chain ID: 5042002</p>
              </div>
            </div>

            {/* Flow Diagram */}
            <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", marginTop: "16px" }}>
              <h3 style={{ fontWeight: 700, fontSize: "14px", marginBottom: "16px" }}>Signal → Payment Flow</h3>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", textAlign: "center" }}>
                {[
                  { icon: "📡", title: "Listen", desc: "GitHub, APIs, oracles, onchain events", bg: "#d6f0e8" },
                  { icon: "🧠", title: "Decide", desc: "Rule engine evaluates conditions", bg: "rgba(172,198,233,0.3)" },
                  { icon: "💸", title: "Pay", desc: "USDC via Circle Agent Stack", bg: "rgba(90,205,167,0.15)" },
                  { icon: "✅", title: "Settle", desc: "Sub-second finality on Arc", bg: "#f4f0e6" },
                ].map((step, i) => (
                  <div key={i} style={{ flex: 1 }}>
                    <div style={{ padding: "16px", borderRadius: "8px", background: step.bg }}>
                      <div style={{ fontSize: "24px", marginBottom: "8px" }}>{step.icon}</div>
                      <p style={{ fontWeight: 700, fontSize: "14px", margin: 0 }}>{step.title}</p>
                      <p style={{ fontSize: "12px", color: "#2f578c", marginTop: "4px" }}>{step.desc}</p>
                    </div>
                    {i < 3 && <div style={{ fontSize: "24px", color: "#2f578c", margin: "0 8px" }}>→</div>}
                  </div>
                )).reduce((prev, curr, i) => i === 0 ? [curr] : [...prev, <span key={`arrow-${i}`} style={{ fontSize: "24px", color: "#2f578c" }}>→</span>, curr], [] as any)}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", marginTop: "16px" }}>
              <button onClick={() => setShowNewRule(true)} style={{ background: "#1b3158", color: "#f4f0e6", borderRadius: "12px", padding: "20px", textAlign: "left", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                <p style={{ fontWeight: 700, fontSize: "18px", margin: 0 }}>+ New Rule</p>
                <p style={{ fontSize: "12px", opacity: 0.7, marginTop: "4px" }}>Create a new signal-to-payment rule</p>
              </button>
              <button style={{ background: "#d6f0e8", color: "#1b3158", borderRadius: "12px", padding: "20px", textAlign: "left", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                <p style={{ fontWeight: 700, fontSize: "18px", margin: 0 }}>Fund Wallet</p>
                <p style={{ fontSize: "12px", opacity: 0.7, marginTop: "4px" }}>Add USDC to agent wallet via faucet</p>
              </button>
            </div>
          </div>
        )}

        {/* RULES TAB */}
        {activeTab === "rules" && (
          <div style={{ marginTop: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontWeight: 700, fontSize: "18px", margin: 0 }}>Rules ({rules.length})</h3>
              <button onClick={() => setShowNewRule(true)} style={{ background: "#1b3158", color: "#f4f0e6", padding: "8px 16px", borderRadius: "8px", fontSize: "14px", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>+ New Rule</button>
            </div>
            <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {rules.map(rule => {
                const sc = signalSourceColors[rule.signal.source] || { bg: "#ddd", text: "#333" };
                const acColor = rule.action.type === "pay" ? "#1b3158" : rule.action.type === "refund" ? "#ff4b31" : "#5acda7";
                return (
                  <div key={rule.id} style={{ background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                        <h4 style={{ fontWeight: 700, margin: 0 }}>{rule.name}</h4>
                        <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "9999px", fontWeight: 500, background: sc.bg, color: sc.text }}>{rule.signal.source}</span>
                        <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "9999px", fontWeight: 500, background: acColor, color: "#fff" }}>{rule.action.type}</span>
                      </div>
                      <p style={{ fontSize: "14px", color: "#2f578c", margin: "0 0 8px" }}>{rule.description}</p>
                      <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "#2f578c", flexWrap: "wrap" }}>
                        <span>Trigger: <code style={{ background: "#f3f4f6", padding: "1px 4px", borderRadius: "4px" }}>{rule.signal.trigger}</code></span>
                        <span>Amount: <strong>{rule.action.amount} {rule.action.currency}</strong></span>
                        <span>To: <code style={{ background: "#f3f4f6", padding: "1px 4px", borderRadius: "4px" }}>{rule.action.recipient.slice(0, 10)}...</code></span>
                        {rule.cooldown && <span>Cooldown: {rule.cooldown}s</span>}
                      </div>
                    </div>
                    <button onClick={() => toggleRule(rule.id)}
                      style={{ marginLeft: "16px", padding: "8px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: 500, border: "none", cursor: "pointer",
                        background: rule.enabled ? "rgba(90,205,167,0.2)" : "#f3f4f6",
                        color: rule.enabled ? "#5acda7" : "#9ca3af" }}>
                      {rule.enabled ? "ON" : "OFF"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === "payments" && (
          <div style={{ marginTop: "16px" }}>
            <h3 style={{ fontWeight: 700, fontSize: "18px", margin: "0 0 16px" }}>Payment History</h3>
            <div style={{ background: "#fff", borderRadius: "12px", padding: "48px", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <p style={{ fontSize: "36px", marginBottom: "12px" }}>💳</p>
              <p style={{ fontWeight: 700, color: "#2f578c", margin: 0 }}>No payments yet</p>
              <p style={{ fontSize: "14px", color: "#2f578c", marginTop: "4px" }}>Payments will appear here once rules trigger</p>
            </div>
          </div>
        )}
      </main>

      {/* NEW RULE MODAL */}
      {showNewRule && (
        <div onClick={() => setShowNewRule(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "16px", padding: "24px", width: "100%", maxWidth: "420px", margin: "0 16px", boxShadow: "0 25px 50px rgba(0,0,0,0.25)" }}>
            <h3 style={{ fontWeight: 700, fontSize: "18px", margin: "0 0 16px" }}>Create New Rule</h3>
            <form style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 500, color: "#2f578c" }}>Rule Name</label>
                <input type="text" placeholder="e.g., Auto Bug Bounty" style={{ width: "100%", marginTop: "4px", padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 500, color: "#2f578c" }}>Signal Source</label>
                <select style={{ width: "100%", marginTop: "4px", padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }}>
                  <option>GitHub</option><option>External API</option><option>Onchain Oracle</option><option>Webhook</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 500, color: "#2f578c" }}>Trigger Condition</label>
                <input type="text" placeholder="e.g., pull_request.merged" style={{ width: "100%", marginTop: "4px", padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 500, color: "#2f578c" }}>Amount (USDC)</label>
                  <input type="number" placeholder="50" style={{ width: "100%", marginTop: "4px", padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 500, color: "#2f578c" }}>Recipient</label>
                  <input type="text" placeholder="0x..." style={{ width: "100%", marginTop: "4px", padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }} />
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px", paddingTop: "8px" }}>
                <button type="button" onClick={() => setShowNewRule(false)} style={{ flex: 1, padding: "8px 16px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", background: "#fff", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: "8px 16px", background: "#1b3158", color: "#f4f0e6", borderRadius: "8px", fontSize: "14px", fontWeight: 500, border: "none", cursor: "pointer", fontFamily: "inherit" }}>Create Rule</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}} />
    </div>
  );
}
