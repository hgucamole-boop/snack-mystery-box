'use client';
import { useState } from 'react';
import { Navbar } from '@/app/components/Navbar';
import { Footer } from '@/app/home/components/Footer';
import { CaseSelector } from '@/app/drop/components/CaseSelector';
import { SpinReel } from '@/app/drop/components/SpinReel';
import { ResultReveal } from '@/app/drop/components/ResultReveal';
import { EarningsTracker } from '@/app/drop/components/EarningsTracker';
import { LiveDropsSidebar } from '@/app/drop/components/LiveDropsSidebar';
import { SnackDetailModal } from '@/app/drop/components/SnackDetailModal';
import { caseConfig } from '@/app/drop/data/snackItems';
import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';

const Drop = () => {
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [sessionDrops, setSessionDrops] = useState([]);
  const [triggerSpin, setTriggerSpin] = useState(0);
  const [detailItem, setDetailItem] = useState(null);

  const selectedCase = useStore((s) => s.selectedCase);
  const config = caseConfig[selectedCase];

  const handleResult = (item) => {
    setResult(item);
    setShowResult(true);
    setSessionDrops(prev => [{ item, cost: config.price }, ...prev]);
  };

  const handleCloseResult = () => setShowResult(false);
  const handleOpenAnother = () => { setShowResult(false); setResult(null); };
  const handleReroll = () => {
    setShowResult(false);
    setResult(null);
    setTimeout(() => setTriggerSpin(prev => prev + 1), 100);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="flex pt-16">
        <div className="hidden lg:block w-64 shrink-0 border-r border-border bg-card/30 p-3 h-[calc(100vh-64px)] sticky top-16 overflow-y-auto">
          <EarningsTracker drops={sessionDrops} />
        </div>
        <div className="flex-1 min-w-0">
          <main className="pb-12">
            <div className="container mx-auto px-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 pt-8">
                <h1 className="font-display text-5xl md:text-7xl gradient-text mb-4">LUCKY DROP</h1>
                <p className="font-body text-muted-foreground max-w-lg mx-auto">
                  Pick a case, spin the reel, and reveal your mystery snack. Will you pull an ULTRA?
                </p>
              </motion.div>
              <CaseSelector onSelect={() => {}} />
              <div className="mt-12">
                <SpinReel onResult={handleResult} triggerSpin={triggerSpin} onSnackClick={setDetailItem} />
              </div>
            </div>
          </main>
        </div>
        <LiveDropsSidebar onSnackClick={setDetailItem} />
      </div>
      <Footer />
      {showResult && (
        <ResultReveal
          item={result}
          onClose={handleCloseResult}
          onOpenAnother={handleOpenAnother}
          onReroll={handleReroll}
          caseCost={config.price}
        />
      )}
      <SnackDetailModal item={detailItem} onClose={() => setDetailItem(null)} />
    </div>
  );
};

export default Drop;