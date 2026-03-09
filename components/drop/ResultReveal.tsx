'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { type SnackItemData, rarityColors } from '@/data/snackItems';
import Link from 'next/link';
import { RefreshCw } from 'lucide-react';

interface ResultRevealProps {
  item: SnackItemData | null;
  onClose: () => void;
  onOpenAnother: () => void;
  onReroll?: () => void;
  caseCost?: number;
}

export function ResultReveal({ item, onClose, onOpenAnother, onReroll, caseCost = 0 }: ResultRevealProps) {
  const savedRef = useRef(false);

  useEffect(() => {
    if (!item || savedRef.current) return;
    savedRef.current = true;

    const saved = JSON.parse(localStorage.getItem('myDrops') || '[]');
    saved.push({ ...item, openedAt: new Date().toISOString() });
    localStorage.setItem('myDrops', JSON.stringify(saved));

    if (item.rarity === 'ULTRA' || item.rarity === 'LEGENDARY') {
      const duration = 3000;
      const end = Date.now() + duration;
      const frame = () => {
        confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#FF2E63', '#FFD700', '#00D9FF'] });
        confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#FF2E63', '#FFD700', '#00D9FF'] });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
  }, [item]);

  if (!item) return null;

  const rarityColor = rarityColors[item.rarity];
  const isUltra = item.rarity === 'ULTRA';
  const profit = item.numericValue - caseCost;
  const isProfit = profit >= 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center bg-navy/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.3 }}
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: `hsl(var(--${rarityColor}))` }}
        />
        <motion.div
          initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
          className={`w-full max-w-lg mx-4 mb-4 p-8 bg-navy-2 border-2 ${isUltra ? 'animate-pulse-border' : ''}`}
          style={{ borderColor: `hsl(var(--${rarityColor}))` }}
        >
          <div className="text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="mb-4">
              <img src={item.image} alt={item.name} className="w-32 h-32 object-contain mx-auto" />
            </motion.div>

            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="font-display text-4xl mb-2" style={{ color: `hsl(var(--${rarityColor}))` }}>
              {item.name}
            </motion.h2>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="inline-block px-4 py-1 mb-4 font-body text-sm border"
              style={{ backgroundColor: `hsl(var(--${rarityColor}) / 0.2)`, color: `hsl(var(--${rarityColor}))`, borderColor: `hsl(var(--${rarityColor}))` }}>
              {item.rarity}
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mb-6">
              <p className="font-body text-cream mb-1">{item.country}</p>
              <p className="font-body text-muted-foreground mb-3">
                Retail value: <span className="text-gold">{item.value}</span>
              </p>
              {caseCost > 0 && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.6, type: 'spring' }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${isProfit ? 'bg-green-400/10 border-green-400/30' : 'bg-destructive/10 border-destructive/30'}`}
                >
                  <span className={`font-display text-lg ${isProfit ? 'text-green-400' : 'text-destructive'}`}>
                    {isProfit ? '📈 +' : '📉 -'}${Math.abs(profit).toFixed(2)}
                  </span>
                  <span className="font-body text-xs text-muted-foreground">{isProfit ? 'profit!' : 'try again!'}</span>
                </motion.div>
              )}
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              className="font-body text-sm text-cyan mb-6">
              Adding to your next mystery box delivery!
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-3 justify-center">
              {onReroll && (
                <button onClick={onReroll}
                  className="px-6 py-3 bg-gold/10 border border-gold text-gold font-body hover:bg-gold/20 transition-all flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4" /> RE-ROLL
                </button>
              )}
              <button onClick={onOpenAnother} className="px-6 py-3 bg-pink text-white font-body transition-all">
                🎰 OPEN ANOTHER
              </button>
              <Link href="/dashboard" className="px-6 py-3 border border-cyan text-cyan font-body hover:bg-cyan hover:text-navy transition-all text-center">
                📦 VIEW MY HAUL
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}