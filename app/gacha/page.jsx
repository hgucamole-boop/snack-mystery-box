'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import "@/styles/gacha.css";
import { Navbar } from "../components/Navbar";
import { snacks as SNACKS, rarity as RARITY } from "../../data/products"

// ─── CONSTANTS (all deterministic — safe for SSR) ─────────────────────────────
const CELL_H = 100;
const RESULT_IDX = 28;
const LIGHT_COLS = ["#2f855a", "#d3a84d", "#3f8f76", "#78a64f"];
const PARTICLE_EMOJIS = ["🍫", "🥔", "🍿", "🌶️", "🍪", "🌿", "🌾", "🍃"];
const TICKER_MSGS = [
  "SPIN TO WIN", "SNACK DROP LIVE", "6 SLOTS · 3 RARITIES",
  "3000+ BOXES DELIVERED", "LEGENDARY DROPS AVAILABLE",
  "FREE SHIPPING", "SUSTAINABLE SNACK PICKS", "◆ SEASONAL SNACKS INSIDE",
];
// Add this constant near the top with your other constants
const BOX_PRICE = 199.99; // adjust as needed

// Add this helper — total value of the rolled results
function calcBoxValue(results) {
  return results?.reduce((sum, s) => sum + (s.numericValue * s.multiple), 0) ?? 0;
}

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

// ─── REUSABLE SnackImage component — image with emoji fallback ────────────────
function SnackImage({ snack, size = 64, reelMode = false }) {
  const [imgFailed, setImgFailed] = useState(false);

  if (!snack.image || imgFailed) {
    // Emoji fallback
    const randomEmoji = PARTICLE_EMOJIS[Math.floor(Math.random() * PARTICLE_EMOJIS.length)];
    return (
      <span style={{ fontSize: reelMode ? 48 : size * 0.75, lineHeight: 1, userSelect: "none" }}>
        {randomEmoji}
      </span>
    );
  }

  return (
    <img
      src={snack.image}
      alt={snack.name}
      onError={() => setImgFailed(true)}
      style={{
        width: reelMode ? 72 : size,
        height: reelMode ? 72 : size,
        objectFit: "contain",
        // Drop shadow tinted to rarity color for visual pop
        filter: `drop-shadow(0 2px 6px ${RARITY[snack.rarity].glow})`,
        userSelect: "none",
        pointerEvents: "none",
        margin: "16px"
      }}
    />
  );
}

// ─── REEL ─────────────────────────────────────────────────────────────────────
function Reel({ reelIdx, result, onDone, spinTrigger }) {
  const stripRef = useRef(null);
  const animRef = useRef(null);

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
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / stopDelay);
        const speed = progress > 0.75
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
      background: "#f4faf2",
      border: `2px solid ${r.color}`,
      borderRadius: 10,
      overflow: "hidden",
      position: "relative",
      flexShrink: 0,
      boxShadow: `inset 0 0 16px rgba(24,52,42,.16), 0 0 16px ${r.glow}`,
      transition: "border-color .4s, box-shadow .4s",
    }}>
      {/* Fades */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "30%", background: "linear-gradient(to bottom,rgba(24,52,42,.28),transparent)", zIndex: 15, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "30%", background: "linear-gradient(to top,rgba(24,52,42,.28),transparent)", zIndex: 15, pointerEvents: "none" }} />
      {/* Payline */}
      <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 2, transform: "translateY(-50%)", background: "#2f855a", boxShadow: "0 0 8px rgba(47,133,90,.45)", zIndex: 25, pointerEvents: "none" }} />

      {/* Strip */}
      <div ref={stripRef} style={{ display: "flex", flexDirection: "column", willChange: "transform" }}>
        {strip
          ? strip.map((s, i) => (
            <div key={i} style={{ width: CELL_H, height: CELL_H, minHeight: CELL_H, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <SnackImage snack={s} reelMode />
            </div>
          ))
          // SSR + pre-hydration placeholder — static, deterministic
          : (
            <div style={{ width: CELL_H, height: CELL_H, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 48, lineHeight: 1, userSelect: "none" }}>🎰</span>
            </div>
          )
        }
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
      className="casino-snack-reveal"
      style={{
        animationDelay: `${delay}s`,
        background: isLeg ? "linear-gradient(135deg,rgba(255,215,0,.12),rgba(255,46,99,.08))" : r.bg,
        border: `1px solid ${r.border}`, borderRadius: 14,
        padding: "1rem .75rem", textAlign: "center", position: "relative",
        transition: "transform .2s, box-shadow .2s",
        boxShadow: isLeg ? `0 0 20px ${r.glow}` : "none",
        cursor: "default",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px) scale(1.04)"; e.currentTarget.style.boxShadow = `0 10px 30px ${r.glow}`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = isLeg ? `0 0 20px ${r.glow}` : "none"; }}
    >
      {isLeg && (
        <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(90deg,#FF2E63,#FFD700,#FF2E63)", backgroundSize: "200% auto", animation: "shimmer 2s linear infinite", color: "#0d0d1a", fontFamily: "'Bebas Neue',sans-serif", fontSize: ".65rem", letterSpacing: 3, padding: ".2rem .8rem", borderRadius: 3, whiteSpace: "nowrap" }}>
          ⭐ LEGENDARY
        </div>
      )}

      
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: ".5rem" }}>
        <SnackImage snack={snack} size={80} />
      </div>
      <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1rem", color: r.color, letterSpacing: 1, marginBottom: ".2rem" }}>{snack.name} x {snack.multiple}</div>
      <div className="casino-rarity-pulse" style={{ marginTop: ".4rem", display: "inline-block", background: r.badgeBg, border: `1px solid ${r.border}`, color: r.color, fontFamily: "'Space Mono',monospace", fontSize: ".55rem", letterSpacing: 2, padding: ".15rem .5rem", borderRadius: 3 }}>
        {r.label}
      </div>
    </div>
  );
}

// ─── PARTICLES (client-only — generated in useEffect, renders nothing on server) ──
function Particles() {
  const [list, setList] = useState([]);
  useEffect(() => {
    setList(Array.from({ length: 8 }, (_, i) => ({
      id: i,
      emoji: PARTICLE_EMOJIS[i % PARTICLE_EMOJIS.length],
      left: Math.random() * 100,
      dur: 10 + Math.random() * 12,
      delay: Math.random() * 12,
      size: 0.8 + Math.random() * 0.6,
    })));
  }, []);

  if (list.length === 0) return null;

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" }}>
      {list.map(p => (
        <div key={p.id} style={{ position: "absolute", left: `${p.left}%`, fontSize: `${p.size}rem`, opacity: 0, animation: `particleDrift ${p.dur}s ease-in-out infinite`, animationDelay: `-${p.delay}s` }}>
          {p.emoji}
        </div>
      ))}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function SnackCasino() {
  const [spinCount, setSpinCount] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [results, setResults] = useState(null);
  const [spinTrigger, setSpinTrigger] = useState(0);
  const [doneCount, setDoneCount] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [luckPct, setLuckPct] = useState(0);
  const [pendingResults, setPendingResults] = useState(null);
  const completedRef = useRef(false);

  const handleReelDone = useCallback(() => {
    setDoneCount(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (doneCount === 6 && isSpinning && !completedRef.current) {
      completedRef.current = true;
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

    const totalValue = calcBoxValue(results);
  const savings = totalValue - BOX_PRICE;
  const savingsPct = Math.round((savings / totalValue) * 100);
  const isGoodDeal = savings > 0;

  return (
    <>
      {/* Background */}
      <div className="fixed inset-0 z-0" style={{ background: "radial-gradient(ellipse 80% 60% at 15% 10%,rgba(47,133,90,.1) 0%,transparent 60%),radial-gradient(ellipse 60% 50% at 85% 90%,rgba(63,143,118,.09) 0%,transparent 60%),radial-gradient(ellipse 50% 50% at 50% 50%,rgba(211,168,77,.06) 0%,transparent 70%),#eef7ec" }}>
        <div className="casino-grid-bg" style={{ position: "absolute", inset: 0 }} />
      </div>

      <Particles />
      <Navbar />

      <div className="relative z-20 min-h-screen px-4 pt-8 pb-20 flex flex-col items-center font-body">

        {/* Header */}
        <header className="text-center mb-6 mt-24">
          <h1 className="font-display leading-[0.85] tracking-[4px] text-[clamp(3.5rem,12vw,8rem)]">
            <span className="casino-shimmer-text">SNACK<br />PREVIEW</span>
          </h1>
          <p className="text-[clamp(.75rem,2vw,1rem)] text-foreground/65 mt-3 tracking-wide">
            Check out what's in our drop this month. <span className="text-primary font-bold">Preview your box.</span> Every pull is a surprise.
          </p>
          {/* Rarity legend */}
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
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
        <div className="w-full max-w-[900px] overflow-hidden border-y border-primary/25 py-2 mb-6">
          <div className="flex whitespace-nowrap text-[0.7rem] tracking-[3px] text-primary/70" style={{ animation: "tickerScroll 32s linear infinite" }}>
            {[...TICKER_MSGS, ...TICKER_MSGS].map((t, i) => (
              <span key={i} className="px-8">{t}<span className="ml-8 text-secondary">◆</span></span>
            ))}
          </div>
        </div>

        {/* Machine */}
        <div className="w-full max-w-[900px]">
          <div style={{ background: "linear-gradient(160deg,#f7fcf5 0%,#edf7ea 50%,#e7f3e3 100%)", border: "2px solid #2f855a", borderRadius: 24, padding: "clamp(1.5rem,4vw,2.5rem) clamp(1rem,3vw,2rem)", position: "relative", boxShadow: "0 0 0 1px rgba(47,133,90,.22),0 18px 42px rgba(31,74,58,.13),inset 0 1px 0 rgba(255,255,255,.65)" }}>

            {/* Corner diamonds */}
            {[["top", "left"], ["top", "right"], ["bottom", "left"], ["bottom", "right"]].map(([v, h], i) => (
              <div key={i} style={{ position: "absolute", [v]: "-.7rem", [h]: "1.5rem", fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.1rem", color: "#d3a84d", filter: "drop-shadow(0 0 5px rgba(211,168,77,.45))" }}>◆</div>
            ))}

            <div style={{ position: "absolute", top: "1rem", right: "1.2rem", background: "#2f855a", color: "#f5fcf3", fontFamily: "'Bebas Neue',sans-serif", fontSize: ".8rem", letterSpacing: 2, padding: ".25rem .8rem", borderRadius: 4, boxShadow: "0 0 10px rgba(47,133,90,.28)" }}>
              SNACK DROP ◆ V2
            </div>

            {/* Marquee lights — Array.from length is a static literal → identical on server & client */}
            <div className="flex justify-center gap-2 mb-6 flex-wrap">
              {Array.from({ length: 28 }, (_, i) => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: LIGHT_COLS[i % LIGHT_COLS.length], boxShadow: `0 0 4px ${LIGHT_COLS[i % LIGHT_COLS.length]}`, border: "1px solid rgba(255,255,255,.6)", animation: `mBlink 2.2s ${(i * 0.09).toFixed(2)}s infinite` }} />
              ))}
            </div>

            <div className="text-center font-display text-[1.3rem] tracking-[4px] text-primary mb-6" style={{ textShadow: "0 0 10px rgba(47,133,90,.18)" }}>
              — SPIN TO BUILD YOUR BOX —
            </div>

            {/* Reels */}
            <div className="flex justify-center gap-2 md:gap-4 mb-6 flex-wrap">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div className="font-display text-[.7rem] tracking-[2px] text-accent/80">SLOT {i + 1}</div>
                  <Reel
                    reelIdx={i}
                    result={pendingResults?.[i] ?? SNACKS[i]}
                    onDone={handleReelDone}
                    spinTrigger={spinTrigger}
                  />
                  {/* Pip: always render a fixed-size box to avoid layout shift */}
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: results && !isSpinning ? RARITY[results[i].rarity].color : "transparent", boxShadow: results && !isSpinning ? `0 0 8px ${RARITY[results[i].rarity].glow}` : "none", transition: "all .4s" }} />
                </div>
              ))}
            </div>

            {/* Spin button */}
            <div className="flex flex-col items-center gap-4">
              <button onClick={spin} disabled={isSpinning} className="font-display text-[clamp(1.3rem,4vw,1.9rem)] tracking-[4px] px-8 md:px-16 py-3 border-2 border-secondary rounded-lg text-[#f6fcf4] transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-75" style={{ background: isSpinning ? "linear-gradient(135deg,#2c7d54,#236643)" : "linear-gradient(135deg,#2f855a,#266f49)", boxShadow: isSpinning ? "0 2px 0 #1f5638,0 4px 12px rgba(47,133,90,.28)" : "0 6px 0 #1f5638,0 8px 20px rgba(47,133,90,.35)", textShadow: "0 1px 2px rgba(0,0,0,.2)" }}>
                {isSpinning ? "SPINNING..." : "PULL THE LEVER"}
              </button>
              <span className="text-[.7rem] text-foreground/55 tracking-[2px]">
                SPINS: <span className="text-primary font-bold">{spinCount}</span>
              </span>
            </div>

            {/* Luck meter */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-display text-[.85rem] tracking-[3px] text-accent">LUCK METER</span>
                <span className="text-[.7rem] text-secondary font-bold">{luckPct}%</span>
              </div>
              <div style={{ height: 8, background: "rgba(47,133,90,.12)", borderRadius: 99, overflow: "hidden", border: "1px solid rgba(47,133,90,.28)" }}>
                <div style={{ height: "100%", width: `${luckPct}%`, background: "linear-gradient(90deg,#3f8f76,#78a64f)", borderRadius: 99, transition: "width .8s cubic-bezier(.34,1.2,.64,1)", boxShadow: "0 0 8px rgba(63,143,118,.35)" }} />
              </div>
            </div>

          </div>
        </div>

        {/* Result panel */}
        <div style={{ width: "100%", maxWidth: 900, marginTop: "2rem", opacity: showResults ? 1 : 0, transform: showResults ? "translateY(0)" : "translateY(30px)", transition: "all .6s cubic-bezier(.34,1.56,.64,1)", pointerEvents: showResults ? "all" : "none" }}>
          <div style={{ background: hasLegendary ? "linear-gradient(160deg,rgba(211,168,77,.14),rgba(63,143,118,.08))" : "linear-gradient(160deg,rgba(211,168,77,.1),rgba(63,143,118,.07))", border: "2px solid #d3a84d", borderRadius: 20, padding: "2rem", position: "relative", boxShadow: hasLegendary ? "0 0 0 1px rgba(211,168,77,.2),0 0 28px rgba(211,168,77,.18),0 0 60px rgba(63,143,118,.12)" : "0 0 0 1px rgba(211,168,77,.16),0 0 24px rgba(211,168,77,.1)" }}>
            <div style={{ position: "absolute", top: "-1rem", left: "50%", transform: "translateX(-50%)", background: hasLegendary ? "linear-gradient(90deg,#2f855a,#d3a84d,#2f855a)" : "#d3a84d", backgroundSize: "200% auto", animation: hasLegendary ? "shimmer 3s linear infinite" : "none", color: "#133224", fontFamily: "'Bebas Neue',sans-serif", fontSize: ".95rem", letterSpacing: 3, padding: ".3rem 1.5rem", whiteSpace: "nowrap", borderRadius: 4, boxShadow: "0 3px 10px rgba(211,168,77,.35)" }}>
              {hasLegendary ? "⭐ LEGENDARY BOX UNLOCKED ⭐" : "🎰 YOUR SNACK BOX IS READY"}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem", marginTop: "1rem" }}>
              {results?.map((snack, i) => <ResultCard key={snack.id} snack={snack} delay={i * 0.1} />)}
            </div>
            <div style={{
              display: "flex", justifyContent: "center", alignItems: "center",
              gap: "2rem", margin: "1.5rem 0 0", flexWrap: "wrap",
              background: "rgba(255,255,255,.68)", border: "1px solid rgba(47,133,90,.16)",
              borderRadius: 12, padding: "1rem 1.5rem",
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: ".7rem", letterSpacing: 3, color: "rgba(24,52,42,.45)", marginBottom: ".2rem" }}>
                  BOX VALUE
                </div>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.6rem", color: "#3f8f76", letterSpacing: 2 }}>
                  ${totalValue.toFixed(2)}
                </div>
              </div>

              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: ".7rem", letterSpacing: 3, color: "rgba(24,52,42,.45)", marginBottom: ".2rem" }}>
                  YOU PAY
                </div>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.6rem", color: "#d3a84d", letterSpacing: 2 }}>
                  ${BOX_PRICE.toFixed(2)}
                </div>
              </div>

              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: ".7rem", letterSpacing: 3, color: "rgba(24,52,42,.45)", marginBottom: ".2rem" }}>
                  YOU SAVE
                </div>
                <div style={{
                  fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.6rem", letterSpacing: 2,
                  color: isGoodDeal ? "#4c9b52" : "#a84e3c",
                }}>
                  {isGoodDeal ? `$${savings.toFixed(2)}` : `-$${Math.abs(savings).toFixed(2)}`}
                </div>
                {isGoodDeal && (
                  <div style={{
                    fontFamily: "'Space Mono',monospace", fontSize: ".55rem", letterSpacing: 2,
                    background: "rgba(76,155,82,.12)", border: "1px solid rgba(76,155,82,.3)",
                    color: "#4c9b52", padding: ".15rem .5rem", borderRadius: 3, marginTop: ".3rem",
                    display: "inline-block",
                  }}>
                    {savingsPct}% OFF
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-4 justify-center mt-6 flex-wrap">
              <a href="#" className="font-display text-[1.2rem] tracking-[3px] py-3.5 px-10 bg-primary text-[#f8fcf6] border-2 border-secondary rounded-md no-underline shadow-[4px_4px_0_#3f8f76] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#3f8f76] transition-all">
                🛒 CLAIM THIS BOX
              </a>
              <button onClick={reset} className="font-display text-[1.2rem] tracking-[3px] py-3.5 px-8 bg-transparent text-accent border-2 border-accent rounded-md cursor-pointer transition-colors hover:bg-accent/10">
                ↺ SPIN AGAIN
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}