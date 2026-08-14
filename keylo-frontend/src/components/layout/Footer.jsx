import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-primary border-t-2 border-primary">
      <div className="px-margin-mobile lg:px-margin-desktop py-xl flex flex-col md:flex-row md:items-center md:justify-between gap-md">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <svg className="h-6 w-6 flex-shrink-0" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M2 2 H19 L5 15 Z" fill="#ffffff"/>
          <path d="M38 2 H21 L35 15 Z" fill="#ffffff"/>
          <path d="M15.8 25 A5.5 5.5 0 1 1 24.2 25" stroke="#C7F000" strokeWidth="2.2" strokeLinecap="round"/>
          <circle cx="20" cy="28.5" r="2.8" stroke="#ffffff" strokeWidth="2.2"/>
          <rect x="19.1" y="31.5" width="1.8" height="5" rx="0.9" fill="#ffffff"/>
          <rect x="20.9" y="33.8" width="2.4" height="1.6" rx="0.8" fill="#ffffff"/>
          <rect x="20.9" y="36.6" width="3.2" height="1.6" rx="0.8" fill="#ffffff"/>
          </svg>
          <span className="font-h3 text-h3 text-on-primary">keylo</span>
        </div>

        {/* Nav links */}
        <nav className="flex flex-wrap justify-center gap-lg" aria-label="Footer navigation">
          <Link to="/privacy" className="text-on-primary/70 hover:text-on-primary font-label-caps text-label-caps transition-colors">Privacy</Link>
          <Link to="/terms" className="text-on-primary/70 hover:text-on-primary font-label-caps text-label-caps transition-colors">Terms</Link>
          <Link to="/support" className="text-on-primary/70 hover:text-on-primary font-label-caps text-label-caps transition-colors">Support</Link>
          <Link to="/accessibility" className="text-on-primary/70 hover:text-on-primary font-label-caps text-label-caps transition-colors">Accessibility</Link>
        </nav>

        {/* Copyright */}
        <p className="font-body-md text-on-primary/50 text-center md:text-right">
          &copy; {new Date().getFullYear()} KeyLo Inc. Built for Students.
        </p>
      </div>
    </footer>
  );
}
