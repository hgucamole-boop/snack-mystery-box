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
          {/* <Link href="/products" className={`nav-link ${pathname === '/products' ? 'active' : ''}`}>
            Collections
          </Link> */}
          <Link
            href="/drop"
            className={`nav-link ${pathname === '/drop' ? 'active' : ''} !text-primary font-bold border border-primary !px-3 !py-1.5`}
          >
            🎰 Lucky Drop
          </Link>
          <Link
            href="/gacha"
            className={`nav-link ${pathname === '/gacha' ? 'active' : ''} !text-primary font-bold border border-primary !px-3 !py-1.5`}
          >
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