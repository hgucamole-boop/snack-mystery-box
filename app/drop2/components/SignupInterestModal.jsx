'use client';

import { useEffect } from 'react';

export function SignupInterestModal({ isOpen, email, onEmailChange, onClose, onSubmit }) {
  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(event) {
      if (event.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="drop2-modal-backdrop drop2-modal-backdrop-enter" onClick={onClose}>
      <div
        className="drop2-modal drop2-modal-enter"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drop2-signup-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="drop2-modal-close"
          onClick={onClose}
          aria-label="Close sign up form"
        >
          ×
        </button>
        <h4 id="drop2-signup-title">Register Your Interest</h4>
        <p>Drop your email and we will keep you posted on upcoming snack box releases.</p>
        <form className="drop2-modal-form" onSubmit={onSubmit}>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            required
          />
          <button type="submit">Notify Me</button>
        </form>
      </div>
    </div>
  );
}
