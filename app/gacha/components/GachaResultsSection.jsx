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

  return (
    <section ref={resultsRef} className="gacha-results-wrap" style={{ marginTop: '6rem' }}>
      <div className="gacha-results-controls">
        <h3>Box Size</h3>
        <div className="gacha-size-selector" role="radiogroup" aria-label="Select box size">
          {boxOptions.map((box) => (
            <button
              key={box.id}
              type="button"
              className={`gacha-size-btn ${selectedBoxId === box.id ? 'active' : ''}`}
              onClick={() => onBoxSizeChange(box.id)}
              disabled={isSpinning}
              aria-checked={selectedBoxId === box.id}
              role="radio"
            >
              <span className="gacha-size-emoji">{box.emoji}</span>
              <span className="gacha-size-name">{box.name}</span>
              <span className="gacha-size-pax">{box.pax}</span>
            </button>
          ))}
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
          selection.map((item) => (
            <article key={item.id} className="gacha-card">
              <div className="gacha-card-media">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="gacha-card-body">
                <h3>{item.name}</h3>
                <p>{item.country} · {item.rarity.toLowerCase()} pick</p>
                <div className="gacha-card-meta">
                  <span>{item.multiple * unitMultiplier} units</span>
                  <strong>${(item.numericValue * item.multiple * unitMultiplier).toFixed(2)}</strong>
                </div>
              </div>
            </article>
          ))}
      </div>
    </section>
  );
}


