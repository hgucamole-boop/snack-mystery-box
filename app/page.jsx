'use client';
import { useState, useEffect } from 'react';

// Google Analytics Helper
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with your GA4 Measurement ID

export function initGA() {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID);
  }
}

export function trackEvent(eventName, eventParams = {}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
}

export default function SnackBoxLanding() {
  const [email, setEmail] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('weekly');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load Google Analytics
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);
    
    script.onload = () => {
      initGA();
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Track signup event
    trackEvent('subscription_signup', {
      plan: selectedPlan,
      email: email
    });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert(`Thanks for subscribing to the ${selectedPlan} plan! We'll send confirmation to ${email}`);
    setEmail('');
    setIsSubmitting(false);
  };

  const plans = [
    {
      id: 'weekly',
      name: 'Weekly Mystery',
      price: '$12',
      items: '8-12 items',
      description: 'A surprise every week'
    },
    {
      id: 'biweekly',
      name: 'Bi-Weekly Discovery',
      price: '$20',
      items: '15-20 items',
      description: 'Bigger boxes, bigger savings',
      popular: true
    },
    {
      id: 'monthly',
      name: 'Monthly Treasure',
      price: '$35',
      items: '30-40 items',
      description: 'Maximum variety'
    }
  ];

  const features = [
    { icon: '📦', title: 'Mystery Boxes', desc: 'Curated surprises delivered to your door' },
    { icon: '🌍', title: 'Global Snacks', desc: 'Imported treats from around the world' },
    { icon: '💰', title: 'Unbeatable Value', desc: 'Save 60-80% on retail prices' },
    { icon: '♻️', title: 'Fight Food Waste', desc: 'Near-expiry doesn\'t mean bad quality' },
    { icon: '🎁', title: 'Always Different', desc: 'New discoveries every delivery' },
    { icon: '🚚', title: 'Zero Effort', desc: 'No hunting, just unboxing joy' }
  ];

  return (
    <div className="landing-container">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=Archivo+Black&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --primary: #FF2E63;
          --secondary: #FFD700;
          --dark: #1A1A2E;
          --light: #FFF5E1;
          --accent: #00D9FF;
          --green: #7FFF00;
        }

        .landing-container {
          min-height: 100vh;
          background: var(--dark);
          color: var(--light);
          font-family: 'Space Mono', monospace;
          overflow-x: hidden;
        }

        /* Animated Background */
        .landing-container::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 20% 50%, rgba(255, 46, 99, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(0, 217, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, rgba(255, 215, 0, 0.08) 0%, transparent 50%);
          animation: floatBg 20s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes floatBg {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }

        /* Hero Section */
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          text-align: center;
          z-index: 1;
        }

        .logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2rem, 5vw, 3rem);
          color: var(--secondary);
          letter-spacing: 4px;
          margin-bottom: 1rem;
          text-shadow: 3px 3px 0 var(--primary);
          animation: slideDown 0.8s ease-out;
        }

        @keyframes slideDown {
          from { transform: translateY(-50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .hero-title {
          font-family: 'Archivo Black', sans-serif;
          font-size: clamp(3rem, 10vw, 7rem);
          line-height: 0.9;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, var(--primary), var(--accent), var(--secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: slideUp 1s ease-out 0.2s both;
        }

        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .hero-subtitle {
          font-size: clamp(1rem, 2vw, 1.5rem);
          max-width: 600px;
          margin: 0 auto 3rem;
          line-height: 1.6;
          opacity: 0;
          animation: fadeIn 1s ease-out 0.6s both;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .highlight {
          color: var(--secondary);
          font-weight: 700;
          text-decoration: underline wavy var(--primary);
          text-underline-offset: 5px;
        }

        /* Floating Items Animation */
        .floating-items {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: -1;
        }

        .float-item {
          position: absolute;
          font-size: clamp(2rem, 4vw, 4rem);
          animation: float 6s ease-in-out infinite;
          opacity: 0.3;
        }

        .float-item:nth-child(1) { top: 10%; left: 10%; animation-delay: 0s; }
        .float-item:nth-child(2) { top: 20%; right: 15%; animation-delay: 1s; }
        .float-item:nth-child(3) { top: 60%; left: 5%; animation-delay: 2s; }
        .float-item:nth-child(4) { top: 70%; right: 10%; animation-delay: 3s; }
        .float-item:nth-child(5) { top: 40%; left: 50%; animation-delay: 1.5s; }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(5deg); }
          50% { transform: translateY(-10px) rotate(-5deg); }
          75% { transform: translateY(-15px) rotate(3deg); }
        }

        /* CTA Button */
        .cta-button {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.5rem;
          padding: 1.2rem 3rem;
          background: var(--primary);
          color: white;
          border: 4px solid var(--secondary);
          border-radius: 0;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 2px;
          box-shadow: 8px 8px 0 var(--accent);
          animation: fadeIn 1s ease-out 1s both;
          text-decoration: none;
          display: inline-block;
        }

        .cta-button:hover {
          transform: translate(4px, 4px);
          box-shadow: 4px 4px 0 var(--accent);
          background: var(--accent);
          border-color: var(--primary);
        }

        /* Features Section */
        .features {
          position: relative;
          padding: 6rem 2rem;
          background: linear-gradient(180deg, var(--dark) 0%, #252540 100%);
          z-index: 1;
        }

        .section-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2.5rem, 6vw, 4rem);
          text-align: center;
          margin-bottom: 4rem;
          color: var(--secondary);
          text-shadow: 2px 2px 0 var(--primary);
          letter-spacing: 3px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid var(--accent);
          padding: 2rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(135deg, var(--primary), var(--accent), var(--secondary));
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .feature-card:hover::before {
          opacity: 0.3;
        }

        .feature-card:hover {
          transform: translateY(-10px);
          border-color: var(--secondary);
        }

        .feature-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          display: block;
        }

        .feature-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: var(--secondary);
          letter-spacing: 2px;
        }

        .feature-desc {
          opacity: 0.8;
          line-height: 1.6;
        }

        /* Pricing Section */
        .pricing {
          position: relative;
          padding: 6rem 2rem;
          background: var(--dark);
          z-index: 1;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .pricing-card {
          background: rgba(255, 255, 255, 0.05);
          border: 3px solid var(--accent);
          padding: 2.5rem;
          position: relative;
          transition: all 0.3s ease;
        }

        .pricing-card.popular {
          border-color: var(--secondary);
          transform: scale(1.05);
          background: rgba(255, 215, 0, 0.1);
        }

        .pricing-card:hover {
          transform: translateY(-15px) scale(1.02);
          border-color: var(--primary);
        }

        .popular-badge {
          position: absolute;
          top: -15px;
          right: 20px;
          background: var(--secondary);
          color: var(--dark);
          padding: 0.5rem 1rem;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1rem;
          letter-spacing: 2px;
          box-shadow: 4px 4px 0 var(--primary);
        }

        .plan-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2rem;
          color: var(--secondary);
          margin-bottom: 1rem;
          letter-spacing: 2px;
        }

        .plan-price {
          font-family: 'Archivo Black', sans-serif;
          font-size: 3.5rem;
          color: var(--primary);
          margin-bottom: 0.5rem;
        }

        .plan-items {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          color: var(--accent);
        }

        .plan-desc {
          opacity: 0.8;
          margin-bottom: 2rem;
        }

        .select-plan-btn {
          font-family: 'Bebas Neue', sans-serif;
          width: 100%;
          padding: 1rem;
          font-size: 1.3rem;
          background: transparent;
          color: var(--accent);
          border: 2px solid var(--accent);
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 2px;
        }

        .select-plan-btn:hover,
        .select-plan-btn.selected {
          background: var(--accent);
          color: var(--dark);
          box-shadow: 4px 4px 0 var(--secondary);
        }

        /* Signup Form */
        .signup-section {
          padding: 6rem 2rem;
          background: linear-gradient(180deg, var(--dark) 0%, #1a1a3e 100%);
          text-align: center;
        }

        .signup-form {
          max-width: 600px;
          margin: 3rem auto 0;
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .email-input {
          flex: 1;
          min-width: 250px;
          padding: 1.2rem;
          font-family: 'Space Mono', monospace;
          font-size: 1rem;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid var(--accent);
          color: white;
          transition: all 0.3s ease;
        }

        .email-input:focus {
          outline: none;
          border-color: var(--secondary);
          background: rgba(255, 255, 255, 0.15);
        }

        .email-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .submit-btn {
          font-family: 'Bebas Neue', sans-serif;
          padding: 1.2rem 2.5rem;
          font-size: 1.3rem;
          background: var(--primary);
          color: white;
          border: 3px solid var(--secondary);
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 2px;
          box-shadow: 6px 6px 0 var(--accent);
        }

        .submit-btn:hover:not(:disabled) {
          transform: translate(3px, 3px);
          box-shadow: 3px 3px 0 var(--accent);
        }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Footer */
        .footer {
          padding: 3rem 2rem;
          background: var(--dark);
          text-align: center;
          border-top: 2px solid var(--accent);
        }

        .footer-text {
          opacity: 0.6;
          font-size: 0.9rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 3rem;
          }
          
          .pricing-card.popular {
            transform: scale(1);
          }

          .signup-form {
            flex-direction: column;
          }

          .email-input {
            min-width: 100%;
          }
        }

        /* Scroll Animations */
        @keyframes scrollFadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .features, .pricing, .signup-section {
          animation: scrollFadeIn 1s ease-out;
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero">
        <div className="floating-items">
          <span className="float-item">🍫</span>
          <span className="float-item">🥤</span>
          <span className="float-item">🍪</span>
          <span className="float-item">🍬</span>
          <span className="float-item">🧃</span>
        </div>

        <div className="logo">SNACK MYSTERY BOX</div>
        <h1 className="hero-title">
          DISCOVER.<br/>
          SAVE.<br/>
          SNACK.
        </h1>
        <p className="hero-subtitle">
          Weekly blind boxes of <span className="highlight">rare imported snacks</span> and drinks 
          at 60-80% off. Zero hunting. Pure discovery. Delivered to your door.
        </p>
        <a href="#pricing" className="cta-button" onClick={() => trackEvent('cta_click', { location: 'hero' })}>
          START EXPLORING
        </a>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">Why You'll Love It</h2>
        <div className="features-grid">
          {features.map((feature, idx) => (
            <div key={idx} className="feature-card">
              <span className="feature-icon">{feature.icon}</span>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing" id="pricing">
        <h2 className="section-title">Choose Your Adventure</h2>
        <div className="pricing-grid">
          {plans.map((plan) => (
            <div key={plan.id} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
              {plan.popular && <div className="popular-badge">MOST POPULAR</div>}
              <div className="plan-name">{plan.name}</div>
              <div className="plan-price">{plan.price}</div>
              <div className="plan-items">{plan.items}</div>
              <p className="plan-desc">{plan.description}</p>
              <button 
                className={`select-plan-btn ${selectedPlan === plan.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedPlan(plan.id);
                  trackEvent('plan_selected', { plan: plan.id });
                }}
              >
                {selectedPlan === plan.id ? '✓ SELECTED' : 'SELECT PLAN'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Signup Section */}
      <section className="signup-section">
        <h2 className="section-title">Get Started Today</h2>
        <p className="hero-subtitle">
          Join the snack adventure. Your first mystery box ships within 48 hours.
        </p>
        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="email"
            className="email-input"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'SUBSCRIBING...' : 'SUBSCRIBE NOW'}
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p className="footer-text">
          © 2026 Snack Mystery Box. Fighting food waste, one surprise at a time. 🌍♻️
        </p>
      </footer>
    </div>
  );
}
