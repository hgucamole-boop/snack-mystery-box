'use client';
export function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-ambient" aria-hidden="true">
        <span className="hero-blob hero-blob-left" />
        <span className="hero-blob hero-blob-right" />
      </div>

      <div className="hero-content">
        <div className="hero-copy">
          <div className="logo">Mari Makan</div>
          <h1 className="hero-title">
            UNBOX <br />
            PURE <br />
            CURIOSITY.
          </h1>
          <p className="hero-subtitle">
            The snack box that turns food waste into adventures. Curated from surplus, supply your pantries and events with treats and hidden gems from local markets. 
          </p>
          <div className="hero-actions">
            <a href="/drop2" className="cta-button hero-cta">
              TRY IT OUT
            </a>
          </div>
        </div>

        <div className="hero-photo-wrap">
          <div className="hero-photo-frame">
            <img
              src="/images/snackRescue.jpg"
              alt="A curated Mari Makan snack box with international treats"
              className="hero-photo"
            />
            <div className="hero-photo-overlay" />
          </div>
          <div className="hero-floating-badge" aria-hidden="true">
            <span className="hero-badge-icon">★</span>
          </div>
          <div className="hero-floating-note">
            <div className="hero-note-icon">→</div>
            <div>
              <p className="hero-note-title">Curated from surplus</p>
              <p className="hero-note-subtitle">Snacks and finds from local markets</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}