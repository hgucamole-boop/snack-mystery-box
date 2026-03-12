'use client';
import { PricingCard } from './PricingCard';
import { plans } from '../../../data/constants';

export function PricingSection({ selectedPlan, onSelectPlan }) {
  return (
    <section className="pricing" id="pricing">
      <p className="pricing-eyebrow">Monthly Group Delivery</p>
      <h2 className="section-title">Feed Your Whole Crew</h2>
      <p className="pricing-subtext">
        One box. Every month. Enough mystery snacks to make your office pantry the most exciting place in the building.
      </p>
      <div className="pricing-grid">
        {plans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            isSelected={selectedPlan === plan.id}
            onSelect={onSelectPlan}
          />
        ))}
      </div>
    </section>
  );
}
