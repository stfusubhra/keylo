import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { completeHandover, getHandoverBooking } from '../lib/supabaseData';
import { isSupabaseConfigured } from '../lib/supabase';

export default function DigitalHandoverPage() {
  const navigate = useNavigate();
  const [currentStep] = useState(3);
  const [isCompleting, setIsCompleting] = useState(false);
  const [handoverStatus, setHandoverStatus] = useState(''); // '', 'error', 'success'
  const [handoverMessage, setHandoverMessage] = useState('');

  const handleComplete = async () => {
    if (isCompleting) return;
    setHandoverStatus('');
    setHandoverMessage('');
    if (!isSupabaseConfigured) {
      setHandoverStatus('error');
      setHandoverMessage('Handover records are stored per booking — demo mode has no booking to attach this to.');
      return;
    }
    setIsCompleting(true);
    try {
      const booking = await getHandoverBooking();
      if (!booking) {
        setHandoverStatus('error');
        setHandoverMessage('No confirmed booking found. Complete a booking first, then return here to finish your handover.');
      } else {
        await completeHandover({
          bookingId: booking.id,
          checklist: { room_condition: true, meter_readings: true, agreement_signed: true },
        });
        setHandoverStatus('success');
        setHandoverMessage(`Handover recorded for ${booking.properties?.name || 'your stay'}. Your deposit is now protected by KeyLo Vault.`);
      }
    } catch (error) {
      setHandoverStatus('error');
      setHandoverMessage(error.message || 'Unable to record handover. Please try again.');
    } finally {
      setIsCompleting(false);
    }
  };

  const steps = [
    { id: 1, label: 'ID Verify', icon: 'verified', status: 'done' },
    { id: 2, label: 'Sign', icon: 'draw', status: 'done' },
    { id: 3, label: 'Record Condition', icon: 'photo_camera', status: 'active' },
    { id: 4, label: 'Pay Deposit', icon: 'account_balance_wallet', status: 'pending' },
    { id: 5, label: 'Access', icon: 'key', status: 'pending' },
  ];

  return (
    <div className="bg-surface font-body-md text-on-surface px-margin-mobile lg:px-margin-desktop py-xl">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header Section */}
        <div className="mb-xl text-center">
          <h1 className="font-heading text-h1-mobile md:text-h1 text-on-surface mb-md font-bold">
            Move in without the drama.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mx-auto" style={{ maxWidth: '672px' }}>
            Complete your digital handover to unlock your new space. Document
            the condition now to protect your deposit later.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="bg-surface-container-low border-2 border-primary p-lg mb-xl relative">
          <div className="flex items-center justify-between mb-sm relative z-10">
            <span className="font-label-caps text-label-caps text-on-surface uppercase">
              Digital Handover Progress
            </span>
            <span className="font-h3 text-h3 text-on-surface">
              Step {currentStep}/5
            </span>
          </div>
          <div className="h-2 bg-surface-container-high border-2 border-primary relative overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-acid-lime border-r-2 border-primary transition-all duration-1000 ease-in-out"
              style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
            ></div>
          </div>
          {/* Steps Checklist */}
          <div className="mt-lg grid grid-cols-5 gap-sm relative z-10">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center text-center ${
                  step.status === 'pending' ? 'opacity-30' : ''
                }`}
              >
                <div
                  className={`w-10 h-10 -mt-1 rounded-full border-2 border-primary flex items-center justify-center mb-xs shadow-[4px_4px_0px_0px_#000000] ${
                    step.status === 'done'
                      ? 'bg-acid-lime'
                      : step.status === 'active'
                      ? 'bg-surface'
                      : 'bg-surface-container-high'
                  }`}
                >
                  {step.status === 'done' ? (
                    <span
                      className="material-symbols-outlined text-sm"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check
                    </span>
                  ) : (
                    <span
                      className={`material-symbols-outlined ${
                        step.status === 'active'
                          ? 'text-primary'
                          : 'text-on-surface-variant'
                      }`}
                    >
                      {step.icon}
                    </span>
                  )}
                </div>
                <span
                  className={`font-label-caps text-label-caps ${
                    step.status === 'active'
                      ? 'text-primary font-bold'
                      : 'text-on-surface'
                  } hidden md:block`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Step Content: Record Condition */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xl">
          {/* Room Photos Upload */}
          <div className="bg-surface border-2 border-primary flex flex-col hover:-translate-y-1 transition-transform group cursor-pointer relative overflow-hidden h-64">
            <div className="absolute inset-0 bg-surface-container-high border-b-2 border-primary h-2/3 group-hover:bg-acid-lime/20 transition-colors flex items-center justify-center flex-col z-0">
              <span className="material-symbols-outlined text-h1 mb-sm opacity-50 group-hover:opacity-100 group-hover:text-primary transition-all group-hover:scale-110">
                add_photo_alternate
              </span>
              <span className="font-label-caps text-label-caps text-on-surface-variant">
                Tap to Upload
              </span>
            </div>
            <div className="absolute bottom-0 w-full p-md bg-surface border-t-2 border-primary z-10">
              <h3 className="font-h3 text-h3 text-on-surface mb-xs">
                Room Photos
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm line-clamp-1">
                Capture overall condition.
              </p>
            </div>
            <input accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" multiple type="file" />
          </div>

          {/* Meter Readings Upload */}
          <div className="bg-surface border-2 border-primary flex flex-col hover:-translate-y-1 transition-transform group cursor-pointer relative overflow-hidden h-64">
            <div className="absolute inset-0 bg-surface-container-high border-b-2 border-primary h-2/3 group-hover:bg-primary/5 transition-colors flex items-center justify-center flex-col z-0">
              <span className="material-symbols-outlined text-h1 mb-sm opacity-50 group-hover:opacity-100 group-hover:text-primary transition-all group-hover:scale-110">
                speed
              </span>
              <span className="font-label-caps text-label-caps text-on-surface-variant">
                Take Photo
              </span>
            </div>
            <div className="absolute bottom-0 w-full p-md bg-surface border-t-2 border-primary z-10">
              <h3 className="font-h3 text-h3 text-on-surface mb-xs">
                Meter Readings
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm line-clamp-1">
                Electricity &amp; Gas meters.
              </p>
            </div>
            <input
              accept="image/*"
              capture="environment"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              type="file"
            />
          </div>

          {/* Furniture Photos Upload */}
          <div className="bg-surface border-2 border-primary flex flex-col hover:-translate-y-1 transition-transform group cursor-pointer relative overflow-hidden h-64">
            <div className="absolute inset-0 bg-surface-container-high border-b-2 border-primary h-2/3 group-hover:bg-electric-purple/10 transition-colors flex items-center justify-center flex-col z-0">
              <span className="material-symbols-outlined text-h1 mb-sm opacity-50 group-hover:opacity-100 group-hover:text-electric-purple transition-all group-hover:scale-110">
                chair
              </span>
              <span className="font-label-caps text-label-caps text-on-surface-variant">
                Inventory Check
              </span>
            </div>
            <div className="absolute bottom-0 w-full p-md bg-surface border-t-2 border-primary z-10">
              <div className="flex items-center justify-between mb-xs">
                <h3 className="font-h3 text-h3 text-on-surface">Furniture</h3>
                <span className="bg-electric-purple text-white px-2 py-1 font-label-caps text-[10px] uppercase border-2 border-primary leading-none">
                  AI Scan
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm line-clamp-1">
                Document existing damage.
              </p>
            </div>
            <input accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" multiple type="file" />
          </div>
        </div>

        {/* Warning / Info Box */}
        <div className="bg-error-container border-2 border-primary p-md flex items-start gap-md mb-xl">
          <span className="material-symbols-outlined text-on-error-container mt-1">
            info
          </span>
          <div>
            <p className="font-body-md text-body-md text-on-error-container font-bold">
              Important
            </p>
            <p className="font-body-md text-body-md text-on-error-container text-sm">
              Take clear photos in good lighting. These records are legally
              binding and will be referenced during move-out.
            </p>
          </div>
        </div>

        {/* Action Area */}
        <div className="flex justify-between items-center pt-lg border-t-2 border-primary">
          <button onClick={() => navigate(-1)} className="font-label-caps text-label-caps text-on-surface hover:opacity-70 transition-opacity uppercase">
            ← Back
          </button>
          <button
            type="button"
            onClick={handleComplete}
            disabled={isCompleting}
            className="bg-acid-lime border-2 border-primary px-xl py-lg font-h3 text-h3 text-primary uppercase hover:shadow-[8px_8px_0px_0px_#000000] hover:-translate-y-1 transition-all flex items-center gap-sm disabled:opacity-50"
          >
            {isCompleting ? 'RECORDING...' : 'COMPLETE HANDOVER'}
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
        {handoverStatus && (
          <div role="status" className={`mt-lg border-2 border-primary p-md flex items-start gap-md ${handoverStatus === 'success' ? 'bg-surface-container-lowest' : 'bg-error-container'}`}>
            <span className={`material-symbols-outlined mt-1 ${handoverStatus === 'success' ? 'text-primary' : 'text-on-error-container'}`}>
              {handoverStatus === 'success' ? 'verified' : 'error'}
            </span>
            <p className={`font-body-md text-body-md ${handoverStatus === 'success' ? 'text-on-surface' : 'text-on-error-container'}`}>
              {handoverMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
