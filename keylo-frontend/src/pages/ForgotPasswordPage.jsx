import { useState } from 'react';
import { Link } from 'react-router-dom';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import KeyLoMark from '../components/KeyLoMark';

function KeyLoLogo() {
  return (
    <div className="flex items-center gap-2">
      <KeyLoMark className="h-10 w-auto flex-shrink-0" />
      <span className="font-h2 text-h2 tracking-tight text-primary whitespace-nowrap">keylo</span>
    </div>
  );
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return;
    }
    if (!isSupabaseConfigured) {
      setError('Password reset is unavailable in demo mode because Supabase is not configured for this deployment.');
      return;
    }
    setIsLoading(true);
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    setIsLoading(false);
    if (resetError) {
      setError(resetError.message);
      return;
    }
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-surface-container-low font-body-md text-on-surface flex items-center justify-center px-margin-mobile lg:px-margin-desktop py-xl">
      <div className="w-full" style={{ maxWidth: '448px' }}>
        <div className="text-center mb-xl">
          <Link to="/" className="inline-flex mb-lg">
            <KeyLoLogo />
          </Link>
          <h1 className="font-heading text-h1-mobile text-primary mb-sm uppercase tracking-tight font-bold">Reset password</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">We&apos;ll email you a link to set a new password.</p>
        </div>

        <div className="bg-surface border-2 border-primary shadow-[8px_8px_0px_0px_#000000] p-xl">
          {sent ? (
            <div role="status">
              <div className="flex flex-col items-center text-center gap-md mb-lg">
                <span className="material-symbols-outlined text-[48px] text-acid-lime">mark_email_read</span>
                <h2 className="font-h3 text-h3 text-primary">Check your inbox</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  If an account exists for <span className="text-primary font-bold">{email}</span>, a password reset
                  link is on its way. Follow the link to choose a new password.
                </p>
              </div>
              <Link to="/login" className="block w-full text-center py-md bg-acid-lime text-primary font-label-caps text-label-caps border-2 border-primary hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] transition-all">
                BACK TO SIGN IN
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-lg" noValidate>
              {error && <div role="alert" className="border-2 border-error bg-error/10 p-md font-body-md text-error">{error}</div>}
              <div>
                <label htmlFor="email" className="font-label-caps text-label-caps text-on-surface block mb-xs">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-md py-md bg-surface-container-lowest border-2 border-primary focus:outline-none focus:ring-4 ring-[#C7F000] ring-offset-0 font-body-md text-on-surface placeholder:text-on-surface-variant/50 transition-all"
                  placeholder="you@example.com"
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-md bg-acid-lime text-primary font-label-caps text-label-caps border-2 border-primary hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-sm"
              >
                {isLoading ? (
                  <><span className="material-symbols-outlined animate-spin text-lg">progress_activity</span> Sending link...</>
                ) : (
                  <>SEND RESET LINK <span className="material-symbols-outlined text-sm">arrow_forward</span></>
                )}
              </button>
            </form>
          )}
        </div>

        <p className="mt-lg text-center font-body-md text-on-surface-variant">
          Remembered it?{' '}
          <Link to="/login" className="text-primary font-label-caps text-label-caps hover:text-electric-purple transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
