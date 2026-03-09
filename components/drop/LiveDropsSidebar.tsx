'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { snackItems, rarityColors } from '@/data/snackItems';

const fakeUsernames = [
  'snackfan92', 'officeSnacker', 'lunchbreak', 'munchyMike', 'snackattack',
  'pantryQueen', 'treatYoSelf', 'nibbleNinja', 'crunchMaster', 'snackHunter',
  'teatimeEats', 'biteSizeBen', 'yumYumYuki', 'snackLord99', 'munchieMax',
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
    createdAt: new Date(Date.now() - Math.random() * 60000),
  };
}

export function LiveDropsSidebar() {
  const [drops, setDrops] = useState<FakeDrop[]>([]);

  useEffect(() => {
    const initialDrops = Array.from({ length: 20 }, (_, i) => generateFakeDrop(i));
    setDrops(initialDrops);

    const interval = setInterval(() => {
      setDrops((prev) => {
        const newDrop = generateFakeDrop(Date.now());
        return [newDrop, ...prev].slice(0, 25);
      });
    }, 2500 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-[280px] shrink-0 hidden xl:flex flex-col border-l border-border bg-card h-[calc(100vh-56px)] sticky top-14">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-pink" />
        </span>
        <span className="font-display text-sm text-cream">LIVE DROPS</span>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="popLayout">
          {drops.map((drop) => (
            <motion.div
              key={drop.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-3 px-3 py-2.5 border-b border-border/50 hover:bg-muted/30 transition-colors"
            >
              <div
                className="w-12 h-12 shrink-0 flex items-center justify-center border rounded"
                style={{
                  borderColor: `hsl(var(--${rarityColors[drop.item.rarity]}) / 0.5)`,
                  backgroundColor: `hsl(var(--${rarityColors[drop.item.rarity]}) / 0.05)`,
                }}
              >
                <img src={drop.item.image} alt={drop.item.name} className="w-9 h-9 object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-xs text-cream truncate">{drop.item.name}</p>
                <p className="font-body text-[10px] text-muted-foreground truncate">@{drop.username}</p>
              </div>
              <span
                className="font-body text-xs font-bold shrink-0"
                style={{ color: `hsl(var(--${rarityColors[drop.item.rarity]}))` }}
              >
                {drop.item.value}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}