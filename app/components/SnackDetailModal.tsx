import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Sparkles, DollarSign } from 'lucide-react';
import { type SnackItemData, rarityColors } from '../../data/snackItems';

const countryNames: Record<string, string> = {
  '🇯🇵': 'Japan', '🇺🇸': 'USA', '🇲🇾': 'Malaysia', '🇸🇬': 'Singapore',
  '🇰🇷': 'Korea', '🇹🇼': 'Taiwan', '🇩🇪': 'Germany', '🇻🇳': 'Vietnam',
};

interface SnackDetailModalProps {
  item: SnackItemData | null;
  onClose: () => void;
}

export function SnackDetailModal({ item, onClose }: SnackDetailModalProps) {
  if (!item) return null;

  const color = rarityColors[item.rarity];
  const countryName = countryNames[item.country] || 'Unknown';

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          key="snack-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            key="snack-modal-content"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-card border-2 rounded-xl overflow-hidden"
            style={{
              borderColor: `hsl(var(--${color}))`,
              boxShadow: `0 0 40px hsl(var(--${color}) / 0.2), 0 0 80px hsl(var(--${color}) / 0.1)`,
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-muted/80 text-muted-foreground hover:text-cream hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image area */}
            <div
              className="relative flex items-center justify-center py-10 px-8"
              style={{
                background: `radial-gradient(ellipse at center, hsl(var(--${color}) / 0.08) 0%, transparent 70%)`,
              }}
            >
              {/* Glow ring behind image */}
              <div
                className="absolute w-48 h-48 rounded-full blur-3xl opacity-20"
                style={{ backgroundColor: `hsl(var(--${color}))` }}
              />
              <motion.img
                src={item.image}
                alt={item.name}
                className="relative w-52 h-52 object-contain drop-shadow-2xl"
                initial={{ scale: 0.8, rotate: -5 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 15, stiffness: 200 }}
              />
            </div>

            {/* Details */}
            <div className="px-6 pb-6 -mt-2">
              {/* Rarity badge */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="px-3 py-1 text-xs font-body font-bold border rounded-full"
                  style={{
                    backgroundColor: `hsl(var(--${color}) / 0.15)`,
                    color: `hsl(var(--${color}))`,
                    borderColor: `hsl(var(--${color}) / 0.4)`,
                  }}
                >
                  {item.rarity}
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Name */}
              <h2 className="font-display text-2xl md:text-3xl text-cream mb-3">
                {item.name}
              </h2>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 p-3 bg-muted/40 rounded-lg">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="font-body text-[10px] text-muted-foreground uppercase">Origin</p>
                    <p className="font-body text-sm text-cream">{item.country} {countryName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-muted/40 rounded-lg">
                  <DollarSign className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="font-body text-[10px] text-muted-foreground uppercase">Retail Value</p>
                    <p className="font-body text-sm text-gold font-bold">{item.value}</p>
                  </div>
                </div>
              </div>

              {/* Rarity meter */}
              <div className="p-3 bg-muted/40 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4" style={{ color: `hsl(var(--${color}))` }} />
                  <p className="font-body text-xs text-muted-foreground uppercase">Rarity Level</p>
                </div>
                <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-muted">
                  {(['COMMON', 'RARE', 'EPIC', 'LEGENDARY', 'ULTRA'] as const).map((r, i) => {
                    const rarityIndex = ['COMMON', 'RARE', 'EPIC', 'LEGENDARY', 'ULTRA'].indexOf(item.rarity);
                    const isActive = i <= rarityIndex;
                    return (
                      <div
                        key={r}
                        className="flex-1 rounded-full transition-colors"
                        style={{
                          backgroundColor: isActive ? `hsl(var(--${rarityColors[r]}))` : undefined,
                          opacity: isActive ? 1 : 0.15,
                        }}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between mt-1">
                  <span className="font-body text-[9px] text-muted-foreground">Common</span>
                  <span className="font-body text-[9px] text-muted-foreground">Ultra</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
