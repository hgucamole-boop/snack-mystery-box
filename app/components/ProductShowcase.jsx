'use client';
import { products, images } from '../data/products';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

export function ProductShowcase() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const slotRefs = useRef([]);

  // Initialize with random items on load
  useEffect(() => {
    const initialItems = Array.from({ length: 4 }, () => Math.floor(Math.random() * products.length));
    setSelectedItems(initialItems);

    // Position slots to show initial items
    setTimeout(() => {
      slotRefs.current.forEach((slotEl, index) => {
        if (slotEl) {
          const itemHeight = 60;
          const selectedIndex = initialItems[index];
          const position = -(selectedIndex * itemHeight + products.length * itemHeight);
          slotEl.style.transform = `translateY(${position}px)`;
        }
      });
    }, 100);
  }, []);

  const spinSlots = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setShowResult(false);

    // Generate new random selections
    const newSelections = Array.from({ length: 4 }, () => Math.floor(Math.random() * products.length));
    setSelectedItems(newSelections);

    // Stop spinning after animation and position slots
    setTimeout(() => {
      setIsSpinning(false);
      // Position each slot to show the selected item
      slotRefs.current.forEach((slotEl, index) => {
        if (slotEl) {
          // Calculate position to show the selected item in the center
          const itemHeight = 60;
          const selectedIndex = newSelections[index];
          // Position so the selected item is visible (around the middle of the duplicated list)
          const position = -(selectedIndex * itemHeight + products.length * itemHeight);
          slotEl.style.transform = `translateY(${position}px)`;
          slotEl.style.animation = 'none';
        }
      });
      setShowResult(true);
    }, 3000);
  };

  const getSlotContent = (slotIndex) => {
    const duplicatedProducts = [...products, ...products, ...products]; // Triple for smooth scrolling

    return duplicatedProducts.map((product, index) => (
      <div key={`${slotIndex}-${index}`} className="slot-item">
        <Image
          src={product.src}
          alt={product.name}
          className="slot-image"
          width={60}
          height={60}
        />
      </div>
    ));
  };

  const getSlotAnimation = (slotIndex) => {
    if (isSpinning) {
      return {
        animation: `slotSpin 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${slotIndex * 0.1}s forwards`
      };
    }
    return {
      animation: 'idleScroll 20s linear infinite'
    };
  };

  const getSlotClass = (isSpinning) => {
    return isSpinning ? 'slot-content spinning' : 'slot-content idle';
  };

  return (
    <section className="product-showcase">
      <div className="showcase-container">
        <div className="showcase-header">
          <h2 className="showcase-title">What's Inside Your Box?</h2>
          <p className="showcase-subtitle">
            Spin the slots to discover what surprise awaits you this month!
          </p>
        </div>

        <div className="slot-machine">
          {/* All 4 Slots in a Row */}
          <div className="slot-column">
            <div className="slot-track">
              <div
                className={getSlotClass(isSpinning)}
                style={getSlotAnimation(0)}
                ref={el => slotRefs.current[0] = el}
              >
                {getSlotContent(0)}
              </div>
            </div>
            <div className="slot-track">
              <div
                className={getSlotClass(isSpinning)}
                style={getSlotAnimation(1)}
                ref={el => slotRefs.current[1] = el}
              >
                {getSlotContent(1)}
              </div>
            </div>
            {/* Center Snack Box */}
            <div className="snackbox-container">
              <Image
                src={images.snackBox.src}
                alt="Mystery Snack Box"
                className="snackbox-image"
                width={180}
                height={180}
              />
            </div>
            <div className="slot-track">
              <div
                className={getSlotClass(isSpinning)}
                style={getSlotAnimation(2)}
                ref={el => slotRefs.current[2] = el}
              >
                {getSlotContent(2)}
              </div>
            </div>
            <div className="slot-track">
              <div
                className={getSlotClass(isSpinning)}
                style={getSlotAnimation(3)}
                ref={el => slotRefs.current[3] = el}
              >
                {getSlotContent(3)}
              </div>
            </div>
          </div>


        </div>

        {/* Spin Button */}
        <div className="spin-controls">
          <button
            className="spin-button"
            onClick={spinSlots}
            disabled={isSpinning}
          >
            {isSpinning ? 'Spinning...' : 'Spin the Slots!'}
          </button>
        </div>

        {/* Results Display */}
        {showResult && (
          <div className="results-display">
            <h3>You got:</h3>
            <div className="selected-snacks">
              {selectedItems.map((itemIndex, slotIndex) => (
                <div key={slotIndex} className="result-item">
                  <Image
                    src={products[itemIndex].src}
                    alt={products[itemIndex].name}
                    width={80}
                    height={80}
                  />
                  <p>{products[itemIndex].name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
