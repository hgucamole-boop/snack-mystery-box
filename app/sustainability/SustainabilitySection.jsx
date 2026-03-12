import { sustainabilityPoints, sustainabilityStory } from '../../data/constants';

export function SustainabilitySection() {
  return (
    <section className="sustainability">
      <div className="sustainability-header">
        <h2 className="section-title">{sustainabilityStory.title}</h2>
        <p className="sustainability-intro">
          {sustainabilityStory.subtitle}
        </p>
      </div>

      <div className="sustainability-story">
        {sustainabilityPoints.map((point, idx) => (
          <div key={idx} className="story-step">
            <div className="story-content">
              <span className="story-icon">{point.icon}</span>
              <h3 className="story-title">{point.title}</h3>
              <p className="story-desc">{point.desc}</p>
            </div>
            <div className="story-image">
              <img
                src={point.image}
                alt={point.alt}
                className="placeholder-image"
              />
              <div className="image-placeholder-text">Image Placeholder</div>
            </div>
          </div>
        ))}
      </div>

      <div className="sustainability-impact">
        <p className="impact-text">
          {sustainabilityStory.impact}
        </p>
      </div>
    </section>
  );
}
