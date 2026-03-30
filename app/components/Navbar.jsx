'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/lib/gtm';

export function Navbar() {
  const pathname = usePathname();
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert(`Thanks for subscribing! We'll send confirmation to ${email}`);
    trackEvent('button-click', { source: 'navbar-signup' });
    setEmail('');
    setIsSubmitting(false);
    setIsSignupOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <Link href="/" className="nav-logo">
            Mari Makan
          </Link>
          <div className="nav-links">
            <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
              Home
            </Link>
            {/* <Link href="/products" className={`nav-link ${pathname === '/products' ? 'active' : ''}`}>
              Collections
            </Link> */}
            <Link href="/sustainability" className={`nav-link ${pathname === '/sustainability' ? 'active' : ''}`}>
              Our Story
            </Link>
            <Link href="/gacha" className={`nav-link ${pathname === '/gacha' ? 'active' : ''}`}>
              🎰 Lucky Drop
            </Link>
            <button type="button" className="nav-link nav-link-signup" onClick={() => setIsSignupOpen(true)}>
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {isSignupOpen && (
        <div className="nav-signup-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="nav-signup-title">
          <div className="nav-signup-modal">
            <button
              type="button"
              className="nav-signup-close"
              aria-label="Close sign up form"
              onClick={() => setIsSignupOpen(false)}
            >
              x
            </button>
            <h3 id="nav-signup-title">Join The Snack Adventure</h3>
            <p>Sign up now and be the first to hear about new drops and deals.</p>
            <form className="nav-signup-form" onSubmit={handleSignupSubmit}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'SUBSCRIBING...' : 'SIGN UP'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}