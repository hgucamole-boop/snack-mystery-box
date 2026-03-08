import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { type SnackItemData, rarityColors } from '@/data/snackItems';
import Link from 'next/link';

interface ResultRevealProps {
  item: SnackItemData | null;
  onClose: () => void;
  onOpenAnother: () => void;
}

export function ResultReveal({ item, onClose, onOpenAnother }: ResultRevealProps) {
  useEffect(() => {
    if (item?.rarity === 'ULTRA') {
      // Fire confetti for ULTRA pulls
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#FF2E63', '#FFD700', '#00D9FF'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#FF2E63', '#FFD700', '#00D9FF'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [item]);

  if (!item) return null;

  const rarityColor = rarityColors[item.rarity];
  const isUltra = item.rarity === 'ULTRA';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center bg-navy/80 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Flash effect */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: `hsl(var(--${rarityColor}))` }}
        />

        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
          className={`w-full max-w-lg mx-4 mb-4 p-8 bg-navy-2 border-2 ${
            isUltra ? 'animate-pulse-border' : ''
          }`}
          style={{ borderColor: `hsl(var(--${rarityColor}))` }}
        >
          <div className="text-center">
            {/* Emoji */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="text-8xl mb-4"
            >
              <img src={item.image} alt={item.name} className="w-32 h-32 object-contain mx-auto" />
            </motion.div>

            {/* Item name */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-4xl mb-2"
              style={{ color: `hsl(var(--${rarityColor}))` }}
            >
              {item.name}
            </motion.h2>

            {/* Rarity badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-block px-4 py-1 mb-4 font-body text-sm border"
              style={{
                backgroundColor: `hsl(var(--${rarityColor}) / 0.2)`,
                color: `hsl(var(--${rarityColor}))`,
                borderColor: `hsl(var(--${rarityColor}))`,
              }}
            >
              {item.rarity}
            </motion.div>

            {/* Country */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="font-body text-cream mb-2"
            >
              {item.country} From {
                item.country === '🇯🇵' ? 'Japan' :
                item.country === '🇺🇸' ? 'USA' :
                item.country === '🇲🇾' ? 'Malaysia' :
                item.country === '🇸🇬' ? 'Singapore' :
                item.country === '🇰🇷' ? 'Korea' :
                item.country === '🇹🇼' ? 'Taiwan' :
                item.country === '🇩🇪' ? 'Germany' : 'Unknown'
              }
            </motion.p>

            {/* Value */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="font-body text-muted-foreground mb-6"
            >
              Retail value: <span className="text-gold">{item.value}</span>
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="font-body text-sm text-cyan mb-6"
            >
              Adding to your next mystery box delivery!
            </motion.p>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <button
                onClick={onOpenAnother}
                className="px-6 py-3 bg-pink text-primary-foreground font-body hover:glow-pink transition-all"
              >
                🎰 OPEN ANOTHER
              </button>
              <Link
                to="/dashboard"
                className="px-6 py-3 border border-cyan text-cyan font-body hover:bg-cyan hover:text-navy transition-all text-center"
              >
                📦 VIEW MY HAUL
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
