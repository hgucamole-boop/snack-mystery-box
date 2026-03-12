import { features } from '../../../data/constants';

export function FeaturesSection() {
  return (
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
  );
}
