'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ROLL_ITEM_H,
  ROLL_WINDOW_H,
  RESULT_IDX,
  buildStrip,
} from '@/app/gacha/utils/gachaHelpers';
import { ReelSnackItem } from './ReelSnackItem';

export function ReelColumn({ items, target, reelIdx, spinTrigger, onDone, isSpinning, isSettled, unitMultiplier = 1 }) {
  const windowRef = useRef(null);
  const stripRef = useRef(null);
  const animRef = useRef(null);
  const [strip, setStrip] = useState([]);
  const isIdle = !isSpinning && spinTrigger === 0;

  const getReelMetrics = () => {
    const firstItem = stripRef.current?.firstElementChild;
    const itemRectHeight = firstItem?.getBoundingClientRect().height || ROLL_ITEM_H;
    const itemStyles = firstItem ? window.getComputedStyle(firstItem) : null;
    const marginTop = itemStyles ? Number.parseFloat(itemStyles.marginTop) || 0 : 0;
    const marginBottom = itemStyles ? Number.parseFloat(itemStyles.marginBottom) || 0 : 0;
    const itemHeight = itemRectHeight + marginTop + marginBottom;
    const windowHeight = windowRef.current?.getBoundingClientRect().height || ROLL_WINDOW_H;
    return { itemHeight, windowHeight };
  };

  useEffect(() => {
    if (spinTrigger === 0) {
      setStrip([...items, ...items]);
    }
  }, [items, spinTrigger]);

  useEffect(() => {
    if (spinTrigger === 0) return;

    const newStrip = buildStrip(target, items);
    setStrip(newStrip);

    const raf = requestAnimationFrame(() => {
      if (stripRef.current) stripRef.current.style.transform = 'translateY(0px)';

      const stopDelay = 900 + reelIdx * 420;
      const startTime = performance.now();
      let pos = 0;
      const { itemHeight, windowHeight } = getReelMetrics();

      if (animRef.current) cancelAnimationFrame(animRef.current);

      function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / stopDelay);
        const speed = progress > 0.75
          ? itemHeight * 0.58 * (1 - (progress - 0.75) / 0.25) + itemHeight * 0.03
          : itemHeight * 0.58;

        pos += speed;

        const loopAt = (RESULT_IDX - 4) * itemHeight;
        if (pos >= loopAt) pos = pos % loopAt;

        if (elapsed >= stopDelay && speed <= itemHeight * 0.05) {
          if (stripRef.current) {
            const settleAt = RESULT_IDX * itemHeight + (itemHeight / 2) - (windowHeight / 2);
            stripRef.current.style.transform = `translateY(-${settleAt}px)`;
          }
          onDone(reelIdx);
          return;
        }

        if (stripRef.current) stripRef.current.style.transform = `translateY(-${pos}px)`;
        animRef.current = requestAnimationFrame(tick);
      }

      animRef.current = requestAnimationFrame(tick);
    });

    return () => {
      cancelAnimationFrame(raf);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [spinTrigger, reelIdx, target, items, onDone]);

  return (
    <div
      ref={windowRef}
      className={`gacha-roller-window ${isSpinning && !isSettled ? 'spinning' : ''} ${isSettled ? 'settled' : ''}`.trim()}
    >
      <div className="gacha-roller-payline" />
      <div
        ref={stripRef}
        className={`gacha-roller-track ${isIdle ? 'idle' : ''}`.trim()}
        style={isIdle ? { animationDuration: `${42 + reelIdx * 4}s` } : undefined}
      >
        {strip.map((item, itemIdx) => (
          <ReelSnackItem
            key={`${item.id}-${reelIdx}-${itemIdx}`}
            item={item}
            isTarget={itemIdx === RESULT_IDX}
            unitMultiplier={unitMultiplier}
          />
        ))}
      </div>
    </div>
  );
}



