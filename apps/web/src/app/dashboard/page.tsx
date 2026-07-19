"use client";

import { useState, useEffect, useCallback } from "react";
import { Bot, Radio, Brain, Zap, CheckCircle, CreditCard, Plus, RefreshCw, ExternalLink } from "lucide-react";

const C = {
  sand: "#f4f0e6", ink: "#0b1a33", ocean: "#1b3158",
  steel: "#2f578c", surf: "#acc6e9", coral: "#ff4b31",
  mint: "#5acda7", gold: "#f2a43a", purple: "#9f72ff",
  foam: "#d6f0e8", white: "#ffffff",
  border: "rgba(11,26,51,0.08)", borderLight: "rgba(11,26,51,0.04)",
};

const SOURCE_COLORS: Record<string, { bg: string; text: string }> = {
  github: { bg: C.ocean, text: C.sand },
  api: { bg: C.coral, text: C.sand },
  oracle: { bg: C.surf, text: C.ink },
  webhook: { bg: C.gold, text: C.ink },
};

const FLOW = [
  { icon: Radio, title: "Listen", desc: "GitHub, APIs, oracles, onchain events", bg: C.foam, color: C.ocean },
  { icon: Brain, title: "Decide", desc: "Rule engine evaluates conditions", bg: "rgba(172,198,233,0.25)", color: C.steel },
  { icon: Zap, title: "Pay", desc: "USDC via Circle Agent Stack", bg: "rgba(90,205,167,0.12)", color: C.mint },
  { icon: CheckCircle, title: "Settle", desc: "Sub-second finality on Arc", bg: C.sand, color: C.ocean },
];

export default function Dashboard() {
  const [rules, setRules] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [status, setStatus] = useState<any>(null);
  const [tab, setTab] = useState<"overview" | "rules" | "payments">("overview");
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchData = useCallback(async () => {
    try {
      const [statusRes, rulesRes, paymentsRes] = await Promise.all([
        fetch("/api/status").catch(() => null),
        fetch("/api/rules").catch(() => null),
        fetch("/api/payments").catch(() => null),
      ]);
      if (statusRes?.ok) setStatus(await statusRes.json());
      if (rulesRes?.ok) setRules(await rulesRes.json());
      if (paymentsRes?.ok) setPayments(await paymentsRes.json());
      setLastRefresh(new Date());
    } catch (e) {
      console.error("Fetch failed:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [fetchData]);

  const toggle = async (id: string) => {
    const rule = rules.find(r => r.id === id);
    if (!rule) return;
    try {
      await fetch(`/api/rules/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !rule.enabled }),
      });
      setRules(rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    } catch (e) {
      // fallback local toggle
      setRules(rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    }
  };

  const fmt = (n: number) => n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}K` : String(n);

  return (
    <div style={{ minHeight: "100vh", background: C.sand, fontFamily: "'DM Sans', system-ui, sans-serif", color: C.ink }}>
      {/* HEADER */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(244,240,230,0.92)", backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, background: C.ocean, borderRadius: 8, display: "grid", placeItems: "center", color: C.sand, fontWeight: 900, fontSize: 13 }}>AG</div>
            <span style={{ fontWeight: 700, fontSize: 16 }}>ArcGent</span>
            <span style={{ fontSize: 11, color: C.steel }}>Dashboard</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={fetchData} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: C.steel, fontFamily: "inherit" }}>
              <RefreshCw size={12} /> {lastRefresh.toLocaleTimeString()}
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 999, background: status?.running ? "rgba(90,205,167,0.1)" : "rgba(255,75,49,0.1)", border: `1px solid ${status?.running ? "rgba(90,205,167,0.25)" : "rgba(255,75,49,0.25)"}` }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: status?.running ? C.mint : C.coral, animation: status?.running ? "pulse 2s infinite" : "none" }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: status?.running ? C.mint : C.coral }}>{status?.running ? "RUNNING" : "STOPPED"}</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{status?.balance ? fmt(parseFloat(status.balance.replace(/,/g, ""))) : "—"} USDC</span>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px 48px" }}>
        {/* TABS */}
        <div style={{ display: "flex", gap: 4, borderBottom: `1px solid ${C.border}`, paddingBottom: 0, marginBottom: 24 }}>
          {(["overview", "rules", "payments"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "8px 16px", fontSize: 13, fontWeight: tab === t ? 600 : 400,
              color: tab === t ? C.ink : C.steel,
              background: tab === t ? C.white : "transparent",
              border: "none", borderBottom: tab === t ? `2px solid ${C.ocean}` : "2px solid transparent",
              cursor: "pointer", fontFamily: "inherit",
              borderRadius: tab === t ? "8px 8px 0 0" : "0",
              marginBottom: -1,
            }}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Active Rules", value: String(status?.rulesCount || rules.length), icon: Bot },
                { label: "Wallet Balance", value: `${status?.balance ? fmt(parseFloat(status.balance.replace(/,/g, ""))) : "—"} USDC`, icon: CreditCard, accent: C.mint },
                { label: "Block Number", value: status?.blockNumber ? `#${fmt(status.blockNumber)}` : "—", icon: Zap },
                { label: "Network", value: status?.network || "Arc Testnet", sub: `Chain ID: ${status?.chainId || 5042002}`, icon: Radio },
              ].map((s, i) => (
                <div key={i} style={{ background: C.white, borderRadius: 14, padding: "20px 20px 16px", border: `1px solid ${C.borderLight}`, boxShadow: "0 1px 3px rgba(11,26,51,0.04)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                    <s.icon size={14} color={s.accent || C.steel} />
                    <span style={{ fontSize: 11, fontWeight: 500, color: C.steel, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</span>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: s.accent || C.ink, letterSpacing: "-0.02em" }}>{s.value}</div>
                  {s.sub && <div style={{ fontSize: 11, color: C.steel, marginTop: 2 }}>{s.sub}</div>}
                </div>
              ))}
            </div>

            <div style={{ background: C.white, borderRadius: 14, padding: 24, border: `1px solid ${C.borderLight}`, boxShadow: "0 1px 3px rgba(11,26,51,0.04)", marginBottom: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 20 }}>Signal → Payment Flow</h3>
              <div style={{ display: "flex", alignItems: "stretch", gap: 8, flexWrap: "wrap" }}>
                {FLOW.map((step, i) => (
                  <div key={i} style={{ flex: 1, minWidth: 140, display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, background: step.bg, borderRadius: 10, padding: "16px 12px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                      <step.icon size={22} color={step.color} strokeWidth={1.5} />
                      <div><div style={{ fontSize: 12, fontWeight: 700 }}>{step.title}</div><div style={{ fontSize: 10, color: C.steel, marginTop: 2 }}>{step.desc}</div></div>
                    </div>
                    {i < FLOW.length - 1 && <span style={{ color: C.steel, opacity: 0.3, fontSize: 20 }}>→</span>}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <button onClick={() => setShowNew(true)} style={{ background: C.ocean, color: C.sand, borderRadius: 14, padding: "20px 22px", textAlign: "left", border: "none", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 40, height: 40, background: "rgba(244,240,230,0.15)", borderRadius: 10, display: "grid", placeItems: "center" }}><Plus size={20} /></div>
                <div><div style={{ fontWeight: 700, fontSize: 15 }}>New Rule</div><div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>Create a signal-to-payment rule</div></div>
              </button>
              <a href={`https://testnet.arcscan.app/address/${status?.walletAddress || ""}`} target="_blank" rel="noopener" style={{ background: C.foam, color: C.ocean, borderRadius: 14, padding: "20px 22px", textAlign: "left", textDecoration: "none", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 40, height: 40, background: "rgba(27,49,88,0.1)", borderRadius: 10, display: "grid", placeItems: "center" }}><ExternalLink size={20} /></div>
                <div><div style={{ fontWeight: 700, fontSize: 15 }}>View on Explorer</div><div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>Arc Testnet scan</div></div>
              </a>
            </div>
          </div>
        )}

        {/* RULES */}
        {tab === "rules" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Rules <span style={{ fontWeight: 400, fontSize: 14, color: C.steel }}>({rules.length})</span></h2>
              <button onClick={() => setShowNew(true)} style={{ background: C.ocean, color: C.sand, padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
                <Plus size={14} /> New Rule
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {rules.map(rule => {
                const sc = SOURCE_COLORS[rule.signal?.source] || { bg: "#ddd", text: "#333" };
                return (
                  <div key={rule.id} style={{ background: C.white, borderRadius: 14, padding: "18px 20px", border: `1px solid ${C.borderLight}`, boxShadow: "0 1px 3px rgba(11,26,51,0.04)" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <span style={{ fontWeight: 700, fontSize: 14 }}>{rule.name}</span>
                          <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 999, background: sc.bg, color: sc.text }}>{rule.signal?.source}</span>
                          <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 999, border: "1px solid rgba(90,205,167,0.3)", color: C.mint }}>{rule.action?.type}</span>
                        </div>
                        <p style={{ fontSize: 12, color: C.steel, margin: "0 0 8px" }}>{rule.description}</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: 11, color: C.steel }}>
                          <span>Trigger: <code style={{ background: "#f3f4f6", padding: "1px 5px", borderRadius: 4, fontSize: 10 }}>{rule.signal?.trigger}</code></span>
                          <span style={{ fontWeight: 600, color: C.ink }}>{rule.action?.amount} {rule.action?.currency}</span>
                          <span>Cooldown: {rule.cooldown}s</span>
                        </div>
                      </div>
                      <button onClick={() => toggle(rule.id)} style={{
                        width: 44, height: 24, borderRadius: 999, border: "none", cursor: "pointer", flexShrink: 0,
                        background: rule.enabled ? C.mint : "#e5e7eb", position: "relative", transition: "background 0.2s",
                      }}>
                        <span style={{ position: "absolute", top: 2, left: rule.enabled ? 24 : 2, width: 20, height: 20, borderRadius: "50%", background: C.white, transition: "left 0.2s", boxShadow: "0 1px 2px rgba(0,0,0,0.15)" }} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PAYMENTS */}
        {tab === "payments" && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 16px" }}>Payment History</h2>
            {payments.length === 0 ? (
              <div style={{ background: C.white, borderRadius: 14, padding: "64px 24px", textAlign: "center", border: `1px solid ${C.borderLight}`, boxShadow: "0 1px 3px rgba(11,26,51,0.04)" }}>
                <CreditCard size={48} color={C.steel} strokeWidth={1} style={{ opacity: 0.3, marginBottom: 16 }} />
                <h3 style={{ fontWeight: 700, fontSize: 16, color: C.steel, margin: "0 0 4px" }}>No payments yet</h3>
                <p style={{ fontSize: 13, color: C.steel, margin: 0 }}>Payments will appear here once rules trigger</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {payments.map(p => (
                  <div key={p.id} style={{ background: C.white, borderRadius: 14, padding: "18px 20px", border: `1px solid ${C.borderLight}`, boxShadow: "0 1px 3px rgba(11,26,51,0.04)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: 14 }}>{p.rule}</span>
                        <span style={{ fontSize: 11, color: C.steel, marginLeft: 8 }}>{p.recipient}</span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontWeight: 700, fontSize: 14 }}>{p.amount} USDC</span>
                        <span style={{ fontSize: 11, color: C.mint, marginLeft: 8 }}>{p.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL */}
      {showNew && (
        <div onClick={() => setShowNew(false)} style={{ position: "fixed", inset: 0, background: "rgba(11,26,51,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: C.white, borderRadius: 20, padding: 28, width: "100%", maxWidth: 420, boxShadow: "0 25px 50px rgba(11,26,51,0.2)" }}>
            <h3 style={{ fontWeight: 700, fontSize: 18, margin: "0 0 20px" }}>Create New Rule</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[{ l: "Rule Name", p: "e.g. Auto Bug Bounty", key: "name" }, { l: "Trigger Condition", p: "e.g. pull_request.merged", key: "trigger" }].map(f => (
                <div key={f.key}><label style={{ fontSize: 12, fontWeight: 500, color: C.steel, display: "block", marginBottom: 4 }}>{f.l}</label>
                <input placeholder={f.p} id={`new-${f.key}`} style={{ width: "100%", padding: "10px 12px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box", outline: "none" }} /></div>
              ))}
              <div><label style={{ fontSize: 12, fontWeight: 500, color: C.steel, display: "block", marginBottom: 4 }}>Signal Source</label>
                <select id="new-source" style={{ width: "100%", padding: "10px 12px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box", outline: "none", background: C.white }}>
                  <option value="github">GitHub</option><option value="api">External API</option><option value="oracle">Onchain Oracle</option><option value="webhook">Webhook</option>
                </select></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[{ l: "Amount (USDC)", p: "50", key: "amount", t: "number" }, { l: "Recipient", p: "0x...", key: "recipient" }].map(f => (
                  <div key={f.key}><label style={{ fontSize: 12, fontWeight: 500, color: C.steel, display: "block", marginBottom: 4 }}>{f.l}</label>
                  <input type={f.t} placeholder={f.p} id={`new-${f.key}`} style={{ width: "100%", padding: "10px 12px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box", outline: "none" }} /></div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10, paddingTop: 6 }}>
                <button type="button" onClick={() => setShowNew(false)} style={{ flex: 1, padding: "10px 16px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontWeight: 500, background: C.white, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                <button onClick={() => {
                  const name = (document.getElementById("new-name") as HTMLInputElement)?.value;
                  const trigger = (document.getElementById("new-trigger") as HTMLInputElement)?.value;
                  const source = (document.getElementById("new-source") as HTMLSelectElement)?.value;
                  const amount = (document.getElementById("new-amount") as HTMLInputElement)?.value;
                  const recipient = (document.getElementById("new-recipient") as HTMLInputElement)?.value;
                  if (name && trigger && amount && recipient) {
                    fetch("/api/rules", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ name, description: `Auto-created rule`, signal: { source, trigger, conditions: {} }, action: { type: "pay", recipient, amount: Number(amount), currency: "USDC" }, enabled: false, cooldown: 3600 }),
                    }).then(() => { fetchData(); setShowNew(false); });
                  }
                }} style={{ flex: 1, padding: "10px 16px", background: C.ocean, color: C.sand, borderRadius: 8, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "inherit" }}>Create Rule</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } } ::selection { background: rgba(172,198,233,0.4); }` }} />
    </div>
  );
}
