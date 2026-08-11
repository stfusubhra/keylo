import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-surface border-t-2 border-primary">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-wrap gap-8 justify-between">
        <div>
          <Link to="/" className="font-h3 text-h3 text-primary hover:text-electric-purple transition-colors">KeyLo</Link>
          <p className="font-body-md text-on-surface-variant mt-md max-w-sm">
            Kolkata student rentals with deposit protection.
          </p>
        </div>
        <div>
          <h3 className="font-label-caps text-label-caps text-primary mb-md">Explore</h3>
          <ul>
            <li className="mb-sm"><Link to="/find-a-stay" className="font-body-md text-on-surface-variant hover:text-electric-purple">Find a Stay</Link></li>
            <li className="mb-sm"><Link to="/rentals" className="font-body-md text-on-surface-variant hover:text-electric-purple">Rent Essentials</Link></li>
            <li className="mb-sm"><Link to="/keylo-vault" className="font-body-md text-on-surface-variant hover:text-electric-purple">KeyLo Vault</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-label-caps text-label-caps text-primary mb-md">For You</h3>
          <ul>
            <li className="mb-sm"><Link to="/dashboard/bookings" className="font-body-md text-on-surface-variant hover:text-electric-purple">Dashboard</Link></li>
            <li className="mb-sm"><Link to="/login" className="font-body-md text-on-surface-variant hover:text-electric-purple">Login</Link></li>
            <li className="mb-sm"><Link to="/signup" className="font-body-md text-on-surface-variant hover:text-electric-purple">Sign Up</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-label-caps text-label-caps text-primary mb-md">Company</h3>
          <ul>
            <li className="mb-sm"><Link to="/about" className="font-body-md text-on-surface-variant hover:text-electric-purple">About</Link></li>
            <li className="mb-sm"><Link to="/accessibility" className="font-body-md text-on-surface-variant hover:text-electric-purple">Accessibility</Link></li>
            <li className="mb-sm"><a href="mailto:hello@keylo.in" className="font-body-md text-on-surface-variant hover:text-electric-purple">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="text-center py-6 border-t-2 border-primary">
        <p className="font-body-sm text-on-surface-variant">
          &copy; {new Date().getFullYear()} KeyLo. All rights reserved.
        </p>
      </div>
    </footer>
  );
}