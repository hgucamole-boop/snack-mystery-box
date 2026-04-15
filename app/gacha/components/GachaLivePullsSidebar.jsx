'use client';

import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Leaf, PackageCheck, Recycle } from 'lucide-react';

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

function getUnitsForPull(pull) {
  const multiplier = Number.isFinite(Number(pull?.unitMultiplier)) && Number(pull.unitMultiplier) > 0
    ? Number(pull.unitMultiplier)
    : 1;

  return (pull?.selection || []).reduce((sum, item) => {
    const itemUnits = Number.isFinite(Number(item?.multiple)) && Number(item.multiple) > 0
      ? Number(item.multiple)
      : 1;
    return sum + itemUnits * multiplier;
  }, 0);
}

export function GachaLivePullsSidebar({ snacks, pullHistory = [] }) {
  const [livePulls, setLivePulls] = useState([]);

  const sustainabilityTotals = useMemo(() => {
    const snacksRescued = pullHistory.reduce((total, pull) => total + getUnitsForPull(pull), 0);
    return {
      snacksRescued,
      co2Kg: snacksRescued * 0.18,
      wasteKg: snacksRescued * 0.2,
    };
  }, [pullHistory]);

  useEffect(() => {
    if (!snacks.length) return undefined;

    const initial = Array.from({ length: 14 }, (_, idx) => buildFakePull(`seed-${idx}`, snacks));
    setLivePulls(initial);

    let timeoutId;
    let isCancelled = false;

    const minDelayMs = 1200;
    const maxDelayMs = 5200;

    const scheduleNextPull = () => {
      const nextDelay = Math.floor(Math.random() * (maxDelayMs - minDelayMs + 1)) + minDelayMs;

      timeoutId = setTimeout(() => {
        if (isCancelled) return;

        const nextPull = buildFakePull(`live-${Date.now()}`, snacks);
        setLivePulls((prev) => [nextPull, ...prev].slice(0, 24));
        scheduleNextPull();
      }, nextDelay);
    };

    scheduleNextPull();

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [snacks]);

  return (
    <div className="gacha-live-panel">
      <section className="gacha-sustainability-tracker" aria-label="Sustainability tracker">
        <div className="gacha-sustainability-head">
          <Leaf className="gacha-sustainability-icon" />
          <p>Sustainability Tracker</p>
        </div>

        <div className="gacha-sustainability-grid">
          <article>
            <PackageCheck className="gacha-sustainability-stat-icon" />
            <span>Units Rescued</span>
            <strong>{Math.round(sustainabilityTotals.snacksRescued)}</strong>
          </article>
          <article>
            <Recycle className="gacha-sustainability-stat-icon" />
            <span>Food Saved</span>
            <strong>{sustainabilityTotals.wasteKg.toFixed(1)} kg</strong>
          </article>
          <article>
            <Leaf className="gacha-sustainability-stat-icon" />
            <span>CO2 Avoided</span>
            <strong>{sustainabilityTotals.co2Kg.toFixed(1)} kg</strong>
          </article>
        </div>
      </section>

      <div className="gacha-sidebar-heading">
        <span className="gacha-live-dot gacha-live-dot-pulse" aria-hidden="true" />
        <h3>Live Pulls</h3>
      </div>

      <p className="gacha-sidebar-subtitle">See what others are pulling in real time!</p>

      <div className="gacha-live-list" role="log" aria-live="polite" aria-label="Recent live pulls">
        <AnimatePresence initial={false} mode="sync">
          {livePulls.map((pull) => (
            <motion.article
              key={pull.id}
              className="gacha-live-item"
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -14, height: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
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