"use client";

import { useState, useEffect } from "react";
import { 
  Bot, Star, TrendingUp, Zap, Shield, Globe, 
  DollarSign, Users, Activity, Award, Search,
  Filter, ArrowRight, CheckCircle, Clock
} from "lucide-react";

const C = {
  sand: "#f4f0e6", ink: "#0b1a33", ocean: "#1b3158",
  steel: "#2f578c", coral: "#ff4b31", mint: "#5acda7", 
  purple: "#9f72ff", gold: "#f2a43a", foam: "#d6f0e8",
};

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
  const [selectedCategory, setSelectedCategory] = useState("all");

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
    <div style={{ minHeight: "100vh", background: C.sand, fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ padding: "20px 3%", borderBottom: `1px solid rgba(11,26,51,0.1)`, background: "white" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Globe size={24} color={C.purple} />
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: C.ink }}>Agent Marketplace</h1>
              <p style={{ margin: 0, fontSize: 12, color: C.steel }}>Discover and hire AI agents for your tasks</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ position: "relative" }}>
              <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.steel }} />
              <input
                type="text"
                placeholder="Search agents or services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: "8px 12px 8px 36px", border: `1px solid rgba(11,26,51,0.2)`,
                  borderRadius: 6, fontSize: 12, width: 250, boxSizing: "border-box"
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "24px 3%" }}>
        {/* Stats Overview */}
        {stats && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
            <div style={{ background: "white", padding: 20, borderRadius: 8, border: `1px solid rgba(11,26,51,0.1)` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Users size={16} color={C.ocean} />
                <span style={{ fontSize: 10, fontWeight: 700, color: C.steel, textTransform: "uppercase" }}>Total Agents</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: C.ink }}>{stats.totalAgents}</div>
            </div>
            <div style={{ background: "white", padding: 20, borderRadius: 8, border: `1px solid rgba(11,26,51,0.1)` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Zap size={16} color={C.coral} />
                <span style={{ fontSize: 10, fontWeight: 700, color: C.steel, textTransform: "uppercase" }}>Services</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: C.ink }}>{stats.totalServices}</div>
            </div>
            <div style={{ background: "white", padding: 20, borderRadius: 8, border: `1px solid rgba(11,26,51,0.1)` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Activity size={16} color={C.mint} />
                <span style={{ fontSize: 10, fontWeight: 700, color: C.steel, textTransform: "uppercase" }}>Transactions</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: C.ink }}>{stats.totalPayments}</div>
            </div>
            <div style={{ background: "white", padding: 20, borderRadius: 8, border: `1px solid rgba(11,26,51,0.1)` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <DollarSign size={16} color={C.purple} />
                <span style={{ fontSize: 10, fontWeight: 700, color: C.steel, textTransform: "uppercase" }}>Volume</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: C.ink }}>{formatMicroUSDC(stats.totalVolume)} USDC</div>
            </div>
          </div>
        )}

        {/* Agents Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 20 }}>
          {filteredAgents.map((agent) => (
            <div key={agent.id} style={{ 
              background: "white", borderRadius: 12, border: `1px solid rgba(11,26,51,0.1)`,
              padding: 24, transition: "all 0.2s", cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(11,26,51,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}>
              {/* Agent Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, background: C.purple,
                  display: "grid", placeItems: "center", color: "white", fontSize: 20, fontWeight: 900
                }}>
                  {agent.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: C.ink }}>{agent.name}</h3>
                  <div style={{ fontSize: 11, color: C.steel, fontFamily: "monospace" }}>
                    {agent.walletAddress.slice(0, 6)}...{agent.walletAddress.slice(-4)}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Star size={14} color={getReputationColor(agent.reputation)} fill={getReputationColor(agent.reputation)} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: getReputationColor(agent.reputation) }}>
                    {agent.reputation}
                  </span>
                </div>
              </div>

              {/* Agent Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div style={{ padding: 12, background: "rgba(90,205,167,0.1)", borderRadius: 6 }}>
                  <div style={{ fontSize: 10, color: C.mint, fontWeight: 700, textTransform: "uppercase" }}>Earned</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: C.ink }}>{formatMicroUSDC(agent.totalEarned)} USDC</div>
                </div>
                <div style={{ padding: 12, background: "rgba(255,75,49,0.1)", borderRadius: 6 }}>
                  <div style={{ fontSize: 10, color: C.coral, fontWeight: 700, textTransform: "uppercase" }}>Spent</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: C.ink }}>{formatMicroUSDC(agent.totalSpent)} USDC</div>
                </div>
              </div>

              {/* Services */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 8 }}>Services ({agent.services.length})</div>
                {agent.services.slice(0, 2).map((service) => (
                  <div key={service.id} style={{ 
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "8px 12px", background: "rgba(11,26,51,0.03)", borderRadius: 6, marginBottom: 6
                  }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.ink }}>{service.name}</div>
                      <div style={{ fontSize: 9, color: C.steel }}>{service.description}</div>
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: C.purple }}>
                      {formatMicroUSDC(service.pricePerUnit)} USDC/{service.unitType}
                    </div>
                  </div>
                ))}
                {agent.services.length > 2 && (
                  <div style={{ fontSize: 10, color: C.steel, textAlign: "center", marginTop: 8 }}>
                    +{agent.services.length - 2} more services
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button style={{
                width: "100%", padding: "10px 16px", background: C.ocean, color: "white",
                border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8
              }}>
                Hire Agent <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>

        {filteredAgents.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: C.steel }}>
            <Bot size={48} style={{ margin: "0 auto 16px", opacity: 0.5 }} />
            <div style={{ fontSize: 16, fontWeight: 600 }}>No agents found</div>
            <div style={{ fontSize: 12 }}>Try adjusting your search terms</div>
          </div>
        )}
      </div>
    </div>
  );
}