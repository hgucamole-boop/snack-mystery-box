'use client';

export function GachaSavingsSection({ hasPulls, totalValue, boxPrice, savings, savingsPct }) {
  if (!hasPulls) {
    return (
      <section className="gacha-savings gacha-savings-empty">
        <p>Your savings reveal is waiting.</p>
        <h4>Give the reel a spin to unlock your deal</h4>
      </section>
    );
  }

  return (
    <section className="gacha-savings">
      <div>
        <p>Total Box Value</p>
        <h4>${totalValue.toFixed(2)}</h4>
      </div>
      <div>
        <p>You Pay</p>
        <h4>${boxPrice.toFixed(2)}</h4>
      </div>
      <div>
        <p>You Save</p>
        <h4>{savings > 0 ? `${savingsPct}% OFF` : '$0.00'}</h4>
      </div>
    </section>
  );
}


