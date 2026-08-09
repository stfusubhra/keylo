import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { rentalItems, categoryImages } from '../lib/rentalCatalog';

const DAILY_CATEGORIES = ['scooters', 'bikes'];

export default function RentItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = rentalItems.find((r) => r.id === Number(id));

  const [step, setStep] = useState(1); // 1=configure, 2=review, 3=success
  const [duration, setDuration] = useState(null); // set after item loads
  const [startDate, setStartDate] = useState('');
  const [delivery, setDelivery] = useState('pickup');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState({});

  const today = new Date().toISOString().split('T')[0];

  if (!item) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-lg p-xl">
        <span className="material-symbols-outlined text-[64px] text-on-surface-variant">inventory_2</span>
        <h1 className="font-h2 text-h2 text-primary">Item not found</h1>
        <Link to="/rentals" className="px-lg py-md bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary">
          ← Back to Rentals
        </Link>
      </div>
    );
  }

  const isDaily = DAILY_CATEGORIES.includes(item.category);
  const unitLabel = isDaily ? 'day' : 'month';
  const effectiveDuration = duration ?? (isDaily ? 3 : 1);

  const priceNum = Number(String(item.price).replace(/[^\d]/g, '')) || 0;
  const subtotal = priceNum * effectiveDuration;
  const platformFee = Math.round(subtotal * 0.05);
  const deliveryFee = delivery === 'delivery' ? 99 : 0;
  const total = subtotal + platformFee + deliveryFee;

  const endDate = (() => {
    if (!startDate) return '—';
    const d = new Date(startDate);
    if (isDaily) d.setDate(d.getDate() + effectiveDuration);
    else d.setMonth(d.getMonth() + effectiveDuration);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  })();

  const fmtDate = (s) =>
    s ? new Date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  const validate = () => {
    const errs = {};
    if (!startDate) errs.startDate = 'Please choose a start date.';
    if (delivery === 'delivery' && !address.trim()) errs.address = 'Please enter a delivery address.';
    return errs;
  };

  const handleNext = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirm = () => {
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const itemImage = item.useImage ? item.image : (categoryImages[item.category] || item.image);

  // ── Step labels ──
  const stepLabels = ['Configure', 'Review', 'Confirmed'];

  return (
    <div className="min-h-screen bg-surface-container-low font-body-md text-on-surface">

      {/* ── Breadcrumb & step bar ── */}
      <div className="w-full bg-surface border-b-2 border-primary px-margin-mobile lg:px-margin-desktop">
        <div className="flex items-center gap-sm py-md">
          <Link to="/rentals" className="hover:text-primary transition-colors flex items-center gap-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] leading-none">arrow_back</span>
            <span className="font-label-caps text-label-caps">Back to Rentals</span>
          </Link>
          <span className="font-label-caps text-label-caps text-on-surface-variant">/</span>
          <span className="font-label-caps text-label-caps text-primary truncate">{item.name}</span>
        </div>

        {/* Step indicator */}
        <div className="flex border-t-2 border-primary -mx-margin-mobile lg:-mx-margin-desktop">
          {stepLabels.map((label, i) => (
            <div
              key={label}
              className={`flex-1 py-sm flex items-center justify-center gap-xs border-r-2 last:border-r-0 border-primary transition-colors ${
                step === i + 1
                  ? 'bg-acid-lime text-primary'
                  : step > i + 1
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-lowest text-on-surface-variant'
              }`}
            >
              {step > i + 1 && (
                <span className="material-symbols-outlined text-[16px] leading-none flex-shrink-0">check</span>
              )}
              <span className="font-label-caps text-label-caps" style={{ fontFamily: 'inherit', letterSpacing: '0.05em' }}>
                {step <= i + 1 ? `${i + 1}. ` : ''}{label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full px-margin-mobile lg:px-margin-desktop py-xl max-w-6xl mx-auto">

        {/* ══════════════════════════════ STEP 1: Configure ══════════════════════════════ */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-xl items-start">

            {/* Left — item details */}
            <div className="flex flex-col gap-lg">
              <div>
                <p className="font-label-caps text-label-caps text-electric-purple uppercase mb-xs">{item.categoryLabel}</p>
                <h1 className="font-heading text-h1-mobile lg:text-h2 text-primary tracking-tight font-bold">{item.name}</h1>
                <div className="flex flex-wrap gap-xs mt-sm">
                  {item.badges.map((b) => (
                    <span key={b.label} className={`px-sm py-xs ${b.bg} ${b.textColor} font-label-caps text-[10px] uppercase border-2 border-primary`}>
                      {b.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-2 border-primary overflow-hidden">
                <img
                  src={itemImage}
                  alt={item.name}
                  className="w-full aspect-video object-cover"
                />
              </div>

              <div className="border-2 border-primary bg-surface p-lg">
                <h2 className="font-h3 text-h3 text-primary mb-md uppercase">About this item</h2>
                <div className="grid grid-cols-2 gap-md">
                  {[
                    { icon: 'category', label: 'Category', val: item.categoryLabel },
                    { icon: 'payments', label: 'Rate', val: `${item.price} ${item.period}` },
                    { icon: 'verified', label: 'Status', val: item.badges[0]?.label || 'Available' },
                    { icon: 'local_shipping', label: 'Delivery', val: 'Available · ₹99' },
                  ].map(({ icon, label, val }) => (
                    <div key={label} className="flex items-start gap-sm">
                      <span className="material-symbols-outlined text-electric-purple text-[20px] mt-0.5">{icon}</span>
                      <div>
                        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase">{label}</p>
                        <p className="font-body-md text-body-md text-primary">{val}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — booking form */}
            <div className="flex flex-col gap-lg">
              <div className="border-2 border-primary bg-surface p-lg shadow-[-6px_6px_0px_0px_#C7F000]">
                <p className="font-label-caps text-label-caps text-electric-purple uppercase mb-xs">Configure rental</p>
                <div className="flex items-baseline gap-sm mb-lg">
                  <span className="font-price-display text-price-display text-primary">{item.price}</span>
                  <span className="font-body-md text-body-md text-on-surface-variant lowercase">{item.period}</span>
                </div>

                {/* Duration */}
                <div className="mb-lg">
                  <p className="font-label-caps text-label-caps text-primary uppercase mb-sm">Duration ({unitLabel}s)</p>
                  <div className="flex items-center gap-md mb-sm">
                    <button
                      aria-label="Decrease"
                      onClick={() => { const cur = duration ?? (isDaily ? 3 : 1); setDuration(Math.max(1, cur - 1)); }}
                      className="w-10 h-10 border-2 border-primary bg-surface-container-lowest font-h3 text-h3 text-primary hover:bg-acid-lime transition-colors flex items-center justify-center"
                    >−</button>
                    <span className="font-price-display text-price-display text-primary w-10 text-center">{effectiveDuration}</span>
                    <button
                      aria-label="Increase"
                      onClick={() => { const cur = duration ?? (isDaily ? 3 : 1); setDuration(Math.min(isDaily ? 30 : 12, cur + 1)); }}
                      className="w-10 h-10 border-2 border-primary bg-surface-container-lowest font-h3 text-h3 text-primary hover:bg-acid-lime transition-colors flex items-center justify-center"
                    >+</button>
                    <span className="font-label-caps text-label-caps text-on-surface-variant">{effectiveDuration} {unitLabel}{effectiveDuration > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex flex-wrap gap-xs">
                    {(isDaily ? [1, 3, 7, 14, 30] : [1, 2, 3, 6, 12]).map((n) => (
                      <button
                        key={n}
                        onClick={() => setDuration(n)}
                        className={`px-sm py-xs font-label-caps text-label-caps border-2 border-primary transition-colors ${
                          effectiveDuration === n ? 'bg-acid-lime text-primary' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-acid-lime'
                        }`}
                      >
                        {n}{unitLabel[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Start date */}
                <div className="mb-lg">
                  <label htmlFor="start-date" className="block font-label-caps text-label-caps text-primary uppercase mb-sm">
                    Start Date
                  </label>
                  <input
                    id="start-date"
                    type="date"
                    min={today}
                    value={startDate}
                    onChange={(e) => { setStartDate(e.target.value); setErrors((p) => ({ ...p, startDate: undefined })); }}
                    className={`w-full border-2 ${errors.startDate ? 'border-error' : 'border-primary'} bg-surface-container-lowest px-md py-md font-body-md text-body-md text-primary focus:outline-none focus:ring-4 ring-acid-lime`}
                  />
                  {errors.startDate && <p className="mt-xs font-label-caps text-label-caps text-error">{errors.startDate}</p>}
                  {startDate && (
                    <p className="mt-xs font-label-caps text-label-caps text-on-surface-variant">
                      Return by: <span className="text-primary">{endDate}</span>
                    </p>
                  )}
                </div>

                {/* Fulfilment */}
                <div className="mb-lg">
                  <p className="font-label-caps text-label-caps text-primary uppercase mb-sm">Fulfilment</p>
                  <div className="flex gap-sm">
                    {[
                      { value: 'pickup', label: 'Self Pickup', icon: 'storefront', sub: 'Free' },
                      { value: 'delivery', label: 'Delivery', icon: 'local_shipping', sub: '₹99' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setDelivery(opt.value)}
                        className={`flex-1 flex flex-col items-start gap-xs p-md border-2 transition-all text-left ${
                          delivery === opt.value
                            ? 'border-primary bg-acid-lime shadow-[-3px_3px_0px_0px_#000000]'
                            : 'border-primary bg-surface-container-lowest hover:bg-acid-lime/30'
                        }`}
                      >
                        <span className="material-symbols-outlined text-primary">{opt.icon}</span>
                        <span className="font-label-caps text-label-caps text-primary">{opt.label}</span>
                        <span className="font-label-caps text-label-caps text-on-surface-variant">{opt.sub}</span>
                      </button>
                    ))}
                  </div>

                  {delivery === 'delivery' && (
                    <div className="mt-md">
                      <label htmlFor="delivery-address" className="block font-label-caps text-label-caps text-primary uppercase mb-sm">
                        Delivery Address
                      </label>
                      <textarea
                        id="delivery-address"
                        rows={2}
                        placeholder="Flat no., building, street, city..."
                        value={address}
                        onChange={(e) => { setAddress(e.target.value); setErrors((p) => ({ ...p, address: undefined })); }}
                        className={`w-full border-2 ${errors.address ? 'border-error' : 'border-primary'} bg-surface-container-lowest px-md py-md font-body-md text-body-md text-primary placeholder:text-on-surface-variant focus:outline-none focus:ring-4 ring-acid-lime resize-none`}
                      />
                      {errors.address && <p className="mt-xs font-label-caps text-label-caps text-error">{errors.address}</p>}
                    </div>
                  )}
                </div>

                {/* Cost preview */}
                <div className="border-t-2 border-primary pt-md mb-lg">
                  <div className="flex justify-between font-body-md text-body-md text-on-surface-variant mb-xs">
                    <span>{item.price} × {effectiveDuration} {unitLabel}{effectiveDuration > 1 ? 's' : ''}</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-body-md text-body-md text-on-surface-variant mb-xs">
                    <span>Platform fee (5%)</span>
                    <span>₹{platformFee.toLocaleString('en-IN')}</span>
                  </div>
                  {delivery === 'delivery' && (
                    <div className="flex justify-between font-body-md text-body-md text-on-surface-variant mb-xs">
                      <span>Delivery</span>
                      <span>₹99</span>
                    </div>
                  )}
                  <div className="flex justify-between font-label-caps text-label-caps text-primary border-t-2 border-primary mt-sm pt-sm">
                    <span className="uppercase">Total</span>
                    <span className="font-price-display text-price-display">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  className="w-full py-md bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary hover:-translate-y-0.5 hover:shadow-[-4px_4px_0px_0px_#000000] transition-all flex items-center justify-center gap-sm"
                >
                  REVIEW BOOKING <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════ STEP 2: Review ══════════════════════════════ */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto flex flex-col gap-lg">
            <div>
              <p className="font-label-caps text-label-caps text-electric-purple uppercase mb-xs">Review your booking</p>
              <h1 className="font-h2 text-h2 text-primary">{item.name}</h1>
            </div>

            {/* Item card */}
            <div className="flex items-center gap-md border-2 border-primary bg-surface p-md">
              <img src={itemImage} alt={item.name} className="w-20 h-20 object-cover border-2 border-primary flex-shrink-0" />
              <div>
                <p className="font-label-caps text-label-caps text-electric-purple uppercase">{item.categoryLabel}</p>
                <p className="font-h3 text-h3 text-primary">{item.name}</p>
                <div className="flex gap-xs mt-xs flex-wrap">
                  {item.badges.map((b) => (
                    <span key={b.label} className={`px-xs py-[2px] ${b.bg} ${b.textColor} font-label-caps text-[10px] uppercase border border-primary`}>{b.label}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking details */}
            <div className="border-2 border-primary bg-surface">
              <p className="font-label-caps text-label-caps text-primary uppercase px-lg py-sm border-b-2 border-primary bg-surface-container-lowest">Booking Details</p>
              {[
                { label: 'Duration', value: `${effectiveDuration} ${unitLabel}${effectiveDuration > 1 ? 's' : ''}` },
                { label: 'Start date', value: fmtDate(startDate) },
                { label: 'Return by', value: endDate },
                { label: 'Fulfilment', value: delivery === 'pickup' ? 'Self Pickup (Free)' : 'Delivery — ₹99' },
                ...(delivery === 'delivery' ? [{ label: 'Address', value: address }] : []),
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-md px-lg py-sm border-b-2 last:border-b-0 border-primary">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase flex-shrink-0">{label}</span>
                  <span className="font-body-md text-body-md text-primary text-right">{value}</span>
                </div>
              ))}
            </div>

            {/* Cost breakdown */}
            <div className="border-2 border-primary bg-surface">
              <p className="font-label-caps text-label-caps text-primary uppercase px-lg py-sm border-b-2 border-primary bg-surface-container-lowest">Cost Breakdown</p>
              <div className="px-lg py-md flex flex-col gap-xs">
                <div className="flex justify-between font-body-md text-body-md text-on-surface-variant">
                  <span>Rental ({effectiveDuration} {unitLabel}{effectiveDuration > 1 ? 's' : ''})</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-body-md text-body-md text-on-surface-variant">
                  <span>Platform fee (5%)</span>
                  <span>₹{platformFee.toLocaleString('en-IN')}</span>
                </div>
                {delivery === 'delivery' && (
                  <div className="flex justify-between font-body-md text-body-md text-on-surface-variant">
                    <span>Delivery charge</span>
                    <span>₹99</span>
                  </div>
                )}
                <div className="flex justify-between font-label-caps text-label-caps text-primary border-t-2 border-primary mt-sm pt-sm">
                  <span className="uppercase">Total payable</span>
                  <span className="font-price-display text-price-display">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <p className="font-label-caps text-label-caps text-on-surface-variant text-center border-2 border-primary bg-surface-container-lowest px-lg py-sm">
              By confirming you agree to KeyLo's rental terms. Payment is collected at pickup or delivery.
            </p>

            <div className="flex gap-sm">
              <button
                onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="flex-1 py-md bg-surface border-2 border-primary font-label-caps text-label-caps text-primary hover:bg-surface-container-lowest transition-colors"
              >
                BACK
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-md bg-primary text-on-primary border-2 border-primary font-label-caps text-label-caps hover:bg-acid-lime hover:text-primary transition-colors flex items-center justify-center gap-sm"
              >
                CONFIRM & BOOK <span className="material-symbols-outlined text-sm">check</span>
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════ STEP 3: Success ══════════════════════════════ */}
        {step === 3 && (
          <div className="max-w-lg mx-auto flex flex-col items-center text-center gap-lg py-xl">
            <div className="w-24 h-24 bg-acid-lime border-2 border-primary flex items-center justify-center shadow-[-6px_6px_0px_0px_#000000]">
              <span className="material-symbols-outlined text-[48px] text-primary" style={{ fontVariationSettings: 'FILL 1' }}>
                check_circle
              </span>
            </div>

            <div>
              <p className="font-label-caps text-label-caps text-electric-purple uppercase mb-xs">Booking confirmed!</p>
              <h1 className="font-h2 text-h2 text-primary mb-sm">{item.name} is reserved for you.</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                {delivery === 'pickup'
                  ? 'Head to the KeyLo hub from your start date to collect your item. Bring a valid ID.'
                  : 'Your item will be delivered to your address by the start date. Payment collected on delivery.'}
              </p>
            </div>

            <div className="w-full border-2 border-primary bg-surface text-left">
              <p className="font-label-caps text-label-caps text-primary uppercase px-lg py-sm border-b-2 border-primary bg-surface-container-lowest">Booking Summary</p>
              {[
                { label: 'Item', value: item.name },
                { label: 'Category', value: item.categoryLabel },
                { label: 'Duration', value: `${effectiveDuration} ${unitLabel}${effectiveDuration > 1 ? 's' : ''}` },
                { label: 'Start', value: fmtDate(startDate) },
                { label: 'Return by', value: endDate },
                { label: 'Fulfilment', value: delivery === 'pickup' ? 'Self Pickup' : 'Delivery' },
                { label: 'Total paid', value: `₹${total.toLocaleString('en-IN')}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-md px-lg py-sm border-b-2 last:border-b-0 border-primary">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">{label}</span>
                  <span className="font-body-md text-body-md text-primary text-right">{value}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-sm w-full">
              <Link
                to="/rentals"
                className="flex-1 py-md bg-surface border-2 border-primary font-label-caps text-label-caps text-primary text-center hover:bg-surface-container-lowest transition-colors"
              >
                BROWSE MORE ITEMS
              </Link>
              <Link
                to="/dashboard"
                className="flex-1 py-md bg-primary text-on-primary border-2 border-primary font-label-caps text-label-caps text-center hover:bg-acid-lime hover:text-primary transition-colors"
              >
                GO TO DASHBOARD
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
