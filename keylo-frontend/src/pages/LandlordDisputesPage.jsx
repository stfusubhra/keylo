import { useEffect, useRef, useState } from 'react';
import { getLandlordDisputes, respondToDepositDispute } from '../lib/supabaseData';
import { isSupabaseConfigured } from '../lib/supabase';

export default function LandlordDisputesPage() {
  const [disputes, setDisputes] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [respondingId, setRespondingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  // Always-current snapshot so the submit handler never reads stale draft state.
  const draftsRef = useRef(drafts);
  draftsRef.current = drafts;

  const refresh = () => getLandlordDisputes().then(setDisputes).catch((err) => setError(err.message));
  useEffect(() => { if (isSupabaseConfigured) refresh(); }, []);
  const updateDraft = (id, field, value) => setDrafts((current) => ({ ...current, [id]: { ...current[id], [field]: value } }));

  const respond = async (dispute) => {
    const draft = draftsRef.current[dispute.id] || {};
    setMessage('');
    setError('');
    setRespondingId(dispute.id);
    try {
      await respondToDepositDispute({
        disputeId: dispute.id,
        response: (draft.response || '').trim() || 'I have reviewed the evidence and shared my recommendation.',
        recommendedRefund: draft.refund ?? dispute.recommended_refund,
      });
      setDrafts((current) => { const next = { ...current }; delete next[dispute.id]; return next; });
      setMessage('Response sent to the admin review queue.');
      await refresh();
    } catch (err) { setError(err.message); } finally { setRespondingId(null); }
  };

  return <div className="bg-surface min-h-screen font-body-md text-on-surface p-lg lg:p-xl"><div className="max-w-5xl mx-auto"><header className="border-b-2 border-primary pb-lg mb-xl"><p className="font-label-caps text-label-caps text-hot-pink uppercase">Landlord workspace</p><h1 className="font-heading text-h1-mobile md:text-h1 text-primary font-bold uppercase">Dispute resolutions</h1><p className="font-body-lg text-on-surface-variant mt-sm">Review evidence, submit your response, and let KeyLo admins close the case.</p></header>{message && <div role="status" className="bg-acid-lime border-2 border-primary p-md mb-lg">{message}</div>}{error && <div role="alert" className="bg-error/10 border-2 border-error p-md mb-lg text-error">{error}</div>}<div className="flex flex-col gap-lg">{disputes.length ? disputes.map((dispute) => { const draft = drafts[dispute.id] || {}; const pending = respondingId === dispute.id; return <article key={dispute.id} className="border-2 border-primary bg-surface-container-lowest p-lg shadow-[4px_4px_0px_0px_#000000]"><div className="flex flex-wrap justify-between gap-sm"><span className="font-label-caps text-label-caps text-electric-purple uppercase">{dispute.status.replace('_', ' ')}</span><span className="font-label-caps text-label-caps">AI suggests ₹{Number(dispute.recommended_refund).toLocaleString('en-IN')} refund</span></div><h2 className="font-h3 text-h3 text-primary mt-md">{dispute.properties?.name || 'Property dispute'}</h2><p className="mt-sm text-on-surface-variant">{dispute.reason}</p>{['open', 'landlord_review'].includes(dispute.status) ? <div className="grid md:grid-cols-[1fr_180px_auto] gap-md mt-lg"><label className="font-label-caps text-label-caps">Your response<textarea value={draft.response || ''} onChange={(event) => updateDraft(dispute.id, 'response', event.target.value)} className="block w-full mt-xs border-2 border-primary p-md bg-surface" rows="3" placeholder="Explain the condition or proposed resolution." /></label><label className="font-label-caps text-label-caps">Refund ₹<input type="number" min="0" max={dispute.claimed_amount} value={draft.refund ?? dispute.recommended_refund} onChange={(event) => updateDraft(dispute.id, 'refund', event.target.value)} className="block w-full mt-xs border-2 border-primary p-md bg-surface" /></label><button type="button" disabled={pending} onClick={() => respond(dispute)} className="self-end px-lg py-md bg-acid-lime border-2 border-primary font-label-caps text-label-caps disabled:opacity-60">{pending ? 'Sending…' : 'SEND RESPONSE'}</button></div> : <p className="mt-lg font-label-caps text-label-caps text-on-surface-variant">Awaiting final admin decision.</p>}</article>; }) : <p className="border-2 border-primary p-lg text-on-surface-variant">No disputes are assigned to your properties.</p>}</div></div></div>;
}
