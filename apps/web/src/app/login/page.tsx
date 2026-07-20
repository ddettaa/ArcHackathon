"use client";

import { useState, useEffect, Suspense } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { useRouter, useSearchParams } from "next/navigation";
import { WalletConnect } from "@/components/WalletConnect";
import { Wallet, ArrowRight, Shield, Zap, Bot } from "lucide-react";

const C = {
  sand: "#f4f0e6", ink: "#0b1a33", ocean: "#1b3158",
  steel: "#2f578c", coral: "#ff4b31", mint: "#5acda7", purple: "#9f72ff",
  gold: "#f2a43a", surf: "#acc6e9",
};

function LoginForm() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState("");

  // Get redirect target from URL
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  // Check for existing session
  useEffect(() => {
    const saved = localStorage.getItem("arcgent_session");
    if (saved) {
      try {
        const s = JSON.parse(saved);
        if (s.expiresAt > Date.now()) {
          setSession(s);
          // Auto-redirect if already logged in
          router.push(redirectTo);
        } else localStorage.removeItem("arcgent_session");
      } catch {}
    }
  }, []);

  const handleLogin = async () => {
    if (!address) return;
    setLoading(true);
    setError("");
    
    try {
      const message = `Sign in to ArcGent\n\nWallet: ${address}\nTimestamp: ${Date.now()}`;
      
      // Request wallet signature
      const signature = await signMessageAsync({ message });
      
      // Verify with backend
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: address, signature, message }),
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Verification failed");
      }
      
      const data = await res.json();
      setSession(data);
      localStorage.setItem("arcgent_session", JSON.stringify(data));
      
      // Auto-create agent if not exists
      await fetch("/api/my-agent", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-Wallet-Address": address,
          "Authorization": `Bearer ${data.sessionToken}`,
        },
        body: JSON.stringify({ walletAddress: address }),
      });
      
      // Redirect to original page
      setTimeout(() => router.push(redirectTo), 500);
      
    } catch (e: any) {
      setError(e.message || "Login failed");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem("arcgent_session");
  };

  return (
    <div style={{ minHeight: "100vh", background: C.sand, fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 420, padding: "0 20px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-grid", placeItems: "center", width: 48, height: 48, background: C.ocean, borderRadius: 10, marginBottom: 12 }}>
            <Bot size={24} color="white" />
          </div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: C.ink }}>ArcGent</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: C.steel }}>If This, Then Pay</p>
        </div>

        {!session ? (
          <div style={{ background: "white", padding: 32, borderRadius: 12, border: `1px solid rgba(11,26,51,0.1)` }}>
            <h2 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 800 }}>Sign In</h2>
            <p style={{ margin: "0 0 24px", fontSize: 13, color: C.steel }}>
              Connect your wallet and sign a message to prove ownership. No password needed.
            </p>
            
            {!isConnected ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <WalletConnect />
              </div>
            ) : (
              <div>
                <div style={{ padding: 12, background: "rgba(90,205,167,0.1)", borderRadius: 8, marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.mint }}>✅ Connected</div>
                  <div style={{ fontSize: 11, color: C.steel, marginTop: 4 }}>{address?.slice(0, 6)}...{address?.slice(-4)}</div>
                </div>
                
                {error && (
                  <div style={{ padding: 10, background: "rgba(255,75,49,0.1)", borderRadius: 6, marginBottom: 12, fontSize: 12, color: C.coral }}>
                    {error}
                  </div>
                )}
                
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  style={{
                    width: "100%", padding: "14px", background: C.ocean, color: "white",
                    border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700,
                    cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}
                >
                  {loading ? (
                    <>Signing...</>
                  ) : (
                    <>Sign Message to Login <ArrowRight size={16} /></>
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ background: "white", padding: 32, borderRadius: 12, border: `1px solid rgba(11,26,51,0.1)`, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
            <h2 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 800 }}>Logged In!</h2>
            <div style={{ padding: 12, background: "rgba(159,114,255,0.08)", borderRadius: 8, marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.purple }}>Session Active</div>
              <div style={{ fontSize: 11, color: C.steel, marginTop: 4 }}>{session.walletAddress?.slice(0, 6)}...{session.walletAddress?.slice(-4)}</div>
            </div>
            
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <a
                href="/dashboard"
                style={{
                  padding: "12px 24px", background: C.ocean, color: "white",
                  textDecoration: "none", borderRadius: 6, fontSize: 12, fontWeight: 700,
                }}
              >
                Dashboard
              </a>
              <button
                onClick={handleLogout}
                style={{
                  padding: "12px 24px", background: "none", border: `1px solid rgba(11,26,51,0.2)`,
                  borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer", color: C.steel,
                }}
              >
                Logout
              </button>
            </div>
          </div>
        )}
        
        {/* Features */}
        <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 24 }}>
          <div style={{ textAlign: "center" }}>
            <Shield size={20} color={C.purple} style={{ marginBottom: 4 }} />
            <div style={{ fontSize: 10, color: C.steel }}>Secure</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <Zap size={20} color={C.mint} style={{ marginBottom: 4 }} />
            <div style={{ fontSize: 10, color: C.steel }}>Instant</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <Bot size={20} color={C.ocean} style={{ marginBottom: 4 }} />
            <div style={{ fontSize: 10, color: C.steel }}>AI-Powered</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#f4f0e6", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
