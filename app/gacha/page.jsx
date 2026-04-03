'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import '@/styles/gacha.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { snacks as SNACKS } from '@/data/products';
import { plans } from '@/data/constants';
import { Navbar } from '@/app/components/Navbar';
import { SignupInterestModal } from '@/app/gacha/components/SignupInterestModal';
import { GachaHero } from '@/app/gacha/components/GachaHero';
import { GachaPreviewEngine } from '@/app/gacha/components/GachaPreviewEngine';
import { GachaResultsSection } from '@/app/gacha/components/GachaResultsSection';
import { GachaSavingsSection } from '@/app/gacha/components/GachaSavingsSection';
import { GachaSignupCta } from '@/app/gacha/components/GachaSignupCta';
import { GachaPullHistorySidebar } from '@/app/gacha/components/GachaPullHistorySidebar';
import { GachaLivePullsSidebar } from '@/app/gacha/components/GachaLivePullsSidebar';
import {
  ROLL_COLUMNS,
  chunkSelection,
  pickRandomSelection,
  calcValue,
  parsePrice,
  buildColumns,
} from '@/app/gacha/utils/gachaHelpers';

export default function GachaPage() {
  const boxOptions = useMemo(
    () => plans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      pax: plan.pax,
      emoji: plan.emoji,
      popular: plan.popular,
      price: plan.price,
      unitMultiplier: plan.unitMultiplier || 1,
    })),
    [],
  );
  const [selectedBoxId, setSelectedBoxId] = useState('team');
  const selectedBox = useMemo(
    () => boxOptions.find((box) => box.id === selectedBoxId) || boxOptions[0],
    [boxOptions, selectedBoxId],
  );
  const unitMultiplier = selectedBox?.unitMultiplier || 1;
  const boxPrice = parsePrice(selectedBox?.price);
  const initialSelection = useMemo(() => chunkSelection(SNACKS, ROLL_COLUMNS), []);
  const [selection, setSelection] = useState(initialSelection);
  const [pendingSelection, setPendingSelection] = useState(initialSelection);
  const [isSpinning, setIsSpinning] = useState(false);
  const [settledCount, setSettledCount] = useState(0);
  const [spinTrigger, setSpinTrigger] = useState(0);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isHistorySheetOpen, setIsHistorySheetOpen] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const [pullHistory, setPullHistory] = useState([]);
  const lastLoggedSpinRef = useRef(0);
  const resultsRef = useRef(null);

  const totalValue = calcValue(selection, unitMultiplier);
  const savings = totalValue - boxPrice;
  const savingsPct = totalValue > 0 ? Math.round((savings / totalValue) * 100) : 0;
  const columns = useMemo(() => buildColumns(SNACKS, ROLL_COLUMNS), []);
  const historyCount = pullHistory.length;
  const totalSpent = historyCount * boxPrice;
  const historyValue = pullHistory.reduce((sum, pull) => sum + calcValue(pull.selection, unitMultiplier), 0);
  const historyProfit = historyValue - totalSpent;
  const historyRoiPct = totalSpent > 0 ? ((historyValue / totalSpent - 1) * 100) : 0;

  const scrollToResults = useCallback(() => {
    if (!resultsRef.current || typeof window === 'undefined') return;

    const navOffset = 96;
    const targetTop = resultsRef.current.getBoundingClientRect().top + window.scrollY - navOffset;

    window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });

    // Mobile Safari can occasionally ignore one smooth scroll call after layout updates.
    window.setTimeout(() => {
      const retryTop = resultsRef.current.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({ top: Math.max(0, retryTop), behavior: 'smooth' });
    }, 180);
  }, []);

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
    const spinSettled = !isSpinning && spinTrigger > 0 && settledCount === ROLL_COLUMNS;
    const isNewSettledSpin = spinTrigger !== lastLoggedSpinRef.current;

    if (spinSettled && isNewSettledSpin) {
      setPullHistory((prev) => {
        const nextMonth = prev.length + 1;
        return [
          {
            id: `${spinTrigger}-${nextMonth}`,
            monthLabel: `Month ${nextMonth}`,
            selection: pendingSelection,
          },
          ...prev,
        ];
      });
      lastLoggedSpinRef.current = spinTrigger;
      scrollToResults();
    }
  }, [isSpinning, spinTrigger, settledCount, pendingSelection, scrollToResults]);

  useEffect(() => {
    if (!isHistorySheetOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isHistorySheetOpen]);

  const handleBoxSizeChange = (boxId) => {
    if (isSpinning) return;
    setSelectedBoxId(boxId);
  };

  const handleSignupSubmit = (event) => {
    event.preventDefault();
    if (!signupEmail.trim()) return;

    setIsSignupOpen(false);
    setSignupEmail('');
    toast.success('You have registered your interest in our service.');
  };

  return (
    <div className="gacha-page">
      <Navbar />

      <div className="gacha-layout">
        <aside className="gacha-sidebar gacha-sidebar-left" aria-label="Your pull history">
          <GachaPullHistorySidebar
            pullHistory={pullHistory}
            selectedBoxName={selectedBox?.name || 'Snack Box'}
            unitMultiplier={unitMultiplier}
            boxPrice={boxPrice}
          />
        </aside>

        <main className="gacha-main" style={{paddingTop: '0.5rem'}}>
          <GachaHero />

          <section className="gacha-mobile-history-strip" aria-label="Quick pull performance">
            <div className="gacha-mobile-history-stat">
              <p>Profit</p>
              <strong className={historyProfit >= 0 ? 'positive' : 'negative'}>
                {historyProfit >= 0 ? '+' : '-'}${Math.abs(historyProfit).toFixed(2)}
              </strong>
            </div>
            <div className="gacha-mobile-history-stat">
              <p>ROI</p>
              <strong className={historyRoiPct >= 0 ? 'positive' : 'negative'}>
                {historyRoiPct >= 0 ? '+' : ''}{historyRoiPct.toFixed(0)}%
              </strong>
            </div>
            <div className="gacha-mobile-history-stat">
              <p>Months</p>
              <strong>{historyCount}</strong>
            </div>
            <button type="button" className="gacha-mobile-history-btn" onClick={() => setIsHistorySheetOpen(true)}>
              View History
            </button>
          </section>

          <GachaPreviewEngine
            columns={columns}
            pendingSelection={pendingSelection}
            spinTrigger={spinTrigger}
            onReelDone={handleReelDone}
            isSpinning={isSpinning}
            settledCount={settledCount}
            onGenerate={handleGenerate}
          />

          <GachaResultsSection
            resultsRef={resultsRef}
            boxOptions={boxOptions}
            selectedBoxId={selectedBoxId}
            onBoxSizeChange={handleBoxSizeChange}
            isSpinning={isSpinning}
            hasPulls={pullHistory.length > 0}
            selection={selection}
            unitMultiplier={unitMultiplier}
          />

          <GachaSavingsSection
            hasPulls={pullHistory.length > 0}
            totalValue={totalValue}
            boxPrice={boxPrice}
            savings={savings}
            savingsPct={savingsPct}
          />

          <GachaSignupCta onSignupOpen={() => setIsSignupOpen(true)} />

          <SignupInterestModal
            isOpen={isSignupOpen}
            email={signupEmail}
            onEmailChange={setSignupEmail}
            onClose={() => setIsSignupOpen(false)}
            onSubmit={handleSignupSubmit}
          />

          <ToastContainer
            position="bottom-right"
            autoClose={2600}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </main>

        <aside className="gacha-sidebar gacha-sidebar-right" aria-label="Live pull activity">
          <GachaLivePullsSidebar snacks={SNACKS} />
        </aside>
      </div>

      {isHistorySheetOpen && (
        <div className="gacha-mobile-history-sheet" role="dialog" aria-modal="true" aria-label="Your pull history">
          <button
            type="button"
            className="gacha-mobile-history-sheet-backdrop"
            aria-label="Close pull history"
            onClick={() => setIsHistorySheetOpen(false)}
          />
          <div className="gacha-mobile-history-sheet-panel">
            <div className="gacha-mobile-history-sheet-head">
              <h3>Your Pull History</h3>
              <button type="button" onClick={() => setIsHistorySheetOpen(false)} aria-label="Close history panel">
                Close
              </button>
            </div>
            <div className="gacha-mobile-history-sheet-body">
              <GachaPullHistorySidebar
                pullHistory={pullHistory}
                selectedBoxName={selectedBox?.name || 'Snack Box'}
                unitMultiplier={unitMultiplier}
                boxPrice={boxPrice}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



