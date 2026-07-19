"use client";

import { useState, useEffect } from "react";
import { 
  TrendingUp, TrendingDown, DollarSign, Activity, 
  BarChart3, PieChart, Calendar, Download,
  ArrowUpRight, ArrowDownRight, Zap, Bot
} from "lucide-react";

const C = {
  sand: "#f4f0e6", ink: "#0b1a33", ocean: "#1b3158",
  steel: "#2f578c", coral: "#ff4b31", mint: "#5acda7", 
  purple: "#9f72ff", gold: "#f2a43a", foam: "#d6f0e8",
};

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
        // Mock additional analytics data
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

  const formatUSDC = (amount: number) => {
    return amount.toFixed(4);
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
    <div style={{ minHeight: "100vh", background: C.sand, fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ padding: "20px 3%", borderBottom: `1px solid rgba(11,26,51,0.1)`, background: "white" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <BarChart3 size={24} color={C.purple} />
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: C.ink }}>Payment Analytics</h1>
              <p style={{ margin: 0, fontSize: 12, color: C.steel }}>Agent economy performance metrics</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              style={{
                padding: "8px 12px", border: `1px solid rgba(11,26,51,0.2)`,
                borderRadius: 6, fontSize: 12, boxSizing: "border-box"
              }}
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
            <button style={{
              display: "flex", alignItems: "center", gap: 6, padding: "8px 12px",
              background: C.ocean, color: "white", border: "none", borderRadius: 6,
              fontSize: 12, fontWeight: 700, cursor: "pointer"
            }}>
              <Download size={14} />
              Export
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: "24px 3%" }}>
        {stats && (
          <>
            {/* Key Metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 32 }}>
              <div style={{ background: "white", padding: 20, borderRadius: 8, border: `1px solid rgba(11,26,51,0.1)` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: C.steel, textTransform: "uppercase" }}>Total Volume</span>
                  <DollarSign size={16} color={C.mint} />
                </div>
                <div style={{ fontSize: 28, fontWeight: 900, color: C.ink, marginBottom: 4 }}>
                  {formatMicroUSDC(stats.totalVolume)} USDC
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
                  <TrendingUp size={12} color={C.mint} />
                  <span style={{ color: C.mint, fontWeight: 700 }}>+12.5%</span>
                  <span style={{ color: C.steel }}>vs last period</span>
                </div>
              </div>

              <div style={{ background: "white", padding: 20, borderRadius: 8, border: `1px solid rgba(11,26,51,0.1)` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: C.steel, textTransform: "uppercase" }}>Transactions</span>
                  <Activity size={16} color={C.ocean} />
                </div>
                <div style={{ fontSize: 28, fontWeight: 900, color: C.ink, marginBottom: 4 }}>
                  {stats.totalPayments}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
                  <TrendingUp size={12} color={C.mint} />
                  <span style={{ color: C.mint, fontWeight: 700 }}>+8.2%</span>
                  <span style={{ color: C.steel }}>vs last period</span>
                </div>
              </div>

              <div style={{ background: "white", padding: 20, borderRadius: 8, border: `1px solid rgba(11,26,51,0.1)` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: C.steel, textTransform: "uppercase" }}>Avg Amount</span>
                  <Zap size={16} color={C.purple} />
                </div>
                <div style={{ fontSize: 28, fontWeight: 900, color: C.ink, marginBottom: 4 }}>
                  {formatMicroUSDC(stats.averageAmount)} USDC
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
                  <TrendingDown size={12} color={C.coral} />
                  <span style={{ color: C.coral, fontWeight: 700 }}>-3.1%</span>
                  <span style={{ color: C.steel }}>vs last period</span>
                </div>
              </div>

              <div style={{ background: "white", padding: 20, borderRadius: 8, border: `1px solid rgba(11,26,51,0.1)` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: C.steel, textTransform: "uppercase" }}>Active Agents</span>
                  <Bot size={16} color={C.gold} />
                </div>
                <div style={{ fontSize: 28, fontWeight: 900, color: C.ink, marginBottom: 4 }}>
                  {stats.topEarners.length + stats.topSpenders.length}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
                  <TrendingUp size={12} color={C.mint} />
                  <span style={{ color: C.mint, fontWeight: 700 }}>+2</span>
                  <span style={{ color: C.steel }}>new this week</span>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 32 }}>
              {/* Volume Chart */}
              <div style={{ background: "white", padding: 24, borderRadius: 8, border: `1px solid rgba(11,26,51,0.1)` }}>
                <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 800, color: C.ink }}>Daily Volume</h3>
                <div style={{ height: 200, display: "flex", alignItems: "end", gap: 8 }}>
                  {stats.dailyVolume.map((day, i) => (
                    <div key={day.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                      <div style={{
                        width: "100%", background: C.purple, borderRadius: 4,
                        height: `${(day.volume / Math.max(...stats.dailyVolume.map(d => d.volume))) * 160}px`,
                        minHeight: 4, transition: "all 0.3s"
                      }} />
                      <div style={{ fontSize: 10, color: C.steel, textAlign: "center" }}>
                        {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Agents */}
              <div style={{ background: "white", padding: 24, borderRadius: 8, border: `1px solid rgba(11,26,51,0.1)` }}>
                <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 800, color: C.ink }}>Top Earners</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {stats.topEarners.slice(0, 5).map((earner, i) => (
                    <div key={earner.agentId} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{
                          width: 24, height: 24, borderRadius: "50%", background: C.mint,
                          display: "grid", placeItems: "center", color: "white", fontSize: 10, fontWeight: 700
                        }}>
                          {i + 1}
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: C.ink }}>{earner.agentId}</span>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: C.mint }}>
                        {formatMicroUSDC(earner.earned)} USDC
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{ background: "white", padding: 24, borderRadius: 8, border: `1px solid rgba(11,26,51,0.1)` }}>
              <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 800, color: C.ink }}>Recent Activity</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { type: "earned", agent: "content-evaluator", amount: 1500, time: "2 min ago", service: "Content Quality Check" },
                  { type: "spent", agent: "translation-agent", amount: 800, time: "5 min ago", service: "Text Translation" },
                  { type: "earned", agent: "security-auditor", amount: 3200, time: "12 min ago", service: "Security Scan" },
                  { type: "spent", agent: "content-evaluator", amount: 500, time: "18 min ago", service: "Text Translation" },
                ].map((activity, i) => (
                  <div key={i} style={{ 
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 16px", background: "rgba(11,26,51,0.02)", borderRadius: 6
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: "50%", 
                        background: activity.type === "earned" ? "rgba(90,205,167,0.1)" : "rgba(255,75,49,0.1)",
                        display: "grid", placeItems: "center"
                      }}>
                        {activity.type === "earned" ? 
                          <ArrowUpRight size={16} color={C.mint} /> : 
                          <ArrowDownRight size={16} color={C.coral} />
                        }
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: C.ink }}>{activity.agent}</div>
                        <div style={{ fontSize: 10, color: C.steel }}>{activity.service}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ 
                        fontSize: 12, fontWeight: 700, 
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
          </>
        )}
      </div>
    </div>
  );
}