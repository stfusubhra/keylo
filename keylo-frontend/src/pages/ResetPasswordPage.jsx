import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [isRecovery, setIsRecovery] = useState(null); // null = checking
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsRecovery(false);
      return undefined;
    }
    let active = true;
    const checkRecovery = async () => {
      // Supabase delivers the recovery token in the URL fragment; getSession()
      // picks it up automatically.
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (!active) return;
      if (sessionError || !data.session) {
        setIsRecovery(false);
        return;
      }
      const recoveryType = new URLSearchParams(window.location.hash.slice(1)).get('type');
      setIsRecovery(recoveryType === 'recovery');
    };
    checkRecovery();
    return () => { active = false; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setError('Include uppercase, lowercase, and a number');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setIsLoading(false);
      setError(updateError.message);
      return;
    }
    await supabase.auth.signOut();
    setIsLoading(false);
    navigate('/login', { state: { resetDone: true } });
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-surface-container-low font-body-md text-on-surface flex items-center justify-center px-margin-mobile lg:px-margin-desktop py-xl">
        <div className="w-full text-center" style={{ maxWidth: '448px' }}>
          <KeyLoLogo />
          <h1 className="font-heading text-h1-mobile text-primary mb-sm uppercase tracking-tight font-bold mt-lg">Reset password</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mb-lg">
            Password reset is unavailable in demo mode because Supabase is not configured for this deployment.
          </p>
          <Link to="/login" className="inline-block px-lg py-md bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary">Back to sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-container-low font-body-md text-on-surface flex items-center justify-center px-margin-mobile lg:px-margin-desktop py-xl">
      <div className="w-full" style={{ maxWidth: '448px' }}>
        <div className="text-center mb-xl">
          <Link to="/" className="inline-flex mb-lg">
            <KeyLoLogo />
          </Link>
          <h1 className="font-heading text-h1-mobile text-primary mb-sm uppercase tracking-tight font-bold">Choose a new password</h1>
        </div>

        <div className="bg-surface border-2 border-primary shadow-[8px_8px_0px_0px_#000000] p-xl">
          {isRecovery === null && <p className="font-body-md text-on-surface-variant text-center">Checking your reset link...</p>}
          {isRecovery === false && (
            <div className="text-center flex flex-col items-center gap-md">
              <span className="material-symbols-outlined text-[48px] text-on-surface-variant">link_off</span>
              <p className="font-body-md text-body-md text-on-surface-variant">
                This link is missing a valid recovery token. Request a fresh reset link and use the one from your email.
              </p>
              <Link to="/forgot-password" className="px-lg py-md bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary">Request a new link</Link>
            </div>
          )}
          {isRecovery && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-lg" noValidate>
              {error && <div role="alert" className="border-2 border-error bg-error/10 p-md font-body-md text-error">{error}</div>}
              <div>
                <label htmlFor="new-password" className="font-label-caps text-label-caps text-on-surface block mb-xs">New password</label>
                <input
                  type="password"
                  id="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-md py-md bg-surface-container-lowest border-2 border-primary focus:outline-none focus:ring-4 ring-[#C7F000] ring-offset-0 font-body-md text-on-surface transition-all"
                  placeholder="••••••••"
                  disabled={isLoading}
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label htmlFor="confirm-new-password" className="font-label-caps text-label-caps text-on-surface block mb-xs">Confirm new password</label>
                <input
                  type="password"
                  id="confirm-new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-md py-md bg-surface-container-lowest border-2 border-primary focus:outline-none focus:ring-4 ring-[#C7F000] ring-offset-0 font-body-md text-on-surface transition-all"
                  placeholder="••••••••"
                  disabled={isLoading}
                  autoComplete="new-password"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-md bg-acid-lime text-primary font-label-caps text-label-caps border-2 border-primary hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-sm"
              >
                {isLoading ? (
                  <><span className="material-symbols-outlined animate-spin text-lg">progress_activity</span> Updating...</>
                ) : (
                  <>UPDATE PASSWORD <span className="material-symbols-outlined text-sm">arrow_forward</span></>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
