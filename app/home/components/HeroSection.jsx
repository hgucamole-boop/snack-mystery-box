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
            The monthly adventure for your tastebuds. Hand-picked, hard-to-find global snacks delivered to your door in a box of pure mystery.
          </p>
          <div className="hero-actions">
            <a href="#pricing" className="cta-button">
              START YOUR JOURNEY
            </a>
            <a href="#pricing" className="cta-button secondary">
              HOW IT WORKS
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
              <p className="hero-note-title">Curated Worldwide</p>
              <p className="hero-note-subtitle">Rare snacks from 20+ countries</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}