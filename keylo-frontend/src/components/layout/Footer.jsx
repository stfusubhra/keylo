import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-primary border-t-2 border-primary">
      <div className="px-margin-mobile lg:px-margin-desktop py-xl flex flex-col md:flex-row md:items-center md:justify-between gap-md">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <svg className="h-6 w-6 flex-shrink-0" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="0" y="0" width="40" height="40" rx="6" fill="#ffffff"/>
            <path d="M20 10 L20 30 M10 20 L30 20" stroke="#C7F000" strokeWidth="3" strokeLinecap="round"/>
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
