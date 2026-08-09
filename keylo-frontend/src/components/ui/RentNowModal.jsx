import { useEffect, useRef, useState } from 'react';

/**
 * RentNowModal
 * A multi-step rental booking modal for the KeyLo Rent Essentials page.
 *   Step 1 – Configure (duration, dates, delivery)
 *   Step 2 – Review & confirm (full cost breakdown)
 *   Step 3 – Success state
 */
export default function RentNowModal({ item, onClose }) {
  const DAILY_CATEGORIES = ['scooters', 'bikes'];
  const isDaily = DAILY_CATEGORIES.includes(item.category);

  const [step, setStep] = useState(1);
  const [duration, setDuration] = useState(isDaily ? 3 : 1);
  const [startDate, setStartDate] = useState('');
  const [delivery, setDelivery] = useState('pickup');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState({});
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  useEffect(() => { dialogRef.current?.focus(); }, [step]);

  const priceNum = Number(String(item.price).replace(/[^\d]/g, '')) || 0;
  const unitLabel = isDaily ? 'day' : 'month';
  const subtotal = priceNum * duration;
  const platformFee = Math.round(subtotal * 0.05);
  const deliveryFee = delivery === 'delivery' ? 99 : 0;
  const total = subtotal + platformFee + deliveryFee;

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
  };

  const endDate = (() => {
    if (!startDate) return '—';
    const d = new Date(startDate);
    if (isDaily) d.setDate(d.getDate() + duration);
    else d.setMonth(d.getMonth() + duration);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  })();

  const fmtDate = (s) =>
    s ? new Date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] bg-primary/60 flex items-end sm:items-center justify-center p-0 sm:p-lg"
      role="dialog"
      aria-modal="true"
      aria-label={`Rent ${item.name}`}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="w-full sm:max-w-lg max-h-[92dvh] overflow-y-auto bg-surface border-2 border-primary shadow-[-8px_8px_0px_0px_#C7F000] outline-none flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-primary px-lg py-md bg-surface-container-lowest flex-shrink-0">
          <div className="flex items-center gap-sm">
            {step > 1 && step < 3 && (
              <button
                onClick={() => setStep(step - 1)}
                aria-label="Back"
                className="material-symbols-outlined text-primary hover:text-electric-purple transition-colors"
              >
                arrow_back
              </button>
            )}
            <div>
              <p className="font-label-caps text-label-caps text-electric-purple uppercase">
                {step === 1 ? 'Configure rental' : step === 2 ? 'Review & confirm' : 'Booking confirmed'}
              </p>
              <h2 className="font-h3 text-h3 text-primary leading-tight">{item.name}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="material-symbols-outlined text-primary hover:text-hot-pink transition-colors flex-shrink-0"
          >
            close
          </button>
        </div>

        {/* Step indicator */}
        {step < 3 && (
          <div className="flex border-b-2 border-primary flex-shrink-0">
            {['Configure', 'Confirm'].map((label, i) => (
              <div
                key={label}
                className={`flex-1 py-sm text-center font-label-caps text-label-caps border-r-2 last:border-r-0 border-primary transition-colors ${
                  step === i + 1 ? 'bg-acid-lime text-primary' : 'bg-surface-container-lowest text-on-surface-variant'
                }`}
              >
                {i + 1}. {label}
              </div>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto">

          {/* ── STEP 1: Configure ── */}
          {step === 1 && (
            <div className="p-lg flex flex-col gap-lg">
              {/* Item card */}
              <div className="flex items-center gap-md border-2 border-primary bg-surface-container-lowest p-md">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover border-2 border-primary flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-label-caps text-label-caps text-electric-purple uppercase">{item.categoryLabel}</p>
                  <p className="font-h3 text-h3 text-primary truncate">{item.name}</p>
                  <p className="font-label-caps text-label-caps text-on-surface-variant">
                    {item.price} <span className="lowercase">{item.period}</span>
                  </p>
                </div>
              </div>

              {/* Duration */}
              <div>
                <p className="font-label-caps text-label-caps text-primary uppercase mb-sm">Duration ({unitLabel}s)</p>
                <div className="flex items-center gap-md">
                  <button
                    aria-label="Decrease"
                    onClick={() => setDuration((d) => Math.max(1, d - 1))}
                    className="w-10 h-10 border-2 border-primary bg-surface-container-lowest font-h3 text-h3 text-primary hover:bg-acid-lime transition-colors flex items-center justify-center"
                  >−</button>
                  <span className="font-price-display text-price-display text-primary w-12 text-center">{duration}</span>
                  <button
                    aria-label="Increase"
                    onClick={() => setDuration((d) => Math.min(isDaily ? 30 : 12, d + 1))}
                    className="w-10 h-10 border-2 border-primary bg-surface-container-lowest font-h3 text-h3 text-primary hover:bg-acid-lime transition-colors flex items-center justify-center"
                  >+</button>
                  <span className="font-label-caps text-label-caps text-on-surface-variant ml-xs">
                    {duration} {unitLabel}{duration > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex gap-xs mt-sm flex-wrap">
                  {(isDaily ? [1, 3, 7, 14, 30] : [1, 2, 3, 6, 12]).map((n) => (
                    <button
                      key={n}
                      onClick={() => setDuration(n)}
                      className={`px-sm py-xs font-label-caps text-label-caps border-2 border-primary transition-colors ${
                        duration === n ? 'bg-acid-lime text-primary' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-acid-lime'
                      }`}
                    >
                      {n}{unitLabel[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Start date */}
              <div>
                <label htmlFor="rent-start-date" className="block font-label-caps text-label-caps text-primary uppercase mb-sm">
                  Start Date
                </label>
                <input
                  id="rent-start-date"
                  type="date"
                  min={today}
                  value={startDate}
                  onChange={(e) => { setStartDate(e.target.value); setErrors((p) => ({ ...p, startDate: undefined })); }}
                  className={`w-full border-2 ${errors.startDate ? 'border-error' : 'border-primary'} bg-surface-container-lowest px-md py-md font-body-md text-body-md text-primary focus:outline-none focus:ring-4 ring-acid-lime`}
                />
                {errors.startDate && <p className="mt-xs font-label-caps text-label-caps text-error">{errors.startDate}</p>}
                {startDate && (
                  <p className="mt-xs font-label-caps text-label-caps text-on-surface-variant">
                    Returns by: <span className="text-primary">{endDate}</span>
                  </p>
                )}
              </div>

              {/* Fulfilment */}
              <div>
                <p className="font-label-caps text-label-caps text-primary uppercase mb-sm">Fulfilment</p>
                <div className="flex gap-sm">
                  {[
                    { value: 'pickup', label: 'Self Pickup', icon: 'storefront', sub: 'Free · Collect from hub' },
                    { value: 'delivery', label: 'Delivery', icon: 'local_shipping', sub: '₹99 · Delivered to you' },
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
                      <span className="font-body-md text-body-md text-on-surface-variant">{opt.sub}</span>
                    </button>
                  ))}
                </div>
                {delivery === 'delivery' && (
                  <div className="mt-md">
                    <label htmlFor="rent-address" className="block font-label-caps text-label-caps text-primary uppercase mb-sm">
                      Delivery Address
                    </label>
                    <textarea
                      id="rent-address"
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
              <div className="border-2 border-primary bg-surface-container-lowest p-md">
                <div className="flex justify-between font-body-md text-body-md text-on-surface-variant mb-xs">
                  <span>{item.price} × {duration} {unitLabel}{duration > 1 ? 's' : ''}</span>
                  <span className="text-primary">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-body-md text-body-md text-on-surface-variant mb-xs">
                  <span>Platform fee (5%)</span>
                  <span className="text-primary">₹{platformFee.toLocaleString('en-IN')}</span>
                </div>
                {delivery === 'delivery' && (
                  <div className="flex justify-between font-body-md text-body-md text-on-surface-variant mb-xs">
                    <span>Delivery</span>
                    <span className="text-primary">₹99</span>
                  </div>
                )}
                <div className="border-t-2 border-primary mt-sm pt-sm flex justify-between">
                  <span className="font-label-caps text-label-caps text-primary uppercase">Total</span>
                  <span className="font-price-display text-price-display text-primary">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Review ── */}
          {step === 2 && (
            <div className="p-lg flex flex-col gap-lg">
              <div className="flex items-center gap-md border-2 border-primary bg-surface-container-lowest p-md">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover border-2 border-primary flex-shrink-0" />
                <div>
                  <p className="font-label-caps text-label-caps text-electric-purple uppercase">{item.categoryLabel}</p>
                  <p className="font-h3 text-h3 text-primary">{item.name}</p>
                </div>
              </div>

              <div className="border-2 border-primary">
                {[
                  { label: 'Duration', value: `${duration} ${unitLabel}${duration > 1 ? 's' : ''}` },
                  { label: 'Start date', value: fmtDate(startDate) },
                  { label: 'Return by', value: endDate },
                  { label: 'Fulfilment', value: delivery === 'pickup' ? 'Self Pickup (Free)' : 'Delivery — ₹99' },
                  ...(delivery === 'delivery' ? [{ label: 'Address', value: address }] : []),
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between gap-md px-md py-sm border-b-2 last:border-b-0 border-primary">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase flex-shrink-0">{label}</span>
                    <span className="font-body-md text-body-md text-primary text-right">{value}</span>
                  </div>
                ))}
              </div>

              <div className="border-2 border-primary bg-surface-container-lowest p-md">
                <p className="font-label-caps text-label-caps text-primary uppercase mb-sm">Cost Breakdown</p>
                <div className="flex justify-between font-body-md text-body-md text-on-surface-variant mb-xs">
                  <span>Rental ({duration} {unitLabel}{duration > 1 ? 's' : ''})</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-body-md text-body-md text-on-surface-variant mb-xs">
                  <span>Platform fee (5%)</span>
                  <span>₹{platformFee.toLocaleString('en-IN')}</span>
                </div>
                {delivery === 'delivery' && (
                  <div className="flex justify-between font-body-md text-body-md text-on-surface-variant mb-xs">
                    <span>Delivery charge</span>
                    <span>₹99</span>
                  </div>
                )}
                <div className="border-t-2 border-primary mt-sm pt-sm flex justify-between">
                  <span className="font-label-caps text-label-caps text-primary uppercase">Total payable</span>
                  <span className="font-price-display text-price-display text-primary">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <p className="font-label-caps text-label-caps text-on-surface-variant text-center">
                By confirming you agree to KeyLo's rental terms. Payment is collected at pickup or delivery.
              </p>
            </div>
          )}

          {/* ── STEP 3: Success ── */}
          {step === 3 && (
            <div className="p-lg flex flex-col items-center text-center gap-lg">
              <div className="w-20 h-20 bg-acid-lime border-2 border-primary flex items-center justify-center shadow-[-4px_4px_0px_0px_#000000]">
                <span className="material-symbols-outlined text-[40px] text-primary" style={{ fontVariationSettings: 'FILL 1' }}>
                  check_circle
                </span>
              </div>
              <div>
                <p className="font-label-caps text-label-caps text-electric-purple uppercase mb-xs">Booking confirmed!</p>
                <h3 className="font-h3 text-h3 text-primary mb-sm">{item.name} is reserved for you.</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {delivery === 'pickup'
                    ? 'Head to the KeyLo hub from your start date to collect your item.'
                    : 'Your item will be delivered to your address by the start date.'}
                </p>
              </div>
              <div className="w-full border-2 border-primary bg-surface-container-lowest p-md text-left">
                {[
                  { label: 'Item', value: item.name },
                  { label: 'Duration', value: `${duration} ${unitLabel}${duration > 1 ? 's' : ''}` },
                  { label: 'Start', value: fmtDate(startDate) },
                  { label: 'Return by', value: endDate },
                  { label: 'Total', value: `₹${total.toLocaleString('en-IN')}` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between gap-md py-xs border-b-2 last:border-b-0 border-primary/30">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">{label}</span>
                    <span className="font-body-md text-body-md text-primary">{value}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={onClose}
                className="w-full py-md bg-primary text-on-primary font-label-caps text-label-caps border-2 border-primary hover:bg-acid-lime hover:text-primary transition-colors"
              >
                DONE
              </button>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        {step === 1 && (
          <div className="flex-shrink-0 border-t-2 border-primary p-lg bg-surface-container-lowest">
            <button
              onClick={handleNext}
              className="w-full py-md bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary hover:-translate-y-0.5 hover:shadow-[-4px_4px_0px_0px_#000000] transition-all flex items-center justify-center gap-sm"
            >
              REVIEW BOOKING <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        )}
        {step === 2 && (
          <div className="flex-shrink-0 border-t-2 border-primary p-lg bg-surface-container-lowest flex gap-sm">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-md bg-surface-container-lowest border-2 border-primary font-label-caps text-label-caps text-primary hover:bg-surface transition-colors"
            >
              BACK
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 py-md bg-primary text-on-primary border-2 border-primary font-label-caps text-label-caps hover:bg-acid-lime hover:text-primary transition-colors flex items-center justify-center gap-sm"
            >
              CONFIRM & BOOK <span className="material-symbols-outlined text-sm">check</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
