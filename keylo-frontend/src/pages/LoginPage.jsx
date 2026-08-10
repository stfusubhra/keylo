import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

function KeyLoLogo() {
  return (
    <div className="flex items-center gap-2">
      <svg className="h-10 w-10 flex-shrink-0" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="0" y="0" width="40" height="40" rx="6" fill="#000000"/>
        <path d="M20 10 L20 30 M10 20 L30 20" stroke="#C7F000" strokeWidth="3" strokeLinecap="round"/>
      </svg>
      <span className="font-h2 text-h2 tracking-tight text-primary whitespace-nowrap">keylo</span>
    </div>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.from || '/dashboard';
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState('');

  const handleGoogle = async () => {
    setErrors({});
    if (!isSupabaseConfigured) {
      setErrors({ submit: 'Google sign-in is unavailable in demo mode. Enter your email and password instead.' });
      return;
    }
    setSocialLoading('google');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/dashboard` },
      });
      if (error) setErrors({ submit: error.message });
    } catch (err) {
      setErrors({ submit: err.message || 'Google sign-in failed. Please try again.' });
    } finally {
      setSocialLoading('');
    }
  };

  const handlePhone = () => {
    setErrors({ submit: 'Phone sign-in is coming soon — use email or Google for now.' });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    if (!isSupabaseConfigured) {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setIsLoading(false);
      navigate(returnTo, { replace: true });
      return;
    }

    const { data: authData, error } = await supabase.auth.signInWithPassword({ email: formData.email, password: formData.password });
    setIsLoading(false);
    if (error) {
      setErrors({ submit: error.message });
      return;
    }
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', authData.user.id).maybeSingle();
    const roleHome = profile?.role === 'landlord' ? '/owner' : profile?.role === 'admin' ? '/admin' : '/dashboard';
    const workspaceRoles = profile?.role === 'landlord' || profile?.role === 'admin';
    navigate(workspaceRoles ? roleHome : location.state?.from || roleHome, { replace: true });
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
          <p className="font-body-lg text-body-lg text-on-surface-variant">Sign in to your KeyLo account</p>
        </div>

        {/* Demo credentials helper banner */}
        <div className="mb-md p-sm bg-acid-lime border-2 border-primary text-primary font-label-caps text-xs flex justify-between items-center">
          <div>
            <span className="font-bold">Landlord Demo:</span> landlord.ui.demo@keylo.in
          </div>
          <button
            type="button"
            onClick={() => setFormData({ email: 'landlord.ui.demo@keylo.in', password: 'KeyLoLandlord2026!', rememberMe: true })}
            className="px-xs py-[2px] bg-primary text-on-primary border border-primary text-[10px] uppercase hover:bg-electric-purple transition-colors"
          >
            Auto-fill
          </button>
        </div>

        {/* Login Form Card */}
        <div className="bg-surface border-2 border-primary shadow-[8px_8px_0px_0px_#000000] p-xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-lg" noValidate>
            {errors.submit && <div role="alert" className="border-2 border-error bg-error/10 p-md font-body-md text-error">{errors.submit}</div>}
            {/* Email */}
            <div>
              <label htmlFor="email" className="font-label-caps text-label-caps text-on-surface block mb-xs">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-md py-md bg-surface-container-lowest border-2 border-primary focus:outline-none focus:ring-4 ring-[#C7F000] ring-offset-0 font-body-md text-on-surface placeholder:text-on-surface-variant/50 transition-all ${errors.email ? 'border-error' : ''}`}
                placeholder="you@example.com"
                disabled={isLoading}
                autoComplete="email"
              />
              {errors.email && <p className="mt-xs font-body-sm text-error">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-xs">
                <label htmlFor="password" className="font-label-caps text-label-caps text-on-surface">Password</label>
                <Link to="/forgot-password" className="font-label-caps text-label-caps text-primary hover:text-electric-purple transition-colors text-sm">Forgot?</Link>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-md py-md bg-surface-container-lowest border-2 border-primary focus:outline-none focus:ring-4 ring-[#C7F000] ring-offset-0 font-body-md text-on-surface placeholder:text-on-surface-variant/50 transition-all ${errors.password ? 'border-error' : ''}`}
                placeholder="••••••••"
                disabled={isLoading}
                autoComplete="current-password"
              />
              {errors.password && <p className="mt-xs font-body-sm text-error">{errors.password}</p>}
            </div>

            {/* Remember Me */}
            <label className="flex items-center gap-sm cursor-pointer">
              <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} className="w-4 h-4 accent-acid-lime border-2 border-primary" />
              <span className="font-body-md text-on-surface-variant">Keep me signed in</span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-md bg-acid-lime text-primary font-label-caps text-label-caps border-2 border-primary hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-sm"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                  Signing in...
                </>
              ) : (
                <>SIGN IN <span className="material-symbols-outlined text-sm">arrow_forward</span></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-lg">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-primary" /></div>
            <div className="relative flex justify-center"><span className="px-md bg-surface font-label-caps text-label-caps text-on-surface-variant">OR</span></div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-md">
            <button type="button" onClick={handleGoogle} disabled={isLoading || socialLoading === 'google'} className="py-md bg-surface text-primary font-label-caps text-label-caps border-2 border-primary hover:bg-acid-lime transition-all flex items-center justify-center gap-sm disabled:opacity-50">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              {socialLoading === 'google' ? 'Redirecting...' : 'Google'}
            </button>
            <button type="button" onClick={handlePhone} disabled={isLoading} className="py-md bg-surface text-primary font-label-caps text-label-caps border-2 border-primary hover:bg-acid-lime transition-all flex items-center justify-center gap-sm disabled:opacity-50">
              <span className="material-symbols-outlined">smartphone</span>
              Phone
            </button>
          </div>
        </div>

        {/* Sign Up Link */}
        <p className="mt-lg text-center font-body-md text-on-surface-variant">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-primary font-label-caps text-label-caps hover:text-electric-purple transition-colors">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
