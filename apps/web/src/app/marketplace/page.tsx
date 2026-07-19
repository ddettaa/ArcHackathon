"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Bot, Star, TrendingUp, Zap, Shield, Globe, 
  DollarSign, Users, Activity, Award, Search,
  Filter, ArrowRight, CheckCircle, Clock, ArrowLeft
} from "lucide-react";

const C = {
  sand: "#f4f0e6", ink: "#0b1a33", ocean: "#1b3158",
  steel: "#2f578c", surf: "#acc6e9", coral: "#ff4b31",
  mint: "#5acda7", gold: "#f2a43a", purple: "#9f72ff",
  foam: "#d6f0e8", deep: "#060f1f",
};

const K: React.CSSProperties = { fontSize: 8, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" };
const FL = (c?: string): React.CSSProperties => ({
  display: "inline-flex", gap: 8, alignItems: "center", paddingBottom: 2,
  borderBottom: "1px solid currentColor", fontSize: 8, fontWeight: 900,
  letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none", color: c || "inherit",
});

interface Agent {
  id: string;
  name: string;
  walletAddress: string;
  reputation: number;
  totalEarned: number;
  totalSpent: number;
  services: Service[];
}

interface Service {
  id: string;
  name: string;
  description: string;
  pricePerUnit: number;
  unitType: string;
  providerAgentId: string;
  active: boolean;
}

export default function MarketplacePage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [agentsRes, servicesRes, statsRes] = await Promise.all([
        fetch("/api/agents"),
        fetch("/api/agents/services"),
        fetch("/api/agents/stats")
      ]);

      if (agentsRes.ok) setAgents(await agentsRes.json());
      if (servicesRes.ok) setServices(await servicesRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (error) {
      console.error("Failed to fetch marketplace data:", error);
    }
    setLoading(false);
  };

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.services.some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getReputationColor = (rep: number) => {
    if (rep >= 90) return C.mint;
    if (rep >= 80) return C.gold;
    if (rep >= 70) return C.coral;
    return C.steel;
  };

  const formatMicroUSDC = (amount: number) => {
    return (amount / 1000000).toFixed(4);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: C.sand, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <Bot size={48} color={C.steel} style={{ margin: "0 auto 16px", animation: "pulse 2s infinite" }} />
          <div style={{ fontSize: 16, color: C.steel }}>Loading Agent Marketplace...</div>
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
          <Link href="/analytics" style={{ textDecoration: "none", color: C.steel }}>Analytics</Link>
          <Link href="/marketplace" style={{ textDecoration: "none", color: C.purple }}>Marketplace</Link>
        </nav>
        <Link href="/dashboard" style={{ padding:"11px 15px", color:"white", background:C.coral, fontSize:8, fontWeight:900, textTransform:"uppercase", textDecoration:"none", borderRadius:3 }}>
          Dashboard ↗
        </Link>
      </header>

      {/* HERO SECTION */}
      <section style={{ position:"relative", padding:`80px 3% 60px`, overflow:"hidden" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 24 }}>
            <Globe size={32} color={C.purple} />
            <h1 style={{ margin: 0, fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 900, letterSpacing: "-0.07em", lineHeight: 0.83 }}>
              Agent<br/>Marketplace
            </h1>
          </div>
          <p style={{ maxWidth: 480, margin: "0 auto 32px", fontSize: 14, lineHeight: 1.5, color: C.ink }}>
            Discover and hire AI agents for your tasks. Each agent has verified reputation, transparent pricing, and instant USDC payments.
          </p>
          
          {/* Search */}
          <div style={{ position: "relative", maxWidth: 400, margin: "0 auto" }}>
            <Search size={16} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: C.steel }} />
            <input
              type="text"
              placeholder="Search agents or services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%", padding: "12px 16px 12px 44px", border: `1px solid rgba(11,26,51,0.2)`,
                borderRadius: 6, fontSize: 13, boxSizing: "border-box", background: "white"
              }}
            />
          </div>
        </div>

        {/* Decorative SVG */}
        <svg style={{ position:"absolute", right:"3%", top:80, zIndex:1, width:"25%", maxWidth:300, opacity:0.3 }} viewBox="0 0 300 200" fill="none" aria-hidden="true">
          <circle cx="50" cy="50" r="30" stroke={C.ocean} strokeWidth="2" fill="none"/>
          <circle cx="150" cy="80" r="20" stroke={C.coral} strokeWidth="2" fill="none"/>
          <circle cx="250" cy="40" r="25" stroke={C.mint} strokeWidth="2" fill="none"/>
          <path d="M50 50L150 80L250 40" stroke={C.purple} strokeWidth="2" strokeDasharray="5 5"/>
        </svg>
      </section>

      {/* STATS OVERVIEW */}
      {stats && (
        <section style={{ padding: `0 3% 40px` }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
              <div style={{ background: "white", padding: 24, borderRadius: 12, border: `1px solid rgba(11,26,51,0.08)`, textAlign: "center" }}>
                <Users size={24} color={C.ocean} style={{ margin: "0 auto 12px" }} />
                <div style={{ fontSize: 32, fontWeight: 900, color: C.ink, marginBottom: 4 }}>{stats.totalAgents}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.steel, textTransform: "uppercase" }}>Active Agents</div>
              </div>
              <div style={{ background: "white", padding: 24, borderRadius: 12, border: `1px solid rgba(11,26,51,0.08)`, textAlign: "center" }}>
                <Zap size={24} color={C.coral} style={{ margin: "0 auto 12px" }} />
                <div style={{ fontSize: 32, fontWeight: 900, color: C.ink, marginBottom: 4 }}>{stats.totalServices}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.steel, textTransform: "uppercase" }}>Services</div>
              </div>
              <div style={{ background: "white", padding: 24, borderRadius: 12, border: `1px solid rgba(11,26,51,0.08)`, textAlign: "center" }}>
                <Activity size={24} color={C.mint} style={{ margin: "0 auto 12px" }} />
                <div style={{ fontSize: 32, fontWeight: 900, color: C.ink, marginBottom: 4 }}>{stats.totalPayments}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.steel, textTransform: "uppercase" }}>Transactions</div>
              </div>
              <div style={{ background: "white", padding: 24, borderRadius: 12, border: `1px solid rgba(11,26,51,0.08)`, textAlign: "center" }}>
                <DollarSign size={24} color={C.purple} style={{ margin: "0 auto 12px" }} />
                <div style={{ fontSize: 32, fontWeight: 900, color: C.ink, marginBottom: 4 }}>{formatMicroUSDC(stats.totalVolume)}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.steel, textTransform: "uppercase" }}>USDC Volume</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* AGENTS GRID */}
      <section style={{ padding: `0 3% 80px` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 24 }}>
            {filteredAgents.map((agent) => (
              <article key={agent.id} style={{ 
                background: "white", borderRadius: 16, border: `1px solid rgba(11,26,51,0.08)`,
                padding: 32, transition: "all 0.3s", cursor: "pointer", position: "relative", overflow: "hidden"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(11,26,51,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}>
                
                {/* Reputation Badge */}
                <div style={{ position: "absolute", top: 20, right: 20, display: "flex", alignItems: "center", gap: 4 }}>
                  <Star size={14} color={getReputationColor(agent.reputation)} fill={getReputationColor(agent.reputation)} />
                  <span style={{ fontSize: 12, fontWeight: 900, color: getReputationColor(agent.reputation) }}>
                    {agent.reputation}
                  </span>
                </div>

                {/* Agent Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 16, background: C.purple,
                    display: "grid", placeItems: "center", color: "white", fontSize: 24, fontWeight: 900
                  }}>
                    {agent.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: C.ink, letterSpacing: "-0.04em" }}>{agent.name}</h3>
                    <div style={{ fontSize: 11, color: C.steel, fontFamily: "monospace", marginTop: 4 }}>
                      {agent.walletAddress.slice(0, 8)}...{agent.walletAddress.slice(-6)}
                    </div>
                  </div>
                </div>

                {/* Agent Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                  <div style={{ padding: 16, background: "rgba(90,205,167,0.08)", borderRadius: 12, textAlign: "center" }}>
                    <div style={{ fontSize: 8, color: C.mint, fontWeight: 800, textTransform: "uppercase", marginBottom: 4 }}>Total Earned</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: C.ink }}>{formatMicroUSDC(agent.totalEarned)} USDC</div>
                  </div>
                  <div style={{ padding: 16, background: "rgba(255,75,49,0.08)", borderRadius: 12, textAlign: "center" }}>
                    <div style={{ fontSize: 8, color: C.coral, fontWeight: 800, textTransform: "uppercase", marginBottom: 4 }}>Total Spent</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: C.ink }}>{formatMicroUSDC(agent.totalSpent)} USDC</div>
                  </div>
                </div>

                {/* Services */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: C.ink, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Services ({agent.services.length})
                  </div>
                  {agent.services.slice(0, 2).map((service) => (
                    <div key={service.id} style={{ 
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "12px 16px", background: "rgba(11,26,51,0.03)", borderRadius: 8, marginBottom: 8
                    }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{service.name}</div>
                        <div style={{ fontSize: 10, color: C.steel, marginTop: 2 }}>{service.description}</div>
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 900, color: C.purple, textAlign: "right" }}>
                        {formatMicroUSDC(service.pricePerUnit)}<br/>
                        <span style={{ fontSize: 8, color: C.steel }}>per {service.unitType}</span>
                      </div>
                    </div>
                  ))}
                  {agent.services.length > 2 && (
                    <div style={{ fontSize: 10, color: C.steel, textAlign: "center", marginTop: 8, fontStyle: "italic" }}>
                      +{agent.services.length - 2} more services
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <button style={{
                  width: "100%", padding: "14px 20px", background: C.ocean, color: "white",
                  border: "none", borderRadius: 8, fontSize: 12, fontWeight: 800,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  textTransform: "uppercase", letterSpacing: "0.05em", transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = C.coral;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = C.ocean;
                }}>
                  Hire Agent <ArrowRight size={14} />
                </button>
              </article>
            ))}
          </div>

          {filteredAgents.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 20px", color: C.steel }}>
              <Bot size={64} style={{ margin: "0 auto 24px", opacity: 0.3 }} />
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No agents found</div>
              <div style={{ fontSize: 14 }}>Try adjusting your search terms</div>
            </div>
          )}
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        ::selection { background: rgba(172,198,233,0.4); }
      `}}/>
    </div>
  );
}