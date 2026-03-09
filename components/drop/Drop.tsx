'use client';
import { useState } from 'react';
import { Navbar } from '@/app/components/Navbar';
import { Footer } from '@/app/components/Footer';
import { CaseSelector } from '@/components/drop/CaseSelector';
import { LiveFeed } from '@/components/drop/LiveFeed';
import { SpinReel } from '@/components/drop/SpinReel';
import { ResultReveal } from '@/components/drop/ResultReveal';
import { EarningsTracker } from '@/components/drop/EarningsTracker';
import { LiveDropsSidebar } from '@/components/drop/LiveDropsSidebar';
import { type SnackItemData, caseConfig } from '@/data/snackItems';
import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';

const Drop = () => {
  const [result, setResult] = useState<SnackItemData | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [sessionDrops, setSessionDrops] = useState<{ item: SnackItemData; cost: number }[]>([]);
  const [triggerSpin, setTriggerSpin] = useState(0);
  const selectedCase = useStore((s) => s.selectedCase);
  const config = caseConfig[selectedCase];

  const handleResult = (item: SnackItemData) => {
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
        {/* Left: Earnings tracker (desktop only) */}
        <div className="hidden lg:block w-64 shrink-0 border-r border-border bg-card/30 p-3 h-[calc(100vh-64px)] sticky top-16 overflow-y-auto">
          <EarningsTracker drops={sessionDrops} />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <main className="pb-12">
            <div className="container mx-auto px-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 pt-8">
                <h1 className="font-display text-5xl md:text-7xl gradient-text mb-4">LUCKY DROP</h1>
                <p className="font-body text-muted-foreground max-w-lg mx-auto">
                  Pick a case, spin the reel, and reveal your mystery snack. Will you pull an ULTRA?
                </p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4">
                  <CaseSelector onSelect={() => {}} />
                </div>
                <div className="lg:col-span-8 h-[400px] bg-navy-2 border border-border p-4">
                  <LiveFeed />
                </div>
              </div>

              <div className="mt-12">
                <SpinReel onResult={handleResult} triggerSpin={triggerSpin} />
              </div>
            </div>
          </main>
        </div>

        {/* Right: Live drops sidebar (XL only) */}
        <LiveDropsSidebar />
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
    </div>
  );
};

export default Drop;