import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

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

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '',
    userType: 'tenant', agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState('');

  const handleGoogle = async () => {
    setErrors({});
    if (!isSupabaseConfigured) {
      setErrors({ submit: 'Google sign-up is unavailable in demo mode. Create an account with email instead.' });
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
      setErrors({ submit: err.message || 'Google sign-up failed. Please try again.' });
    } finally {
      setSocialLoading('');
    }
  };

  const handlePhone = () => {
    setErrors({ submit: 'Phone sign-up is coming soon — use email or Google for now.' });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = 'Enter a valid 10-digit Indian mobile number';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) newErrors.password = 'Include uppercase, lowercase, and a number';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';
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
      navigate(formData.userType === 'landlord' ? '/owner' : '/dashboard');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
       options: { data: { full_name: formData.fullName, role: formData.userType === 'landlord' ? 'landlord' : 'student' } },
    });
    if (error) {
      setIsLoading(false);
      setErrors({ submit: error.message });
      return;
    }

    if (data.user) {
      await supabase.from('profiles').update({ full_name: formData.fullName, phone: formData.phone }).eq('id', data.user.id);
    }
    setIsLoading(false);
    if (!data.session) {
      setErrors({ submit: 'Account created. Check your email to confirm your account before signing in.' });
      return;
    }
    navigate(formData.userType === 'landlord' ? '/owner' : '/dashboard');
  };

  return (
    <div className="min-h-screen bg-surface-container-low font-body-md text-on-surface flex items-center justify-center px-margin-mobile lg:px-margin-desktop py-xl">
      <div className="w-full" style={{ maxWidth: '448px' }}>
        {/* Logo & Title */}
        <div className="text-center mb-xl">
          <Link to="/" className="inline-flex mb-lg">
            <KeyLoLogo />
          </Link>
          <h1 className="font-heading text-h1-mobile text-primary mb-sm uppercase tracking-tight font-bold">Create your account</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Join KeyLo to rent smarter and stay safer</p>
        </div>

        {/* Signup Form Card */}
        <div className="bg-surface border-2 border-primary shadow-[8px_8px_0px_0px_#000000] p-xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-lg" noValidate>
            {errors.submit && <div role="alert" className="border-2 border-error bg-error/10 p-md font-body-md text-error">{errors.submit}</div>}
            {/* User Type Selector */}
            <div>
              <label className="font-label-caps text-label-caps text-on-surface block mb-md">I want to</label>
              <div className="grid grid-cols-2 gap-md">
                {[
                  { value: 'tenant', label: 'Find a Home', icon: 'home' },
                  { value: 'landlord', label: 'List Property', icon: 'apartment' },
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, userType: type.value }))}
                    className={`py-md px-md font-label-caps text-label-caps border-2 border-primary transition-all flex flex-col items-center gap-sm ${
                      formData.userType === type.value
                        ? 'bg-primary text-on-primary shadow-[4px_4px_0px_0px_#C7F000]'
                        : 'bg-surface text-primary hover:bg-acid-lime'
                    }`}
                  >
                    <span className="material-symbols-outlined">{type.icon}</span>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="font-label-caps text-label-caps text-on-surface block mb-xs">Full Name</label>
              <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange}
                className={`w-full px-md py-md bg-surface-container-lowest border-2 border-primary focus:outline-none focus:ring-4 ring-[#C7F000] ring-offset-0 font-body-md text-on-surface placeholder:text-on-surface-variant/50 transition-all ${errors.fullName ? 'border-error' : ''}`}
                placeholder="John Doe" disabled={isLoading} autoComplete="name" />
              {errors.fullName && <p className="mt-xs font-body-sm text-error">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="font-label-caps text-label-caps text-on-surface block mb-xs">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                className={`w-full px-md py-md bg-surface-container-lowest border-2 border-primary focus:outline-none focus:ring-4 ring-[#C7F000] ring-offset-0 font-body-md text-on-surface placeholder:text-on-surface-variant/50 transition-all ${errors.email ? 'border-error' : ''}`}
                placeholder="you@example.com" disabled={isLoading} autoComplete="email" />
              {errors.email && <p className="mt-xs font-body-sm text-error">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="font-label-caps text-label-caps text-on-surface block mb-xs">Phone Number</label>
              <div className="relative">
                <span className="absolute left-md top-1/2 -translate-y-1/2 font-body-md text-on-surface-variant">+91</span>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange}
                  className={`w-full pl-14 pr-md py-md bg-surface-container-lowest border-2 border-primary focus:outline-none focus:ring-4 ring-[#C7F000] ring-offset-0 font-body-md text-on-surface placeholder:text-on-surface-variant/50 transition-all ${errors.phone ? 'border-error' : ''}`}
                  placeholder="9876543210" disabled={isLoading} autoComplete="tel" maxLength={10} />
              </div>
              {errors.phone && <p className="mt-xs font-body-sm text-error">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="font-label-caps text-label-caps text-on-surface block mb-xs">Password</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange}
                className={`w-full px-md py-md bg-surface-container-lowest border-2 border-primary focus:outline-none focus:ring-4 ring-[#C7F000] ring-offset-0 font-body-md text-on-surface placeholder:text-on-surface-variant/50 transition-all ${errors.password ? 'border-error' : ''}`}
                placeholder="••••••••" disabled={isLoading} autoComplete="new-password" />
              {errors.password && <p className="mt-xs font-body-sm text-error">{errors.password}</p>}
              <p className="mt-xs font-body-sm text-on-surface-variant/70">8+ chars with uppercase, lowercase, and number</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="font-label-caps text-label-caps text-on-surface block mb-xs">Confirm Password</label>
              <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                className={`w-full px-md py-md bg-surface-container-lowest border-2 border-primary focus:outline-none focus:ring-4 ring-[#C7F000] ring-offset-0 font-body-md text-on-surface placeholder:text-on-surface-variant/50 transition-all ${errors.confirmPassword ? 'border-error' : ''}`}
                placeholder="••••••••" disabled={isLoading} autoComplete="new-password" />
              {errors.confirmPassword && <p className="mt-xs font-body-sm text-error">{errors.confirmPassword}</p>}
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-sm cursor-pointer">
                <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange}
                  className="mt-1 w-4 h-4 accent-acid-lime border-2 border-primary flex-shrink-0" />
                <span className="font-body-sm text-on-surface-variant">
                  I agree to the <Link to="/terms" className="text-primary hover:text-electric-purple transition-colors">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:text-electric-purple transition-colors">Privacy Policy</Link>
                </span>
              </label>
              {errors.agreeTerms && <p className="mt-xs font-body-sm text-error">{errors.agreeTerms}</p>}
            </div>

            {/* Submit */}
            <button type="submit" disabled={isLoading}
              className="w-full py-md bg-acid-lime text-primary font-label-caps text-label-caps border-2 border-primary hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-sm">
              {isLoading ? (
                <><span className="material-symbols-outlined animate-spin text-lg">progress_activity</span> Creating account...</>
              ) : (
                <>CREATE ACCOUNT <span className="material-symbols-outlined text-sm">arrow_forward</span></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-lg">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-primary" /></div>
            <div className="relative flex justify-center"><span className="px-md bg-surface font-label-caps text-label-caps text-on-surface-variant">OR</span></div>
          </div>

          {/* Social Signup */}
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

        {/* Login Link */}
        <p className="mt-lg text-center font-body-md text-on-surface-variant">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-label-caps text-label-caps hover:text-electric-purple transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
