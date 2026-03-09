'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, Leaf } from 'lucide-react';

interface CounterItemProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

function AnimatedNumber({ end, suffix = '', prefix = '', duration = 2000 }: CounterItemProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
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
  { icon: Package, label: 'Snacks Saved', end: 48520, suffix: '+', color: 'pink' },
  { icon: Truck, label: 'Boxes Delivered', end: 6230, suffix: '+', color: 'cyan' },
  { icon: Leaf, label: 'Tonnes Diverted', end: 14, suffix: '.7t', color: 'gold' },
];

export function ImpactCounter() {
  return (
    <section className="py-12 border-t border-b border-border bg-card/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-8"
      >
        <p className="font-body text-xs text-muted-foreground tracking-widest mb-1">OUR IMPACT SO FAR</p>
        <h2 className="font-display text-2xl gradient-text">FIGHTING FOOD WASTE, ONE BOX AT A TIME</h2>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {counters.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            viewport={{ once: true }}
            className="text-center p-6 rounded-xl border border-border bg-card group hover:border-muted-foreground transition-colors"
          >
            <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ background: `hsl(var(--${c.color}) / 0.1)` }}>
              <c.icon className="w-6 h-6" style={{ color: `hsl(var(--${c.color}))` }} />
            </div>
            <div style={{ color: `hsl(var(--${c.color}))` }}>
              <AnimatedNumber end={c.end} suffix={c.suffix} />
            </div>
            <p className="font-body text-sm text-muted-foreground mt-2">{c.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}