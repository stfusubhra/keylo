import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createBooking, createTestPayment, getPropertyById } from '../lib/supabaseData';
import { isSupabaseConfigured } from '../lib/supabase';
import { demoProperties } from '../lib/demoCatalog';
import { supabase } from '../lib/supabase';
import LoadingScreen from '../components/ui/LoadingScreen';

export default function SecureYourStayPage() {
  const { id = 'jadavpur-pg' } = useParams();
  const navigate = useNavigate();
  const [addons, setAddons] = useState({
    'Damage Protection': false,
    'Bi-weekly Deep Cleaning': false,
    'Wi-Fi Pro Package': false,
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [property, setProperty] = useState(null); // { name, rent, deposit, area, city, distance, university } resolved row or demo
  const [isLoadingProperty, setIsLoadingProperty] = useState(isSupabaseConfigured);
  const [propertyError, setPropertyError] = useState('');
  const [completedBooking, setCompletedBooking] = useState(null); // created booking row (real or demo)

  useEffect(() => {
    let active = true;
    const demo = demoProperties.find((p) => p.id === id);
    const demoFallback = demo
      ? {
          name: demo.name,
          rent: Number(String(demo.price).replace(/[^\d]/g, '')) || 8500,
          deposit: Number(String(demo.deposit).replace(/[^\d]/g, '')) || 10000,
          area: demo.area,
          city: 'Kolkata',
          distance: demo.distance,
          university: demo.university,
        }
      : { name: 'Lake View Student PG', rent: 9500, deposit: 12000, area: 'Jadavpur', city: 'Kolkata', distance: '0.6 km', university: 'Jadavpur University' };
    if (!isSupabaseConfigured) {
      setProperty(demoFallback);
      return () => { active = false; };
    }
    getPropertyById(id)
      .then((row) => {
         if (!active) return;
         if (!row) {
           setPropertyError('This property is no longer available. Return to Find a Stay to browse current listings.');
           return;
         }
         setProperty({
           name: row.name,
           rent: Number(row.monthly_rent),
           deposit: Number(row.security_deposit),
           area: row.area,
           city: row.city || 'Kolkata',
           distance: `${row.distance_to_university_km} km`,
           university: row.universities?.name || 'a Kolkata university',
         });
       })
      .catch((error) => { if (active) setPropertyError(error.message || 'We could not load this property. Please try again.'); })
      .finally(() => { if (active) setIsLoadingProperty(false); });
    return () => { active = false; };
  }, [id]);

  const rentAmount = property?.rent ?? 9500;
  const depositAmount = property?.deposit ?? 12000;
  const propertyName = property?.name || 'Lake View Student PG';
  const baseTotal = rentAmount + depositAmount + 997;

  // Unique, human-readable reference derived from the real booking id.
  const bookingRef = completedBooking
    ? `KYL-${String(completedBooking.id).replace(/-/g, '').slice(0, 8).toUpperCase()}`
    : '';

  // These are included in the booking experience; KeyLo does not sell subscriptions.
  const addonPrices = {
    'Damage Protection': 0,
    'Bi-weekly Deep Cleaning': 0,
    'Wi-Fi Pro Package': 0,
  };

  const formatMoney = (amount) => {
    return '₹' + amount.toLocaleString('en-IN');
  };

  const toggleAddon = (name) => {
    setAddons((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const addonsTotal = Object.entries(addons)
    .filter(([_, checked]) => checked)
    .reduce((sum, [name]) => sum + addonPrices[name], 0);

  const newTotal = baseTotal + addonsTotal;

  if (isLoadingProperty) return <LoadingScreen label="Loading stay details..." className="min-h-screen" />;
  if (isSupabaseConfigured && (propertyError || !property)) return <div className="min-h-[60vh] flex items-center justify-center bg-surface-container-low px-lg"><div role="alert" className="max-w-2xl border-2 border-error bg-error/10 p-lg text-center font-body-md text-error"><p>{propertyError || 'This property is no longer available.'}</p><Link to="/find-a-stay" className="inline-block mt-md px-lg py-sm bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary">Browse current stays</Link></div></div>;

  const simulateCheckout = async () => {
    setBookingError('');
    if (!isSupabaseConfigured) {
      setCompletedBooking({ id: `demo-${Date.now()}-${Math.floor(Math.random() * 1000)}` });
      setShowSuccess(true);
      document.body.style.overflow = 'hidden';
      return;
    }
    const { data: sessionData, error: sessionError } = await supabase.auth.getUser();
    if (sessionError || !sessionData.user) {
      navigate('/login', { state: { from: `/secure-your-stay/${id}` } });
      return;
    }
    setIsBooking(true);
    try {
      const booking = await createBooking({ propertyId: id, moveInDate: '2026-09-01', rentAmount, depositAmount });
      await createTestPayment({ booking, method: paymentMethod });
      setCompletedBooking(booking);
      setShowSuccess(true);
      document.body.style.overflow = 'hidden';
    } catch (error) {
      setBookingError(error.message || 'Unable to create booking. Please sign in and try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const resetCheckout = () => {
    setShowSuccess(false);
    document.body.style.overflow = '';
  };

  return (
    <div className="bg-surface-container-low font-body-md text-on-surface">
      {/* Ambient Background Decoration */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <svg
          className="absolute w-[200vw] h-[2048px] -top-[512px] -left-[50vw] animate-[spin_60s_linear_infinite]"
          viewBox="0 0 1000 1000"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient cx="50%" cy="50%" id="bgGrad" r="50%">
              <stop offset="0%" stopColor="#C7F000" stopOpacity="0.05"></stop>
              <stop offset="100%" stopColor="transparent" stopOpacity="0"></stop>
            </radialGradient>
          </defs>
          <circle cx="500" cy="500" fill="url(#bgGrad)" r="400"></circle>
          <path
            d="M 100 500 L 900 500 M 500 100 L 500 900"
            stroke="#000000"
            strokeDasharray="10 20"
            strokeOpacity="0.03"
            strokeWidth="1"
          ></path>
          <circle
            cx="500"
            cy="500"
            fill="none"
            r="300"
            stroke="#000000"
            strokeOpacity="0.03"
            strokeWidth="1"
          ></circle>
        </svg>
      </div>

      <div className="w-full max-w-7xl mx-auto px-margin-mobile lg:px-margin-desktop py-xl">
        {/* Header */}
        <div className="mb-xl">
          <p className="font-label-caps text-label-caps text-on-surface-variant mb-sm uppercase tracking-widest flex items-center gap-2">
            <span className="inline-block w-8 h-[2px] bg-primary"></span>
            Secure Your Spot
          </p>
          <h1 className="font-heading text-h1-mobile lg:text-h1 text-primary">
            Finalize Booking
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg relative">
          {/* Left Column: Details & Included Protection */}
          <div className="lg:col-span-7 flex flex-col gap-lg">
            {/* Property Overview Card */}
            <div className="bg-surface-container-lowest border-2 border-primary overflow-hidden relative group">
              <div className="flex flex-col sm:flex-row">
                {/* Image Block */}
                <div className="w-full sm:w-1/3 aspect-[4/3] sm:aspect-auto border-b-2 sm:border-b-0 sm:border-r-2 border-primary relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCmFuPS-qtycJ_ysXNhAO1mF7zHBBXyO2iuDtSCUgTBtzRq-CcrwX3oTMf3_gxb0jx-g6xnn0hvG0wJfgdTgeGK5S5Biluwo_IqS6NWmeuBu31WVAAnNwd0Zbj_4cjT1tZ35OR_HLNlf0ZNboOUcR0rSdT5jejMPTZKfHGELKx7cZ7te2fW_qI1B4dnZoi0nu6vcrJhicGKyQ1Ndd70oFhEIPsjH7nbaZpYdpYXdL9OlUjsI1eAnwIr')",
                    }}
                  ></div>
                  <div className="absolute top-2 left-2 bg-acid-lime border-2 border-primary px-2 py-1 font-label-caps text-[10px] uppercase font-bold tracking-wider z-10">
                    Fast Filling
                  </div>
                </div>
                {/* Details Block */}
                <div
                  className="p-md flex-1 flex flex-col justify-between bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iIzAwMDAwMCIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] bg-[size:20px_20px]"
                >
                  <div>
                    <h2 className="font-h3 text-h3 text-primary mb-xs group-hover:text-electric-purple transition-colors">
                      {propertyName}
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px]">
                        location_on
                      </span>
                      {property?.area || 'Kolkata'}, {property?.city || 'Kolkata'} • {property?.distance || '0.6 km'} from {property?.university || 'a Kolkata university'}
                    </p>
                  </div>
                  <div className="mt-md pt-md border-t-2 border-primary border-dashed grid grid-cols-2 gap-md">
                    <div>
                      <p className="font-label-caps text-[10px] text-on-surface-variant uppercase">
                        Move-in
                      </p>
                      <p className="font-body-lg text-body-md font-semibold text-primary">
                        01 Sept 2026
                      </p>
                    </div>
                    <div>
                      <p className="font-label-caps text-[10px] text-on-surface-variant uppercase">
                        Duration
                      </p>
                      <p className="font-body-lg text-body-md font-semibold text-primary">
                        6 Months
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Included Protection Section */}
            <div className="mt-xl relative">
              {/* Decorative structural element */}
              <div className="absolute -left-6 top-0 bottom-0 w-[2px] bg-primary hidden lg:block opacity-20"></div>
              <div className="absolute -left-[29px] top-6 w-3 h-3 rounded-full border-2 border-primary bg-acid-lime hidden lg:block"></div>
              <h3 className="font-h2 text-h3 mb-md text-primary flex items-center gap-2">
                Power-Ups
                <span className="bg-primary text-on-primary font-label-caps text-[10px] px-2 py-1 uppercase rounded-full">
                  Optional
                </span>
              </h3>
              <div className="flex flex-col gap-sm">
                {/* Add-on 1 */}
                <label className="cursor-pointer group">
                  <input
                    className="peer sr-only"
                    type="checkbox"
                    checked={addons['Damage Protection']}
                    onChange={() => toggleAddon('Damage Protection')}
                  />
                  <div className="bg-surface-container border-2 border-primary p-md flex flex-col sm:flex-row sm:items-center justify-between gap-md transition-all group-has-checked:bg-acid-lime/10 group-has-checked:border-primary group-has-checked:shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#000000]">
                    <div className="flex items-center gap-md">
                      <div className="w-12 h-12 bg-surface-container-lowest text-primary flex items-center justify-center border-2 border-primary group-has-checked:bg-acid-lime group-has-checked:text-primary transition-colors flex-shrink-0">
                        <span className="material-symbols-outlined">shield</span>
                      </div>
                      <div>
                        <p className="font-body-lg text-body-lg font-bold text-primary">
                          Damage Protection
                        </p>
                        <p className="font-body-md text-label-caps text-on-surface-variant">
                          Zero liability for accidental damage.
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center sm:justify-end gap-4 w-full sm:w-auto mt-sm sm:mt-0 pt-sm sm:pt-0 border-t border-primary/10 sm:border-t-0">
                      <span className="font-price-display text-h3 text-primary">
                        Included
                      </span>
                      <div className="w-6 h-6 border-2 border-primary flex items-center justify-center bg-surface-container-lowest group-has-checked:bg-primary transition-colors flex-shrink-0">
                        <span
                          className="material-symbols-outlined text-[16px] text-on-primary opacity-0 group-has-checked:opacity-100 transition-opacity"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check
                        </span>
                      </div>
                    </div>
                  </div>
                </label>

                {/* Add-on 2 */}
                <label className="cursor-pointer group">
                  <input
                    className="peer sr-only"
                    type="checkbox"
                    checked={addons['Bi-weekly Deep Cleaning']}
                    onChange={() => toggleAddon('Bi-weekly Deep Cleaning')}
                  />
                  <div className="bg-surface-container border-2 border-primary p-md flex flex-col sm:flex-row sm:items-center justify-between gap-md transition-all group-has-checked:bg-acid-lime/10 group-has-checked:border-primary group-has-checked:shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#000000]">
                    <div className="flex items-center gap-md">
                      <div className="w-12 h-12 bg-surface-container-lowest text-primary flex items-center justify-center border-2 border-primary group-has-checked:bg-acid-lime transition-colors flex-shrink-0">
                        <span className="material-symbols-outlined">cleaning_services</span>
                      </div>
                      <div>
                        <p className="font-body-lg text-body-lg font-bold text-primary">
                          Bi-weekly Deep Cleaning
                        </p>
                        <p className="font-body-md text-label-caps text-on-surface-variant">
                          Professional cleaning twice a month.
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center sm:justify-end gap-4 w-full sm:w-auto mt-sm sm:mt-0 pt-sm sm:pt-0 border-t border-primary/10 sm:border-t-0">
                      <span className="font-price-display text-h3 text-primary">
                        Included
                      </span>
                      <div className="w-6 h-6 border-2 border-primary flex items-center justify-center bg-surface-container-lowest group-has-checked:bg-primary transition-colors flex-shrink-0">
                        <span
                          className="material-symbols-outlined text-[16px] text-on-primary opacity-0 group-has-checked:opacity-100 transition-opacity"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check
                        </span>
                      </div>
                    </div>
                  </div>
                </label>

                {/* Add-on 3 */}
                <label className="cursor-pointer group">
                  <input
                    className="peer sr-only"
                    type="checkbox"
                    checked={addons['Wi-Fi Pro Package']}
                    onChange={() => toggleAddon('Wi-Fi Pro Package')}
                  />
                  <div className="bg-surface-container border-2 border-primary p-md flex flex-col sm:flex-row sm:items-center justify-between gap-md transition-all group-has-checked:bg-acid-lime/10 group-has-checked:border-primary group-has-checked:shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#000000]">
                    <div className="flex items-center gap-md">
                      <div className="w-12 h-12 bg-surface-container-lowest text-primary flex items-center justify-center border-2 border-primary group-has-checked:bg-acid-lime transition-colors flex-shrink-0">
                        <span className="material-symbols-outlined">wifi</span>
                      </div>
                      <div>
                        <p className="font-body-lg text-body-lg font-bold text-primary">
                          Wi-Fi Pro Package
                        </p>
                        <p className="font-body-md text-label-caps text-on-surface-variant">
                          Dedicated 300Mbps connection.
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center sm:justify-end gap-4 w-full sm:w-auto mt-sm sm:mt-0 pt-sm sm:pt-0 border-t border-primary/10 sm:border-t-0">
                      <span className="font-price-display text-h3 text-primary">
                        Included
                      </span>
                      <div className="w-6 h-6 border-2 border-primary flex items-center justify-center bg-surface-container-lowest group-has-checked:bg-primary transition-colors flex-shrink-0">
                        <span
                          className="material-symbols-outlined text-[16px] text-on-primary opacity-0 group-has-checked:opacity-100 transition-opacity"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check
                        </span>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Price Breakdown Sticky */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-surface-container-lowest border-2 border-primary p-md sm:p-lg flex flex-col gap-md shadow-[8px_8px_0px_0px_#000000]">
              <h3 className="font-h2 text-h3 border-b-2 border-primary pb-sm mb-sm text-primary uppercase tracking-tight">
                Summary
              </h3>
              {/* Line Items */}
              <div className="flex flex-col gap-sm font-body-md text-body-md">
                <div className="flex justify-between items-end">
                  <span className="text-on-surface-variant font-medium">
                    1st Month Rent
                  </span>
                  <span className="font-price-display text-[20px] text-primary">
                    {formatMoney(rentAmount)}
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-on-surface-variant font-medium">
                    Security Deposit{' '}
                    <span className="bg-electric-purple text-on-primary text-[10px] px-1 ml-1 rounded">
                      Refundable
                    </span>
                  </span>
                  <span className="font-price-display text-[20px] text-primary">
                    {formatMoney(depositAmount)}
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-on-surface-variant font-medium flex items-center gap-1">
                    First-booking KeyLo fee{' '}
                    <span
                      className="material-symbols-outlined text-[14px] cursor-help"
                      title="Covers background checks & contract generation"
                    >
                      info
                    </span>
                  </span>
                  <span className="font-price-display text-[20px] text-primary">
                    ₹997
                  </span>
                </div>
                  {/* Included services selected by the tenant */}
                <div className="flex flex-col gap-sm mt-sm pt-sm border-t border-primary/20 border-dashed">
                  {Object.entries(addons)
                    .filter(([_, checked]) => checked)
                    .map(([name]) => (
                      <div
                        key={name}
                        className="flex justify-between items-end animate-[fade-in_0.3s_ease-out]"
                      >
                        <span className="text-on-surface-variant font-medium">
                          + {name}
                        </span>
                        <span className="font-price-display text-[20px] text-primary">
                          Included
                        </span>
                      </div>
                    ))}
                </div>
              </div>
              <div className="border-2 border-primary bg-surface-container p-md">
                <div className="flex items-center justify-between gap-md mb-sm"><span className="font-label-caps text-label-caps text-primary uppercase">Payment method</span><span className="font-label-caps text-[10px] px-xs py-[2px] bg-acid-lime border border-primary text-primary">TEST MODE</span></div>
                <div className="grid grid-cols-2 gap-sm"><button type="button" onClick={() => setPaymentMethod('upi')} className={`py-sm border-2 border-primary font-label-caps text-label-caps ${paymentMethod === 'upi' ? 'bg-primary text-on-primary' : 'bg-surface text-primary'}`}><span className="material-symbols-outlined text-[16px] align-middle mr-xs">account_balance</span>UPI</button><button type="button" onClick={() => setPaymentMethod('card')} className={`py-sm border-2 border-primary font-label-caps text-label-caps ${paymentMethod === 'card' ? 'bg-primary text-on-primary' : 'bg-surface text-primary'}`}><span className="material-symbols-outlined text-[16px] align-middle mr-xs">credit_card</span>Test card</button></div>
                <p className="font-label-caps text-[10px] text-on-surface-variant mt-sm">No real money is charged. This records a paid test transaction for the demo.</p>
              </div>
              {/* Total */}
              <div className="mt-md pt-md border-t-4 border-primary">
                <div className="flex justify-between items-baseline">
                  <span className="font-h3 text-h3 text-primary uppercase">
                    Total Due
                  </span>
                  <span className="font-price-display text-[40px] text-primary leading-none">
                    {formatMoney(newTotal)}
                  </span>
                </div>
                <p className="font-label-caps text-label-caps text-right text-on-surface-variant mt-1">
                  Includes all taxes
                </p>
              </div>
              {/* CTA */}
              {bookingError && <div role="alert" className="border-2 border-error bg-error/10 p-md text-error font-body-md">{bookingError}</div>}
              <button
                className="mt-lg w-full py-4 bg-acid-lime border-2 border-primary font-h3 text-[20px] text-primary uppercase flex items-center justify-center gap-2 hover:-translate-y-1 shadow-[4px_4px_0px_0px_#000000] hover:shadow-[4px_4px_0px_0px_#000000] transition-all group relative overflow-hidden"
                onClick={simulateCheckout}
                disabled={isBooking}
              >
                <span className="relative z-10 flex items-center gap-2">
                   {isBooking ? 'Creating booking...' : 'Secure Booking'}
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </span>
                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0"></div>
                <span className="absolute inset-0 z-10 flex items-center justify-center gap-2 text-on-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Secure Booking
                  <span className="material-symbols-outlined translate-x-1">
                    arrow_forward
                  </span>
                </span>
              </button>
              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-4 mt-sm opacity-60">
                <span
                  className="material-symbols-outlined text-[24px]"
                  title="Secure Payment"
                >
                  lock
                </span>
                <span className="font-label-caps text-[10px] tracking-widest uppercase">
                  Bank-grade Encryption
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Overlay */}
      {showSuccess && (
        <div
          className="fixed inset-0 z-[100] bg-surface-container-lowest flex flex-col items-center justify-center p-lg opacity-100 pointer-events-auto transition-opacity duration-500"
          id="success-overlay"
        >
          {/* Confetti Canvas (Simulated with SVG shapes for visual) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-acid-lime border-2 border-primary animate-[bounce_2s_infinite]"></div>
            <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-electric-purple border-2 border-primary rounded-full animate-[bounce_1.5s_infinite_0.5s]"></div>
            <div className="absolute bottom-1/4 left-1/3 w-8 h-2 bg-coral border-2 border-primary rotate-45 animate-[bounce_3s_infinite_1s]"></div>
            <div className="absolute top-1/2 right-1/3 w-5 h-5 bg-primary rounded-sm animate-[spin_3s_linear_infinite]"></div>
          </div>
          <div className="w-full text-center relative z-10 flex flex-col items-center" style={{ maxWidth: '448px' }}>
            <div className="w-32 h-32 mb-lg relative">
              {/* Abstract Success Icon */}
              <div className="absolute inset-0 bg-acid-lime border-4 border-primary rounded-full animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] opacity-20"></div>
              <div className="absolute inset-0 bg-acid-lime border-4 border-primary flex items-center justify-center rounded-full shadow-[8px_8px_0px_0px_#000000]">
                <span className="material-symbols-outlined text-[64px] text-primary">
                  key
                </span>
              </div>
            </div>
            <h2 className="font-h1 text-[48px] text-primary uppercase mb-2">
              You're KeyLo'd <span className="inline-block animate-bounce">🎉</span>
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl">
              Your stay at {propertyName} has been locked in. Welcome to the
              anti-hustle.
            </p>
            <div className="w-full bg-surface-container border-2 border-primary p-md text-left mb-lg flex items-center justify-between">
              <div>
                <p className="font-label-caps text-[10px] uppercase text-on-surface-variant">
                  Booking Ref
                </p>
                <p className="font-h3 text-[20px] font-mono text-primary tracking-widest">
                  {bookingRef || '#KYL-PENDING'}
                </p>
                {!isSupabaseConfigured && (
                  <p className="font-label-caps text-[10px] uppercase text-on-surface-variant mt-xs">Demo reference — no database record</p>
                )}
              </div>
              <span className="material-symbols-outlined text-primary text-[32px]">
                qr_code_2
              </span>
            </div>
            <Link
              to="/dashboard"
              className="px-lg py-4 border-2 border-primary bg-primary text-on-primary font-label-caps text-label-caps hover:bg-surface-container-lowest hover:text-primary transition-colors"
              onClick={resetCheckout}
            >
              BACK TO DASHBOARD
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
