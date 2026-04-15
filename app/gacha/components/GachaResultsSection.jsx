'use client';

export function GachaResultsSection({
  resultsRef,
  boxOptions,
  selectedBoxId,
  onBoxSizeChange,
  isSpinning,
  hasPulls,
  selection,
  unitMultiplier,
}) {
  const placeholderCount = selection.length || 6;

  const formatCategory = (category) => category.replace(/_/g, ' ');

  return (
    <section ref={resultsRef} className="gacha-results-wrap">
      <div className="gacha-results-controls">
        <h3>Box Size</h3>
        <div className="gacha-size-selector" role="radiogroup" aria-label="Select box size">
          {boxOptions.map((box) => {
            const isSelected = selectedBoxId === box.id;
            const boxIcon = isSelected ? (box.emojiSelected || box.emoji) : box.emoji;

            return (
            <button
              key={box.id}
              type="button"
              className={`gacha-size-btn ${isSelected ? 'active' : ''}`}
              onClick={() => onBoxSizeChange(box.id)}
              disabled={isSpinning}
              aria-checked={isSelected}
              role="radio"
            >
              <img className="gacha-size-emoji" src={boxIcon} alt={`${box.name} icon`} />
              <span className="gacha-size-name">{box.name}</span>
              <span className="gacha-size-price">
                <span className="gacha-size-price-value">{box.price}</span>
                <span className="gacha-size-period">/ month</span>
              </span>
              <span className="gacha-size-pax">{box.pax}</span>
            </button>
            );
          })}
        </div>
      </div>

      <div className="gacha-results">
        {!hasPulls &&
          Array.from({ length: placeholderCount }).map((_, idx) => (
            <article key={`placeholder-${idx}`} className="gacha-card gacha-card-placeholder" aria-hidden="true">
              <div className="gacha-card-media gacha-skeleton-block" />
              <div className="gacha-card-body">
                <div className="gacha-skeleton-line gacha-skeleton-title" />
                <div className="gacha-skeleton-line gacha-skeleton-subtitle" />
                <div className="gacha-card-meta">
                  <span className="gacha-skeleton-line gacha-skeleton-meta" />
                  <span className="gacha-skeleton-line gacha-skeleton-meta" />
                </div>
              </div>
            </article>
          ))}

        {hasPulls &&
          selection.map((item, idx) => (
            <article key={`gacha-result-${item.id}-${idx}`} className="gacha-card">
              <div className="gacha-card-media">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="gacha-card-body">
                <div className="gacha-card-header">
                  <span className={`gacha-rarity-badge ${item.rarity.toLowerCase()}`}>
                    {item.rarity.toLowerCase()}
                  </span>
                  <h3>{item.name}</h3>
                  <small className="gacha-category-text">{formatCategory(item.category)}</small>
                </div>
                <div className="gacha-card-meta">
                  <span>{item.multiple * unitMultiplier} units</span>
                  <strong>S${(item.numericValue * item.multiple * unitMultiplier).toFixed(2)}</strong>
                </div>
              </div>
            </article>
          ))}
      </div>
    </section>
  );
}


