'use client';
import { products } from '../data/products';
import Image from 'next/image';

export function ProductShowcase() {
  return (
    <section className="product-showcase">
      {/* <div className="showcase-container">
        <div className="showcase-header">
          <h2 className="showcase-title">What's Inside Your Box?</h2>
          <p className="showcase-subtitle">
            We pack diverse, delicious surprises. Here's what you might find in any given month.
          </p>
        </div>

        <div className="scrolling-grid">
          {Array.from({ length: 6 }, (_, i)  => (
            <div key={i} className="scroll-column">
              <div className="scroll-track">
                <div className="scroll-content">
                  {/* Duplicate for continuous scroll effect */}
                  {/* {products.map((p, itemIndex) => (
                    <div key={itemIndex}>
                      <Image key={p.name} src={p.src} alt={p.name} className='product-image'/>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </section>
  );
}
