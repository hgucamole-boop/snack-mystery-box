import { motion } from 'framer-motion';
import { caseConfig, type Rarity, rarityColors } from '@/data/snackItems';
import { useStore } from '@/store/useStore';

type CaseType = keyof typeof caseConfig;

interface CaseSelectorProps {
  onSelect: (caseType: CaseType) => void;
}

export function CaseSelector({ onSelect }: CaseSelectorProps) {
  const selectedCase = useStore((state) => state.selectedCase);
  const setSelectedCase = useStore((state) => state.setSelectedCase);

  const handleSelect = (caseType: CaseType) => {
    setSelectedCase(caseType);
    onSelect(caseType);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-display text-2xl text-cream">SELECT YOUR CASE</h3>
      <div className="grid grid-cols-1 gap-4">
        {(Object.entries(caseConfig) as [CaseType, typeof caseConfig[CaseType]][]).map(([key, config]) => (
          <motion.button
            key={key}
            onClick={() => handleSelect(key)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative p-4 bg-navy-2 border-2 transition-all text-left ${
              selectedCase === key
                ? 'border-cyan glow-cyan'
                : 'border-border hover:border-muted-foreground'
            }`}
          >
            {config.hot && (
              <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-pink text-primary-foreground font-body text-xs">
                ⭐ HOT
              </span>
            )}
            {selectedCase === key && (
              <span className="absolute top-2 right-2 px-2 py-0.5 bg-cyan text-navy font-body text-xs">
                SELECTED
              </span>
            )}
            
            <div className="flex items-center gap-4">
              <span className="text-4xl">{config.emoji}</span>
              <div>
                <h4 className="font-heading text-lg text-cream">{config.name}</h4>
                <p className="font-display text-2xl text-pink">${config.price}</p>
                <p className="font-body text-xs text-muted-foreground">
                  {config.credits} credits
                </p>
              </div>
            </div>
            
            <div className="mt-3 flex gap-2 flex-wrap">
              {config.rarities.map((rarity) => (
                <span
                  key={rarity}
                  className={`px-2 py-0.5 text-xs font-body border bg-${rarityColors[rarity]}/10 text-${rarityColors[rarity]} border-${rarityColors[rarity]}`}
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
        ))}
      </div>
    </div>
  );
}
