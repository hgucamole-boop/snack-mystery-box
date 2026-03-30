'use client';

import { calcValue } from '@/app/gacha/utils/gachaHelpers';

export function GachaPullHistorySidebar({ pullHistory, selectedBoxName, unitMultiplier, boxPrice }) {
  const historyCount = pullHistory.length;
  const totalSpent = historyCount * boxPrice;
  const totalValue = pullHistory.reduce((sum, pull) => sum + calcValue(pull.selection, unitMultiplier), 0);
  const profit = totalValue - totalSpent;
  const roiPct = totalSpent > 0 ? ((totalValue / totalSpent - 1) * 100) : 0;
  const isPositive = profit >= 0;

  return (
    <div className="gacha-history-panel">
      <section className="gacha-history-roi" aria-label="Overall return on investment">
        <p className="gacha-history-roi-label">Overall ROI</p>
        <h4 className={isPositive ? 'positive' : 'negative'}>
          {roiPct >= 0 ? '+' : ''}
          {roiPct.toFixed(0)}%
        </h4>
        <div className="gacha-history-roi-meta">
          <span>Spent: ${totalSpent.toFixed(2)}</span>
          <span>Value: ${totalValue.toFixed(2)}</span>
        </div>
      </section>

      <div className="gacha-sidebar-heading">
        <span className="gacha-live-dot" aria-hidden="true" />
        <h3>Your Pull History</h3>
      </div>

      <p className="gacha-sidebar-subtitle">Each generated box is logged as your next month.</p>

      {historyCount === 0 && (
        <p className="gacha-history-empty">No pulls yet. Generate your first box to create Month 1.</p>
      )}

      {historyCount > 0 && (
        <div className="gacha-history-list">
          {pullHistory.map((pull) => {
            const topItems = pull.selection.slice(0, 2);
            const hiddenCount = Math.max(0, pull.selection.length - topItems.length);

            return (
              <article key={pull.id} className="gacha-history-item">
                <div className="gacha-history-item-head">
                  <strong>{pull.monthLabel}</strong>
                  <span>{selectedBoxName}</span>
                </div>

                <div className="gacha-history-preview">
                  {topItems.map((item) => (
                    <div key={`${pull.id}-${item.id}`} className="gacha-history-snack">
                      <img src={item.image} alt={item.name} />
                      <p>{item.name}</p>
                    </div>
                  ))}
                </div>

                <div className="gacha-history-meta">
                  <span>
                    {pull.selection.length} picks x{unitMultiplier}
                  </span>
                  <span>${calcValue(pull.selection, unitMultiplier).toFixed(2)}</span>
                </div>

                {hiddenCount > 0 && <p className="gacha-history-more">+{hiddenCount} more snacks in this month</p>}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}