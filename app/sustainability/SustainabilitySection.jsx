"use client";

import { useEffect, useRef } from 'react';
import { sustainabilityPoints, sustainabilityStory } from '../../data/constants';

export function SustainabilitySection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return undefined;

    const revealItems = root.querySelectorAll('.sustainability-header, .story-step, .sustainability-impact');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -8% 0px',
      },
    );

    revealItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="sustainability">
      <div className="sustainability-header">
        <h2 className="section-title sustainability-title">{sustainabilityStory.title}</h2>
        <p className="sustainability-intro">
          {sustainabilityStory.subtitle}
        </p>
      </div>

      <div className="sustainability-story">
        {sustainabilityPoints.map((point, idx) => (
          <div key={idx} className="story-step" style={{ '--reveal-delay': `${idx * 90}ms` }}>
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
