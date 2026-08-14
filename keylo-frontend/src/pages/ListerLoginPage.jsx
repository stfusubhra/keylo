import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { listerLogin } from '../lib/listerData';

function KeyLoLogo() {
  return (
    <div className="flex items-center gap-2">
      <svg className="h-10 w-10 flex-shrink-0" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M2 2 H19 L5 15 Z" fill="#000000"/>
        <path d="M38 2 H21 L35 15 Z" fill="#000000"/>
        <path d="M15.8 25 A5.5 5.5 0 1 1 24.2 25" stroke="#C7F000" strokeWidth="2.2" strokeLinecap="round"/>
        <circle cx="20" cy="28.5" r="2.8" stroke="#000000" strokeWidth="2.2"/>
        <rect x="19.1" y="31.5" width="1.8" height="5" rx="0.9" fill="#000000"/>
        <rect x="20.9" y="33.8" width="2.4" height="1.6" rx="0.8" fill="#000000"/>
        <rect x="20.9" y="36.6" width="3.2" height="1.6" rx="0.8" fill="#000000"/>
      </svg>
      <span className="font-h2 text-h2 tracking-tight text-primary whitespace-nowrap">keylo</span>
    </div>
  );
}

export default function ListerLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Enter your email and password.'); return; }
    setIsLoading(true);
    setError('');
    try {
      await listerLogin({ email, password });
      const from = location.state?.from || '/lister';
      navigate(from);
    } catch (err) {
      setError(err.message || 'Sign in failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-low font-body-md text-on-surface flex items-center justify-center px-margin-mobile lg:px-margin-desktop py-xl">
      <div className="w-full" style={{ maxWidth: '448px' }}>
        {/* Logo & Title */}
        <div className="text-center mb-xl">
          <Link to="/" className="inline-flex mb-lg">
            <KeyLoLogo />
          </Link>
          <h1 className="font-heading text-h1-mobile text-primary mb-sm uppercase tracking-tight font-bold">Welcome back</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Sign in to your lister account</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-surface border-2 border-primary shadow-[8px_8px_0px_0px_#000000] p-xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-lg" noValidate>
            {error && <div role="alert" className="border-2 border-error bg-error/10 p-md font-body-md text-error">{error}</div>}

            <div>
              <label htmlFor="listerLoginEmail" className="font-label-caps text-label-caps text-on-surface block mb-xs">Email</label>
              <input type="email" id="listerLoginEmail" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-md py-md bg-surface-container-lowest border-2 border-primary focus:outline-none focus:ring-4 ring-[#C7F000] font-body-md text-on-surface placeholder:text-on-surface-variant/50 transition-all"
                placeholder="you@example.com" disabled={isLoading} autoComplete="email" />
            </div>

            <div>
              <label htmlFor="listerLoginPassword" className="font-label-caps text-label-caps text-on-surface block mb-xs">Password</label>
              <input type="password" id="listerLoginPassword" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-md py-md bg-surface-container-lowest border-2 border-primary focus:outline-none focus:ring-4 ring-[#C7F000] font-body-md text-on-surface placeholder:text-on-surface-variant/50 transition-all"
                placeholder="••••••••" disabled={isLoading} autoComplete="current-password" />
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full py-md bg-acid-lime text-primary font-label-caps text-label-caps border-2 border-primary hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-sm">
              {isLoading ? (
                <><span className="material-symbols-outlined animate-spin text-lg">progress_activity</span> Signing in...</>
              ) : (
                <>SIGN IN <span className="material-symbols-outlined text-sm">arrow_forward</span></>
              )}
            </button>
          </form>
        </div>

        {/* Signup Link */}
        <p className="mt-lg text-center font-body-md text-on-surface-variant">
          New to renting out?{' '}
          <Link to="/lister/signup" className="text-primary font-label-caps text-label-caps hover:text-electric-purple transition-colors">Create a lister account</Link>
        </p>
        <p className="mt-sm text-center font-body-md text-on-surface-variant">
          Need a place to stay instead?{' '}
          <Link to="/login" className="text-primary font-label-caps text-label-caps hover:text-electric-purple transition-colors">Sign in as student</Link>
        </p>
      </div>
    </div>
  );
}
