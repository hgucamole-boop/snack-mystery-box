'use client';
export function HeroSection() {
  return (
    <section className="hero">
      <div className="floating-items">
        <span className="float-item">🍫</span>
        <span className="float-item">🥤</span>
        <span className="float-item">🍪</span>
        <span className="float-item">🍬</span>
        <span className="float-item">🧃</span>
      </div>

      <div className="hero-content">
        <div className="hero-copy">
          <div className="logo">Mari Makan</div>
          <h1 className="hero-title">
            DISCOVER.<br />
            SAVE.<br />
            SNACK.
          </h1>
          <p className="hero-subtitle">
            Monthly fun boxes of <span className="highlight">rare imported snacks</span> and drinks
            at 40-60% off. Zero hunting. Pure discovery. Delivered to your office doorstep.
          </p>
          <a href="#pricing" className="cta-button">
            START EXPLORING
          </a>
        </div>

        <div className="hero-photo-wrap" aria-hidden="true">
          <div className="hero-photo-frame">
            <img
              src="/images/snackRescue.jpg"
              alt=""
              className="hero-photo"
            />
          </div>
        </div>
      </div>
    </section>
  );
}