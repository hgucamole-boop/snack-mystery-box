'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const fakeUsernames = [
  'snackhunter',
  'officemunch',
  'dailytreat',
  'boxbreaker',
  'hotchipclub',
  'snackloop',
  'unboxwithme',
  'teambites',
  'nibblemode',
  'sweetandsalty',
  'munchminute',
  'tokyocrunch',
  'pantryscout',
  'breakroomhero',
];

const rarityClassMap = {
  common: 'common',
  rare: 'rare',
  legendary: 'legendary',
};

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function randomUsername() {
  return fakeUsernames[Math.floor(Math.random() * fakeUsernames.length)];
}

function buildFakePull(id, items) {
  const item = randomItem(items);
  return {
    id,
    item,
    username: randomUsername(),
    monthLabel: `Month ${Math.floor(Math.random() * 12) + 1}`,
    rarityTone: rarityClassMap[item.rarity] || 'common',
  };
}

export function GachaLivePullsSidebar({ snacks }) {
  const [livePulls, setLivePulls] = useState([]);

  useEffect(() => {
    if (!snacks.length) return undefined;

    const initial = Array.from({ length: 14 }, (_, idx) => buildFakePull(`seed-${idx}`, snacks));
    setLivePulls(initial);

    const intervalMs = 2600;
    const intervalId = setInterval(() => {
      setLivePulls((prev) => [buildFakePull(`live-${Date.now()}`, snacks), ...prev].slice(0, 24));
    }, intervalMs);

    return () => clearInterval(intervalId);
  }, [snacks]);

  return (
    <div className="gacha-live-panel">
      <div className="gacha-sidebar-heading">
        <span className="gacha-live-dot gacha-live-dot-pulse" aria-hidden="true" />
        <h3>Live Pulls</h3>
      </div>

      <p className="gacha-sidebar-subtitle">Players are opening the same snack pool in real time.</p>

      <div className="gacha-live-list" role="log" aria-live="polite" aria-label="Recent live pulls">
        <AnimatePresence initial={false} mode="popLayout">
          {livePulls.map((pull) => (
            <motion.article
              key={pull.id}
              className="gacha-live-item"
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -14, height: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              layout
            >
              <div className={`gacha-live-thumb ${pull.rarityTone}`}>
                <img src={pull.item.image} alt={pull.item.name} />
              </div>

              <div className="gacha-live-text">
                <p>{pull.item.name}</p>
                <span>
                  @{pull.username} · {pull.monthLabel}
                </span>
              </div>

              <strong>{pull.item.value}</strong>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}