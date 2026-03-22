'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

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
    <span ref={ref} className="font-display text-4xl md:text-5xl">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

const counters = [
  { label: 'Snacks Saved', end: 48520, suffix: '+', color: 'pink', photoLabel: 'Snack rescue photo' },
  { label: 'Boxes Delivered', end: 6230, suffix: '+', color: 'cyan', photoLabel: 'Delivery photo' },
  { label: 'Tonnes Diverted', end: 14, suffix: '.7t', color: 'gold', photoLabel: 'Impact photo' },
];

export function ImpactCounter() {
  return (
    <section className="py-16 md:py-20 border-t border-b border-border bg-card/35">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <p className="font-body text-md text-muted-foreground tracking-[0.2em] mb-2">OUR IMPACT SO FAR</p>
        <h2 className="font-display text-4xl md:text-5xl gradient-text">FIGHTING FOOD WASTE, ONE BOX AT A TIME</h2>
      </motion.div>
      <div className="max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {counters.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border bg-card overflow-hidden group hover:border-muted-foreground transition-colors min-h-[26rem]"
          >
            <div
              className="h-52 md:h-56 border-b border-border/70 border-dashed flex items-center justify-center px-4"
              style={{
                borderColor: `hsl(var(--${c.color}) / 0.45)`,
                background: `linear-gradient(160deg, hsl(var(--${c.color}) / 0.22), hsl(var(--${c.color}) / 0.07))`,
                color: `hsl(var(--${c.color}))`,
              }}
            >
              <span className="font-body text-sm md:text-base leading-tight tracking-[0.18em] uppercase text-center opacity-85">
                {c.photoLabel}
              </span>
            </div>
            <div className="text-center p-6 md:p-7">
              <div style={{ color: `hsl(var(--${c.color}))` }}>
                <AnimatedNumber end={c.end} suffix={c.suffix} />
              </div>
              <p className="font-body text-base text-muted-foreground mt-3">{c.label}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}