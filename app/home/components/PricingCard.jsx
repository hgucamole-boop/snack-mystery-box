'use client';

export function PricingCard({ plan, isSelected, onSelect }) {
  const planIcon = isSelected ? (plan.emojiSelected || plan.emoji) : plan.emoji;

  return (
    <div className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
      {plan.popular && <div className="popular-badge">BEST VALUE</div>}
      <img className="plan-emoji" src={planIcon} alt={`${plan.name} icon`} />
      <div className="plan-name">{plan.name}</div>
      <span className="plan-pax">{plan.pax}</span>
      <div className="plan-price-row">
        <div className="plan-price">{plan.price}</div>
        <span className="plan-period">/ month</span>
      </div>
      <hr className="plan-divider" />
      <p className="plan-desc">{plan.description}</p>
      <button
        type="button"
        className={`select-plan-btn ${isSelected ? 'selected' : ''}`}
        onClick={() => onSelect(plan.id)}
      >
        {isSelected ? '✓ SELECTED' : 'SELECT PLAN'}
      </button>
    </div>
  );
}
