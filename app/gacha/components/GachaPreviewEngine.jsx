'use client';

import { ReelColumn } from '@/app/gacha/components/ReelColumn';
import { ROLL_COLUMNS } from '@/app/gacha/utils/gachaHelpers';

export function GachaPreviewEngine({
  columns,
  pendingSelection,
  spinTrigger,
  onReelDone,
  isSpinning,
  settledCount,
  onGenerate,
  unitMultiplier,
}) {
  return (
    <section className="gacha-engine">
      {/* <h2>Preview Generator</h2>
      <p>Take a look at this month's selection of snacks. Box size changes the quantity per snack in your final box.</p> */}

      <div className="gacha-rollers">
        {columns.map((col, colIdx) => (
          <ReelColumn
            key={colIdx}
            items={col}
            target={pendingSelection[colIdx]}
            reelIdx={colIdx}
            spinTrigger={spinTrigger}
            onDone={onReelDone}
            isSpinning={isSpinning}
            isSettled={settledCount > colIdx}
            unitMultiplier={unitMultiplier}
          />
        ))}
      </div>

      <div className="gacha-engine-actions">
        <button className="gacha-primary-btn" onClick={onGenerate} disabled={isSpinning}>
          {isSpinning ? `Generating ${settledCount}/${ROLL_COLUMNS}` : 'Generate My Selection'}
        </button>
      </div>
    </section>
  );
}



