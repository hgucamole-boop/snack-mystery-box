'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          Mari Makan
        </Link>
        <div className="nav-links">
          <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
            Home
          </Link>
          <Link href="/products" className={`nav-link ${pathname === '/products' ? 'active' : ''}`}>
            Collections
          </Link>
          <Link href="/drop" className={`nav-link ${pathname === '/drop' ? 'active' : ''}`}
            style={{ color: '#FF2E63', fontWeight: 'bold', border: '1px solid #FF2E63', padding: '6px 12px' }}>
            🎰 Lucky Drop
          </Link>
          <Link href="/gacha" className={`nav-link ${pathname === '/drop' ? 'active' : ''}`}
            style={{ color: '#FF2E63', fontWeight: 'bold', border: '1px solid #FF2E63', padding: '6px 12px' }}>
            🎰 Lucky Drop 2
          </Link>
          <Link href="/sustainability" className={`nav-link ${pathname === '/sustainability' ? 'active' : ''}`}>
            Our Story
          </Link>
        </div>
      </div>
    </nav>
  );
}