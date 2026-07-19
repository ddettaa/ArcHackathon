"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Bot, Radio, Brain, Zap, CheckCircle, CreditCard, 
  Plus, RefreshCw, ExternalLink, Globe, 
} from "lucide-react";

const C = {
  sand: "#f4f0e6", ink: "#0b1a33", ocean: "#1b3158", steel: "#2f578c",
  surf: "#acc6e9", coral: "#ff4b31", mint: "#5acda7", gold: "#f2a43a",
  purple: "#9f72ff", foam: "#d6f0e8",
};

// --- TYPES matching agent output ---
interface AgentStatus {
  status: string;
  balance: string;
  signalChecks: number;
  paymentsExecuted: number;
  chain: string;
  uptime: string;
}

interface AgentRule {
  id: string;
  name: string;
  signal: { source: string; trigger: string; conditions: Record<string,any> };
  action: { type: string; recipient: string; amount: number; currency?: string; memo?: string };
  enabled: boolean;
  cooldown?: number;
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
  const [rules, setRules] = useState<AgentRule[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(0);
  const [newRule, setNewRule] = useState({ name: "", source: "github", trigger: "", amount: "", recipient: "" });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [sRes, rRes, pRes] = await Promise.all([
        fetch("/api/status").then(r => r.ok ? r.json() : null),
        fetch("/api/rules").then(r => r.ok ? r.json() : []),
        fetch("/api/payments").then(r => r.ok ? r.json() : []),
      ]);
      if (sRes) setStatus(sRes);
      setRules(rRes || []);
      setPayments(pRes || []);
      setLastUpdate(Date.now());
      setLoading(false);
    } catch (e) {
      console.error("Failed to fetch:", e);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const toggleRule = async (id: string, currentEnabled: boolean) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !currentEnabled } : r));
    try {
      await fetch(`/api/rules/${id}/toggle`, { method: "POST" });
    } catch {
      setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: currentEnabled } : r));
    }
  };

  const addRule = async () => {
    if (!newRule.name || !newRule.trigger || !newRule.amount || !newRule.recipient) return;
    const rule: AgentRule = {
      id: `rule_${Date.now()}`,
      name: newRule.name,
      signal: { source: newRule.source as any, trigger: newRule.trigger, conditions: {} },
      action: { type: "pay", recipient: newRule.recipient, amount: parseFloat(newRule.amount), currency: "USDC", memo: newRule.name },
      enabled: true,
      cooldown: 3600,
    };
    try {
      const res = await fetch("/api/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rule),
      });
      if (res.ok) {
        const saved = await res.json();
        setRules(prev => [...prev, saved]);
        setShowModal(false);
        setNewRule({ name: "", source: "github", trigger: "", amount: "", recipient: "" });
      }
    } catch (e) {
      console.error("Failed to add rule:", e);
    }
  };

  const sourceBadge: Record<string, { bg: string; text: string }> = {
    github: { bg: C.ocean, text: "white" },
    api: { bg: C.coral, text: "white" },
    webhook: { bg: C.mint, text: C.ink },
    oracle: { bg: C.purple, text: "white" },
  };

  const statCard = (label: string, value: string | number, sub: string, color: string, icon?: React.ReactNode) => (
    <div style={{ background: "white", borderRadius: 12, border: "1px solid rgba(11,26,51,0.08)", padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ fontSize: 11, color: C.steel, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
        {icon}
      </div>
      <div style={{ fontSize: 28, fontWeight: 900, color, marginTop: 4 }}>{value}</div>
      <div style={{ fontSize: 11, color: C.steel, marginTop: 4 }}>{sub}</div>
    </div>
  );

  const activeRules = rules.filter(r => r.enabled).length;
  const balanceNum = status?.balance ? parseFloat(status.balance.replace(/,/g, "")) : 0;

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
            padding: "3px 12px", borderRadius: 999, fontSize: 10, fontWeight: 700,
            background: status?.status === "RUNNING" ? C.mint : C.gold,
            color: C.ink, display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: status?.status === "RUNNING" ? C.ink : C.coral, animation: status?.status === "RUNNING" ? "pulse 2s infinite" : "none" }} />
            {status?.status || "CONNECTING"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "white" }}>{status?.balance || "—"} USDC</div>
            <div style={{ fontSize: 10, color: C.surf }}>Arc Testnet</div>
          </div>
          <button onClick={fetchData} style={{ padding: 8, background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, cursor: "pointer" }}>
            <RefreshCw size={14} color="white" />
          </button>
        </div>
      </header>

      <div style={{ padding: "24px 3%", maxWidth: 1200, margin: "0 auto" }}>
        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
          {statCard("Active Rules", `${activeRules} / ${rules.length}`, activeRules > 0 ? "Monitoring signals" : "No rules active", C.ocean, <Radio size={16} color={C.ocean} />)}
          {statCard("USDC Balance", status?.balance || "—", "Arc Testnet", C.mint, <CreditCard size={16} color={C.mint} />)}
          {statCard("Signal Checks", status?.signalChecks || 0, `Every 10s`, C.gold, <Zap size={16} color={C.gold} />)}
          {statCard("Payments", status?.paymentsExecuted || 0, `${payments.length} total`, C.purple, <CheckCircle size={16} color={C.purple} />)}
        </div>

        {/* FLOW */}
        <div style={{ background: "white", borderRadius: 12, border: "1px solid rgba(11,26,51,0.08)", padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16, color: C.steel }}>Signal → Payment Flow</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            {[
              { icon: Radio, l: "Listen", d: "GitHub | API | Webhook", c: C.ocean },
              { icon: Brain, l: "Decide", d: "Rule engine evaluates", c: C.coral },
              { icon: Zap, l: "Pay", d: "USDC via Circle", c: C.mint },
              { icon: CheckCircle, l: "Settle", d: "Onchain confirmed", c: C.purple },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {i > 0 && <span style={{ color: C.surf, fontSize: 18 }}>→</span>}
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: s.c, borderRadius: 10, color: s.c === C.mint ? C.ink : "white" }}>
                  <s.icon size={16} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800 }}>{s.l}</div>
                    <div style={{ fontSize: 9, opacity: 0.8 }}>{s.d}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RULES */}
        <div style={{ background: "white", borderRadius: 12, border: "1px solid rgba(11,26,51,0.08)", padding: 24, marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: C.steel }}>Rules ({rules.length})</div>
            <button onClick={() => setShowModal(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: C.ocean, color: "white", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              <Plus size={14} /> New Rule
            </button>
          </div>
          {loading ? (
            <div style={{ padding: 40, textAlign: "center", color: C.steel }}>Loading...</div>
          ) : rules.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: C.steel, fontSize: 13 }}>No rules configured yet. Create one to start automating payments.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {rules.map(r => (
                <div key={r.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", background: "rgba(11,26,51,0.02)", borderRadius: 8, border: "1px solid rgba(11,26,51,0.06)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ padding: "4px 10px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: (sourceBadge[r.signal.source] || sourceBadge.github).bg, color: (sourceBadge[r.signal.source] || sourceBadge.github).text, textTransform: "uppercase" }}>
                      {r.signal.source}
                    </span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{r.name}</div>
                      <div style={{ fontSize: 11, color: C.steel }}>{r.signal.trigger} → {r.action.amount} USDC</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: C.ocean }}>{r.action.amount} USDC</span>
                    <button onClick={() => toggleRule(r.id, r.enabled)} style={{
                      padding: "6px 16px", border: "none", borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: "pointer",
                      background: r.enabled ? C.mint : "rgba(11,26,51,0.08)", color: r.enabled ? C.ink : C.steel,
                      transition: "all 0.2s",
                    }}>
                      {r.enabled ? "ON" : "OFF"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PAYMENTS */}
        <div style={{ background: "white", borderRadius: 12, border: "1px solid rgba(11,26,51,0.08)", padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16, color: C.steel }}>Payment History</div>
          {payments.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: C.steel, fontSize: 13 }}>No payments yet. Trigger a rule to see transactions here.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {payments.map(p => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "rgba(11,26,51,0.02)", borderRadius: 8, border: "1px solid rgba(11,26,51,0.06)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <CreditCard size={16} color={C.steel} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{p.amount} USDC → {p.to?.slice(0, 6)}...{p.to?.slice(-4)}</div>
                      <div style={{ fontSize: 10, color: C.steel }}>{new Date(p.timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ padding: "4px 10px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: p.status === "confirmed" ? C.mint : p.status === "pending" ? C.gold : C.coral, color: C.ink }}>{p.status}</span>
                    {p.txHash && (
                      <a href={`https://testnet.arcscan.app/tx/${p.txHash}`} target="_blank" rel="noopener noreferrer" style={{ color: C.ocean, display: "flex" }}>
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ fontSize: 10, color: C.steel, textAlign: "right", marginTop: 8 }}>
          Auto-refresh every 30s · Last: {new Date(lastUpdate).toLocaleTimeString()}
        </div>
      </div>

      {/* NEW RULE MODAL */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(11,26,51,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => setShowModal(false)}>
          <div style={{ background: "white", borderRadius: 16, padding: 28, width: 420, maxWidth: "90vw" }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 24px", fontSize: 18, fontWeight: 900 }}>Create New Rule</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: C.steel, display: "block", marginBottom: 4 }}>Rule Name</label>
                <input placeholder="e.g., Auto Bug Bounty #42" value={newRule.name} onChange={e => setNewRule({ ...newRule, name: e.target.value })}
                  style={{ width: "100%", padding: 10, border: "1px solid rgba(11,26,51,0.15)", borderRadius: 8, fontSize: 13, boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: C.steel, display: "block", marginBottom: 4 }}>Signal Source</label>
                <select value={newRule.source} onChange={e => setNewRule({ ...newRule, source: e.target.value })}
                  style={{ width: "100%", padding: 10, border: "1px solid rgba(11,26,51,0.15)", borderRadius: 8, fontSize: 13, boxSizing: "border-box" }}>
                  <option value="github">GitHub</option>
                  <option value="api">API</option>
                  <option value="webhook">Webhook</option>
                  <option value="oracle">Oracle</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: C.steel, display: "block", marginBottom: 4 }}>Trigger Condition</label>
                <input placeholder="e.g., PR merged with label bugfix" value={newRule.trigger} onChange={e => setNewRule({ ...newRule, trigger: e.target.value })}
                  style={{ width: "100%", padding: 10, border: "1px solid rgba(11,26,51,0.15)", borderRadius: 8, fontSize: 13, boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: C.steel, display: "block", marginBottom: 4 }}>Amount (USDC)</label>
                  <input type="number" placeholder="50" value={newRule.amount} onChange={e => setNewRule({ ...newRule, amount: e.target.value })}
                    style={{ width: "100%", padding: 10, border: "1px solid rgba(11,26,51,0.15)", borderRadius: 8, fontSize: 13, boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: C.steel, display: "block", marginBottom: 4 }}>Recipient Wallet</label>
                  <input placeholder="0x..." value={newRule.recipient} onChange={e => setNewRule({ ...newRule, recipient: e.target.value })}
                    style={{ width: "100%", padding: 10, border: "1px solid rgba(11,26,51,0.15)", borderRadius: 8, fontSize: 13, boxSizing: "border-box" }} />
                </div>
              </div>
              <button onClick={addRule} style={{ padding: 12, background: C.ocean, color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", marginTop: 4 }}>
                Create Rule
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}` }} />
    </div>
  );
}
