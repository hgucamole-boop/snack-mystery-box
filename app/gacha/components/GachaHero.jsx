'use client';

export function GachaHero() {
  return (
    <header className="gacha-hero" style={{ paddingTop: "1rem" }}>
      {/* <div className="gacha-hero-badge">Sustainable Discovery</div> */}
      <h1 className="gacha-title">
        Preview Your Snack Adventure
        {/* <p><span>Curated Selection</span></p> */}
      </h1>
      <p className="gacha-subtitle">
        Every box is a unique rescue mission. We curate premium selections from surplus inventory and rescued ingredients to fight food waste while delivering joy to your door.
      </p>
      <div className="gacha-chips">
        <span>Rescued Inventory</span>
        <span>Zero Waste Goal</span>
      </div>
    </header>
  );
}


