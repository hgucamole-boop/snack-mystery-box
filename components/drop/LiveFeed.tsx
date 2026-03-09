'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { type Drop } from '@/lib/supabase';
import { snackItems, rarityColors, type Rarity } from '@/data/snackItems';
import { useSnackModal } from '@/app/components/SnackModalProvider';

// Generate fake usernames
const fakeUsernames = [
  'snackfan_92', 'officeSnacker', 'lunchbreak', 'munchy_mike', 'snackattack',
  'pantryQueen', 'treatYoSelf', 'nibbleNinja', 'crunchMaster', 'snackHunter',
  'teatimeEats', 'biteSize_ben', 'yumYumYuki', 'snackLord99', 'munchieMax'
];

interface FakeDrop {
  id: number;
  username: string;
  item: typeof snackItems[0];
  createdAt: Date;
}

function generateFakeDrop(id: number): FakeDrop {
  return {
    id,
    username: fakeUsernames[Math.floor(Math.random() * fakeUsernames.length)],
    item: snackItems[Math.floor(Math.random() * snackItems.length)],
    createdAt: new Date(Date.now() - Math.random() * 60000), // Last 60 seconds
  };
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  return `${Math.floor(seconds / 60)}m ago`;
}

export function LiveFeed() {
  const [drops, setDrops] = useState<FakeDrop[]>([]);
  const { openSnack } = useSnackModal(); 
  
  useEffect(() => {
    // Initialize with fake drops
    const initialDrops = Array.from({ length: 15 }, (_, i) => generateFakeDrop(i));
    setDrops(initialDrops);

    // Add new fake drops periodically
    const interval = setInterval(() => {
      setDrops((prev) => {
        const newDrop = generateFakeDrop(Date.now());
        return [newDrop, ...prev].slice(0, 20);
      });
    }, 3000 + Math.random() * 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 bg-pink rounded-full animate-pulse" />
        <h3 className="font-display text-xl text-cream">LIVE DROPS</h3>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="space-y-2 h-full overflow-y-auto pr-2 scrollbar-thin">
          <AnimatePresence mode="popLayout">
            {drops.map((drop) => (
              <motion.div
                key={drop.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-navy-2 border border-border p-3 text-sm"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <img src={drop.item.image} alt={drop.item.name} className="w-8 h-8 object-contain" />
                  <span className="font-body text-cyan">@{drop.username}</span>
                  <span className="font-body text-muted-foreground">pulled</span>
                  <span className="font-heading text-cream">{drop.item.name}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span
                    className="px-2 py-0.5 text-xs font-body border"
                    style={{
                      backgroundColor: `hsl(var(--${rarityColors[drop.item.rarity]}) / 0.1)`,
                      color: `hsl(var(--${rarityColors[drop.item.rarity]}))`,
                      borderColor: `hsl(var(--${rarityColors[drop.item.rarity]}))`,
                    }}
                  >
                    {drop.item.rarity}
                  </span>
                  <span className="font-body text-xs text-muted-foreground">
                    {formatTimeAgo(drop.createdAt)}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
