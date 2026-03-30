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
  const [signupEmail, setSignupEmail] = useState('');
  const [pullHistory, setPullHistory] = useState([]);
  const lastLoggedSpinRef = useRef(0);
  const resultsRef = useRef(null);

  const totalValue = calcValue(selection, unitMultiplier);
  const savings = totalValue - boxPrice;
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
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isSpinning, spinTrigger, settledCount, pendingSelection]);

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

        <main className="gacha-main">
          <GachaHero />

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
            selection={selection}
            unitMultiplier={unitMultiplier}
          />

          <GachaSavingsSection
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
    </div>
  );
}



