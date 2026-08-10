import { useState } from 'react';
import { Link } from 'react-router-dom';
import { respondToRentalRequest, listerMoney } from '../../lib/listerData';

const inr = listerMoney;

const statusStyles = {
  pending: 'bg-acid-lime text-primary',
  accepted: 'bg-electric-purple text-white',
  declined: 'bg-surface-container text-on-surface-variant',
};

function RequestDetailModal({ request, onClose }) {
  if (!request) return null;
  const fmt = (s) => (s ? new Date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—');
  const rows = [
    { label: 'Item', value: request.itemName },
    { label: 'Renter', value: request.renterName },
    { label: 'Email', value: request.renterEmail },
    { label: 'Start date', value: fmt(request.startDate) },
    { label: 'End date', value: fmt(request.endDate) },
    { label: 'Duration', value: `${request.days} day${request.days > 1 ? 's' : ''}` },
    { label: 'Requested amount', value: inr(request.amount) },
    { label: 'Requested on', value: fmt(request.createdAt) },
    { label: 'Status', value: request.status },
  ];
  return (
    <div className="fixed inset-0 z-[100] bg-primary/60 flex items-center justify-center p-lg" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-surface border-2 border-primary p-lg shadow-[8px_8px_0px_0px_#C7F000]">
        <div className="flex justify-between items-start mb-md">
          <div>
            <p className="font-label-caps text-label-caps text-electric-purple uppercase">Rental request</p>
            <h2 className="font-h3 text-h3 text-primary">{request.itemName}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="material-symbols-outlined text-primary">close</button>
        </div>
        <div className="border-2 border-primary divide-y-2 divide-primary mb-lg">
          {rows.map((row) => (
            <div key={row.label} className="flex justify-between gap-md px-md py-sm">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase flex-shrink-0">{row.label}</span>
              <span className="font-body-md text-body-md text-primary text-right capitalize">{row.value}</span>
            </div>
          ))}
        </div>
        {request.message && (
          <div className="border-2 border-primary bg-surface-container-lowest p-md mb-lg">
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-xs">Message from renter</p>
            <p className="font-body-md text-body-md text-primary">{request.message}</p>
          </div>
        )}
        <div className="flex gap-sm">
          <button type="button" onClick={onClose} className="flex-1 py-md bg-surface-container-lowest border-2 border-primary font-label-caps text-label-caps text-primary">CLOSE</button>
          {request.status === 'pending' && (
            <button
              type="button"
              onClick={() => { onClose(); }}
              className="flex-1 py-md bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary"
            >
              HANDLE IN REQUESTS
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ListerRequestsSection({ requests, profile, onRefresh }) {
  const [busyId, setBusyId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const pending = requests.filter((r) => r.status === 'pending');
  const handled = requests.filter((r) => r.status !== 'pending');

  const respond = async (request, decision) => {
    setBusyId(request.id);
    setNotice('');
    setError('');
    try {
      await respondToRentalRequest(request.id, decision);
      setNotice(
        decision === 'accepted'
          ? `Accepted ${request.renterName}'s request. Payout of ${inr(request.amount)} credited to your account.`
          : `Declined ${request.renterName}'s request.`
      );
      onRefresh();
    } catch (err) {
      setError(err.message || 'Could not update the request.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="flex flex-col gap-xl">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-lg">
        <div>
          <p className="font-label-caps text-label-caps text-electric-purple uppercase mb-sm">Inbox</p>
          <h1 className="font-heading text-h1-mobile md:text-h1 text-primary font-bold uppercase tracking-tight">Rental requests</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm max-w-2xl">
            Students request your items here. Accept to confirm the rental — a payout is credited to you instantly and the item is marked as rented.
          </p>
        </div>
        <Link to="/lister/list-an-item" className="shrink-0 px-lg py-md bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-1 transition-all">
          + LIST AN ITEM
        </Link>
      </section>

      {notice && <div role="status" className="border-2 border-primary bg-acid-lime p-md text-primary">{notice}</div>}
      {error && <div role="alert" className="border-2 border-error bg-error/10 p-md text-error">{error}</div>}

      {/* Pending */}
      <section className="flex flex-col gap-md">
        <h2 className="font-h3 text-h3 text-primary uppercase border-b-2 border-primary pb-xs w-fit">Awaiting your reply ({pending.length})</h2>
        {pending.length === 0 ? (
          <div className="bg-surface border-2 border-primary p-lg text-center">
            <span className="material-symbols-outlined text-[48px] text-on-surface-variant">mark_email_read</span>
            <p className="font-body-md text-body-md text-on-surface-variant mt-md">All caught up. New requests will appear here instantly.</p>
          </div>
        ) : (
          pending.map((req) => (
            <article key={req.id} className="bg-surface border-2 border-primary shadow-[6px_6px_0px_0px_#000000] p-lg flex flex-col lg:flex-row lg:items-center gap-lg">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-sm mb-xs">
                  <span className="px-sm py-xs bg-acid-lime border-2 border-primary font-label-caps text-[10px] uppercase">Pending</span>
                  <span className="font-label-caps text-label-caps text-on-surface-variant">{new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                </div>
                <h3 className="font-h3 text-h3 text-primary truncate">{req.itemName}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                  <strong className="text-primary">{req.renterName}</strong> · {req.days} day{req.days > 1 ? 's' : ''} ·{' '}
                  {new Date(req.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} →{' '}
                  {new Date(req.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </p>
                {req.message && <p className="font-body-sm text-body-sm text-on-surface-variant mt-sm italic">"{req.message}"</p>}
              </div>
              <div className="flex items-center gap-md shrink-0">
                <span className="font-price-display text-price-display text-primary">{inr(req.amount)}</span>
                <button type="button" onClick={() => setDetail(req)} className="px-md py-md border-2 border-primary bg-surface-container-lowest font-label-caps text-label-caps text-primary hover:bg-surface transition-colors">
                  DETAILS
                </button>
                <div className="flex flex-col sm:flex-row gap-sm">
                  <button type="button" onClick={() => respond(req, 'declined')} disabled={busyId === req.id}
                    className="px-lg py-md bg-surface border-2 border-primary font-label-caps text-label-caps text-error hover:bg-coral hover:text-white transition-colors disabled:opacity-50">
                    DECLINE
                  </button>
                  <button type="button" onClick={() => respond(req, 'accepted')} disabled={busyId === req.id}
                    className="px-lg py-md bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] transition-all disabled:opacity-50 flex items-center gap-xs">
                    {busyId === req.id ? <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span> : <span className="material-symbols-outlined text-[16px]">check</span>}
                    ACCEPT
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </section>

      {/* Handled */}
      {handled.length > 0 && (
        <section className="flex flex-col gap-md">
          <h2 className="font-h3 text-h3 text-primary uppercase border-b-2 border-primary pb-xs w-fit">History ({handled.length})</h2>
          <div className="bg-surface border-2 border-primary divide-y-2 divide-primary">
            {handled.map((req) => (
              <button key={req.id} type="button" onClick={() => setDetail(req)} className="w-full text-left px-lg py-md flex items-center gap-md hover:bg-surface-container-low transition-colors">
                <span className={`px-sm py-xs border-2 border-primary font-label-caps text-[10px] uppercase flex-shrink-0 ${statusStyles[req.status]}`}>{req.status}</span>
                <span className="flex-1 min-w-0">
                  <span className="block font-body-md text-body-md text-primary font-bold truncate">{req.itemName}</span>
                  <span className="block font-label-caps text-[10px] text-on-surface-variant uppercase">{req.renterName} · {req.days} days · {new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                </span>
                <span className="font-price-display text-price-display text-primary shrink-0">{inr(req.amount)}</span>
                <span className="material-symbols-outlined text-on-surface-variant shrink-0">chevron_right</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <RequestDetailModal request={detail} onClose={() => setDetail(null)} />
    </div>
  );
}
