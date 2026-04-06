'use client';

import { Coins, Gift, Sparkles, TrendingDown, TrendingUp } from 'lucide-react';
import { calcValue } from '@/app/gacha/utils/gachaHelpers';

export function GachaPullHistorySidebar({ pullHistory, selectedBoxName, unitMultiplier, boxPrice }) {
  const historyCount = pullHistory.length;
  const totalSpent = pullHistory.reduce((sum, pull) => sum + (pull.boxPrice ?? boxPrice), 0);
  const totalValue = pullHistory.reduce(
    (sum, pull) => sum + calcValue(pull.selection, pull.unitMultiplier ?? unitMultiplier),
    0,
  );
  const profit = totalValue - totalSpent;
  const roiPct = totalSpent > 0 ? ((totalValue / totalSpent - 1) * 100) : 0;
  const isPositive = profit >= 0;

  return (
    <div className="gacha-history-panel">
      <section className="gacha-history-roi" aria-label="Overall return on investment">
        <div className="gacha-history-roi-head">
          <Sparkles className="gacha-history-roi-icon" />
          <p className="gacha-history-roi-label">Overall Tracker</p>
        </div>

        <div className="gacha-history-roi-main">
          <p className="gacha-history-roi-subtitle">{isPositive ? 'Profit' : 'Down'}</p>
          <h4 className={isPositive ? 'positive' : 'negative'}>
            {isPositive ? '+' : '-'}${Math.abs(profit).toFixed(2)}
          </h4>
          <div className="gacha-history-roi-rate">
            {isPositive ? (
              <TrendingUp className="gacha-history-roi-trend" />
            ) : (
              <TrendingDown className="gacha-history-roi-trend" />
            )}
            <span>
              {roiPct >= 0 ? '+' : ''}
              {roiPct.toFixed(0)}% ROI
            </span>
          </div>
        </div>

        <div className="gacha-history-roi-meta-grid">
          <div className="gacha-history-roi-stat">
            <Coins className="gacha-history-roi-stat-icon" />
            <p>Spent</p>
            <strong>${totalSpent.toFixed(2)}</strong>
          </div>
          <div className="gacha-history-roi-stat">
            <Gift className="gacha-history-roi-stat-icon" />
            <p>Value Won</p>
            <strong>${totalValue.toFixed(2)}</strong>
          </div>
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
                  <span>{pull.boxName || selectedBoxName}</span>
                </div>

                {(() => {
                  const pullMultiplier = pull.unitMultiplier ?? unitMultiplier;
                  const pullBoxPrice = pull.boxPrice ?? boxPrice;
                  const pullValue = calcValue(pull.selection, pullMultiplier);
                  const savedValue = pullValue - pullBoxPrice;

                  return (
                    <>
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
                          {pull.selection.length} picks x{pullMultiplier}
                        </span>
                        <span className={savedValue >= 0 ? 'positive' : 'negative'}>
                          {savedValue >= 0 ? '+' : '-'}${Math.abs(savedValue).toFixed(2)} saved
                        </span>
                      </div>
                    </>
                  );
                })()}

                {hiddenCount > 0 && <p className="gacha-history-more">+{hiddenCount} more snacks in this month</p>}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}