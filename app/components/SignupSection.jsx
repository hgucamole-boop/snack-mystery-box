'use client';
import { useState } from 'react';
import { trackEvent } from '../utils/ga';

export function SignupSection({ selectedPlan }) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert(`Thanks for subscribing to the ${selectedPlan} plan! We'll send confirmation to ${email}`);
    setEmail('');
    setIsSubmitting(false);
  };

  return (
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
        <button
          type="submit"
          className="submit-btn"
          disabled={isSubmitting}
          onClick={() => {
            trackEvent('subscribe_button_clicked', {
              plan: selectedPlan,
              button_text: isSubmitting ? 'SUBSCRIBING...' : 'SUBSCRIBE NOW',
            });
          }}
        >
          {isSubmitting ? 'SUBSCRIBING...' : 'SUBSCRIBE NOW'}
        </button>
      </form>
    </section>
  );
}