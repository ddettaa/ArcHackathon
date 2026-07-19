"use client";

import { useState, useEffect, useCallback } from "react";
import { Bot, Radio, Brain, Zap, CheckCircle, CreditCard, Plus, RefreshCw, ExternalLink } from "lucide-react";

const C = {
  sand: "#f4f0e6", ink: "#0b1a33", ocean: "#1b3158", steel: "#2f578c",
  surf: "#acc6e9", coral: "#ff4b31", mint: "#5acda7", gold: "#f2a43a",
  purple: "#9f72ff", foam: "#d6f0e8",
};

interface AgentStatus {
  status: string;
  wallet: string;
  balance: string;
  blockNumber: string;
  signalChecks: number;
  paymentsExecuted: number;
  chain: string;
  uptime: string;
}

interface Rule {
  id: string;
  name: string;
  signal: { source: string; endpoint: string; pollIntervalMs: number };
  condition: string;
  action: { type: string; amountUSDC: number; to: string; memo: string };
  active: boolean;
}

interface Payment {
  id: string;
  ruleId: string;
  to: string;
  amount: number;
  status: string;
  timestamp: string;
  txHash?: string;
}

export default function Dashboard() {
  const [status, setStatus] = useState<AgentStatus | null>(null);
  const [rules, setRules] = useState<Rule[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [newRule, setNewRule] = useState({ name: "", source: "github", trigger: "", amount: "", recipient: "" });

  const fetchData = useCallback(async () => {
    try {
      const [sRes, rRes, pRes] = await Promise.all([
        fetch("/api/status").then(r => r.json()).catch(() => null),
        fetch("/api/rules").then(r => r.json()).catch(() => []),
        fetch("/api/payments").then(r => r.json()).catch(() => []),
      ]);
      if (sRes) setStatus(sRes);
      if (rRes) setRules(rRes);
      if (pRes) setPayments(pRes);
      setLastUpdate(new Date());
    } catch (e) {
      console.error("Failed to fetch:", e);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const toggleRule = async (id: string, active: boolean) => {
    await fetch(`/api/rules/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    setRules(prev => prev.map(r => r.id === id ? { ...r, active: !active } : r));
  };

  const addRule = async () => {
    if (!newRule.name || !newRule.trigger || !newRule.amount || !newRule.recipient) return;
    const rule: Rule = {
      id: `rule_${Date.now()}`,
      name: newRule.name,
      signal: { source: newRule.source, endpoint: "", pollIntervalMs: 30000 },
      condition: newRule.trigger,
      action: { type: "send_usdc", amountUSDC: parseFloat(newRule.amount), to: newRule.recipient, memo: newRule.name },
      active: true,
    };
    await fetch("/api/rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rule),
    });
    setRules(prev => [...prev, rule]);
    setShowModal(false);
    setNewRule({ name: "", source: "github", trigger: "", amount: "", recipient: "" });
  };

  const sourceBadge: Record<string, { bg: string; text: string }> = {
    github: { bg: C.ocean, text: "white" },
    api: { bg: C.coral, text: "white" },
    webhook: { bg: C.mint, text: C.ink },
    oracle: { bg: C.purple, text: "white" },
  };

  const statCard = (label: string, value: string | number, sub: string, color: string) => (
    <div style={{ background: "white", borderRadius: 12, border: `1px solid rgba(11,26,51,0.08)`, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <div style={{ fontSize: 11, color: C.steel, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 11, color: C.steel, marginTop: 4 }}>{sub}</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.sand, fontFamily: "'DM Sans', sans-serif", color: C.ink }}>
      {/* HEADER */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 3%", background: "rgba(11,26,51,0.95)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "grid", placeItems: "center", width: 36, height: 36, background: C.ocean, borderRadius: 8 }}>
            <Bot size={18} color="white" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 900, color: "white", letterSpacing: "-0.03em" }}>ArcGent</span>
          <span style={{
            padding: "3px 10px", borderRadius: 999, fontSize: 10, fontWeight: 700,
            background: status?.status === "RUNNING" ? C.mint : C.gold,
            color: C.ink, display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: status?.status === "RUNNING" ? C.ink : C.coral, animation: status?.status === "RUNNING" ? "pulse 2s infinite" : "none" }} />
            {status?.status || "CONNECTING"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "white" }}>{status?.balance || "—"} USDC</div>
            <div style={{ fontSize: 10, color: C.surf, fontFamily: "monospace" }}>{status?.wallet?.slice(0, 6)}...{status?.wallet?.slice(-4)}</div>
          </div>
          <button onClick={fetchData} style={{ padding: 8, background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center" }}>
            <RefreshCw size={14} color="white" />
          </button>
        </div>
      </header>

      <div style={{ padding: "24px 3%", maxWidth: 1200, margin: "0 auto" }}>
        {/* STATS ROW */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
          {statCard("Active Rules", rules.filter(r => r.active).length, `${rules.length} total`, C.ocean)}
          {statCard("USDC Balance", status?.balance || "—", "Arc Testnet", C.mint)}
          {statCard("Signal Checks", status?.signalChecks || 0, `Block #${status?.blockNumber || "—"}`, C.gold)}
          {statCard("Network", "Arc Testnet", `Chain ${status?.chain || "5042002"}`, C.purple)}
        </div>

        {/* FLOW DIAGRAM */}
        <div style={{ background: "white", borderRadius: 12, border: `1px solid rgba(11,26,51,0.08)`, padding: 24, marginBottom: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16, color: C.steel }}>Signal → Payment Flow</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            {[
              { icon: Radio, label: "Listen", desc: "GitHub, API, Webhook", color: C.ocean },
              { icon: Brain, label: "Decide", desc: "Rule engine evaluates", color: C.coral },
              { icon: Zap, label: "Pay", desc: "USDC via Circle Stack", color: C.mint },
              { icon: CheckCircle, label: "Settle", desc: "Onchain confirmed", color: C.purple },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {i > 0 && <span style={{ color: C.surf, fontSize: 18 }}>→</span>}
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: i === 0 ? C.ocean : i === 1 ? C.coral : i === 2 ? C.mint : C.purple, borderRadius: 10, color: i === 2 ? C.ink : "white" }}>
                  <s.icon size={16} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800 }}>{s.label}</div>
                    <div style={{ fontSize: 9, opacity: 0.8 }}>{s.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RULES SECTION */}
        <div style={{ background: "white", borderRadius: 12, border: `1px solid rgba(11,26,51,0.08)`, padding: 24, marginBottom: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: C.steel }}>Rules</div>
            <button onClick={() => setShowModal(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: C.ocean, color: "white", border: "none", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
              <Plus size={14} /> New Rule
            </button>
          </div>
          {rules.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: C.steel, fontSize: 13 }}>No rules configured. Create one to get started.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {rules.map((r) => (
                <div key={r.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "rgba(11,26,51,0.02)", borderRadius: 8, border: `1px solid rgba(11,26,51,0.06)` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ padding: "4px 10px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: sourceBadge[r.signal.source]?.bg || C.steel, color: sourceBadge[r.signal.source]?.text || "white", textTransform: "uppercase" }}>
                      {r.signal.source}
                    </span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{r.name}</div>
                      <div style={{ fontSize: 11, color: C.steel }}>{r.condition}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: C.ocean }}>{r.action.amountUSDC} USDC</span>
                    <button onClick={() => toggleRule(r.id, r.active)} style={{
                      padding: "6px 12px", border: "none", borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: "pointer",
                      background: r.active ? C.mint : "rgba(11,26,51,0.1)", color: r.active ? C.ink : C.steel,
                    }}>
                      {r.active ? "ON" : "OFF"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PAYMENTS SECTION */}
        <div style={{ background: "white", borderRadius: 12, border: `1px solid rgba(11,26,51,0.08)`, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16, color: C.steel }}>Payment History</div>
          {payments.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: C.steel, fontSize: 13 }}>No payments yet. Trigger a rule to see transactions here.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {payments.map((p) => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "rgba(11,26,51,0.02)", borderRadius: 8, border: `1px solid rgba(11,26,51,0.06)` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <CreditCard size={16} color={C.steel} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{p.amount} USDC → {p.to.slice(0, 6)}...{p.to.slice(-4)}</div>
                      <div style={{ fontSize: 10, color: C.steel }}>{new Date(p.timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ padding: "4px 10px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: p.status === "confirmed" ? C.mint : p.status === "pending" ? C.gold : C.coral, color: C.ink }}>
                      {p.status}
                    </span>
                    {p.txHash && (
                      <a href={`https://testnet.arcscan.app/tx/${p.txHash}`} target="_blank" rel="noopener" style={{ color: C.ocean }}>
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: 16, fontSize: 10, color: C.steel, textAlign: "right" }}>
          Last updated: {lastUpdate.toLocaleTimeString()} · Auto-refresh every 30s
        </div>
      </div>

      {/* NEW RULE MODAL */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(11,26,51,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => setShowModal(false)}>
          <div style={{ background: "white", borderRadius: 16, padding: 24, width: 400, maxWidth: "90vw" }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 900 }}>New Rule</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input placeholder="Rule name (e.g., Bug Bounty #42)" value={newRule.name} onChange={e => setNewRule({...newRule, name: e.target.value})} style={{ padding: 10, border: `1px solid rgba(11,26,51,0.15)`, borderRadius: 8, fontSize: 13 }} />
              <select value={newRule.source} onChange={e => setNewRule({...newRule, source: e.target.value})} style={{ padding: 10, border: `1px solid rgba(11,26,51,0.15)`, borderRadius: 8, fontSize: 13 }}>
                <option value="github">GitHub</option>
                <option value="api">API</option>
                <option value="webhook">Webhook</option>
                <option value="oracle">Oracle</option>
              </select>
              <input placeholder="Trigger condition (e.g., PR merged with label bugfix)" value={newRule.trigger} onChange={e => setNewRule({...newRule, trigger: e.target.value})} style={{ padding: 10, border: `1px solid rgba(11,26,51,0.15)`, borderRadius: 8, fontSize: 13 }} />
              <input placeholder="Amount (USDC)" type="number" value={newRule.amount} onChange={e => setNewRule({...newRule, amount: e.target.value})} style={{ padding: 10, border: `1px solid rgba(11,26,51,0.15)`, borderRadius: 8, fontSize: 13 }} />
              <input placeholder="Recipient wallet address" value={newRule.recipient} onChange={e => setNewRule({...newRule, recipient: e.target.value})} style={{ padding: 10, border: `1px solid rgba(11,26,51,0.15)`, borderRadius: 8, fontSize: 13 }} />
              <button onClick={addRule} style={{ padding: 12, background: C.ocean, color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", marginTop: 8 }}>
                Create Rule
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
      `}}/>
    </div>
  );
}
