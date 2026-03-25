'use client';
import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { snacks, rarity } from '@/data/products';

const ScrollRow = ({ items, direction = 'right' }) => {
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let scrollPosition = direction === 'left' ? container.scrollWidth - container.clientWidth : 0;
    let animationFrameId;

    const autoScroll = () => {
      if (direction === 'right') {
        scrollPosition += 2;
        if (scrollPosition >= container.scrollWidth - container.clientWidth) {
          scrollPosition = 0;
        }
      } else {
        scrollPosition -= 2;
        if (scrollPosition <= 0) {
          scrollPosition = container.scrollWidth - container.clientWidth;
        }
      }
      
      container.scrollLeft = scrollPosition;
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    // Start auto-scroll
    animationFrameId = requestAnimationFrame(autoScroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [direction]);

  // Duplicate items to create enough content for infinite scroll
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div className="snacks-scroll-container" ref={scrollContainerRef}>
      {duplicatedItems.map((snack, idx) => {
        const snackRarity = rarity[snack.rarity];
        return (
          <div key={`${snack.id}-${idx}`} className="snack-card-mini">
            <div className="snack-image-wrapper-mini">
              <img
                src={snack.image}
                alt={snack.name}
                className="snack-image-mini"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export function SnacksSection() {
  // Filter snacks that are in stock
  const inStockSnacks = snacks.filter(snack => snack.multiple > 0);

  // Split snacks into rows (alternating directions)
  const row1 = inStockSnacks.slice(0, Math.ceil(inStockSnacks.length / 2));
  const row2 = inStockSnacks.slice(Math.ceil(inStockSnacks.length / 2));

  return (
    <section className="snacks-section">
      <div className="snacks-header">
        <div>
          <p className="snacks-eyebrow">In Stock Now</p>
          <h2 className="section-title">Discover Our Collection</h2>
        </div>
      </div>

      <div className="snacks-carousel">
        <ScrollRow items={row1} direction="right" />
        <ScrollRow items={row2} direction="left" />
      </div>

      <div className="snacks-footer">
        <Link href="/gacha" className="explore-button">
          Explore More
        </Link>
      </div>
    </section>
  );
}
