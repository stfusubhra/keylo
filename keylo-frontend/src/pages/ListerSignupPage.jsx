import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fileToDataUrl, listerSignup } from '../lib/listerData';
import KeyLoMark from '../components/KeyLoMark';

function KeyLoLogo() {
  return (
    <div className="flex items-center gap-2">
      <KeyLoMark className="h-10 w-auto flex-shrink-0" />
      <span className="font-h2 text-h2 tracking-tight text-primary whitespace-nowrap">keylo</span>
    </div>
  );
}

export default function ListerSignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
  });
  const [photo, setPhoto] = useState('');
  const [photoLoading, setPhotoLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setErrors((prev) => ({ ...prev, photo: 'Please choose an image file.' })); return; }
    setPhotoLoading(true);
    try {
      const url = await fileToDataUrl(file, 400, 0.72);
      setPhoto(url);
      setErrors((prev) => ({ ...prev, photo: '' }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, photo: err.message || 'Could not read that image.' }));
    } finally {
      setPhotoLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = 'Enter a valid 10-digit Indian mobile number';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await listerSignup({ ...formData, photo });
      navigate('/lister', { state: { welcome: true } });
    } catch (err) {
      setErrors({ submit: err.message || 'Unable to create your account.' });
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
          <h1 className="font-heading text-h1-mobile text-primary mb-sm uppercase tracking-tight font-bold">Rent out your gear</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">List what you own, earn while it sits idle</p>
        </div>

        {/* Signup Form Card */}
        <div className="bg-surface border-2 border-primary shadow-[8px_8px_0px_0px_#000000] p-xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-lg" noValidate>
            {errors.submit && <div role="alert" className="border-2 border-error bg-error/10 p-md font-body-md text-error">{errors.submit}</div>}

            {/* Profile photo (optional) */}
            <div className="flex items-center gap-lg">
              <div className="relative shrink-0">
                {photo ? (
                  <img loading="lazy" src={photo} alt="Profile preview" className="w-16 h-16 rounded-full object-cover border-2 border-primary" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center border-2 border-primary">
                    <span className="material-symbols-outlined text-on-surface-variant text-[28px]">person</span>
                  </div>
                )}
                {photoLoading && (
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-acid-lime border-2 border-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
                  </span>
                )}
              </div>
              <label className="cursor-pointer">
                <span className="inline-block px-md py-sm bg-surface-container-lowest border-2 border-primary font-label-caps text-label-caps text-primary hover:bg-acid-lime transition-colors">
                  {photo ? 'Change photo' : 'Add photo'} <span className="text-on-surface-variant normal-case">(optional)</span>
                </span>
                <input type="file" accept="image/*" onChange={handlePhoto} className="sr-only" aria-label="Profile photo" />
              </label>
            </div>
            {errors.photo && <p className="mt-xs font-body-sm text-error -mt-lg">{errors.photo}</p>}

            {/* Name */}
            <div>
              <label htmlFor="listerName" className="font-label-caps text-label-caps text-on-surface block mb-xs">Name</label>
              <input type="text" id="listerName" name="name" value={formData.name} onChange={handleChange}
                className={`w-full px-md py-md bg-surface-container-lowest border-2 border-primary focus:outline-none focus:ring-4 ring-[#C7F000] ring-offset-0 font-body-md text-on-surface placeholder:text-on-surface-variant/50 transition-all ${errors.name ? 'border-error' : ''}`}
                placeholder="John Doe" disabled={isLoading} autoComplete="name" />
              {errors.name && <p className="mt-xs font-body-sm text-error">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="listerEmail" className="font-label-caps text-label-caps text-on-surface block mb-xs">Email</label>
              <input type="email" id="listerEmail" name="email" value={formData.email} onChange={handleChange}
                className={`w-full px-md py-md bg-surface-container-lowest border-2 border-primary focus:outline-none focus:ring-4 ring-[#C7F000] ring-offset-0 font-body-md text-on-surface placeholder:text-on-surface-variant/50 transition-all ${errors.email ? 'border-error' : ''}`}
                placeholder="you@example.com" disabled={isLoading} autoComplete="email" />
              {errors.email && <p className="mt-xs font-body-sm text-error">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="listerPhone" className="font-label-caps text-label-caps text-on-surface block mb-xs">Phone Number</label>
              <div className="relative">
                <span className="absolute left-md top-1/2 -translate-y-1/2 font-body-md text-on-surface-variant">+91</span>
                <input type="tel" id="listerPhone" name="phone" value={formData.phone} onChange={handleChange}
                  className={`w-full pl-14 pr-md py-md bg-surface-container-lowest border-2 border-primary focus:outline-none focus:ring-4 ring-[#C7F000] ring-offset-0 font-body-md text-on-surface placeholder:text-on-surface-variant/50 transition-all ${errors.phone ? 'border-error' : ''}`}
                  placeholder="9876543210" disabled={isLoading} autoComplete="tel" maxLength={10} />
              </div>
              {errors.phone && <p className="mt-xs font-body-sm text-error">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="listerPassword" className="font-label-caps text-label-caps text-on-surface block mb-xs">Password</label>
              <input type="password" id="listerPassword" name="password" value={formData.password} onChange={handleChange}
                className={`w-full px-md py-md bg-surface-container-lowest border-2 border-primary focus:outline-none focus:ring-4 ring-[#C7F000] ring-offset-0 font-body-md text-on-surface placeholder:text-on-surface-variant/50 transition-all ${errors.password ? 'border-error' : ''}`}
                placeholder="••••••••" disabled={isLoading} autoComplete="new-password" />
              {errors.password && <p className="mt-xs font-body-sm text-error">{errors.password}</p>}
              <p className="mt-xs font-body-sm text-on-surface-variant/70">8+ characters</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="listerConfirm" className="font-label-caps text-label-caps text-on-surface block mb-xs">Confirm Password</label>
              <input type="password" id="listerConfirm" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                className={`w-full px-md py-md bg-surface-container-lowest border-2 border-primary focus:outline-none focus:ring-4 ring-[#C7F000] ring-offset-0 font-body-md text-on-surface placeholder:text-on-surface-variant/50 transition-all ${errors.confirmPassword ? 'border-error' : ''}`}
                placeholder="••••••••" disabled={isLoading} autoComplete="new-password" />
              {errors.confirmPassword && <p className="mt-xs font-body-sm text-error">{errors.confirmPassword}</p>}
            </div>

            {/* Submit */}
            <button type="submit" disabled={isLoading}
              className="w-full py-md bg-acid-lime text-primary font-label-caps text-label-caps border-2 border-primary hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-sm">
              {isLoading ? (
                <><span className="material-symbols-outlined animate-spin text-lg">progress_activity</span> Creating account...</>
              ) : (
                <>CREATE LISTER ACCOUNT <span className="material-symbols-outlined text-sm">arrow_forward</span></>
              )}
            </button>
          </form>
        </div>

        {/* Login Link */}
        <p className="mt-lg text-center font-body-md text-on-surface-variant">
          Already renting out?{' '}
          <Link to="/lister/login" className="text-primary font-label-caps text-label-caps hover:text-electric-purple transition-colors">Sign in</Link>
        </p>
        <p className="mt-sm text-center font-body-md text-on-surface-variant">
          Need a place to stay instead?{' '}
          <Link to="/signup" className="text-primary font-label-caps text-label-caps hover:text-electric-purple transition-colors">Create a student account</Link>
        </p>
      </div>
    </div>
  );
}
