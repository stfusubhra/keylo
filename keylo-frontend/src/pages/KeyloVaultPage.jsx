import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getVaultData, requestDepositRelease, createDepositDispute } from '../lib/supabaseData';
import { isSupabaseConfigured } from '../lib/supabase';

import LoadingScreen from '../components/ui/LoadingScreen';
import toast from 'react-hot-toast';

const formatMoney = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;
const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

// PostgREST embeds a one-to-one relation (deposits.booking_id is unique) as an
// object, not an array. Normalize so callers can rely on an object or undefined.
const firstDeposit = (booking) => {
  if (Array.isArray(booking.deposits)) return booking.deposits[0] || null;
  return booking.deposits || null;
};

// Build a timeline based on a booking's actual data
function buildTimeline(booking, deposit) {
  const steps = [
    { id: 1, label: 'Booking Confirmed', date: booking.created_at, status: 'completed' },
    { id: 2, label: 'Deposit Held', date: deposit?.held_at, status: deposit ? 'completed' : 'pending' },
    { id: 3, label: 'Move-In', date: booking.move_in_date, status: booking.status === 'active' || booking.status === 'completed' ? 'completed' : booking.status === 'confirmed' ? 'current' : 'pending' },
    { id: 4, label: 'Stay Active', date: null, status: booking.status === 'active' ? 'current' : booking.status === 'completed' ? 'completed' : 'pending' },
    { id: 5, label: 'Checkout', date: booking.move_out_date, status: booking.status === 'completed' ? 'completed' : 'pending' },
    { id: 6, label: 'Refund', date: deposit?.released_at, status: deposit?.status === 'released' ? 'completed' : deposit?.status === 'release_pending' ? 'current' : 'pending' },
  ];

  // Mark everything after current as pending, fill gaps
  let foundCurrent = false;
  return steps.map((s) => {
    if (s.status === 'current') foundCurrent = true;
    if (foundCurrent && s.status === 'pending') return s;
    if (!foundCurrent && s.status === 'pending' && s.id > 3) return { ...s, status: 'pending' };
    return s;
  });
}

export default function KeyloVaultPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [isLoading, setIsLoading] = useState(!isSupabaseConfigured);
  const [error, setError] = useState('');
  const [_releaseTarget, setReleaseTarget] = useState(null);
  const [disputeTarget, setDisputeTarget] = useState(null);
  const [disputeReason, setDisputeReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Demo mode: show sample data
      const demoBooking = {
        id: 'demo-1',
        status: 'active',
        move_in_date: '2026-10-15',
        move_out_date: null,
        rent_amount: 9500,
        deposit_amount: 12000,
        created_at: '2026-10-01T10:00:00Z',
        properties: {
          id: 'jadavpur-pg',
          name: 'Lake View Student PG',
          area: 'Jadavpur',
          city: 'Kolkata',
          cover_image_url: 'https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=400&q=80',
          trust_score: 85,
        },
        deposits: [{ id: 'demo-dep-1', status: 'held', amount: 12000, held_at: '2026-10-02T10:00:00Z' }],
      };
      setTimeout(() => {
        setBookings([demoBooking]);
        setIsLoading(false);
      }, 600);
      return;
    }

    let active = true;
    getVaultData()
      .then(({ bookings: data, disputes: disp }) => {
        if (!active) return;
        setBookings(data);
        setDisputes(disp);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || 'Failed to load vault data');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => { active = false; };
  }, []);

  const totalHeld = bookings.reduce(
    (sum, b) => {
      const d = firstDeposit(b);
      return sum + (d && d.status !== 'released' ? Number(d.amount || 0) : 0);
    },
    0,
  );

  const handleRequestRelease = async (booking) => {
    setReleaseTarget(booking);
    try {
      await requestDepositRelease(booking.id);
      setBookings((prev) =>
        prev.map((b) => {
          if (b.id !== booking.id) return b;
          const depArr = Array.isArray(b.deposits) ? b.deposits : b.deposits ? [b.deposits] : [];
          return { ...b, deposits: depArr.map((d) => ({ ...d, status: 'release_pending', release_requested_at: new Date().toISOString() })) };
        }),
      );
      toast.success('Deposit release requested. Funds will be refunded within 3–5 business days.');
      setReleaseTarget(null);
    } catch (err) {
      toast.error(err.message || 'Failed to request release');
    }
  };

  const handleOpenDispute = async (booking) => {
    if (!disputeReason.trim()) {
      toast.error('Please describe the issue before opening a dispute.');
      return;
    }
    setIsSubmitting(true);
    try {
      await createDepositDispute({ bookingId: booking.id, reason: disputeReason.trim() });
      toast.success('Dispute opened. Our team will review within 24 hours.');
      setDisputeTarget(null);
      setDisputeReason('');
      // Refresh
      const { bookings: data, disputes: disp } = await getVaultData();
      setBookings(data);
      setDisputes(disp);
    } catch (err) {
      toast.error(err.message || 'Failed to open dispute');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <LoadingScreen label="Loading your vault..." className="min-h-screen" />;
  if (error) {
    return (
      <div className="min-h-screen bg-surface-container-low flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <span className="material-symbols-outlined text-[64px] text-error mb-md">error</span>
          <h2 className="font-h3 text-h3 text-primary mb-sm">Failed to load vault</h2>
          <p className="font-body-md text-on-surface-variant mb-lg">{error}</p>
          <button onClick={() => navigate(-1)} className="px-md py-sm bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const hasActiveBooking = bookings.some((b) => ['confirmed', 'active'].includes(b.status));
  const hasCompletedBooking = bookings.some((b) => b.status === 'completed');
  const activeDepositCount = bookings.filter((b) => {
    const d = firstDeposit(b);
    return d && d.status !== 'released';
  }).length;

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen">
      {/* Ambient Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-acid-lime/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-electric-purple/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

      <div className="relative z-10 max-w-6xl mx-auto px-margin-mobile lg:px-margin-desktop py-xl flex flex-col gap-xl">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-lg">
          <div>
            <div className="flex items-center gap-xs px-sm py-xs bg-acid-lime/10 border-2 border-acid-lime w-max mb-md">
              <span className="material-symbols-outlined text-acid-lime text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
              <span className="font-label-caps text-label-caps text-acid-lime">SECURED IN KEYLO VAULT</span>
            </div>
            <h1 className="font-heading text-h1-mobile md:text-h1 text-primary font-bold leading-tight">
              Your deposit. <span className="text-acid-lime">Protected.</span>
            </h1>
            <div className="mt-md max-w-lg border-2 border-primary bg-surface-container-lowest p-md shadow-[4px_4px_0px_0px_#000000]">
              <div className="flex items-start gap-sm">
                <span className="material-symbols-outlined text-2xl bg-acid-lime text-primary border-2 border-primary p-xs" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
                <p className="font-body-md text-primary font-medium leading-relaxed">
                  {hasActiveBooking
                    ? <>Your security deposit sits in escrow with KeyLo — <mark className="bg-acid-lime text-primary px-xs py-[1px] font-bold">never handed straight to the landlord</mark>. Request a refund at checkout, or open a dispute if anything feels off.</>
                    : hasCompletedBooking
                    ? 'Your stay is wrapped up. Request your refund below, or check your vault history — your money stays protected until it reaches you.'
                    : 'Book a stay and your security deposit is locked in the KeyLo Vault — protected end to end, refundable at move-out.'}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-lg gap-y-xs mt-md">
              <span className="flex items-center gap-xs font-label-caps text-label-caps text-primary text-[10px] uppercase">
                <span className="material-symbols-outlined text-sm text-acid-lime" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                Escrow-held, never landlord-held
              </span>
              <span className="flex items-center gap-xs font-label-caps text-label-caps text-primary text-[10px] uppercase">
                <span className="material-symbols-outlined text-sm text-acid-lime" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                100% refund guarantee
              </span>
              <span className="flex items-center gap-xs font-label-caps text-label-caps text-primary text-[10px] uppercase">
                <span className="material-symbols-outlined text-sm text-acid-lime" style={{ fontVariationSettings: "'FILL' 1" }}>gavel</span>
                AI-assisted disputes
              </span>
            </div>
          </div>

          {/* Balance Card */}
          <div className="bg-surface-container-lowest border-2 border-primary p-lg shadow-[8px_8px_0px_0px_#000000] min-w-[220px]">
            <div className="flex items-center justify-between gap-sm mb-xs">
              <span className="font-label-caps text-label-caps text-on-surface-variant">Total Held</span>
              <span className="material-symbols-outlined text-on-surface-variant text-sm">account_balance</span>
            </div>
            <div className="font-price-display text-price-display text-acid-lime">{formatMoney(totalHeld)}</div>
            <div className="font-body-sm text-on-surface-variant mt-xs">
              {activeDepositCount} active deposit{activeDepositCount !== 1 ? 's' : ''}
            </div>
            <div className="mt-md pt-md border-t-2 border-primary/10 flex items-center gap-xs">
              <span className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              <span className="font-body-sm text-on-surface-variant">In escrow until move-out</span>
            </div>
          </div>
        </div>

        {/* ── Booking Cards ── */}
        {!hasActiveBooking && !hasCompletedBooking ? (
          <div className="bg-surface-container-lowest border-2 border-primary p-xl text-center">
            <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-md block">lock</span>
            <h2 className="font-h3 text-h3 text-primary mb-sm">No active deposits yet</h2>
            <p className="font-body-md text-on-surface-variant mb-lg">Book a stay to protect your deposit with KeyLo Vault.</p>
            <Link
              to="/find-a-stay"
              className="inline-flex items-center gap-sm px-md py-sm bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary hover:bg-primary hover:text-on-primary transition-colors"
            >
              FIND A STAY <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-lg">
            {bookings.map((booking) => {
              const deposit = firstDeposit(booking);
              const prop = booking.properties;
              const timeline = buildTimeline(booking, deposit);
              const canRelease = booking.status === 'completed' && deposit?.status === 'held';
              const canDispute = booking.status !== 'cancelled' && deposit?.status === 'held';
              const isDisputed = deposit?.status === 'disputed';
              const isReleased = deposit?.status === 'released';
              const isReleasePending = deposit?.status === 'release_pending';

              return (
                <article
                  key={booking.id}
                  className="bg-surface-container-lowest border-2 border-primary shadow-[8px_8px_0px_0px_#000000] overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row gap-md p-lg">
                    {/* Property Image */}
                    <div className="w-full sm:w-32 h-32 flex-shrink-0 border-2 border-primary overflow-hidden">
                      <img
                        src={prop?.cover_image_url || 'https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=200&q=80'}
                        alt={prop?.name || 'Property'}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-md">
                        <div>
                          <h2 className="font-h3 text-h3 text-primary truncate">{prop?.name || 'Property'}</h2>
                          <p className="font-body-md text-on-surface-variant text-sm">
                            {prop?.area}, {prop?.city} · {booking.status === 'active' ? '🏠 Currently staying' : booking.status === 'completed' ? '✅ Completed' : '📋 Confirmed'}
                          </p>
                          <div className="flex flex-wrap gap-sm mt-sm">
                            <span className="px-sm py-xs bg-acid-lime border-2 border-primary font-label-caps text-[10px] uppercase">
                              Trust {prop?.trust_score || '—'}/100
                            </span>
                            {deposit?.status === 'disputed' && (
                              <span className="px-sm py-xs bg-hot-pink border-2 border-primary font-label-caps text-[10px] text-white uppercase">
                                Disputed
                              </span>
                            )}
                            {isReleasePending && (
                              <span className="px-sm py-xs bg-electric-purple border-2 border-primary font-label-caps text-[10px] text-white uppercase">
                                Refund Pending
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Amount */}
                        <div className="text-right flex-shrink-0">
                          <div className="font-price-display text-price-display text-acid-lime">
                            {formatMoney(deposit?.amount || booking.deposit_amount)}
                          </div>
                          <div className="font-label-caps text-label-caps text-on-surface-variant text-[10px] uppercase mt-xs">
                            {isReleased ? 'Refunded' : isReleasePending ? 'Pending Refund' : isDisputed ? 'Under Dispute' : 'Held in Vault'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-outline-variant mx-lg" />

                  {/* Timeline */}
                  <div className="px-lg py-md">
                    <p className="font-label-caps text-label-caps text-on-surface-variant mb-md uppercase text-[10px]">Vault Timeline</p>
                    <div className="relative">
                      <div className="absolute top-4 left-0 right-0 h-0.5 bg-outline-variant z-0" />
                      <div className="flex justify-between relative z-10">
                        {timeline.map((step) => (
                          <div key={step.id} className="flex flex-col items-center gap-1 flex-1">
                            <div
                              className={`w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center bg-surface shadow-[2px_2px_0px_0px_#000000] ${
                                step.status === 'completed'
                                  ? 'bg-acid-lime'
                                  : step.status === 'current'
                                  ? 'bg-surface ring-2 ring-acid-lime'
                                  : 'bg-surface-container-high opacity-50'
                              }`}
                            >
                              {step.status === 'completed' ? (
                                <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                              ) : step.status === 'current' ? (
                                <div className="w-3 h-3 bg-acid-lime rounded-full border border-primary animate-pulse" />
                              ) : (
                                <span className="material-symbols-outlined text-on-surface-variant text-sm">circle</span>
                              )}
                            </div>
                            <span className={`font-label-caps text-[9px] text-center ${step.status === 'pending' ? 'text-on-surface-variant opacity-50' : 'text-primary'}`}>
                              {step.label}
                            </span>
                            {step.date && (
                              <span className="text-[9px] text-on-surface-variant hidden sm:block">{formatDate(step.date)}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-lg py-md bg-surface-container-lowest border-t-2 border-primary flex flex-wrap gap-sm">
                    {canRelease && (
                      <button
                        type="button"
                        onClick={() => handleRequestRelease(booking)}
                        className="px-md py-sm bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary hover:bg-primary hover:text-on-primary transition-colors flex items-center gap-xs"
                      >
                        <span className="material-symbols-outlined text-sm">refund</span>
                        Request Refund
                      </button>
                    )}
                    {canDispute && !isDisputed && (
                      <button
                        type="button"
                        onClick={() => setDisputeTarget(booking)}
                        className="px-md py-sm bg-hot-pink border-2 border-primary font-label-caps text-label-caps text-white hover:bg-primary transition-colors flex items-center gap-xs"
                      >
                        <span className="material-symbols-outlined text-sm">gavel</span>
                        Open Dispute
                      </button>
                    )}
                    {isReleasePending && (
                      <span className="px-md py-sm bg-electric-purple border-2 border-primary font-label-caps text-label-caps text-white flex items-center gap-xs">
                        <span className="material-symbols-outlined text-sm animate-pulse">hourglass_top</span>
                        Refund in progress
                      </span>
                    )}
                    {isDisputed && (
                      <span className="px-md py-sm bg-coral border-2 border-primary font-label-caps text-label-caps text-white flex items-center gap-xs">
                        <span className="material-symbols-outlined text-sm">warning</span>
                        Dispute open — reviewing
                      </span>
                    )}
                    {isReleased && (
                      <span className="px-md py-sm bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary flex items-center gap-xs">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        Refunded on {formatDate(deposit.released_at)}
                      </span>
                    )}
                    <Link
                      to={`/property/${prop?.id}`}
                      className="px-md py-sm border-2 border-primary font-label-caps text-label-caps text-primary hover:bg-acid-lime transition-colors flex items-center gap-xs ml-auto"
                    >
                      View Property <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* ── Disputes Section ── */}
        {disputes.length > 0 && (
          <section className="bg-surface-container-low border-2 border-primary p-lg shadow-[4px_4px_0px_0px_#000000]">
            <h2 className="font-h3 text-h3 text-primary mb-md flex items-center gap-sm">
              <span className="material-symbols-outlined text-hot-pink">gavel</span>
              Active Disputes
            </h2>
            <div className="flex flex-col gap-md">
              {disputes.map((d) => (
                <div key={d.id} className="border-2 border-hot-pink/30 bg-hot-pink/5 p-md flex items-start gap-md">
                  <span className="material-symbols-outlined text-hot-pink text-2xl flex-shrink-0">warning</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-label-caps text-label-caps text-hot-pink uppercase text-sm">{d.status}</p>
                    <p className="font-body-md text-on-surface-variant mt-xs">{d.reason}</p>
                    <p className="font-body-sm text-on-surface-variant mt-xs">
                      Claimed: {formatMoney(d.claimed_amount)} · Opened {formatDate(d.created_at)}
                    </p>
                  </div>
                  <Link
                    to="/dashboard/disputes"
                    className="flex-shrink-0 px-md py-sm bg-hot-pink border-2 border-primary font-label-caps text-label-caps text-white hover:bg-primary transition-colors"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Deposit Flow Explanation ── */}
        <section className="bg-primary text-on-primary border-2 border-primary p-lg shadow-[8px_8px_0px_0px_#7C3AED]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            <div className="flex flex-col gap-sm">
              <span className="material-symbols-outlined text-acid-lime text-3xl">lock</span>
              <h3 className="font-h3 text-h3 text-acid-lime">1. Deposit Held</h3>
              <p className="font-body-md text-on-primary/70 text-sm">Your security deposit is held securely in escrow — never handed directly to the landlord.</p>
            </div>
            <div className="flex flex-col gap-sm">
              <span className="material-symbols-outlined text-acid-lime text-3xl">fact_check</span>
              <h3 className="font-h3 text-h3 text-acid-lime">2. Move-In Inspection</h3>
              <p className="font-body-md text-on-primary/70 text-sm">Complete a digital handover checklist. Both parties agree on the property condition before you move in.</p>
            </div>
            <div className="flex flex-col gap-sm">
              <span className="material-symbols-outlined text-acid-lime text-3xl">refund</span>
              <h3 className="font-h3 text-h3 text-acid-lime">3. Refund or Dispute</h3>
              <p className="font-body-md text-on-primary/70 text-sm">Request your deposit back at checkout. If there&apos;s a disagreement, open a dispute for AI-assisted resolution.</p>
            </div>
          </div>
        </section>
      </div>

      {/* ── Dispute Modal ── */}
      {disputeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Open deposit dispute">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDisputeTarget(null)} />
          <div className="relative bg-surface border-2 border-primary shadow-[12px_12px_0px_0px_#000000] max-w-lg w-full p-lg">
            <button
              type="button"
              onClick={() => setDisputeTarget(null)}
              className="absolute top-md right-md p-xs hover:bg-surface-container-high transition-colors"
              aria-label="Close"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h2 className="font-h3 text-h3 text-primary mb-sm">Open Deposit Dispute</h2>
            <p className="font-body-md text-on-surface-variant mb-md">
              Property: <span className="font-label-caps text-label-caps text-primary">{disputeTarget.properties?.name}</span>
            </p>
            <label className="block font-label-caps text-label-caps text-primary mb-xs" htmlFor="dispute-reason">
              Describe the issue
            </label>
            <textarea
              id="dispute-reason"
              className="w-full border-2 border-primary p-md font-body-md text-on-surface bg-surface-container-lowest resize-none"
              rows="4"
              placeholder="E.g. Landlord is withholding ₹5,000 without valid reason. Room had pre-existing damage..."
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              aria-describedby="dispute-hint"
            />
            <p id="dispute-hint" className="font-body-sm text-on-surface-variant mt-xs">
              Be specific — include amounts, dates, and what went wrong.
            </p>
            <div className="flex gap-sm mt-lg">
              <button
                type="button"
                onClick={() => setDisputeTarget(null)}
                className="px-md py-sm border-2 border-primary font-label-caps text-label-caps text-primary hover:bg-surface-container-high transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleOpenDispute(disputeTarget)}
                disabled={isSubmitting}
                className="px-md py-sm bg-hot-pink border-2 border-primary font-label-caps text-label-caps text-white hover:bg-primary transition-colors disabled:opacity-50 flex items-center gap-xs"
              >
                {isSubmitting ? (
                  <><span className="material-symbols-outlined text-sm animate-spin">progress_activity</span> Submitting...</>
                ) : (
                  <>Submit Dispute <span className="material-symbols-outlined text-sm">arrow_forward</span></>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
