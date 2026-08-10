import { useEffect, useState } from 'react';
import { getDashboardData, getStudentDisputes, openDepositDispute } from '../lib/supabaseData';
import { isSupabaseConfigured } from '../lib/supabase';

const MIN_REASON_LENGTH = 10;

export default function DepositDisputesPage() {
  const [bookings, setBookings] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [bookingId, setBookingId] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const refresh = async () => {
    const [dashboard, currentDisputes] = await Promise.all([getDashboardData(), getStudentDisputes()]);
    setBookings(dashboard.bookings.filter((booking) => ['confirmed', 'active', 'completed'].includes(booking.status)));
    setDisputes(currentDisputes);
  };
  useEffect(() => { if (isSupabaseConfigured) refresh().catch((err) => setError(err.message)); }, []);

  const submit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    if (!bookingId) { setError('Choose a confirmed stay to dispute.'); return; }
    if (reason.trim().length < MIN_REASON_LENGTH) { setError(`Describe what happened in at least ${MIN_REASON_LENGTH} characters.`); return; }
    setSubmitting(true);
    try {
      await openDepositDispute({ bookingId, reason: reason.trim() });
      setReason('');
      setBookingId('');
      setMessage('Dispute opened. KeyLo generated an initial refund recommendation for review.');
      await refresh();
    } catch (err) { setError(err.message); } finally { setSubmitting(false); }
  };

  return <div className="w-full"><div className="max-w-5xl mx-auto">
    <header className="bg-primary text-on-primary border-2 border-primary p-lg lg:p-xl shadow-[8px_8px_0px_0px_#C7F000] mb-xl"><p className="font-label-caps text-label-caps text-acid-lime uppercase">KeyLo Vault</p><h1 className="font-heading text-h1-mobile md:text-h1 font-bold uppercase">Deposit disputes</h1><p className="font-body-lg text-on-primary/80 mt-sm max-w-2xl">Submit move-out evidence, see the AI recommendation, and let a human make the final decision.</p></header>
    {message && <div role="status" className="bg-acid-lime border-2 border-primary p-md mb-lg">{message}</div>}{error && <div role="alert" className="bg-error/10 border-2 border-error p-md mb-lg text-error">{error}</div>}
    <section className="bg-surface-container-lowest border-2 border-primary p-lg mb-xl"><h2 className="font-h3 text-h3 text-primary mb-md">Open a dispute</h2>{bookings.length === 0 ? <p className="border-2 border-primary p-lg text-on-surface-variant">No confirmed stays with a protected deposit yet. Once a booking is paid and confirmed, its deposit can be disputed here.</p> : <form className="grid gap-md" onSubmit={submit}><label className="font-label-caps text-label-caps">Booking<select required disabled={submitting} value={bookingId} onChange={(event) => { setBookingId(event.target.value); setError(''); }} className="block w-full mt-xs border-2 border-primary p-md bg-surface text-primary disabled:opacity-60"><option value="">Choose a confirmed stay</option>{bookings.map((booking) => <option key={booking.id} value={booking.id}>{booking.properties?.name || 'KeyLo stay'} · Deposit ₹{Number(booking.deposit_amount).toLocaleString('en-IN')}</option>)}</select></label><label className="font-label-caps text-label-caps">What happened<textarea required minLength={MIN_REASON_LENGTH} disabled={submitting} value={reason} onChange={(event) => { setReason(event.target.value); setError(''); }} className="block w-full mt-xs border-2 border-primary p-md bg-surface text-primary disabled:opacity-60" rows="4" placeholder="Describe the condition and attach evidence in your handover record." /><span className="font-label-caps text-label-caps mt-xs">{reason.length < MIN_REASON_LENGTH ? `Minimum ${MIN_REASON_LENGTH} characters — ${MIN_REASON_LENGTH - reason.length} to go` : `${reason.length} characters`}</span></label><button disabled={submitting} className="w-full sm:w-fit px-lg py-md bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary disabled:opacity-60" type="submit">{submitting ? 'Opening dispute…' : 'OPEN DISPUTE'}</button></form>}</section>
    <section className="flex flex-col gap-md"><h2 className="font-h3 text-h3 text-primary">Your cases</h2>{disputes.length ? disputes.map((dispute) => <article key={dispute.id} className="border-2 border-primary bg-surface-container-lowest p-lg"><div className="flex flex-wrap justify-between gap-sm"><span className="font-label-caps text-label-caps text-electric-purple uppercase">{dispute.status.replace('_', ' ')}</span><span className="font-label-caps text-label-caps">AI recommendation: {dispute.ai_recommendation.replaceAll('_', ' ')}</span></div><h3 className="font-h3 text-h3 text-primary mt-sm">{dispute.properties?.name || 'Protected stay'}</h3><p className="text-on-surface-variant mt-sm">{dispute.reason}</p><p className="font-label-caps text-label-caps mt-md">Recommended refund: ₹{Number(dispute.recommended_refund).toLocaleString('en-IN')} · Confidence {Number(dispute.ai_confidence).toFixed(0)}%</p>{dispute.admin_note && <p className="mt-sm border-t-2 border-primary pt-sm">Admin: {dispute.admin_note}</p>}</article>) : <p className="border-2 border-primary p-lg text-on-surface-variant">No disputes yet. Your deposit evidence stays available if something needs review.</p>}</section>
  </div></div>;
}
