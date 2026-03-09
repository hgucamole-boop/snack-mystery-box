'use client';
import { products, images } from '../data/products';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';

export function ProductGacha() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const slotRefs = useRef([]);
  const [slotContents, setSlotContents] = useState([])

  const slotCount = 4;
  const BUFFER = 5

  useEffect(() => {
  if (isSpinning) return;
  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  const initial = Array.from({ length: slotCount }, () => [
    ...shuffle(products), ...shuffle(products), ...shuffle(products)
  ]);
  setSlotContents(initial);
}, []); // run once on mount

  // const setupSpin = () => {
  //   // set the selected item
  //   const alrSelected = new Set()

  //   for (var i = 0; i < slotCount; i++) {
  //     let randomProduct = products[Math.floor(Math.random() * products.length)];

  //     while (alrSelected.has(randomProduct)) {
  //       randomProduct = products[Math.floor(Math.random() * products.length)];
  //     }

  //     alrSelected.add(randomProduct)
  //   }

  //   const selected = [...alrSelected]
  //   setSelectedItems(selected)

  //   for (var i = 0; i < slotRefs.current.length; i++) {
  //     const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  //     setSlotContents(prev => {
  //       const next = [...prev];
  //       next[i] = [
  //         ...Array.from({ length: 5 }, () => shuffle(products)).flat(),
  //         selected[i],
  //         ...shuffle(products).slice(0, BUFFER)
  //       ];
  //       return next;
  //     });
  //   }

  //   console.log(selected[0])
  // }



  const spin = () => {
    if (isSpinning) return;
    setupSpin();        // update state
    setIsSpinning(true); // trigger the effect
  };

  const pendingContents = useRef([]);

const setupSpin = () => {
  const alrSelected = new Set();
  for (var i = 0; i < slotCount; i++) {
    let randomProduct = products[Math.floor(Math.random() * products.length)];
    while (alrSelected.has(randomProduct)) {
      randomProduct = products[Math.floor(Math.random() * products.length)];
    }
    alrSelected.add(randomProduct);
  }

  const selected = [...alrSelected];
  setSelectedItems(selected);
  console.log(selected)

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
  const newContents = [];

  for (var i = 0; i < slotCount; i++) {
    newContents[i] = [
      ...Array.from({ length: 5 }, () => shuffle(products)).flat(),
      selected[i],
      ...shuffle(products).slice(0, BUFFER)
    ];
  }

  pendingContents.current = newContents;
  setSlotContents(newContents); // for React to re-render the DOM
  return newContents;
};

useEffect(() => {
  if (!isSpinning) return;

  const contents = pendingContents.current; // read from ref, not stale state

  for (var i = 0; i < slotRefs.current.length; i++) {
    const listEl = slotRefs.current[i];
    const totalItems = contents[i]?.length;
    if (!listEl || !totalItems) continue;

    const itemHeight = listEl.scrollHeight / totalItems;
    const targetIndex = totalItems - 1 - BUFFER;
    const trackHeight = listEl.parentElement.clientHeight;
    const centerOffset = (trackHeight / 2) - (itemHeight / 2);
    const targetY = -(targetIndex * itemHeight) + centerOffset;

    listEl.style.setProperty('--target-y', `${targetY}px`);
    listEl.style.setProperty('--spin-delay', `${i * 0.15}s`); // 0s, 0.15s, 0.3s, 0.45s
    listEl.classList.remove('spinning');
    void listEl.offsetWidth;
    listEl.classList.add('spinning');
  }
}, [isSpinning]);


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

        <div className="gacha-slot-parent">
          {Array.from({ length: slotCount }).map((_, i) => (
            <div className="slot-track" key={i}>
              <div
                className={getSlotClass(isSpinning)}
                ref={el => slotRefs.current[i] = el}
              >
                {slotContents?.[i]?.map((product, index) => (
                  <Image
                    key={index}
                    src={product.src}
                    alt={product.name}
                    className='slot-image'
                  />
                ))}
              </div>
            </div>
          ))}
        </div>



        {/* Spin Button */}
        <div className="spin-controls">
          <button
            className="spin-button"
            onClick={spin}
            disabled={isSpinning}
          >
            {isSpinning ? 'Spinning...' : 'Spin the Slots!'}
          </button>
        </div>

        {/* Results Display */}
        {/* {showResult && (
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
        )} */}
      </div>
    </section>
  );
}
