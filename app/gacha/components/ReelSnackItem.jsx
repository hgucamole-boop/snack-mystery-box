'use client';

const rarityClassMap = {
  common: 'common',
  rare: 'rare',
  legendary: 'legendary',
};

export function ReelSnackItem({ item, isTarget, unitMultiplier = 1 }) {
  const rarityTone = rarityClassMap[item.rarity] || 'common';
  const quantity = (item.multiple || 1) * unitMultiplier;
  const quantityLabel = Number.isInteger(quantity) ? `${quantity}` : quantity.toFixed(1).replace(/\.0$/, '');
  const badgeTone = unitMultiplier >= 3 ? 'large' : unitMultiplier === 2 ? 'medium' : 'small';

  return (
    <div className={`gacha-roller-item ${isTarget ? 'target' : 'decoy'}`}>
      <div className={`gacha-roller-item-surface ${rarityTone}`}>
        <img src={item.image} alt={item.name} />
      </div>
      <span className={`gacha-roller-qty-tag ${badgeTone}`}>x{quantityLabel}</span>
    </div>
  );
}
