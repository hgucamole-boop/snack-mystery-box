'use client';
import { motion } from 'framer-motion';
import { caseConfig, rarityColors } from '@/app/drop/data/snackItems';
import { useStore } from '@/store/useStore';

export function CaseSelector({ onSelect }) {
  const selectedCase = useStore((state) => state.selectedCase);
  const setSelectedCase = useStore((state) => state.setSelectedCase);

  const handleSelect = (caseType) => {
    setSelectedCase(caseType);
    onSelect(caseType);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-display text-2xl text-cream">SELECT YOUR CASE</h3>
      <div className="grid grid-cols-1 gap-4">
        {Object.entries(caseConfig).map(([key, config]) => {
          const isSelected = selectedCase === key;
          const caseIcon = isSelected ? (config.emojiSelected || config.emoji) : config.emoji;

          return (
          <motion.button
            key={key}
            onClick={() => handleSelect(key)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative p-4 bg-navy-2 border-2 transition-all text-left ${
              isSelected
                ? 'border-cyan glow-cyan'
                : 'border-border hover:border-muted-foreground'
            }`}
          >
            {config.hot && (
              <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-pink text-primary-foreground font-body text-xs">
                ⭐ HOT
              </span>
            )}
            {isSelected && (
              <span className="absolute top-2 right-2 px-2 py-0.5 bg-cyan text-navy font-body text-xs">
                SELECTED
              </span>
            )}

            <div className="flex items-center gap-4">
              <img src={caseIcon} alt={`${config.name} icon`} className="w-10 h-10 object-contain" />
              <div>
                <h4 className="font-heading text-lg text-cream">{config.name}</h4>
                <p className="font-display text-2xl text-pink">${config.price}</p>
              </div>
            </div>

            <div className="mt-3 flex gap-2 flex-wrap">
              {config.rarities.map((rarity) => (
                <span
                  key={rarity}
                  className="px-2 py-0.5 text-xs font-body border"
                  style={{
                    backgroundColor: `hsl(var(--${rarityColors[rarity]}) / 0.1)`,
                    color: `hsl(var(--${rarityColors[rarity]}))`,
                    borderColor: `hsl(var(--${rarityColors[rarity]}))`,
                  }}
                >
                  {rarity}
                </span>
              ))}
            </div>
          </motion.button>
          );
        })}
      </div>
    </div>
  );
}