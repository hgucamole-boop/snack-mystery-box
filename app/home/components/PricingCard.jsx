'use client';

export function PricingCard({ plan, isSelected, onSelect }) {
  return (
    <div className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
      {plan.popular && <div className="popular-badge">BEST VALUE</div>}
      <span className="plan-emoji">{plan.emoji}</span>
      <div className="plan-name">{plan.name}</div>
      <span className="plan-pax">{plan.pax}</span>
      <div className="plan-price-row">
        <div className="plan-price">{plan.price}</div>
        <span className="plan-period">/ month</span>
      </div>
      <div className="plan-per-head">✦ {plan.perHead}</div>
      <hr className="plan-divider" />
      <p className="plan-desc">{plan.description}</p>
      <button
        className={`select-plan-btn ${isSelected ? 'selected' : ''}`}
      >
        {isSelected ? '✓ SELECTED' : 'SELECT PLAN'}
      </button>
    </div>
  );
}
