"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const C = {
  sand: "#f4f0e6", ink: "#0b1a33", ocean: "#1b3158",
  steel: "#2f578c", surf: "#acc6e9", coral: "#ff4b31",
  mint: "#5acda7", gold: "#f2a43a", purple: "#9f72ff",
  foam: "#d6f0e8", deep: "#060f1f",
};

// Shared typography: kicker + link
const kicker: React.CSSProperties = { fontSize: 8, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" };
const flink = (color?: string): React.CSSProperties => ({
  display: "inline-flex", gap: 8, alignItems: "center", paddingBottom: 2,
  borderBottom: "1px solid currentColor", fontSize: 8, fontWeight: 900,
  letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none", color: color || "inherit",
});

// Smooth scroll helper
const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#d8d5cc", fontFamily: "'DM Sans', 'Inter', sans-serif", display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 16px 60px" }}>
      {/* FIDELITY FRAME — pixel-accurate to original */}
      <div style={{
        width: "min(100%, 820px)", margin: "0 auto", overflow: "hidden",
        border: "1px solid rgba(11, 26, 51, 0.28)",
        backgroundColor: C.sand,
        backgroundImage: "radial-gradient(rgba(11,26,51,0.08) 0.7px, transparent 0.7px)",
        backgroundSize: "16px 16px",
        color: C.ink,
        boxShadow: "0 32px 80px rgba(11, 26, 51, 0.25)",
        fontFamily: "'DM Sans', 'Inter', sans-serif",
      }}>
        {/* NAV — original grid layout */}
        <header style={{
          display: "grid", gridTemplateColumns: "1fr auto auto", alignItems: "center",
          gap: 30, minHeight: 60, padding: "0 25px",
          position: "sticky", top: 0, zIndex: 50,
          background: scrolled ? "rgba(244,240,230,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          transition: "background 0.3s, backdrop-filter 0.3s",
          borderBottom: `1px solid rgba(11,26,51,0.08)`,
        }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 20, fontWeight: 900, letterSpacing: "-0.05em", color: C.ink, textDecoration: "none" }}>
            <span style={{ display: "grid", placeItems: "center", width: 33, height: 33, color: "white", background: C.ocean, fontSize: 11, letterSpacing: "-0.08em", borderRadius: 4 }}>AG</span>
            ArcGent
          </Link>
          <nav style={{ display: "flex", gap: 28, fontSize: 8, fontWeight: 700, color: C.steel }}>
            {["How It Works", "Use Cases", "Process", "Agent Log"].map((l, i) => (
              <span key={l} onClick={() => scrollTo(["how-it-works", "use-cases", "process", "agent-log"][i])} style={{ cursor: "pointer", transition: "color 0.2s" }} onMouseOver={e => e.currentTarget.style.color = C.ink} onMouseOut={e => e.currentTarget.style.color = ""}>{l}</span>
            ))}
          </nav>
          <Link href="/dashboard" style={{ padding: "11px 15px", color: "white", background: C.coral, fontSize: 8, fontWeight: 900, textTransform: "uppercase", textDecoration: "none", borderRadius: 3, transition: "background 0.2s" }}>
            Launch Agent ↗
          </Link>
        </header>

        {/* HERO — original positioning */}
        <section style={{ position: "relative", minHeight: 515, padding: "11px 25px 0", overflow: "hidden" }}>
          <h1 style={{ position: "relative", zIndex: 3, width: 620, margin: 0, fontSize: 83, fontWeight: 900, letterSpacing: "-0.073em", lineHeight: 0.83 }}>
            When signals fire,<br/>payments flow.
          </h1>
          <div style={{ position: "absolute", left: 27, bottom: 31, zIndex: 4, width: 220, fontSize: 11, lineHeight: 1.25, color: C.ink }}>
            Autonomous agent yang menghubungkan real-world signals ke USDC payments via Arc &amp; Circle.
            <br/><Link href="/dashboard" style={flink(C.ocean)}>Start Building ↗</Link>
          </div>
          <svg style={{ position: "absolute", inset: "107px -15px -18px 175px", zIndex: 2, width: "calc(100% - 150px)", height: 425 }} viewBox="0 0 650 430" fill="none" aria-hidden="true">
            {[[C.ocean, "M20 432C52 341 123 303 236 259C330 223 358 185 373 116C381 79 404 59 444 59H550"],
              [C.mint, "M45 435C75 352 139 319 250 277C350 239 381 196 391 137C397 100 420 81 461 81H560"],
              [C.gold, "M72 438C101 365 155 337 269 295C368 258 400 216 409 158C415 123 438 104 477 104H570"],
              [C.coral, "M99 441C126 379 175 354 286 313C386 276 421 236 428 180C433 146 455 128 493 128H580"],
              [C.purple, "M126 444C151 394 194 372 304 332C405 295 440 257 446 202C450 169 472 153 509 153H590"]].map(([c, d], i) => (
              <path key={i} d={d as string} stroke={c as string} strokeWidth="14" strokeLinecap="round"/>
            ))}
            {[[C.ocean, [[565,59,6],[584,59,7],[605,59,8],[629,59,10]]],
              [C.mint, [[575,81,5],[593,81,6],[613,81,7],[635,81,9]]],
              [C.gold, [[584,104,5],[601,104,6],[620,104,7],[641,104,8]]]].map(([c, pts], i) => (
              <g key={i} fill={c as string}>{(pts as number[][]).map(([cx,cy,r],j)=><circle key={j} cx={cx} cy={cy} r={r}/>)}</g>
            ))}
          </svg>
        </section>

        {/* MANIFESTO */}
        <section style={{ position: "relative", minHeight: 276, padding: "22px 25px", overflow: "hidden", background: C.foam, borderTop: "1px solid rgba(11,26,51,0.22)", borderBottom: "1px solid rgba(11,26,51,0.22)" }}>
          <div style={kicker}>Our Thesis</div>
          <h2 style={{ width: 400, margin: "13px 0 24px", fontSize: 49, lineHeight: 0.86, letterSpacing: "-0.055em" }}>
            Agents don't need permission to <em style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontStyle: "italic" }}>transact.</em>
          </h2>
          <p style={{ width: 220, margin: 0, fontSize: 10, lineHeight: 1.32, color: C.ocean }}>
            ArcGent listens to onchain &amp; offchain signals — merges, bug fixes, API pings — then autonomously routes USDC payments through Circle wallets. No humans in the loop.
          </p>
          <Link href="/dashboard" style={{ ...flink(C.steel), marginTop: 17 }}>Read the protocol ↗</Link>
          <div style={{ position: "absolute", inset: "0 0 0 290px", pointerEvents: "none" }} aria-hidden="true">
            <svg style={{ position: "absolute", inset: "8px 30px 0 0", width: "100%", height: "100%" }} viewBox="0 0 500 270" fill="none">
              <path d="M4 240C85 183 57 130 142 136C218 141 170 54 253 53C347 51 338 201 484 184" stroke={C.ocean} strokeWidth="1.5" strokeDasharray="5 5" opacity="0.65"/>
            </svg>
            {[
              { top:40, right:80, w:18, bg:C.ocean, anim:"2s" },
              { top:90, left:120, w:12, bg:C.coral, anim:"2.5s .5s" },
              { right:140, bottom:70, w:14, bg:C.mint, anim:"3s 1s" },
              { left:180, bottom:50, w:10, bg:C.gold, anim:"2.8s .7s" },
              { top:60, right:200, w:8, bg:C.purple, anim:"2.2s 1.4s" },
            ].map((d, i) => (
              <span key={i} style={{
                position: "absolute", borderRadius: "50%",
                top: d.top, right: d.right, left: d.left as any, bottom: d.bottom as any,
                width: d.w, height: d.w, background: d.bg,
                animation: `signalPulse ${d.anim} infinite`,
              }}/>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" style={{ padding: "20px 25px 6px", background: "color-mix(in srgb, #f4f0e6 96%, white)" }}>
          <div style={{ ...kicker, marginBottom: 8 }}>How ArcGent works</div>
          {[
            { n:"01", c:C.ocean, title:"Listen", desc:"Agent monitors verified signal sources — GitHub events, onchain oracles, flight data, Strava APIs, weather feeds — any structured event stream.", lnk:"Explore signals" },
            { n:"02", c:C.coral, title:"Decide", desc:"LLM-powered decision engine evaluates trigger conditions against user-defined rules. \"If PR merged + label 'bugfix' → pay 50 USDC.\"", lnk:"Explore rules" },
            { n:"03", c:C.mint, title:"Pay", desc:"Circle Agent Stack executes the payment — wallet debit, USDC transfer, settlement confirmed onchain. Nanopayments for sub-cent amounts.", lnk:"Explore payments" },
          ].map((r,i) => (
            <div key={i} style={{ display:"grid", gridTemplateColumns:"42px 1.15fr 0.72fr 0.62fr", gap:12, alignItems:"center", minHeight:91, borderBottom:`1px solid rgba(11,26,51,0.55)`, paddingBottom: i===2?6:0 }}>
              <span style={{ fontSize:18, fontWeight:900, color:r.c }}>{r.n}</span>
              <h3 style={{ margin:0, fontSize:54, letterSpacing:"-0.06em", lineHeight:0.88 }}>{r.title}</h3>
              <div style={{
                height:58, opacity:0.92, backgroundPosition:"center",
                backgroundImage: `radial-gradient(circle, ${r.c} 2.1px, transparent 2.4px)`,
                backgroundSize: "13px 13px",
                maskImage: i===0 ? "linear-gradient(90deg, transparent, black 22%, black 72%, transparent)" :
                           i===1 ? "radial-gradient(ellipse at 35% 50%, black 8%, transparent 70%)" :
                           "linear-gradient(110deg, transparent 3%, black 35%, transparent 91%)",
                ...(i===2?{transform:"skewX(-18deg)"}:{})
              }}/>
              <p style={{ margin:0, fontSize:9, lineHeight:1.34, color:r.c }}>
                {r.desc}<br/>
                <Link href="/dashboard" style={{ ...flink(r.c), marginTop:8 }}>{r.lnk} ↗</Link>
              </p>
            </div>
          ))}
        </section>

        {/* USE CASES */}
        <section id="use-cases" style={{ padding: "15px 25px 22px" }}>
          <div style={kicker}>Use Cases</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:11, marginTop:8 }}>
            {[
              { title:"Bug Bounty", desc:"Auto-pay developers when their PR with \"fix:\" label gets merged. No manual approval.", bg:"rgba(244,240,230,0.86)", color:C.ocean, art:"wave" },
              { title:"Refund AI", desc:"Flight delayed > 2 hours? API ping triggers instant USDC refund to traveler's wallet.", bg:C.coral, color:"white", art:"node" },
              { title:"Tip Stream", desc:"Content hits 1000 reads? Writer gets tipped automatically via Circle Nanopayments.", bg:"rgba(244,240,230,0.86)", color:C.mint, art:"ripple" },
              { title:"Accountability", desc:"Missed gym all week? Your Strava data triggers a penalty payment to your accountability partner.", bg:C.purple, color:"white", art:"arc" },
            ].map((c,i) => (
              <article key={i} style={{
                position:"relative", minHeight:231, padding:12, overflow:"hidden",
                border:"1px solid rgba(11,26,51,0.22)", background:c.bg, color:c.color,
              }}>
                <h4 style={{ position:"relative", zIndex:2, margin:0, fontSize:24, letterSpacing:"-0.045em", color:c.color==="white"?undefined: c.color }}>{c.title}</h4>
                <p style={{ position:"relative", zIndex:2, width:130, marginTop:4, fontSize:8, lineHeight:1.3 }}>{c.desc}</p>
                {c.art==="wave" && <div style={{ position:"absolute", left:-15, right:-15, bottom:35, height:92, backgroundImage:`radial-gradient(circle, ${C.ocean} 1.55px, transparent 1.8px)`, backgroundSize:"7px 7px", clipPath:"polygon(0 58%, 14% 36%, 29% 18%, 46% 28%, 61% 62%, 75% 45%, 89% 58%, 100% 38%, 100% 100%, 0 100%)" }}/>}
                {c.art==="node" && <div style={{ position:"absolute", left:24, bottom:25, width:128, height:128, border:`27px solid ${C.sand}`, borderRadius:"50%" }}><div style={{ position:"absolute", left:32, top:32, width:22, height:22, borderRadius:"50%", background:C.ink }}/></div>}
                {c.art==="ripple" && <div style={{ position:"absolute", right:-12, bottom:25, width:150, height:125, border:`8px double ${C.mint}`, borderRadius:"49% 51% 46% 54%", transform:"rotate(-8deg)", opacity:0.9, boxShadow:`inset 0 0 0 8px ${C.sand}, inset 0 0 0 14px ${C.mint}, inset 0 0 0 21px ${C.sand}, inset 0 0 0 27px ${C.mint}` }}/>}
                {c.art==="arc" && <div style={{ position:"absolute", right:-20, bottom:-55, width:165, height:165, border:`31px solid ${C.ink}`, borderRadius:"50%" }}><div style={{ position:"absolute", inset:23, border:`14px solid ${C.sand}`, borderRadius:"50%" }}/></div>}
                <Link href="/dashboard" style={{ ...flink(c.color), position:"absolute", left:12, bottom:10, zIndex:3, fontSize:7 }}>View case ↗</Link>
              </article>
            ))}
          </div>
          <div style={{ display:"flex", justifyContent:"flex-end", marginTop:8 }}>
            <Link href="/dashboard" style={flink(C.ink)}>All use cases ↗</Link>
          </div>
        </section>

        {/* PROCESS / AGENT LIFECYCLE */}
        <section id="process" style={{ padding: "0 25px 20px" }}>
          <div style={{ ...kicker, marginBottom:12 }}>Agent Lifecycle</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)" }}>
            {[
              { t:"Connect", d:"Wire your signal source via API, webhook, or oracle feed.", c:C.ocean },
              { t:"Configure", d:"Define rules: IF {condition} THEN pay {amount} USDC to {wallet}.", c:C.coral },
              { t:"Verify", d:"Agent validates signal authenticity before triggering payment.", c:C.mint },
              { t:"Settle", d:"USDC transfer executed onchain. Receipt logged. Balance updated.", c:C.purple },
            ].map((s,i) => (
              <div key={i} style={{ position:"relative", minHeight:95, padding:"16px 18px 10px", borderTop:`3px solid ${s.c}` }}>
                <div style={{ position:"absolute", top:-7, left:0, width:10, height:10, border:`2px solid ${C.sand}`, borderRadius:"50%", background:s.c }}/>
                <strong style={{ display:"block", marginBottom:4, fontSize:13 }}>{s.t}</strong>
                <span style={{ display:"block", width:130, fontSize:8, lineHeight:1.3, color:C.steel }}>{s.d}</span>
                <Link href="/dashboard" style={{ ...flink(C.ink), marginTop:10, fontSize:6 }}>Learn ↗</Link>
              </div>
            ))}
          </div>
        </section>

        {/* CTA — Agent-First Economy */}
        <section style={{ display:"grid", gridTemplateColumns:"1.05fr 0.95fr", minHeight:260, overflow:"hidden", background:C.ocean, color:"white", borderBlock:"1px solid rgba(11,26,51,0.28)" }}>
          <div style={{ padding:"28px 27px" }}>
            <div style={kicker}>Agent-First Economy</div>
            <h2 style={{ width:420, margin:"16px 0 18px", fontSize:47, lineHeight:0.85, letterSpacing:"-0.06em" }}>Your agent holds the wallet. Your rules move the money.</h2>
            <p style={{ width:260, fontSize:9, lineHeight:1.34, opacity:0.85 }}>ArcGent runs on Circle Agent Stack. Every agent gets its own wallet. Every rule is auditable. Every payment is instant.</p>
            <Link href="/dashboard" style={{ ...flink(C.surf), marginTop:16 }}>Deploy your first agent ↗</Link>
          </div>
          <div style={{ position:"relative", minHeight:260 }} aria-hidden="true">
            {[{ s:340, c:C.sand },{ s:278, c:C.surf },{ s:216, c:C.mint },{ s:154, c:C.purple },{ s:92, c:C.gold }].map((r,i) => (
              <i key={i} style={{ position:"absolute", left:"50%", top:"50%", borderRadius:"50%", transform:"translate(-50%,-50%)", width:r.s, height:r.s, border:`17px solid ${r.c}`, background:i===4?C.sand:"transparent" }}/>
            ))}
            <span style={{ position:"absolute", zIndex:4, left:"50%", top:"50%", width:94, transform:"translate(-50%,-50%) rotate(-3deg)", textAlign:"center", fontFamily:"monospace", fontSize:8, fontWeight:700, color:C.ink }}>
              SIGNAL IN.<br/>USDC OUT.
            </span>
          </div>
        </section>

        {/* AGENT LOG / NOTES */}
        <section id="agent-log" style={{ padding:"18px 25px 22px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={kicker}>Agent Log</div>
            <Link href="/dashboard" style={flink(C.ink)}>View all ↗</Link>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:11, marginTop:10 }}>
            {[
              { tag:"Protocol", title:"How SignalPay agents verify offchain events", pal: C.ocean, mask: "radial-gradient(ellipse, black 8%, transparent 72%)", linkColor: C.ocean, art: "ocean" },
              { tag:"Engineering", title:"Building agent wallets on Circle Agent Stack", pal: C.coral, linkColor: C.coral, art: "stripes" } as any,
              { tag:"Use Case", title:"The rise of nanopayments in agent economies", pal: C.mint, mask: "linear-gradient(90deg, transparent, black 35%, black 65%, transparent)", linkColor: C.mint, art: "mint" },
              { tag:"Research", title:"Agent-to-agent negotiation: a new primitive", pal: C.purple, mask: "radial-gradient(ellipse at 50% 105%, black 10%, transparent 68%)", linkColor: C.purple, art: "purple" },
            ].map((n,i) => (
              <article key={i} style={{ minHeight:167, padding:8, border:"1px solid rgba(11,26,51,0.18)", background:"rgba(244,240,230,0.72)" }}>
                <div style={{
                  height:72, marginBottom:8,
                  ...(n.art==="ocean" ? { backgroundImage:`radial-gradient(circle, ${C.ocean} 1.6px, transparent 1.9px)`, backgroundSize:"8px 8px", maskImage:"radial-gradient(ellipse, black 8%, transparent 72%)", background: undefined }
                    : n.art==="mint" ? { backgroundImage:`radial-gradient(circle, ${C.mint} 1.6px, transparent 1.9px)`, backgroundSize:"8px 8px", maskImage:"linear-gradient(90deg, transparent, black 35%, black 65%, transparent)", background: undefined }
                    : n.art==="purple" ? { backgroundImage:`radial-gradient(circle, ${C.purple} 1.6px, transparent 1.9px)`, backgroundSize:"8px 8px", maskImage:"radial-gradient(ellipse at 50% 105%, black 10%, transparent 68%)", background: undefined }
                    : { background:`repeating-linear-gradient(135deg, ${C.mint} 0 8px, ${C.sand} 8px 13px, ${C.gold} 13px 21px, ${C.sand} 21px 26px, ${C.coral} 26px 34px, ${C.sand} 34px 39px, ${C.ocean} 39px 47px, ${C.sand} 47px 52px)` }),
                }}/>
                <time style={{ fontSize:6, textTransform:"uppercase", color:C.steel }}>{n.tag}</time>
                <h4 style={{ margin:"5px 0 12px", fontSize:10, lineHeight:1.2 }}>{n.title}</h4>
                <Link href="/dashboard" style={{ ...flink(n.linkColor), fontSize:6 }}>Read ↗</Link>
              </article>
            ))}
          </div>
        </section>

        {/* CLOSING */}
        <section style={{
          display:"grid", gridTemplateColumns:"1.1fr 0.62fr 110px", gap:30,
          alignItems:"center", minHeight:190, padding:"26px 25px",
          borderTop:"1px solid rgba(11,26,51,0.35)",
        }}>
          <h2 style={{ margin:0, fontSize:53, lineHeight:0.85, letterSpacing:"-0.06em" }}>What signal will <em style={{ fontFamily:"Georgia, serif", fontWeight:400 }}>your agent</em> listen for?</h2>
          <div>
            <p style={{ fontSize:10, lineHeight:1.4, color:C.steel }}>From bug bounties to flight refunds — if it can be verified, it can be paid.</p>
            <Link href="/dashboard" style={{ ...flink(C.ocean), marginTop:14 }}>Launch agent ↗</Link>
          </div>
          <div style={{ display:"grid", placeItems:"center", width:96, height:96, color:"white", background:C.ocean, fontSize:30, fontWeight:900, borderRadius:8 }}>AG</div>
        </section>

        {/* FOOTER */}
        <footer style={{
          display:"grid", gridTemplateColumns:"1.2fr 1fr 1fr 1fr 1.1fr", gap:20,
          alignItems:"start", padding:"17px 25px 21px",
          borderTop:"1px solid rgba(11,26,51,0.35)", fontSize:7, lineHeight:1.55, color:C.steel,
        }}>
          <strong style={{ fontSize:13, letterSpacing:"-0.04em", color:C.ink }}>ArcGent</strong>
          <span>Signal-to-payment<br/>autonomous agents.</span>
          <span>LISTEN<br/>DECIDE<br/>PAY</span>
          <span>DOCS<br/>GITHUB<br/>DISCORD</span>
          <span>Built on Arc &amp; Circle<br/>Agent Stack<br/>© 2026</span>
        </footer>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes signalPulse { 0%, 100% { transform: scale(1); opacity: .8; } 50% { transform: scale(2.5); opacity: .15; } }
        ::selection { background: rgba(172,198,233,0.4); }
      `}} />
    </div>
  );
}
