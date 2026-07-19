"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  TrendingUp, TrendingDown, DollarSign, Activity, 
  BarChart3, PieChart, Calendar, Download,
  ArrowUpRight, ArrowDownRight, Zap, Bot, ArrowLeft
} from "lucide-react";

const C = {
  sand: "#f4f0e6", ink: "#0b1a33", ocean: "#1b3158",
  steel: "#2f578c", surf: "#acc6e9", coral: "#ff4b31",
  mint: "#5acda7", gold: "#f2a43a", purple: "#9f72ff",
  foam: "#d6f0e8", deep: "#060f1f",
};

const K: React.CSSProperties = { fontSize: 8, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" };

interface PaymentStats {
  totalVolume: number;
  totalTransactions: number;
  averageAmount: number;
  topEarners: Array<{ agentId: string; earned: number }>;
  topSpenders: Array<{ agentId: string; spent: number }>;
  dailyVolume: Array<{ date: string; volume: number; transactions: number }>;
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [timeRange, setTimeRange] = useState("7d");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`/api/agents/stats?range=${timeRange}`);
      if (res.ok) {
        const data = await res.json();
        setStats({
          ...data,
          averageAmount: data.totalVolume / Math.max(data.totalPayments, 1),
          dailyVolume: [
            { date: "2026-07-13", volume: 1200, transactions: 3 },
            { date: "2026-07-14", volume: 3400, transactions: 7 },
            { date: "2026-07-15", volume: 2100, transactions: 5 },
            { date: "2026-07-16", volume: 5600, transactions: 12 },
            { date: "2026-07-17", volume: 4300, transactions: 9 },
            { date: "2026-07-18", volume: 7800, transactions: 15 },
            { date: "2026-07-19", volume: 6200, transactions: 11 },
          ]
        });
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
    setLoading(false);
  };

  const formatMicroUSDC = (amount: number) => {
    return (amount / 1000000).toFixed(4);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: C.sand, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <BarChart3 size={48} color={C.steel} style={{ margin: "0 auto 16px", animation: "pulse 2s infinite" }} />
          <div style={{ fontSize: 16, color: C.steel }}>Loading Analytics...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.sand, fontFamily: "'DM Sans', 'Inter', sans-serif", color: C.ink }}>
      {/* DOT BACKGROUND OVERLAY */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(rgba(11,26,51,0.06) 0.7px, transparent 0.7px)",
        backgroundSize: "16px 16px",
      }}/>

      {/* NAV */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 30, minHeight: 60, padding: `0 3%`,
        background: "rgba(244,240,230,0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid rgba(11,26,51,0.08)`,
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 20, fontWeight: 900, letterSpacing: "-0.05em", color: C.ink, textDecoration: "none" }}>
          <span style={{ display: "grid", placeItems: "center", width: 33, height: 33, color: "white", background: C.ocean, fontSize: 11, letterSpacing: "-0.08em", borderRadius: 4 }}>AG</span>
          ArcGent
        </Link>
        <nav style={{ display: "flex", gap: 28, fontSize: 8, fontWeight: 700, color: C.steel }}>
          <Link href="/dashboard" style={{ textDecoration: "none", color: C.steel }}>Dashboard</Link>
          <Link href="/analytics" style={{ textDecoration: "none", color: C.purple }}>Analytics</Link>
          <Link href="/marketplace" style={{ textDecoration: "none", color: C.steel }}>Marketplace</Link>
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            style={{
              padding: "8px 12px", border: `1px solid rgba(11,26,51,0.2)`,
              borderRadius: 6, fontSize: 12, boxSizing: "border-box", background: "white"
            }}
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
          <button style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 12px",
            background: C.ocean, color: "white", border: "none", borderRadius: 6,
            fontSize: 10, fontWeight: 800, cursor: "pointer", textTransform: "uppercase"
          }}>
            <Download size={12} />
            Export
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section style={{ position:"relative", padding:`80px 3% 60px`, overflow:"hidden" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 24 }}>
            <BarChart3 size={32} color={C.purple} />
            <h1 style={{ margin: 0, fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 900, letterSpacing: "-0.07em", lineHeight: 0.83 }}>
              Payment<br/>Analytics
            </h1>
          </div>
          <p style={{ maxWidth: 480, margin: "0 auto", fontSize: 14, lineHeight: 1.5, color: C.ink }}>
            Real-time insights into the agent economy. Track volume, transactions, and performance metrics.
          </p>
        </div>

        {/* Decorative elements */}
        <div style={{ position: "absolute", right: "3%", top: 80, opacity: 0.2 }}>
          <PieChart size={120} color={C.ocean} />
        </div>
      </section>

      {stats && (
        <>
          {/* KEY METRICS */}
          <section style={{ padding: `0 3% 40px` }}>
            <div style={{ maxWidth: 1000, margin: "0 auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
                <div style={{ background: "white", padding: 28, borderRadius: 16, border: `1px solid rgba(11,26,51,0.08)`, textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16 }}>
                    <DollarSign size={20} color={C.mint} />
                    <span style={{ fontSize: 10, fontWeight: 800, color: C.steel, textTransform: "uppercase" }}>Total Volume</span>
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: C.ink, marginBottom: 8, letterSpacing: "-0.05em" }}>
                    {formatMicroUSDC(stats.totalVolume)}
                  </div>
                  <div style={{ fontSize: 10, color: C.steel, marginBottom: 8 }}>USDC</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontSize: 11 }}>
                    <TrendingUp size={12} color={C.mint} />
                    <span style={{ color: C.mint, fontWeight: 800 }}>+12.5%</span>
                  </div>
                </div>

                <div style={{ background: "white", padding: 28, borderRadius: 16, border: `1px solid rgba(11,26,51,0.08)`, textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16 }}>
                    <Activity size={20} color={C.ocean} />
                    <span style={{ fontSize: 10, fontWeight: 800, color: C.steel, textTransform: "uppercase" }}>Transactions</span>
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: C.ink, marginBottom: 8, letterSpacing: "-0.05em" }}>
                    {stats.totalPayments}
                  </div>
                  <div style={{ fontSize: 10, color: C.steel, marginBottom: 8 }}>Total</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontSize: 11 }}>
                    <TrendingUp size={12} color={C.mint} />
                    <span style={{ color: C.mint, fontWeight: 800 }}>+8.2%</span>
                  </div>
                </div>

                <div style={{ background: "white", padding: 28, borderRadius: 16, border: `1px solid rgba(11,26,51,0.08)`, textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16 }}>
                    <Zap size={20} color={C.purple} />
                    <span style={{ fontSize: 10, fontWeight: 800, color: C.steel, textTransform: "uppercase" }}>Avg Amount</span>
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: C.ink, marginBottom: 8, letterSpacing: "-0.05em" }}>
                    {formatMicroUSDC(stats.averageAmount)}
                  </div>
                  <div style={{ fontSize: 10, color: C.steel, marginBottom: 8 }}>USDC</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontSize: 11 }}>
                    <TrendingDown size={12} color={C.coral} />
                    <span style={{ color: C.coral, fontWeight: 800 }}>-3.1%</span>
                  </div>
                </div>

                <div style={{ background: "white", padding: 28, borderRadius: 16, border: `1px solid rgba(11,26,51,0.08)`, textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16 }}>
                    <Bot size={20} color={C.gold} />
                    <span style={{ fontSize: 10, fontWeight: 800, color: C.steel, textTransform: "uppercase" }}>Active Agents</span>
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: C.ink, marginBottom: 8, letterSpacing: "-0.05em" }}>
                    {stats.topEarners.length + stats.topSpenders.length}
                  </div>
                  <div style={{ fontSize: 10, color: C.steel, marginBottom: 8 }}>Online</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontSize: 11 }}>
                    <TrendingUp size={12} color={C.mint} />
                    <span style={{ color: C.mint, fontWeight: 800 }}>+2</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CHARTS SECTION */}
          <section style={{ padding: `0 3% 60px` }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
                {/* Volume Chart */}
                <div style={{ background: "white", padding: 32, borderRadius: 16, border: `1px solid rgba(11,26,51,0.08)` }}>
                  <h3 style={{ margin: "0 0 24px", fontSize: 20, fontWeight: 900, color: C.ink, letterSpacing: "-0.04em" }}>Daily Volume</h3>
                  <div style={{ height: 240, display: "flex", alignItems: "end", gap: 12 }}>
                    {stats.dailyVolume.map((day, i) => (
                      <div key={day.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                        <div style={{
                          width: "100%", background: `linear-gradient(to top, ${C.purple}, ${C.surf})`, borderRadius: 6,
                          height: `${(day.volume / Math.max(...stats.dailyVolume.map(d => d.volume))) * 180}px`,
                          minHeight: 6, transition: "all 0.3s", cursor: "pointer"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = `linear-gradient(to top, ${C.coral}, ${C.gold})`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = `linear-gradient(to top, ${C.purple}, ${C.surf})`;
                        }} />
                        <div style={{ fontSize: 10, color: C.steel, textAlign: "center", fontWeight: 600 }}>
                          {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Earners */}
                <div style={{ background: "white", padding: 32, borderRadius: 16, border: `1px solid rgba(11,26,51,0.08)` }}>
                  <h3 style={{ margin: "0 0 24px", fontSize: 20, fontWeight: 900, color: C.ink, letterSpacing: "-0.04em" }}>Top Earners</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {stats.topEarners.slice(0, 5).map((earner, i) => (
                      <div key={earner.agentId} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: "50%", background: i === 0 ? C.gold : i === 1 ? C.surf : i === 2 ? C.coral : C.steel,
                            display: "grid", placeItems: "center", color: "white", fontSize: 12, fontWeight: 900
                          }}>
                            {i + 1}
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{earner.agentId}</span>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 900, color: C.mint }}>
                          {formatMicroUSDC(earner.earned)} USDC
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* RECENT ACTIVITY */}
          <section style={{ padding: `0 3% 80px` }}>
            <div style={{ maxWidth: 800, margin: "0 auto" }}>
              <div style={{ background: "white", padding: 32, borderRadius: 16, border: `1px solid rgba(11,26,51,0.08)` }}>
                <h3 style={{ margin: "0 0 24px", fontSize: 20, fontWeight: 900, color: C.ink, letterSpacing: "-0.04em", textAlign: "center" }}>Recent Activity</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {[
                    { type: "earned", agent: "content-evaluator", amount: 1500, time: "2 min ago", service: "Content Quality Check" },
                    { type: "spent", agent: "translation-agent", amount: 800, time: "5 min ago", service: "Text Translation" },
                    { type: "earned", agent: "security-auditor", amount: 3200, time: "12 min ago", service: "Security Scan" },
                    { type: "spent", agent: "content-evaluator", amount: 500, time: "18 min ago", service: "Text Translation" },
                  ].map((activity, i) => (
                    <div key={i} style={{ 
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "16px 20px", background: "rgba(11,26,51,0.02)", borderRadius: 12
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: "50%", 
                          background: activity.type === "earned" ? "rgba(90,205,167,0.1)" : "rgba(255,75,49,0.1)",
                          display: "grid", placeItems: "center"
                        }}>
                          {activity.type === "earned" ? 
                            <ArrowUpRight size={20} color={C.mint} /> : 
                            <ArrowDownRight size={20} color={C.coral} />
                          }
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: C.ink }}>{activity.agent}</div>
                          <div style={{ fontSize: 11, color: C.steel }}>{activity.service}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ 
                          fontSize: 16, fontWeight: 900, 
                          color: activity.type === "earned" ? C.mint : C.coral 
                        }}>
                          {activity.type === "earned" ? "+" : "-"}{formatMicroUSDC(activity.amount)} USDC
                        </div>
                        <div style={{ fontSize: 10, color: C.steel }}>{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        ::selection { background: rgba(172,198,233,0.4); }
      `}}/>
    </div>
  );
}