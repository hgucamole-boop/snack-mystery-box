'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Coins, Gift, Sparkles } from 'lucide-react';
import { rarityColors, type SnackItemData } from '@/data/snackItems';

interface EarningsTrackerProps {
  drops: { item: SnackItemData; cost: number }[];
}

export function EarningsTracker({ drops }: EarningsTrackerProps) {
  const totalSpent = drops.reduce((sum, d) => sum + d.cost, 0);
  const totalValue = drops.reduce((sum, d) => sum + d.item.numericValue, 0);
  const profit = totalValue - totalSpent;
  const isPositive = profit >= 0;
  const roi = totalSpent > 0 ? ((totalValue / totalSpent - 1) * 100) : 0;

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-gold" />
        <h3 className="font-display text-sm text-cream">SESSION TRACKER</h3>
      </div>

      {/* Main profit display */}
      <div className="text-center p-4 rounded-lg" style={{
        background: isPositive
          ? 'linear-gradient(135deg, hsl(var(--cyan) / 0.1), hsl(var(--gold) / 0.05))'
          : 'linear-gradient(135deg, hsl(var(--pink) / 0.1), hsl(var(--destructive) / 0.05))'
      }}>
        <p className="font-body text-[10px] text-muted-foreground uppercase mb-1">
          {isPositive ? 'Profit' : 'Down'}
        </p>
        <AnimatePresence mode="wait">
          <motion.p
            key={profit.toFixed(2)}
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`font-display text-3xl ${isPositive ? 'text-green-400' : 'text-destructive'}`}
          >
            {isPositive ? '+' : ''}{profit > 0 ? '$' : '-$'}{Math.abs(profit).toFixed(2)}
          </motion.p>
        </AnimatePresence>
        <div className="flex items-center justify-center gap-1 mt-1">
          {isPositive ? <TrendingUp className="w-3 h-3 text-green-400" /> : <TrendingDown className="w-3 h-3 text-destructive" />}
          <span className={`font-body text-xs ${isPositive ? 'text-green-400' : 'text-destructive'}`}>
            {roi > 0 ? '+' : ''}{roi.toFixed(0)}% ROI
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2.5 bg-muted/30 rounded-lg text-center">
          <Coins className="w-3.5 h-3.5 text-gold mx-auto mb-1" />
          <p className="font-body text-[10px] text-muted-foreground">Spent</p>
          <p className="font-display text-sm text-cream">${totalSpent.toFixed(2)}</p>
        </div>
        <div className="p-2.5 bg-muted/30 rounded-lg text-center">
          <Gift className="w-3.5 h-3.5 text-cyan mx-auto mb-1" />
          <p className="font-body text-[10px] text-muted-foreground">Value Won</p>
          <p className="font-display text-sm text-cyan">${totalValue.toFixed(2)}</p>
        </div>
      </div>

      {/* Recent drops */}
      {drops.length > 0 && (
        <div>
          <p className="font-body text-[10px] text-muted-foreground uppercase mb-2">Recent Drops</p>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {drops.slice(0, 8).map((d, i) => {
              const itemProfit = d.item.numericValue - d.cost;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 p-1.5 rounded bg-muted/20"
                >
                  <img src={d.item.image} alt={d.item.name} className="w-7 h-7 object-contain rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-[10px] text-cream truncate">{d.item.name}</p>
                    <span
                      className="font-body text-[8px]"
                      style={{ color: `hsl(var(--${rarityColors[d.item.rarity]}))` }}
                    >
                      {d.item.rarity}
                    </span>
                  </div>
                  <span className={`font-display text-[10px] shrink-0 ${itemProfit >= 0 ? 'text-green-400' : 'text-destructive'}`}>
                    {itemProfit >= 0 ? '+' : ''}{itemProfit > 0 ? '$' : '-$'}{Math.abs(itemProfit).toFixed(2)}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {drops.length === 0 && (
        <p className="font-body text-xs text-muted-foreground text-center py-4">
          Open a drop to start tracking! 🎰
        </p>
      )}
    </div>
  );
}