'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import "../gacha.css";
import { Navbar } from "../components/Navbar";

// ─── CONSTANTS (all deterministic — safe for SSR) ─────────────────────────────
const CELL_H = 100;
const RESULT_IDX = 28;
const LIGHT_COLS = ["#FF2E63","#FFD700","#00D9FF","#7FFF00","#9B30FF"];
const PARTICLE_EMOJIS = ["🍫","🥔","🐻","⚡","🍿","🌶️","🍪","💥","🎰","🃏","💎","⭐","🐉","🌌","✨"];
const TICKER_MSGS = [
  "SPIN TO WIN","SNACK DROP LIVE","6 SLOTS · 3 RARITIES",
  "3000+ BOXES DELIVERED","LEGENDARY DROPS AVAILABLE",
  "FREE SHIPPING","JOIN THE SNACK CULT","◆ JACKPOT SNACKS INSIDE",
];

const RARITY = {
  common:    { label:"COMMON",    weight:60, color:"#aaaaaa", glow:"rgba(170,170,170,0.4)", bg:"rgba(170,170,170,0.08)", border:"rgba(170,170,170,0.3)", badgeBg:"#333"    },
  rare:      { label:"RARE",      weight:30, color:"#00D9FF", glow:"rgba(0,217,255,0.5)",   bg:"rgba(0,217,255,0.08)",   border:"rgba(0,217,255,0.4)",   badgeBg:"#001a25" },
  legendary: { label:"LEGENDARY", weight:10, color:"#FFD700", glow:"rgba(255,215,0,0.7)",   bg:"rgba(255,215,0,0.1)",    border:"rgba(255,215,0,0.6)",   badgeBg:"#1a1200" },
};

const SNACKS = [
  { id:1,  name:"GOLD CHIPS",    sub:"Sea Salt & Vinegar",       emoji:"🥔", rarity:"common"    },
  { id:2,  name:"CHOCO POPS",    sub:"Milk Chocolate",           emoji:"🍫", rarity:"common"    },
  { id:3,  name:"PRETZEL STIX",  sub:"Honey Mustard",            emoji:"🥨", rarity:"common"    },
  { id:4,  name:"COOKIE DOUGH",  sub:"Birthday Cake",            emoji:"🍪", rarity:"common"    },
  { id:5,  name:"CRACK CORN",    sub:"Classic Caramel",          emoji:"🍿", rarity:"common"    },
  { id:6,  name:"RICE CRISPY",   sub:"Original",                 emoji:"🌾", rarity:"common"    },
  { id:7,  name:"NEON FIZZ",     sub:"Ultra Sour Candy",         emoji:"⚡", rarity:"rare"      },
  { id:8,  name:"CHILI RINGS",   sub:"Ghost Pepper",             emoji:"🌶️", rarity:"rare"     },
  { id:9,  name:"MINT BLAST",    sub:"Arctic Cool",              emoji:"🌿", rarity:"rare"      },
  { id:10, name:"SEAWEED CRISP", sub:"Wasabi Kick",              emoji:"🌊", rarity:"rare"      },
  { id:11, name:"ENERGY GUM",    sub:"Turbo Spearmint",          emoji:"💥", rarity:"rare"      },
  { id:12, name:"DRAGON ROLL",   sub:"Fire & Honey",             emoji:"🐉", rarity:"legendary" },
  { id:13, name:"COSMIC CRUNCH", sub:"Galaxy Dust Flavour",      emoji:"🌌", rarity:"legendary" },
  { id:14, name:"GOLD TRUFFLE",  sub:"Black Truffle & Sea Salt", emoji:"✨", rarity:"legendary" },
];

// ─── GAME LOGIC (Math.random only called client-side, inside event handlers / useEffect) ──
function pickSnack(excludeIds = [], forceLegendary = false) {
  const pool = SNACKS.filter(s => !excludeIds.includes(s.id));
  if (forceLegendary) {
    const legPool = pool.filter(s => s.rarity === "legendary");
    if (legPool.length) return legPool[Math.floor(Math.random() * legPool.length)];
  }
  const weighted = [];
  pool.forEach(s => { for (let i = 0; i < RARITY[s.rarity].weight; i++) weighted.push(s); });
  return weighted[Math.floor(Math.random() * weighted.length)];
}

function buildResults() {
  const chosen = [], usedIds = [];
  for (let i = 0; i < 6; i++) {
    const noLegYet = !chosen.some(s => s.rarity === "legendary");
    const forceLeg = (i === 5 && noLegYet) || (i >= 3 && noLegYet && Math.random() < 0.45);
    const snack = pickSnack(usedIds, forceLeg);
    chosen.push(snack);
    usedIds.push(snack.id);
  }
  return chosen;
}

// Called only inside useEffect — never during SSR render
function buildStrip(resultSnack) {
  const decoys = Array.from({ length: RESULT_IDX }, () => SNACKS[Math.floor(Math.random() * SNACKS.length)]);
  return [...decoys, resultSnack, resultSnack];
}

// ─── REEL ─────────────────────────────────────────────────────────────────────
function Reel({ reelIdx, result, onDone, spinTrigger }) {
  const stripRef = useRef(null);
  const animRef  = useRef(null);

  // null on server AND on first client render → identical HTML, no mismatch
  const [strip, setStrip] = useState(null);

  // Populate strip after mount (client-only)
  useEffect(() => {
    setStrip(buildStrip(result || SNACKS[0]));
  // We only want this to run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Animate on each spin
  useEffect(() => {
    if (spinTrigger === 0 || !result) return;

    const newStrip = buildStrip(result);
    setStrip(newStrip);

    // Wait one frame so React has flushed the new strip before we move it
    const raf = requestAnimationFrame(() => {
      if (stripRef.current) stripRef.current.style.transform = "translateY(0px)";

      const stopDelay = 900 + reelIdx * 420;
      const startTime = performance.now();
      let pos = 0;

      if (animRef.current) cancelAnimationFrame(animRef.current);

      function tick(now) {
        const elapsed  = now - startTime;
        const progress = Math.min(1, elapsed / stopDelay);
        const speed    = progress > 0.75
          ? CELL_H * 0.6 * (1 - (progress - 0.75) / 0.25) + CELL_H * 0.03
          : CELL_H * 0.6;

        pos += speed;

        const loopAt = (RESULT_IDX - 4) * CELL_H;
        if (pos >= loopAt) pos = pos % loopAt;

        if (elapsed >= stopDelay && speed <= CELL_H * 0.05) {
          if (stripRef.current) stripRef.current.style.transform = `translateY(-${RESULT_IDX * CELL_H}px)`;
          onDone(reelIdx);
          return;
        }

        if (stripRef.current) stripRef.current.style.transform = `translateY(-${pos}px)`;
        animRef.current = requestAnimationFrame(tick);
      }

      animRef.current = requestAnimationFrame(tick);
    });

    return () => {
      cancelAnimationFrame(raf);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinTrigger]);

  const r = RARITY[result?.rarity ?? "common"];

  return (
    <div className="casino-scanlines" style={{
      width: CELL_H, height: CELL_H,
      background: "#000",
      border: `2px solid ${r.color}`,
      borderRadius: 10,
      overflow: "hidden",
      position: "relative",
      flexShrink: 0,
      boxShadow: `inset 0 0 20px rgba(0,0,0,.8), 0 0 20px ${r.glow}`,
      transition: "border-color .4s, box-shadow .4s",
    }}>
      {/* Fades */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"30%", background:"linear-gradient(to bottom,rgba(0,0,0,.92),transparent)", zIndex:15, pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"30%", background:"linear-gradient(to top,rgba(0,0,0,.92),transparent)", zIndex:15, pointerEvents:"none" }} />
      {/* Payline */}
      <div style={{ position:"absolute", top:"50%", left:0, right:0, height:2, transform:"translateY(-50%)", background:"#FF2E63", boxShadow:"0 0 10px #FF2E63", zIndex:25, pointerEvents:"none" }} />

      {/* Strip */}
      <div ref={stripRef} style={{ display:"flex", flexDirection:"column", willChange:"transform" }}>
        {strip
          ? strip.map((s, i) => (
              <div key={i} style={{ width:CELL_H, height:CELL_H, minHeight:CELL_H, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontSize:48, lineHeight:1, userSelect:"none" }}>{s.emoji}</span>
              </div>
            ))
          // SSR + pre-hydration placeholder — static, deterministic
          : (
              <div style={{ width:CELL_H, height:CELL_H, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontSize:48, lineHeight:1, userSelect:"none" }}>🎰</span>
              </div>
            )
        }
      </div>
    </div>
  );
}

// ─── RESULT CARD ──────────────────────────────────────────────────────────────
function ResultCard({ snack, delay }) {
  const r     = RARITY[snack.rarity];
  const isLeg = snack.rarity === "legendary";
  return (
    <div
      className="casino-snack-reveal"
      style={{
        animationDelay:`${delay}s`,
        background: isLeg ? "linear-gradient(135deg,rgba(255,215,0,.12),rgba(255,46,99,.08))" : r.bg,
        border:`1px solid ${r.border}`, borderRadius:14,
        padding:"1rem .75rem", textAlign:"center", position:"relative",
        transition:"transform .2s, box-shadow .2s",
        boxShadow: isLeg ? `0 0 20px ${r.glow}` : "none",
        cursor:"default",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform="translateY(-5px) scale(1.04)"; e.currentTarget.style.boxShadow=`0 10px 30px ${r.glow}`; }}
      onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=isLeg?`0 0 20px ${r.glow}`:"none"; }}
    >
      {isLeg && (
        <div style={{ position:"absolute", top:-10, left:"50%", transform:"translateX(-50%)", background:"linear-gradient(90deg,#FF2E63,#FFD700,#FF2E63)", backgroundSize:"200% auto", animation:"shimmer 2s linear infinite", color:"#0d0d1a", fontFamily:"'Bebas Neue',sans-serif", fontSize:".65rem", letterSpacing:3, padding:".2rem .8rem", borderRadius:3, whiteSpace:"nowrap" }}>
          ⭐ LEGENDARY
        </div>
      )}
      <div style={{ fontSize:52, lineHeight:1, marginBottom:".5rem", userSelect:"none" }}>{snack.emoji}</div>
      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1rem", color:r.color, letterSpacing:1, marginBottom:".2rem" }}>{snack.name}</div>
      <div style={{ fontSize:".6rem", color:"rgba(255,245,225,.5)", letterSpacing:1 }}>{snack.sub}</div>
      <div className="casino-rarity-pulse" style={{ marginTop:".4rem", display:"inline-block", background:r.badgeBg, border:`1px solid ${r.border}`, color:r.color, fontFamily:"'Space Mono',monospace", fontSize:".55rem", letterSpacing:2, padding:".15rem .5rem", borderRadius:3 }}>
        {r.label}
      </div>
    </div>
  );
}

// ─── PARTICLES (client-only — generated in useEffect, renders nothing on server) ──
function Particles() {
  const [list, setList] = useState([]);
  useEffect(() => {
    setList(Array.from({ length: 22 }, (_, i) => ({
      id: i,
      emoji: PARTICLE_EMOJIS[i % PARTICLE_EMOJIS.length],
      left:  Math.random() * 100,
      dur:   6 + Math.random() * 10,
      delay: Math.random() * 12,
      size:  0.7 + Math.random() * 1.2,
    })));
  }, []);

  if (list.length === 0) return null;

  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:1, overflow:"hidden" }}>
      {list.map(p => (
        <div key={p.id} style={{ position:"absolute", left:`${p.left}%`, fontSize:`${p.size}rem`, opacity:0, animation:`particleDrift ${p.dur}s ease-in-out infinite`, animationDelay:`-${p.delay}s` }}>
          {p.emoji}
        </div>
      ))}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function SnackCasino() {
  const [spinCount,      setSpinCount]      = useState(0);
  const [isSpinning,     setIsSpinning]     = useState(false);
  const [results,        setResults]        = useState(null);
  const [spinTrigger,    setSpinTrigger]    = useState(0);
  const [doneCount,      setDoneCount]      = useState(0);
  const [showResults,    setShowResults]    = useState(false);
  const [flashType,      setFlashType]      = useState(null);
  const [luckPct,        setLuckPct]        = useState(0);
  const [pendingResults, setPendingResults] = useState(null);
  const completedRef = useRef(false);

  const handleReelDone = useCallback(() => {
    setDoneCount(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (doneCount === 6 && isSpinning && !completedRef.current) {
      completedRef.current = true;
      const hasLeg = pendingResults?.some(s => s.rarity === "legendary");
      setFlashType(hasLeg ? "legendary" : "normal");
      setTimeout(() => setFlashType(null), 1000);
      setTimeout(() => {
        setResults(pendingResults);
        setShowResults(true);
        setIsSpinning(false);
      }, 400);
    }
  }, [doneCount, isSpinning, pendingResults]);

  const spin = () => {
    if (isSpinning) return;
    completedRef.current = false;
    const nr = buildResults();
    setPendingResults(nr);
    setShowResults(false);
    setDoneCount(0);
    setIsSpinning(true);
    setSpinCount(c => c + 1);
    setSpinTrigger(t => t + 1);
    setLuckPct(prev => Math.min(100, prev + Math.floor(Math.random() * 30) + 10));
  };

  const reset = () => { setShowResults(false); setResults(null); setSpinCount(0); setLuckPct(0); };

  const hasLegendary = results?.some(s => s.rarity === "legendary");

  return (
    <>
      {/* Flash overlays — driven by client state only, not rendered on server */}
      {flashType === "normal"    && <div className="casino-jackpot-flash"   style={{ position:"fixed", inset:0, background:"rgba(255,215,0,.12)", zIndex:200, pointerEvents:"none" }} />}
      {flashType === "legendary" && <div className="casino-legendary-flash" style={{ position:"fixed", inset:0, background:"linear-gradient(135deg,rgba(255,46,99,.2),rgba(255,175,0,.2),rgba(155,48,255,.2))", zIndex:200, pointerEvents:"none" }} />}

      {/* Background */}
      <div style={{ position:"fixed", inset:0, zIndex:0, background:"radial-gradient(ellipse 80% 60% at 15% 10%,rgba(255,46,99,.14) 0%,transparent 60%),radial-gradient(ellipse 60% 50% at 85% 90%,rgba(0,217,255,.11) 0%,transparent 60%),radial-gradient(ellipse 50% 50% at 50% 50%,rgba(155,48,255,.07) 0%,transparent 70%),#0d0d1a" }}>
        <div className="casino-grid-bg" style={{ position:"absolute", inset:0 }} />
      </div>

      <Particles />
      <Navbar/>

      <div style={{ fontFamily:"'Space Mono',monospace", position:"relative", zIndex:2, minHeight:"100vh", padding:"2rem 1rem 5rem", display:"flex", flexDirection:"column", alignItems:"center" }}>

        {/* Header */}
        <header style={{ textAlign:"center", marginBottom:"1.5rem", marginTop: "100px" }}>
          <h1 className="casino-title-flicker" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(3.5rem,12vw,8rem)", lineHeight:.85, letterSpacing:4 }}>
            <span className="casino-shimmer-text">SNACK<br/>CASINO</span>
          </h1>
          <p style={{ fontSize:"clamp(.75rem,2vw,1rem)", color:"rgba(255,245,225,.55)", marginTop:".75rem", letterSpacing:1 }}>
            Check out what's in our drop this month. <span style={{ color:"#FFD700", fontWeight:700 }}>Preview your box.</span> Every pull is a surprise.
          </p>
          {/* Rarity legend */}
          <div style={{ display:"flex", justifyContent:"center", gap:"1rem", marginTop:"1rem", flexWrap:"wrap" }}>
            {/* {(["common","rare","legendary"]).map(key => {
              const r = RARITY[key];
              return (
                <div key={key} style={{ display:"flex", alignItems:"center", gap:".4rem", background:r.bg, border:`1px solid ${r.border}`, borderRadius:6, padding:".25rem .75rem" }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:r.color, boxShadow:`0 0 6px ${r.color}` }} />
                  <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:".8rem", color:r.color, letterSpacing:2 }}>{r.label}</span>
                  <span style={{ fontSize:".6rem", color:"rgba(255,245,225,.4)", letterSpacing:1 }}>
                    {key === "common" ? "60%" : key === "rare" ? "30%" : "10%"}
                  </span>
                </div>
              );
            })} */}
          </div>
        </header>

        {/* Ticker — TICKER_MSGS doubled as a static literal; identical on server and client */}
        <div style={{ width:"100%", maxWidth:900, overflow:"hidden", borderTop:"1px solid rgba(255,215,0,.2)", borderBottom:"1px solid rgba(255,215,0,.2)", padding:".45rem 0", marginBottom:"1.5rem" }}>
          <div style={{ display:"flex", whiteSpace:"nowrap", animation:"tickerScroll 20s linear infinite", fontSize:".7rem", letterSpacing:3, color:"rgba(255,215,0,.55)" }}>
            {[...TICKER_MSGS, ...TICKER_MSGS].map((t, i) => (
              <span key={i} style={{ padding:"0 2rem" }}>{t}<span style={{ marginLeft:"2rem", color:"#FF2E63" }}>◆</span></span>
            ))}
          </div>
        </div>

        {/* Machine */}
        <div style={{ width:"100%", maxWidth:900 }}>
          <div style={{ background:"linear-gradient(160deg,#14142a 0%,#1c1c38 50%,#12121f 100%)", border:"3px solid #FF2E63", borderRadius:24, padding:"clamp(1.5rem,4vw,2.5rem) clamp(1rem,3vw,2rem)", position:"relative", boxShadow:"0 0 0 1px rgba(255,46,99,.3),0 0 50px rgba(255,46,99,.2),0 0 100px rgba(255,46,99,.08),inset 0 1px 0 rgba(255,255,255,.04)" }}>

            {/* Corner diamonds */}
            {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v,h],i) => (
              <div key={i} style={{ position:"absolute", [v]:"-.7rem", [h]:"1.5rem", fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.1rem", color:"#FFD700", filter:"drop-shadow(0 0 8px #FFD700)" }}>◆</div>
            ))}

            <div className="casino-float-badge" style={{ position:"absolute", top:"1rem", right:"1.2rem", background:"#FF2E63", color:"white", fontFamily:"'Bebas Neue',sans-serif", fontSize:".8rem", letterSpacing:2, padding:".25rem .8rem", borderRadius:4, boxShadow:"0 0 15px rgba(255,46,99,.5)" }}>
              SNACK DROP ◆ V2
            </div>

            {/* Marquee lights — Array.from length is a static literal → identical on server & client */}
            <div style={{ display:"flex", justifyContent:"center", gap:".5rem", marginBottom:"1.5rem", flexWrap:"wrap" }}>
              {Array.from({ length: 28 }, (_, i) => (
                <div key={i} style={{ width:12, height:12, borderRadius:"50%", background:LIGHT_COLS[i%LIGHT_COLS.length], boxShadow:`0 0 7px ${LIGHT_COLS[i%LIGHT_COLS.length]}`, border:"2px solid rgba(255,255,255,.15)", animation:`mBlink .8s ${(i*0.07).toFixed(2)}s infinite` }} />
              ))}
            </div>

            <div style={{ textAlign:"center", fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.3rem", letterSpacing:4, color:"#FFD700", marginBottom:"1.5rem", textShadow:"0 0 20px rgba(255,215,0,.5)" }}>
              — SPIN TO BUILD YOUR BOX —
            </div>

            {/* Reels */}
            <div style={{ display:"flex", justifyContent:"center", gap:"clamp(.4rem,1.5vw,1rem)", marginBottom:"1.5rem", flexWrap:"wrap" }}>
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:".35rem" }}>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:".7rem", letterSpacing:2, color:"#00D9FF", opacity:.65 }}>SLOT {i+1}</div>
                  <Reel
                    reelIdx={i}
                    result={pendingResults?.[i] ?? SNACKS[i]}
                    onDone={handleReelDone}
                    spinTrigger={spinTrigger}
                  />
                  {/* Pip: always render a fixed-size box to avoid layout shift */}
                  <div style={{ width:8, height:8, borderRadius:"50%", background: results && !isSpinning ? RARITY[results[i].rarity].color : "transparent", boxShadow: results && !isSpinning ? `0 0 8px ${RARITY[results[i].rarity].glow}` : "none", transition:"all .4s" }} />
                </div>
              ))}
            </div>

            {/* Spin button */}
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"1rem" }}>
              <button onClick={spin} disabled={isSpinning} style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(1.3rem,4vw,1.9rem)", letterSpacing:4, padding:"clamp(.8rem,2vw,1.1rem) clamp(2rem,6vw,4rem)", background:isSpinning?"linear-gradient(135deg,#c0145a,#FF2E63)":"linear-gradient(135deg,#FF2E63,#c0145a)", color:"white", border:"3px solid #FFD700", borderRadius:8, cursor:isSpinning?"not-allowed":"pointer", boxShadow:isSpinning?"0 2px 0 #8b0c3a,0 4px 15px rgba(255,46,99,.4)":"0 6px 0 #8b0c3a,0 8px 25px rgba(255,46,99,.5)", transition:"all .15s ease", textShadow:"0 2px 4px rgba(0,0,0,.4)", animation:isSpinning?"spinBtn .1s infinite":"none", opacity:isSpinning?.75:1 }}>
                {isSpinning ? "⚡ SPINNING..." : "🎰 PULL THE LEVER"}
              </button>
              <span style={{ fontSize:".7rem", color:"rgba(255,245,225,.4)", letterSpacing:2 }}>
                SPINS: <span style={{ color:"#FFD700", fontWeight:700 }}>{spinCount}</span>
              </span>
            </div>

            {/* Luck meter */}
            <div style={{ marginTop:"1.5rem" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:".4rem" }}>
                <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:".85rem", letterSpacing:3, color:"#00D9FF" }}>🔥 LUCK METER</span>
                <span style={{ fontSize:".7rem", color:"#FFD700", fontWeight:700 }}>{luckPct}%</span>
              </div>
              <div style={{ height:8, background:"rgba(255,255,255,.07)", borderRadius:99, overflow:"hidden", border:"1px solid rgba(0,217,255,.2)" }}>
                <div style={{ height:"100%", width:`${luckPct}%`, background:"linear-gradient(90deg,#00D9FF,#7FFF00)", borderRadius:99, transition:"width .8s cubic-bezier(.34,1.2,.64,1)", boxShadow:"0 0 10px rgba(0,217,255,.5)" }} />
              </div>
            </div>

          </div>
        </div>

        {/* Result panel */}
        <div style={{ width:"100%", maxWidth:900, marginTop:"2rem", opacity:showResults?1:0, transform:showResults?"translateY(0)":"translateY(30px)", transition:"all .6s cubic-bezier(.34,1.56,.64,1)", pointerEvents:showResults?"all":"none" }}>
          <div style={{ background:hasLegendary?"linear-gradient(160deg,rgba(255,215,0,.1),rgba(155,48,255,.06))":"linear-gradient(160deg,rgba(255,215,0,.07),rgba(0,217,255,.04))", border:"2px solid #FFD700", borderRadius:20, padding:"2rem", position:"relative", boxShadow:hasLegendary?"0 0 0 1px rgba(255,215,0,.2),0 0 50px rgba(255,215,0,.2),0 0 100px rgba(155,48,255,.1)":"0 0 0 1px rgba(255,215,0,.15),0 0 40px rgba(255,215,0,.1)" }}>
            <div style={{ position:"absolute", top:"-1rem", left:"50%", transform:"translateX(-50%)", background:hasLegendary?"linear-gradient(90deg,#FF2E63,#FFD700,#FF2E63)":"#FFD700", backgroundSize:"200% auto", animation:hasLegendary?"shimmer 2s linear infinite":"none", color:"#0d0d1a", fontFamily:"'Bebas Neue',sans-serif", fontSize:".95rem", letterSpacing:3, padding:".3rem 1.5rem", whiteSpace:"nowrap", borderRadius:4, boxShadow:"0 4px 15px rgba(255,215,0,.4)" }}>
              {hasLegendary ? "⭐ LEGENDARY BOX UNLOCKED ⭐" : "🎰 YOUR SNACK BOX IS READY"}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1rem", marginTop:"1rem" }}>
              {results?.map((snack, i) => <ResultCard key={snack.id} snack={snack} delay={i*0.1} />)}
            </div>
            <div style={{ display:"flex", gap:"1rem", justifyContent:"center", marginTop:"1.5rem", flexWrap:"wrap" }}>
              <a href="#" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.2rem", letterSpacing:3, padding:".85rem 2.5rem", background:"#FF2E63", color:"white", border:"3px solid #FFD700", borderRadius:6, textDecoration:"none", boxShadow:"6px 6px 0 #00D9FF", transition:"all .2s", display:"inline-block" }}
                onMouseEnter={e=>{e.currentTarget.style.transform="translate(3px,3px)";e.currentTarget.style.boxShadow="3px 3px 0 #00D9FF";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="6px 6px 0 #00D9FF";}}
              >🛒 CLAIM THIS BOX</a>
              <button onClick={reset} style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.2rem", letterSpacing:3, padding:".85rem 2rem", background:"transparent", color:"#00D9FF", border:"2px solid #00D9FF", borderRadius:6, cursor:"pointer", transition:"all .2s" }}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(0,217,255,.1)";}}
                onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}
              >↺ SPIN AGAIN</button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}