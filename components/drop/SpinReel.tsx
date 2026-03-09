'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { snackItems, rarityColors, caseConfig, getRandomItemForCase, type SnackItemData } from '@/data/snackItems';
import { useStore } from '@/store/useStore';

interface SpinReelProps {
  onResult: (item: SnackItemData) => void;
  triggerSpin?: number;
  onSnackClick?: (item: SnackItemData) => void;
}

export function SpinReel({ onResult, triggerSpin, onSnackClick }: SpinReelProps) {
  const selectedCase = useStore((state) => state.selectedCase);
  const isSpinning = useStore((state) => state.isSpinning);
  const setIsSpinning = useStore((state) => state.setIsSpinning);
  
  const [reelItems, setReelItems] = useState<SnackItemData[]>([]);
  const [resultItem, setResultItem] = useState<SnackItemData | null>(null);
  
  const config = caseConfig[selectedCase];
  const caseItems = snackItems.filter(item => config.rarities.includes(item.rarity));

  const generateReelItems = (winner: SnackItemData): SnackItemData[] => {
    const items: SnackItemData[] = [];
    for (let i = 0; i < 40; i++) {
      if (i === 37) {
        items.push(winner);
      } else {
        items.push(caseItems[Math.floor(Math.random() * caseItems.length)]);
      }
    }
    return items;
  };

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResultItem(null);
    const winner = getRandomItemForCase(selectedCase);
    setReelItems(generateReelItems(winner));
    setTimeout(() => {
      setIsSpinning(false);
      setResultItem(winner);
      onResult(winner);
    }, 4000);
  };

  useEffect(() => {
    const initialItems = Array.from({ length: 40 }, () => 
      caseItems[Math.floor(Math.random() * caseItems.length)]
    );
    setReelItems(initialItems);
  }, [selectedCase]);

  useEffect(() => {
    if (triggerSpin && triggerSpin > 0) {
      handleSpin();
    }
  }, [triggerSpin]);

  const itemWidth = 136;
  const scrollDistance = itemWidth * 37 - (typeof window !== 'undefined' ? window.innerWidth / 2 : 600) + 60;

  return (
    <div className="w-full">
      <div className="relative h-8 flex justify-center">
        <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[16px] border-l-transparent border-r-transparent border-t-cyan" />
      </div>
      
      <div className="relative overflow-hidden bg-navy-2 border-y-2 border-cyan py-4">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-navy-2 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-navy-2 to-transparent z-10 pointer-events-none" />
        
        <motion.div
          className="flex gap-4 px-4"
          animate={isSpinning ? { x: -scrollDistance } : {}}
          transition={isSpinning ? { duration: 4, ease: [0.25, 0.46, 0.45, 0.94] } : {}}
          style={{ filter: isSpinning ? 'blur(1px)' : 'none' }}
        >
          {reelItems.map((item, index) => (
            <motion.div
              key={`${item.id}-${index}`}
              onClick={() => !isSpinning && onSnackClick && onSnackClick(item)}
              className="shrink-0 w-[120px] h-[120px] flex flex-col items-center justify-center border-2 bg-navy transition-all cursor-pointer hover:scale-105"
              style={{
                borderColor: !isSpinning && resultItem && index === 37 
                  ? `hsl(var(--${rarityColors[item.rarity]}))` 
                  : undefined,
                boxShadow: !isSpinning && resultItem && index === 37
                  ? `0 0 20px hsl(var(--${rarityColors[item.rarity]}) / 0.6)`
                  : undefined,
              }}
            >
              <img src={item.image} alt={item.name} className="w-16 h-16 object-contain mb-1" />
              <span
                className="px-2 py-0.5 text-[10px] font-body"
                style={{
                  backgroundColor: `hsl(var(--${rarityColors[item.rarity]}) / 0.2)`,
                  color: `hsl(var(--${rarityColors[item.rarity]}))`,
                }}
              >
                {item.rarity}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      <div className="mt-6 flex flex-col items-center gap-4">
        <motion.button
          onClick={handleSpin}
          disabled={isSpinning}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-12 py-4 bg-pink text-primary-foreground font-display text-2xl border-2 border-gold hover:glow-gold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSpinning ? '🎰 SPINNING...' : '🎰 OPEN DROP'}
        </motion.button>
      </div>
    </div>
  );
}