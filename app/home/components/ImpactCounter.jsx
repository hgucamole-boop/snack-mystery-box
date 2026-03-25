'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {images} from '@/data/constants';
import Image from 'next/image';

function AnimatedNumber({ end, suffix = '', prefix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();
          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref} className="impact-number-value">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

const counters = [
  { label: 'Snacks Saved', end: 48520, suffix: '+', color: 'pink', photoLabel: 'Snack rescue photo', image: images.sustainability.snackRescue },
  { label: 'Boxes Delivered', end: 6230, suffix: '+', color: 'cyan', photoLabel: 'Delivery photo', image: images.sustainability.delivery },
  { label: 'Tonnes Diverted', end: 14, suffix: '.7t', color: 'gold', photoLabel: 'Impact photo', image: images.sustainability.diverted },
];

export function ImpactCounter() {
  return (
    <section className="impact-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="impact-header"
      >
        <p className="impact-eyebrow">OUR IMPACT SO FAR</p>
        <h2 className="section-title impact-title">FIGHTING FOOD WASTE, ONE BOX AT A TIME</h2>
      </motion.div>
      <div className="impact-grid">
        {counters.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            viewport={{ once: true }}
            className="impact-card"
          >
            <div
              className="impact-image-wrap"
              style={{
                borderColor: `hsl(var(--${c.color}) / 0.45)`,
                background: `linear-gradient(160deg, hsl(var(--${c.color}) / 0.35), hsl(var(--${c.color}) / 0.1))`,
              }}
            >
              <Image
                src={c.image}
                alt={c.photoLabel}
                fill
                className="impact-image"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="impact-image-overlay" />
            </div>
            <div className="impact-card-content">
              <div className="impact-number" style={{ color: `hsl(var(--${c.color}))` }}>
                <AnimatedNumber end={c.end} suffix={c.suffix} />
              </div>
              <p className="impact-label">{c.label}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}