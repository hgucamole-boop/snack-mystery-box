"use client"
import { useState, useEffect, useRef, useCallback } from "react";

// ─── FONTS ────────────────────────────────────────────────────────────────────
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=Archivo+Black&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0d0d1a; }

    .font-bebas { font-family: 'Bebas Neue', sans-serif; }
    .font-mono  { font-family: 'Space Mono', monospace; }
    .font-arch  { font-family: 'Archivo Black', sans-serif; }

    @keyframes titleFlicker {
      0%,100% { filter: drop-shadow(0 0 28px rgba(255,46,99,.6)); }
      45%     { filter: drop-shadow(0 0 55px rgba(255,215,0,.8)) drop-shadow(0 0 80px rgba(255,46,99,.3)); }
      50%     { filter: drop-shadow(0 0 18px rgba(0,217,255,.5)); }
    }
    @keyframes particleDrift {
      0%   { opacity:0; transform:translateY(100vh) rotate(0deg); }
      8%   { opacity:.35; }
      92%  { opacity:.2; }
      100% { opacity:0; transform:translateY(-80px) rotate(720deg); }
    }
    @keyframes mBlink {
      0%,100% { opacity:1; transform:scale(1); }
      50%      { opacity:.25; transform:scale(.8); }
    }
    @keyframes tickerScroll {
      0%   { transform:translateX(0); }
      100% { transform:translateX(-50%); }
    }
    @keyframes spinBtn {
      0%,100% { transform:translateX(0); }
      25%      { transform:translateX(-2px); }
      75%      { transform:translateX(2px); }
    }
    @keyframes reelWinPulse {
      0%,100% { box-shadow:0 0 20px rgba(255,215,0,.5); border-color:#FFD700; }
      50%      { box-shadow:0 0 50px rgba(255,215,0,.9), 0 0 80px rgba(255,46,99,.4); border-color:#FF2E63; }
    }
    @keyframes legendaryWinPulse {
      0%,100% { box-shadow:0 0 30px rgba(255,175,0,.8), 0 0 60px rgba(255,46,99,.4); }
      50%      { box-shadow:0 0 60px rgba(255,215,0,1), 0 0 120px rgba(155,48,255,.6); }
    }
    @keyframes snackReveal {
      from { opacity:0; transform:scale(.5) rotate(-8deg); }
      to   { opacity:1; transform:scale(1) rotate(0deg); }
    }
    @keyframes jackpotFlash {
      0%   { opacity:.6; }
      100% { opacity:0; }
    }
    @keyframes legendaryFlash {
      0%,20%,40%,60%,80%,100% { opacity:.8; }
      10%,30%,50%,70%,90%     { opacity:0; }
    }
    @keyframes shimmer {
      0%   { background-position:-200% center; }
      100% { background-position:200% center; }
    }
    @keyframes floatBadge {
      0%,100% { transform:translateY(0) rotate(-2deg); }
      50%     { transform:translateY(-6px) rotate(2deg); }
    }
    @keyframes scanlines {
      0%   { background-position:0 0; }
      100% { background-position:0 4px; }
    }
    @keyframes rarityPulse {
      0%,100% { opacity:.7; }
      50%     { opacity:1; }
    }
    @keyframes coinSpin {
      0%   { transform:rotateY(0deg); }
      100% { transform:rotateY(360deg); }
    }

    .title-flicker { animation: titleFlicker 4s ease-in-out infinite; }
    .shimmer-text {
      background: linear-gradient(90deg, #FF2E63 0%, #FFD700 30%, #00D9FF 50%, #FFD700 70%, #FF2E63 100%);
      background-size:200% auto;
      -webkit-background-clip:text;
      -webkit-text-fill-color:transparent;
      background-clip:text;
      animation: shimmer 3s linear infinite;
    }
    .reel-winner    { animation: reelWinPulse 0.7s ease-in-out 4; }
    .reel-legendary { animation: legendaryWinPulse 0.6s ease-in-out 5; }
    .snack-reveal   { animation: snackReveal .5s cubic-bezier(.34,1.56,.64,1) both; }
    .jackpot-overlay { animation: jackpotFlash .5s ease-out forwards; }
    .legendary-overlay { animation: legendaryFlash 1.2s ease-out forwards; }
    .float-badge    { animation: floatBadge 3s ease-in-out infinite; }
    .rarity-pulse   { animation: rarityPulse 2s ease-in-out infinite; }

    /* Scanline effect */
    .scanlines::after {
      content:'';
      position:absolute;
      inset:0;
      background: repeating-linear-gradient(
        0deg, transparent, transparent 3px,
        rgba(0,0,0,.12) 3px, rgba(0,0,0,.12) 4px
      );
      pointer-events:none;
      z-index:20;
      border-radius:inherit;
    }

    /* Grid bg */
    .grid-bg {
      background-image:
        linear-gradient(rgba(0,217,255,.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,217,255,.04) 1px, transparent 1px);
      background-size: 40px 40px;
      mask-image: radial-gradient(ellipse at 50% 100%, black 10%, transparent 70%);
    }
  `}</style>
);

// ─── RARITY CONFIG ────────────────────────────────────────────────────────────
const RARITY = {
  common: {
    label: "COMMON",
    color: "#aaaaaa",
    glow: "rgba(170,170,170,0.4)",
    bg: "rgba(170,170,170,0.08)",
    border: "rgba(170,170,170,0.3)",
    badgeBg: "#333",
    weight: 60,
  },
  rare: {
    label: "RARE",
    color: "#00D9FF",
    glow: "rgba(0,217,255,0.5)",
    bg: "rgba(0,217,255,0.08)",
    border: "rgba(0,217,255,0.4)",
    badgeBg: "#001a25",
    weight: 30,
  },
  legendary: {
    label: "LEGENDARY",
    color: "#FFD700",
    glow: "rgba(255,215,0,0.7)",
    bg: "rgba(255,215,0,0.1)",
    border: "rgba(255,215,0,0.6)",
    badgeBg: "#1a1200",
    weight: 10,
  },
};

// ─── SNACK DATA ───────────────────────────────────────────────────────────────
const SNACKS = [
  // COMMON
  { id:1,  name:"GOLD CHIPS",     sub:"Sea Salt & Vinegar",   emoji:"🥔", rarity:"common",    img:"https://placehold.co/100x100/1a1a00/aaaaaa?text=🥔" },
  { id:2,  name:"CHOCO POPS",     sub:"Milk Chocolate",       emoji:"🍫", rarity:"common",    img:"https://placehold.co/100x100/1a0a00/aaaaaa?text=🍫" },
  { id:3,  name:"PRETZEL STIX",   sub:"Honey Mustard",        emoji:"🥨", rarity:"common",    img:"https://placehold.co/100x100/1a1000/aaaaaa?text=🥨" },
  { id:4,  name:"COOKIE DOUGH",   sub:"Birthday Cake",        emoji:"🍪", rarity:"common",    img:"https://placehold.co/100x100/150e00/aaaaaa?text=🍪" },
  { id:5,  name:"CRACK CORN",     sub:"Classic Caramel",      emoji:"🍿", rarity:"common",    img:"https://placehold.co/100x100/150a00/aaaaaa?text=🍿" },
  { id:6,  name:"RICE CRISPY",    sub:"Original",             emoji:"🌾", rarity:"common",    img:"https://placehold.co/100x100/0a0f00/aaaaaa?text=🌾" },
  // RARE
  { id:7,  name:"NEON FIZZ",      sub:"Ultra Sour Candy",     emoji:"⚡", rarity:"rare",      img:"https://placehold.co/100x100/001525/00D9FF?text=⚡" },
  { id:8,  name:"CHILI RINGS",    sub:"Ghost Pepper",         emoji:"🌶️", rarity:"rare",     img:"https://placehold.co/100x100/1f0005/00D9FF?text=🌶️" },
  { id:9,  name:"MINT BLAST",     sub:"Arctic Cool",          emoji:"🌿", rarity:"rare",      img:"https://placehold.co/100x100/001a08/00D9FF?text=🌿" },
  { id:10, name:"SEAWEED CRISP",  sub:"Wasabi Kick",          emoji:"🌊", rarity:"rare",      img:"https://placehold.co/100x100/001408/00D9FF?text=🌊" },
  { id:11, name:"ENERGY GUM",     sub:"Turbo Spearmint",      emoji:"💥", rarity:"rare",      img:"https://placehold.co/100x100/0f0020/00D9FF?text=💥" },
  // LEGENDARY
  { id:12, name:"DRAGON ROLL",    sub:"Fire & Honey",         emoji:"🐉", rarity:"legendary", img:"https://placehold.co/100x100/1a0a00/FFD700?text=🐉" },
  { id:13, name:"COSMIC CRUNCH",  sub:"Galaxy Dust Flavour",  emoji:"🌌", rarity:"legendary", img:"https://placehold.co/100x100/05001a/FFD700?text=🌌" },
  { id:14, name:"GOLD TRUFFLE",   sub:"Black Truffle & Sea Salt", emoji:"✨", rarity:"legendary", img:"https://placehold.co/100x100/1a1400/FFD700?text=✨" },
];

const COMMON    = SNACKS.filter(s => s.rarity === "common");
const RARE      = SNACKS.filter(s => s.rarity === "rare");
const LEGENDARY = SNACKS.filter(s => s.rarity === "legendary");

// weighted random pick (respects rarity weights, excludes already-chosen)
function pickSnack(exclude = [], forceLegendary = false) {
  const pool = SNACKS.filter(s => !exclude.includes(s.id));
  if (forceLegendary) {
    const legPool = pool.filter(s => s.rarity === "legendary");
    if (legPool.length) return legPool[Math.floor(Math.random() * legPool.length)];
  }
  // Build weighted pool
  const weighted = [];
  pool.forEach(s => {
    const w = RARITY[s.rarity].weight;
    for (let i = 0; i < w; i++) weighted.push(s);
  });
  return weighted[Math.floor(Math.random() * weighted.length)];
}

// Build 6 picks; guarantee one legendary in slots 4-6
function buildResults() {
  const chosen = [];
  const usedIds = [];
  for (let i = 0; i < 6; i++) {
    // Force legendary into one of the last 3 slots if none chosen yet
    const isLastThree = i >= 3;
    const noLegendaryYet = !chosen.some(s => s.rarity === "legendary");
    const isLastSlot = i === 5;
    const forceLeg = (isLastSlot && noLegendaryYet) || (isLastThree && noLegendaryYet && Math.random() < 0.45);
    const snack = pickSnack(usedIds, forceLeg);
    chosen.push(snack);
    usedIds.push(snack.id);
  }
  return chosen;
}

// ─── CELL HEIGHT (fixed px — clamp() is CSS-only, can't be used in JS math) ──
const CELL_H = 100; // px — must match the height set on each reel cell below
const RESULT_IDX = 28;

// ─── REEL STRIP BUILDER ───────────────────────────────────────────────────────
function buildStrip(resultSnack) {
  const decoys = Array.from({ length: RESULT_IDX }, () => SNACKS[Math.floor(Math.random() * SNACKS.length)]);
  return [...decoys, resultSnack, resultSnack];
}

// ─── SINGLE REEL ─────────────────────────────────────────────────────────────
function Reel({ reelIdx, isSpinning, result, onDone, spinTrigger }) {
  const stripRef  = useRef(null);
  const animRef   = useRef(null);
  const [displayStrip, setDisplayStrip] = useState(() => buildStrip(result || SNACKS[0]));

  useEffect(() => {
    if (!isSpinning || !result) return;

    // Rebuild strip so the correct snack lands at RESULT_IDX
    const newStrip = buildStrip(result);
    setDisplayStrip(newStrip);

    // Reset strip position synchronously before animating
    if (stripRef.current) stripRef.current.style.transform = "translateY(0px)";

    const stopDelay = 900 + reelIdx * 420;
    const startTime = performance.now();
    let pos = 0;

    if (animRef.current) cancelAnimationFrame(animRef.current);

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / stopDelay);

      // Speed: full until 75% of stopDelay, then ease to near-zero
      const speed = progress > 0.75
        ? CELL_H * 0.6 * (1 - ((progress - 0.75) / 0.25)) + CELL_H * 0.03
        : CELL_H * 0.6;

      pos += speed;

      // Loop pos to avoid flying past the strip
      const loopAt = (RESULT_IDX - 4) * CELL_H;
      if (pos >= loopAt) pos = pos % loopAt;

      if (elapsed >= stopDelay && speed <= CELL_H * 0.05) {
        // Snap exactly to centre of RESULT_IDX cell
        const snapPos = RESULT_IDX * CELL_H;
        if (stripRef.current) stripRef.current.style.transform = `translateY(-${snapPos}px)`;
        onDone(reelIdx);
        return;
      }

      if (stripRef.current) stripRef.current.style.transform = `translateY(-${pos}px)`;
      animRef.current = requestAnimationFrame(tick);
    }

    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [spinTrigger]);

  const r = RARITY[result?.rarity || "common"];

  return (
    <div
      className="scanlines"
      style={{
        width: 100,
        height: CELL_H,
        background: "#000",
        border: `2px solid ${isSpinning ? "#00D9FF" : r.color}`,
        borderRadius: 10,
        overflow: "hidden",          // hides cells outside the window — strip moves via translateY
        position: "relative",
        flexShrink: 0,
        boxShadow: isSpinning
          ? "inset 0 0 20px rgba(0,0,0,.8), 0 0 15px rgba(0,217,255,.3)"
          : `inset 0 0 20px rgba(0,0,0,.8), 0 0 20px ${r.glow}`,
        transition: "border-color .4s, box-shadow .4s",
      }}
    >
      {/* Top/bottom fade */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"30%", background:"linear-gradient(to bottom,rgba(0,0,0,.92),transparent)", zIndex:15, pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"30%", background:"linear-gradient(to top,rgba(0,0,0,.92),transparent)", zIndex:15, pointerEvents:"none" }} />
      {/* Payline */}
      <div style={{ position:"absolute", top:"50%", left:0, right:0, height:2, transform:"translateY(-50%)", background:"#FF2E63", boxShadow:"0 0 10px #FF2E63", zIndex:25, pointerEvents:"none" }} />

      {/* Moving strip — translateY drives the animation, NOT scrollTop */}
      <div ref={stripRef} style={{ display:"flex", flexDirection:"column", willChange:"transform" }}>
        {displayStrip.map((s, i) => (
          <div key={i} style={{
            width: 100,
            height: CELL_H,
            minHeight: CELL_H,
            flexShrink: 0,
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <span style={{ fontSize: 48, lineHeight: 1, userSelect: "none" }} title={s.name}>
              {s.emoji}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── RESULT CARD ──────────────────────────────────────────────────────────────
function ResultCard({ snack, delay }) {
  const r = RARITY[snack.rarity];
  const isLeg = snack.rarity === "legendary";
  return (
    <div
      className="snack-reveal"
      style={{
        animationDelay: `${delay}s`,
        background: isLeg
          ? "linear-gradient(135deg, rgba(255,215,0,.12), rgba(255,46,99,.08))"
          : r.bg,
        border: `1px solid ${r.border}`,
        borderRadius: 14,
        padding: "1rem .75rem",
        textAlign: "center",
        cursor: "default",
        position: "relative",
        transition: "transform .2s, box-shadow .2s",
        boxShadow: isLeg ? `0 0 20px ${r.glow}` : "none",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-5px) scale(1.04)";
        e.currentTarget.style.boxShadow = `0 10px 30px ${r.glow}`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = isLeg ? `0 0 20px ${r.glow}` : "none";
      }}
    >
      {isLeg && (
        <div style={{
          position:"absolute", top:-10, left:"50%", transform:"translateX(-50%)",
          background:"linear-gradient(90deg,#FF2E63,#FFD700,#FF2E63)",
          backgroundSize:"200% auto",
          animation:"shimmer 2s linear infinite",
          color:"#0d0d1a", fontFamily:"'Bebas Neue',sans-serif",
          fontSize:".65rem", letterSpacing:3, padding:".2rem .8rem",
          borderRadius:3, whiteSpace:"nowrap",
        }}>⭐ LEGENDARY</div>
      )}
      <div style={{ fontSize:52, lineHeight:1, marginBottom:".5rem", userSelect:"none" }}>
        {snack.emoji}
      </div>
      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1rem",
        color:r.color, letterSpacing:1, marginBottom:".2rem" }}>{snack.name}</div>
      <div style={{ fontSize:".6rem", color:"rgba(255,245,225,.5)", letterSpacing:1 }}>{snack.sub}</div>
      <div className="rarity-pulse" style={{
        marginTop:".4rem",
        display:"inline-block",
        background:r.badgeBg,
        border:`1px solid ${r.border}`,
        color:r.color,
        fontFamily:"'Space Mono',monospace",
        fontSize:".55rem",
        letterSpacing:2,
        padding:".15rem .5rem",
        borderRadius:3,
      }}>{r.label}</div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function SnackCasino() {
  const [spinCount,   setSpinCount]   = useState(0);
  const [isSpinning,  setIsSpinning]  = useState(false);
  const [results,     setResults]     = useState(null);
  const [spinTrigger, setSpinTrigger] = useState(0);
  const [doneCount,   setDoneCount]   = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [flashType,   setFlashType]   = useState(null); // 'normal' | 'legendary'
  const [luckPct,     setLuckPct]     = useState(0);
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
  }, [doneCount, isSpinning]);

  const spin = () => {
    if (isSpinning) return;
    completedRef.current = false;
    const newResults = buildResults();
    setPendingResults(newResults);
    setResults(newResults);
    setShowResults(false);
    setDoneCount(0);
    setIsSpinning(true);
    setSpinCount(c => c + 1);
    setSpinTrigger(t => t + 1);
    setLuckPct(Math.min(100, luckPct + Math.floor(Math.random() * 30) + 10));
  };

  const reset = () => {
    setShowResults(false);
    setSpinCount(0);
    setLuckPct(0);
  };

  const hasLegendary = results?.some(s => s.rarity === "legendary");

  // ── PARTICLES ──
  const particles = useRef(
    Array.from({ length: 22 }, (_, i) => ({
      emoji: ["🍫","🥔","🐻","⚡","🍿","🌶️","🍪","💥","🎰","🃏","💎","⭐","🐉","🌌","✨"][i % 15],
      left:  Math.random() * 100,
      dur:   6 + Math.random() * 10,
      delay: Math.random() * 12,
      size:  0.7 + Math.random() * 1.2,
    }))
  ).current;

  // ── TICKER ──
  const tickerItems = [
    "SPIN TO WIN","SNACK DROP LIVE","6 SLOTS · 3 RARITIES",
    "3000+ BOXES DELIVERED","LEGENDARY DROPS AVAILABLE",
    "FREE SHIPPING","JOIN THE SNACK CULT","◆ JACKPOT SNACKS INSIDE",
  ];

  // ── LIGHTS ──
  const lightCols = ["#FF2E63","#FFD700","#00D9FF","#7FFF00","#9B30FF"];

  return (
    <>
      <FontLoader />

      {/* ── FLASH OVERLAYS ── */}
      {flashType === "normal" && (
        <div className="jackpot-overlay" style={{
          position:"fixed", inset:0, background:"rgba(255,215,0,.12)",
          zIndex:200, pointerEvents:"none",
        }} />
      )}
      {flashType === "legendary" && (
        <div className="legendary-overlay" style={{
          position:"fixed", inset:0,
          background:"linear-gradient(135deg,rgba(255,46,99,.2),rgba(255,175,0,.2),rgba(155,48,255,.2))",
          zIndex:200, pointerEvents:"none",
        }} />
      )}

      {/* ── FIXED BG ── */}
      <div style={{
        position:"fixed", inset:0, zIndex:0,
        background:`
          radial-gradient(ellipse 80% 60% at 15% 10%, rgba(255,46,99,.14) 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 85% 90%, rgba(0,217,255,.11) 0%, transparent 60%),
          radial-gradient(ellipse 50% 50% at 50% 50%, rgba(155,48,255,.07) 0%, transparent 70%),
          #0d0d1a`,
      }}>
        <div className="grid-bg" style={{ position:"absolute", inset:0 }} />
      </div>

      {/* ── PARTICLES ── */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:1, overflow:"hidden" }}>
        {particles.map((p, i) => (
          <div key={i} style={{
            position:"absolute",
            left:`${p.left}%`,
            fontSize:`${p.size}rem`,
            opacity:0,
            animation:`particleDrift ${p.dur}s ease-in-out infinite`,
            animationDelay:`-${p.delay}s`,
          }}>{p.emoji}</div>
        ))}
      </div>

      {/* ── PAGE ── */}
      <div className="font-mono" style={{
        position:"relative", zIndex:2,
        minHeight:"100vh",
        padding:"2rem 1rem 5rem",
        display:"flex", flexDirection:"column", alignItems:"center",
      }}>

        {/* HEADER */}
        <header style={{ textAlign:"center", marginBottom:"1.5rem" }}>
          <p style={{ fontFamily:"'Space Mono',monospace", fontSize:".7rem", letterSpacing:6,
            color:"#00D9FF", textTransform:"uppercase", marginBottom:".5rem", opacity:.8 }}>
            🎰 SNACKBOX ENTERTAINMENT SYSTEM
          </p>
          <h1 className="font-bebas title-flicker" style={{
            fontSize:"clamp(3.5rem,12vw,8rem)", lineHeight:.85,
            letterSpacing:4,
          }}>
            <span className="shimmer-text">SNACK<br/>CASINO</span>
          </h1>
          <p style={{ fontSize:"clamp(.75rem,2vw,1rem)", color:"rgba(255,245,225,.55)",
            marginTop:".75rem", letterSpacing:1 }}>
            Spin the reels.{" "}
            <span style={{ color:"#FFD700", fontWeight:700 }}>Win your box.</span>{" "}
            Every pull is a surprise.
          </p>

          {/* Rarity legend */}
          <div style={{ display:"flex", justifyContent:"center", gap:"1rem", marginTop:"1rem", flexWrap:"wrap" }}>
            {Object.entries(RARITY).map(([key, r]) => (
              <div key={key} style={{
                display:"flex", alignItems:"center", gap:".4rem",
                background:r.bg, border:`1px solid ${r.border}`,
                borderRadius:6, padding:".25rem .75rem",
              }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:r.color,
                  boxShadow:`0 0 6px ${r.color}` }} />
                <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:".8rem",
                  color:r.color, letterSpacing:2 }}>{r.label}</span>
                <span style={{ fontSize:".6rem", color:"rgba(255,245,225,.4)", letterSpacing:1 }}>
                  {key === "common" ? "60%" : key === "rare" ? "30%" : "10%"}
                </span>
              </div>
            ))}
          </div>
        </header>

        {/* TICKER */}
        <div style={{
          width:"100%", maxWidth:900, overflow:"hidden",
          borderTop:"1px solid rgba(255,215,0,.2)", borderBottom:"1px solid rgba(255,215,0,.2)",
          padding:".45rem 0", marginBottom:"1.5rem",
        }}>
          <div style={{
            display:"flex", whiteSpace:"nowrap",
            animation:"tickerScroll 20s linear infinite",
            fontSize:".7rem", letterSpacing:3, color:"rgba(255,215,0,.55)",
          }}>
            {[...tickerItems, ...tickerItems].map((t, i) => (
              <span key={i} style={{ padding:"0 2rem" }}>
                {t}<span style={{ marginLeft:"2rem", color:"#FF2E63" }}>◆</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── MACHINE ── */}
        <div style={{ width:"100%", maxWidth:900 }}>
          <div style={{
            background:"linear-gradient(160deg,#14142a 0%,#1c1c38 50%,#12121f 100%)",
            border:"3px solid #FF2E63",
            borderRadius:24,
            padding:"clamp(1.5rem,4vw,2.5rem) clamp(1rem,3vw,2rem)",
            position:"relative",
            boxShadow:"0 0 0 1px rgba(255,46,99,.3), 0 0 50px rgba(255,46,99,.2), 0 0 100px rgba(255,46,99,.08), inset 0 1px 0 rgba(255,255,255,.04)",
          }}>

            {/* Corner diamonds */}
            {["◆","◆","◆","◆"].map((d,i) => (
              <div key={i} style={{
                position:"absolute",
                top: i<2 ? "-.7rem" : "auto",
                bottom: i>=2 ? "-.7rem" : "auto",
                left: i%2===0 ? "1.5rem" : "auto",
                right: i%2===1 ? "1.5rem" : "auto",
                fontFamily:"'Bebas Neue',sans-serif",
                fontSize:"1.1rem", color:"#FFD700",
                filter:"drop-shadow(0 0 8px #FFD700)",
              }}>{d}</div>
            ))}

            {/* VERSION BADGE */}
            <div className="float-badge" style={{
              position:"absolute", top:"1rem", right:"1.2rem",
              background:"#FF2E63", color:"white",
              fontFamily:"'Bebas Neue',sans-serif",
              fontSize:".8rem", letterSpacing:2,
              padding:".25rem .8rem", borderRadius:4,
              boxShadow:"0 0 15px rgba(255,46,99,.5)",
            }}>SNACK DROP ◆ V2</div>

            {/* MARQUEE LIGHTS */}
            <div style={{ display:"flex", justifyContent:"center", gap:".5rem", marginBottom:"1.5rem", flexWrap:"wrap" }}>
              {Array.from({ length: 28 }, (_, i) => (
                <div key={i} style={{
                  width:12, height:12, borderRadius:"50%",
                  background: lightCols[i % lightCols.length],
                  boxShadow:`0 0 7px ${lightCols[i % lightCols.length]}`,
                  border:"2px solid rgba(255,255,255,.15)",
                  animation:`mBlink .8s ${(i * 0.07).toFixed(2)}s infinite`,
                }} />
              ))}
            </div>

            {/* PAYLINE LABEL */}
            <div style={{
              textAlign:"center", fontFamily:"'Bebas Neue',sans-serif",
              fontSize:"1.3rem", letterSpacing:4,
              color:"#FFD700", marginBottom:"1.5rem",
              textShadow:"0 0 20px rgba(255,215,0,.5)",
            }}>— SPIN TO BUILD YOUR BOX —</div>

            {/* REELS */}
            <div style={{
              display:"flex", justifyContent:"center",
              gap:"clamp(.4rem,1.5vw,1rem)",
              marginBottom:"1.5rem", flexWrap:"wrap",
            }}>
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:".35rem" }}>
                  <div style={{
                    fontFamily:"'Bebas Neue',sans-serif", fontSize:".7rem",
                    letterSpacing:2, color:"#00D9FF", opacity:.65,
                  }}>SLOT {i + 1}</div>
                  <Reel
                    reelIdx={i}
                    isSpinning={isSpinning}
                    result={results?.[i] || SNACKS[i]}
                    onDone={handleReelDone}
                    spinTrigger={spinTrigger}
                  />
                  {/* Rarity pip under each reel */}
                  {results && !isSpinning && (
                    <div style={{
                      width:8, height:8, borderRadius:"50%",
                      background: RARITY[results[i].rarity].color,
                      boxShadow:`0 0 8px ${RARITY[results[i].rarity].glow}`,
                      transition:"all .4s",
                    }} />
                  )}
                </div>
              ))}
            </div>

            {/* SPIN BUTTON */}
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"1rem" }}>
              <button
                onClick={spin}
                disabled={isSpinning}
                className={isSpinning ? "font-bebas" : "font-bebas"}
                style={{
                  fontSize:"clamp(1.3rem,4vw,1.9rem)",
                  letterSpacing:4,
                  padding:"clamp(.8rem,2vw,1.1rem) clamp(2rem,6vw,4rem)",
                  background: isSpinning
                    ? "linear-gradient(135deg,#c0145a,#FF2E63)"
                    : "linear-gradient(135deg,#FF2E63,#c0145a)",
                  color:"white",
                  border:"3px solid #FFD700",
                  borderRadius:8,
                  cursor: isSpinning ? "not-allowed" : "pointer",
                  boxShadow: isSpinning
                    ? "0 2px 0 #8b0c3a, 0 4px 15px rgba(255,46,99,.4)"
                    : "0 6px 0 #8b0c3a, 0 8px 25px rgba(255,46,99,.5)",
                  transition:"all .15s ease",
                  textShadow:"0 2px 4px rgba(0,0,0,.4)",
                  animation: isSpinning ? "spinBtn .1s infinite" : "none",
                  opacity: isSpinning ? .75 : 1,
                }}
              >
                {isSpinning ? "⚡ SPINNING..." : "🎰 PULL THE LEVER"}
              </button>
              <span style={{ fontSize:".7rem", color:"rgba(255,245,225,.4)", letterSpacing:2 }}>
                SPINS: <span style={{ color:"#FFD700", fontWeight:700 }}>{spinCount}</span>
              </span>
            </div>

            {/* LUCK METER */}
            <div style={{ marginTop:"1.5rem" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:".4rem" }}>
                <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:".85rem", letterSpacing:3, color:"#00D9FF" }}>
                  🔥 LUCK METER
                </span>
                <span style={{ fontSize:".7rem", color:"#FFD700", fontWeight:700 }}>{luckPct}%</span>
              </div>
              <div style={{
                height:8, background:"rgba(255,255,255,.07)",
                borderRadius:99, overflow:"hidden",
                border:"1px solid rgba(0,217,255,.2)",
              }}>
                <div style={{
                  height:"100%", width:`${luckPct}%`,
                  background:"linear-gradient(90deg,#00D9FF,#7FFF00)",
                  borderRadius:99, transition:"width .8s cubic-bezier(.34,1.2,.64,1)",
                  boxShadow:"0 0 10px rgba(0,217,255,.5)",
                }} />
              </div>
            </div>

          </div>{/* end machine-shell */}
        </div>

        {/* ── RESULT PANEL ── */}
        <div style={{
          width:"100%", maxWidth:900,
          marginTop:"2rem",
          opacity: showResults ? 1 : 0,
          transform: showResults ? "translateY(0)" : "translateY(30px)",
          transition:"all .6s cubic-bezier(.34,1.56,.64,1)",
          pointerEvents: showResults ? "all" : "none",
        }}>
          <div style={{
            background: hasLegendary
              ? "linear-gradient(160deg,rgba(255,215,0,.1),rgba(155,48,255,.06))"
              : "linear-gradient(160deg,rgba(255,215,0,.07),rgba(0,217,255,.04))",
            border:`2px solid ${hasLegendary ? "#FFD700" : "#FFD700"}`,
            borderRadius:20,
            padding:"2rem",
            position:"relative",
            boxShadow: hasLegendary
              ? "0 0 0 1px rgba(255,215,0,.2), 0 0 50px rgba(255,215,0,.2), 0 0 100px rgba(155,48,255,.1)"
              : "0 0 0 1px rgba(255,215,0,.15), 0 0 40px rgba(255,215,0,.1)",
          }}>

            {/* Panel header badge */}
            <div style={{
              position:"absolute", top:"-1rem", left:"50%",
              transform:"translateX(-50%)",
              background: hasLegendary
                ? "linear-gradient(90deg,#FF2E63,#FFD700,#FF2E63)"
                : "#FFD700",
              backgroundSize:"200% auto",
              animation: hasLegendary ? "shimmer 2s linear infinite" : "none",
              color:"#0d0d1a",
              fontFamily:"'Bebas Neue',sans-serif",
              fontSize:".95rem", letterSpacing:3,
              padding:".3rem 1.5rem",
              whiteSpace:"nowrap", borderRadius:4,
              boxShadow:"0 4px 15px rgba(255,215,0,.4)",
            }}>
              {hasLegendary ? "⭐ LEGENDARY BOX UNLOCKED ⭐" : "🎰 YOUR SNACK BOX IS READY"}
            </div>

            {/* Result grid */}
            <div style={{
              display:"grid",
              gridTemplateColumns:"repeat(3,1fr)",
              gap:"1rem",
              marginTop:"1rem",
            }}>
              {results?.map((snack, i) => (
                <ResultCard key={snack.id} snack={snack} delay={i * 0.1} />
              ))}
            </div>

            {/* CTAs */}
            <div style={{ display:"flex", gap:"1rem", justifyContent:"center", marginTop:"1.5rem", flexWrap:"wrap" }}>
              <a href="#" style={{
                fontFamily:"'Bebas Neue',sans-serif",
                fontSize:"1.2rem", letterSpacing:3,
                padding:".85rem 2.5rem",
                background:"#FF2E63", color:"white",
                border:"3px solid #FFD700", borderRadius:6,
                textDecoration:"none", cursor:"pointer",
                boxShadow:"6px 6px 0 #00D9FF",
                transition:"all .2s",
                display:"inline-block",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform="translate(3px,3px)"; e.currentTarget.style.boxShadow="3px 3px 0 #00D9FF"; }}
              onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="6px 6px 0 #00D9FF"; }}
              >🛒 CLAIM THIS BOX</a>
              <button
                onClick={reset}
                style={{
                  fontFamily:"'Bebas Neue',sans-serif",
                  fontSize:"1.2rem", letterSpacing:3,
                  padding:".85rem 2rem",
                  background:"transparent", color:"#00D9FF",
                  border:"2px solid #00D9FF", borderRadius:6,
                  cursor:"pointer", transition:"all .2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background="rgba(0,217,255,.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.background="transparent"; }}
              >↺ SPIN AGAIN</button>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}