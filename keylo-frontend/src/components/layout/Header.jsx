import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Home', icon: 'home' },
  { path: '/find-a-stay', label: 'Find a Stay', icon: 'search' },
  { path: '/rentals', label: 'Rentals', icon: 'inventory_2' },
  { path: '/how-it-works', label: 'How It Works', icon: 'psychology' },
  { path: '/for-owners', label: 'For Owners', icon: 'business' },
];

function KeyLoLogo({ className = '', textClass = 'text-primary' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg className="h-8 w-8 flex-shrink-0" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="0" y="0" width="40" height="40" rx="6" fill="#000000"/>
        <path d="M20 10 L20 30 M10 20 L30 20" stroke="#C7F000" strokeWidth="3" strokeLinecap="round"/>
      </svg>
      <span className={`font-h3 text-h3 tracking-tight whitespace-nowrap ${textClass}`}>KeyLo</span>
    </div>
  );
}

export default function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/95 backdrop-blur-sm border-b-2 border-primary">
      <div className="relative h-20 w-full px-margin-mobile lg:px-margin-desktop flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center" aria-label="KeyLo Home">
          <KeyLoLogo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-lg lg:absolute lg:left-1/2 lg:-translate-x-1/2" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`transition-all py-2 ${
                isActive(item.path)
                  ? 'text-primary font-bold border-b-2 border-primary'
                  : 'font-label-caps text-label-caps text-on-surface-variant hover:text-primary'
              }`}
              aria-current={isActive(item.path) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-md">
          <button
            className="p-xs text-on-surface-variant hover:text-primary transition-colors"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="w-px h-6 bg-outline-variant mx-xs hidden sm:block" aria-hidden="true"></div>

          <Link to="/login" className="px-lg py-md bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary hover:-translate-y-1 hover:shadow-hard transition-all hidden sm:inline-flex">
            Log In
          </Link>
          <Link to="/signup" className="px-lg py-md bg-primary text-on-primary border-2 border-primary font-label-caps text-label-caps hover:bg-surface-container-lowest hover:text-primary transition-all hidden sm:inline-flex">
            Sign Up
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-xs text-on-surface-variant hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface border-t-2 border-primary px-margin-mobile py-md">
          <nav className="flex flex-col gap-sm" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-md py-lg border-2 border-transparent hover:border-primary transition-all ${
                  isActive(item.path)
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface'
                }`}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={isActive(item.path) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-sm mt-md pt-md border-t-2 border-primary">
              <Link to="/login" className="px-lg py-md bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary text-center" onClick={() => setMobileMenuOpen(false)}>
                Log In
              </Link>
              <Link to="/signup" className="px-lg py-md bg-primary text-on-primary border-2 border-primary font-label-caps text-label-caps text-center" onClick={() => setMobileMenuOpen(false)}>
                Sign Up
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
