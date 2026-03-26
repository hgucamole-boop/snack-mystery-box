'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import '@/styles/drop2.css';
import { snacks as SNACKS } from '@/data/products';
import { plans } from '@/data/constants';
import { Navbar } from '@/app/components/Navbar';

const BOX_PRICE = 19.99;
const ROLL_ITEM_H = 112;
const ROLL_WINDOW_H = 340;
const RESULT_IDX = 22;
const ROLL_COLUMNS = 6;

function chunkSelection(items, count = ROLL_COLUMNS) {
  return items.slice(0, count);
}

function pickRandomSelection(items, count = 6) {
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function calcValue(items, unitMultiplier) {
  return items.reduce((sum, item) => sum + item.numericValue * item.multiple * unitMultiplier, 0);
}

function shuffleItems(items) {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function buildColumns(items, count = 6) {
  return Array.from({ length: count }, () => {
    const firstPass = shuffleItems(items);
    const secondPass = shuffleItems(items);
    return [...firstPass, ...secondPass];
  });
}

function buildStrip(target, pool) {
  const decoys = Array.from({ length: RESULT_IDX }, () => pool[Math.floor(Math.random() * pool.length)]);
  const tailCandidates = pool.filter((item) => item.id !== target.id);
  const tail = tailCandidates.length
    ? tailCandidates[Math.floor(Math.random() * tailCandidates.length)]
    : target;
  return [...decoys, target, tail];
}

function ReelColumn({ items, target, reelIdx, spinTrigger, onDone, isSpinning, isSettled }) {
  const stripRef = useRef(null);
  const animRef = useRef(null);
  const [strip, setStrip] = useState([]);
  const isIdle = !isSpinning && spinTrigger === 0;

  useEffect(() => {
    if (spinTrigger === 0) {
      // Before first spin, keep a long repeated strip for smooth idle scrolling.
      setStrip([...items, ...items]);
    }
  }, [items, spinTrigger]);

  useEffect(() => {
    if (spinTrigger === 0) return;

    const newStrip = buildStrip(target, items);
    setStrip(newStrip);

    const raf = requestAnimationFrame(() => {
      if (stripRef.current) stripRef.current.style.transform = 'translateY(0px)';

      const stopDelay = 900 + reelIdx * 420;
      const startTime = performance.now();
      let pos = 0;

      if (animRef.current) cancelAnimationFrame(animRef.current);

      function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / stopDelay);
        const speed = progress > 0.75
          ? ROLL_ITEM_H * 0.58 * (1 - (progress - 0.75) / 0.25) + ROLL_ITEM_H * 0.03
          : ROLL_ITEM_H * 0.58;

        pos += speed;

        const loopAt = (RESULT_IDX - 4) * ROLL_ITEM_H;
        if (pos >= loopAt) pos = pos % loopAt;

        if (elapsed >= stopDelay && speed <= ROLL_ITEM_H * 0.05) {
          if (stripRef.current) {
            const settleAt = RESULT_IDX * ROLL_ITEM_H + (ROLL_ITEM_H / 2) - (ROLL_WINDOW_H / 2);
            stripRef.current.style.transform = `translateY(-${settleAt}px)`;
          }
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
  }, [spinTrigger, reelIdx, target, items, onDone]);

  return (
    <div
      className={`drop2-roller-window ${isSpinning && !isSettled ? 'spinning' : ''} ${isSettled ? 'settled' : ''}`.trim()}
    >
      <div className="drop2-roller-payline" />
      <div
        ref={stripRef}
        className={`drop2-roller-track ${isIdle ? 'idle' : ''}`.trim()}
        style={isIdle ? { animationDuration: `${42 + reelIdx * 4}s` } : undefined}
      >
        {strip.map((item, itemIdx) => (
          <div
            key={`${item.id}-${reelIdx}-${itemIdx}`}
            className={`drop2-roller-item ${itemIdx === RESULT_IDX ? 'target' : 'decoy'}`}
          >
            <img src={item.image} alt={item.name} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Drop2Page() {
  const boxOptions = useMemo(
    () => plans.map((plan) => ({ id: plan.id, name: plan.name, unitMultiplier: plan.unitMultiplier || 1 })),
    [],
  );
  const [selectedBoxId, setSelectedBoxId] = useState('team');
  const selectedBox = useMemo(
    () => boxOptions.find((box) => box.id === selectedBoxId) || boxOptions[0],
    [boxOptions, selectedBoxId],
  );
  const unitMultiplier = selectedBox?.unitMultiplier || 1;
  const initialSelection = useMemo(() => chunkSelection(SNACKS, ROLL_COLUMNS), []);
  const [selection, setSelection] = useState(initialSelection);
  const [pendingSelection, setPendingSelection] = useState(initialSelection);
  const [isSpinning, setIsSpinning] = useState(false);
  const [settledCount, setSettledCount] = useState(0);
  const [spinTrigger, setSpinTrigger] = useState(0);
  const resultsRef = useRef(null);

  const totalValue = calcValue(selection, unitMultiplier);
  const savings = totalValue - BOX_PRICE;
  const savingsPct = totalValue > 0 ? Math.round((savings / totalValue) * 100) : 0;
  const columns = useMemo(() => buildColumns(SNACKS, ROLL_COLUMNS), []);

  const handleReelDone = useCallback((idx) => {
    setSelection((prev) => {
      const updated = [...prev];
      updated[idx] = pendingSelection[idx];
      return updated;
    });

    setSettledCount((prev) => {
      const next = prev + 1;
      if (next === ROLL_COLUMNS) setIsSpinning(false);
      return next;
    });
  }, [pendingSelection]);

  const handleGenerate = () => {
    if (isSpinning) return;

    const nextSelection = pickRandomSelection(SNACKS, ROLL_COLUMNS);
    setPendingSelection(nextSelection);
    setIsSpinning(true);
    setSettledCount(0);
    setSpinTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    if (!isSpinning && spinTrigger > 0 && settledCount === ROLL_COLUMNS) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isSpinning, spinTrigger, settledCount]);

  const handleBoxSizeChange = (boxId) => {
    if (isSpinning) return;
    setSelectedBoxId(boxId);
  };

  return (
    <div className="drop2-page">
      <Navbar />

      <main className="drop2-main">
        <header className="drop2-hero">
          <div className="drop2-hero-badge">Sustainable Discovery</div>
          <h1 className="drop2-title">
            Preview This Month&apos;s 
            <p><span>Curated Selection</span></p>
          </h1>
          <p className="drop2-subtitle">
            Every box is a unique rescue mission. We curate premium selections from surplus inventory and rescued ingredients to fight food waste while delivering joy to your door.
          </p>
          <div className="drop2-chips">
            <span>Rescued Inventory</span>
            <span>Zero Waste Goal</span>
          </div>
        </header>

        <section className="drop2-engine">
          <h2>Preview Generator</h2>
          <p>Take a look at this month's selection of snacks. {selectedBox.name} scales quantity to {unitMultiplier}x units per snack.</p>

          <div className="drop2-rollers">
            {columns.map((col, colIdx) => (
              <ReelColumn
                key={colIdx}
                items={col}
                target={pendingSelection[colIdx]}
                reelIdx={colIdx}
                spinTrigger={spinTrigger}
                onDone={handleReelDone}
                isSpinning={isSpinning}
                isSettled={settledCount > colIdx}
              />
            ))}
          </div>

          <div className="drop2-engine-actions">
            <button className="drop2-primary-btn" onClick={handleGenerate} disabled={isSpinning}>
              {isSpinning ? 'Generating...' : 'Generate My Selection'}
            </button>
            <button className="drop2-secondary-btn" onClick={handleGenerate} disabled={isSpinning}>
              {isSpinning ? `Settling ${settledCount}/${ROLL_COLUMNS}` : 'Preview Another Box'}
            </button>
          </div>
        </section>

        <section ref={resultsRef} className="drop2-results-wrap" style={{ marginTop: '6rem' }}>
          <div className="drop2-results-controls">
            <h3>Box Size</h3>
            <div className="drop2-size-selector" role="radiogroup" aria-label="Select box size">
              {boxOptions.map((box) => (
                <button
                  key={box.id}
                  type="button"
                  className={`drop2-size-btn ${selectedBoxId === box.id ? 'active' : ''}`}
                  onClick={() => handleBoxSizeChange(box.id)}
                  disabled={isSpinning}
                  aria-checked={selectedBoxId === box.id}
                  role="radio"
                >
                  <span>{box.name}</span>
                  <strong>{box.unitMultiplier}x units</strong>
                </button>
              ))}
            </div>
          </div>

          <div className="drop2-results">
          {selection.map((item) => (
            <article key={item.id} className="drop2-card">
              <div className="drop2-card-media">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="drop2-card-body">
                <h3>{item.name}</h3>
                <p>{item.country} · {item.rarity.toLowerCase()} pick</p>
                <div className="drop2-card-meta">
                  <span>{item.multiple * unitMultiplier} units</span>
                  <strong>${(item.numericValue * item.multiple * unitMultiplier).toFixed(2)}</strong>
                </div>
              </div>
            </article>
          ))}
          </div>
        </section>

        <section className="drop2-savings">
          <div>
            <p>Total Box Value</p>
            <h4>${totalValue.toFixed(2)}</h4>
          </div>
          <div>
            <p>You Pay</p>
            <h4>${BOX_PRICE.toFixed(2)}</h4>
          </div>
          <div>
            <p>You Save</p>
            <h4>{savings > 0 ? `${savingsPct}% OFF` : '$0.00'}</h4>
          </div>
        </section>

        <section className="drop2-trust">
          <div>
            <h5>Fighting Food Waste</h5>
            <p>Every preview reflects inventory that helps reduce unnecessary waste.</p>
          </div>
          <div>
            <h5>Affordable Discovery</h5>
            <p>Surplus sourcing keeps quality high and prices friendlier.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
