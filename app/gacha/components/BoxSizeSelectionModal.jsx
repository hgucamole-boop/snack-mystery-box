'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/gtm';

export function BoxSizeSelectionModal({ 
  isOpen, 
  boxOptions, 
  selectedBoxId, 
  onSelect, 
  onClose 
}) {
  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(event) {
      if (event.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBoxSelect = (boxId) => {
    onSelect(boxId);
  };

  const handleSubmit = () => {
    trackEvent('gacha-box-size-selection-modal', { selectedBoxId });
    onClose();
  };

  return (
    <div className="gacha-modal-backdrop gacha-modal-backdrop-enter" onClick={onClose}>
      <div
        className="gacha-modal gacha-box-size-modal gacha-modal-enter"
        role="dialog"
        aria-modal="true"
        aria-labelledby="box-selection-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="gacha-modal-close"
          onClick={onClose}
          aria-label="Close box size selection"
        >
          ×
        </button>
        <h4 id="box-selection-title">Choose Your Box Size</h4>
        <p>Select the plan that works best for you, then start spinning!</p>
        
        <div className="gacha-box-size-grid">
          {boxOptions.map((box) => {
            const isSelected = selectedBoxId === box.id;
            const boxIcon = isSelected ? (box.emojiSelected || box.emoji) : box.emoji;

            return (
              <button
                key={box.id}
                type="button"
                className={`gacha-box-size-card ${isSelected ? 'active' : ''}`}
                onClick={() => handleBoxSelect(box.id)}
                aria-pressed={isSelected}
              >
                <img className="gacha-box-size-card-emoji" src={boxIcon} alt={`${box.name} icon`} />
                <div className="gacha-box-size-card-name">{box.name}</div>
                <div className="gacha-box-size-card-pax">{box.pax}</div>
                <div className="gacha-box-size-card-price">{box.price}</div>
                {box.popular && (
                  <div className="gacha-box-size-card-badge">✨ Popular</div>
                )}
              </button>
            );
          })}
        </div>

        <div className="gacha-box-size-actions">
          <button
            type="button"
            className="gacha-primary-btn"
            onClick={handleSubmit}
          >
            Start Spinning
          </button>
        </div>
      </div>
    </div>
  );
}
