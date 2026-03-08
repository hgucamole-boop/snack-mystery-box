import { useState } from 'react';
import { Navbar } from '@/app/components/Navbar';
import { Footer } from '@/app/components/Footer';
import { CaseSelector } from '@/components/drop/CaseSelector';
import { LiveFeed } from '@/components/drop/LiveFeed';
import { SpinReel } from '@/components/drop/SpinReel';
import { ResultReveal } from '@/components/drop/ResultReveal';
import { type SnackItemData } from '@/data/snackItems';
import { motion } from 'framer-motion';

const Drop = () => {
  const [result, setResult] = useState<SnackItemData | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleResult = (item: SnackItemData) => {
    setResult(item);
    setShowResult(true);
  };

  const handleCloseResult = () => {
    setShowResult(false);
  };

  const handleOpenAnother = () => {
    setShowResult(false);
    setResult(null);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-display text-5xl md:text-7xl gradient-text mb-4">
              LUCKY DROP
            </h1>
            <p className="font-body text-muted-foreground max-w-lg mx-auto">
              Pick a case, spin the reel, and reveal your mystery snack. Will you pull an ULTRA?
            </p>
          </motion.div>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left column - Case selector */}
            <div className="lg:col-span-4">
              <CaseSelector onSelect={() => {}} />
            </div>

            {/* Right column - Live feed */}
            <div className="lg:col-span-8 h-[400px] bg-navy-2 border border-border p-4">
              <LiveFeed />
            </div>
          </div>

          {/* Spin reel - full width */}
          <div className="mt-12">
            <SpinReel onResult={handleResult} />
          </div>
        </div>
      </main>

      <Footer />

      {/* Result modal */}
      {showResult && (
        <ResultReveal
          item={result}
          onClose={handleCloseResult}
          onOpenAnother={handleOpenAnother}
        />
      )}
    </div>
  );
};

export default Drop;
