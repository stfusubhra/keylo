import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAdminVaultData, releaseDeposit, cancelDepositRelease, resolveDepositDispute } from '../lib/supabaseData';
import { isSupabaseConfigured } from '../lib/supabase';
import LoadingScreen from '../components/ui/LoadingScreen';
import toast from 'react-hot-toast';

const money = (v) => `₹${Number(v || 0).toLocaleString('en-IN')}`;
const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
const _formatDateTime = (d) => d ? new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';

function StatusBadge({ status, size = 'sm' }) {
  const styles = {
    held: 'bg-acid-lime text-primary',
    release_pending: 'bg-electric-purple text-white',
    released: 'bg-surface-container text-primary',
    disputed: 'bg-hot-pink text-white',
    open: 'bg-hot-pink text-white',
    landlord_review: 'bg-sky-cyan text-primary',
    admin_review: 'bg-electric-purple text-white',
    resolved: 'bg-acid-lime text-primary',
    denied: 'bg-surface-container text-on-surface-variant',
    pending: 'bg-surface-container text-on-surface-variant',
    confirmed: 'bg-acid-lime text-primary',
    active: 'bg-acid-lime text-primary',
    completed: 'bg-surface-container text-on-surface-variant',
    cancelled: 'bg-surface-container text-on-surface-variant',
  };
  const sizeClasses = size === 'lg' ? 'px-sm py-xs text-[10px]' : 'px-xs py-[2px] text-[9px]';
  return (
    <span className={`font-label-caps uppercase border-2 border-primary ${styles[status] || 'bg-surface-container text-on-surface-variant'} ${sizeClasses}`}>
      {status?.replace('_', ' ') || 'unknown'}
    </span>
  );
}

export default function AdminVaultPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('deposits');
  const [_releaseTarget, setReleaseTarget] = useState(null);
  const [resolveTarget, setResolveTarget] = useState(null);
  const [resolveNote, setResolveNote] = useState('');
  const [resolveRefund, setResolveRefund] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }
    let active = true;
    getAdminVaultData()
      .then(({ bookings: b, deposits: d, disputes: disp }) => {
        if (!active) return;
        setBookings(b);
        setDeposits(d);
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

  const stats = {
    totalHeld: deposits.filter((d) => d.status === 'held').reduce((s, d) => s + Number(d.amount || 0), 0),
    pendingRelease: deposits.filter((d) => d.status === 'release_pending').reduce((s, d) => s + Number(d.amount || 0), 0),
    disputed: deposits.filter((d) => d.status === 'disputed').reduce((s, d) => s + Number(d.amount || 0), 0),
    released: deposits.filter((d) => d.status === 'released').reduce((s, d) => s + Number(d.amount || 0), 0),
    openDisputes: disputes.filter((d) => !['resolved', 'denied'].includes(d.status)).length,
  };

  const handleRelease = async (deposit) => {
    setReleaseTarget(deposit);
    try {
      await releaseDeposit(deposit.booking_id);
      setDeposits((prev) => prev.map((d) => d.id === deposit.id ? { ...d, status: 'released', released_at: new Date().toISOString() } : d));
      toast.success(`Released ${money(deposit.amount)} for ${deposit.property_name}`);
      setReleaseTarget(null);
    } catch (err) {
      toast.error(err.message || 'Failed to release deposit');
    }
  };

  const handleApproveRelease = async (deposit) => {
    try {
      await releaseDeposit(deposit.booking_id);
      setDeposits((prev) => prev.map((d) => d.id === deposit.id ? { ...d, status: 'released', released_at: new Date().toISOString() } : d));
      toast.success(`Approved release of ${money(deposit.amount)}`);
    } catch (err) {
      toast.error(err.message || 'Failed to approve release');
    }
  };

  const handleResolveDispute = async (dispute, decision) => {
    setIsSubmitting(true);
    try {
      await resolveDepositDispute({
        disputeId: dispute.id,
        decision,
        refundAmount: decision === 'refund' ? resolveRefund : 0,
        note: resolveNote || `Admin decision: ${decision}.`,
      });
      setDisputes((prev) => prev.map((d) => d.id === dispute.id ? { ...d, status: decision === 'refund' ? 'resolved' : 'denied' } : d));
      toast.success(`Dispute ${decision === 'refund' ? 'resolved with refund' : 'denied'}`);
      setResolveTarget(null);
      setResolveNote('');
      setResolveRefund(0);
    } catch (err) {
      toast.error(err.message || 'Failed to resolve dispute');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <LoadingScreen label="Loading vault data..." className="min-h-screen" />;
  if (error) {
    return (
      <div className="min-h-screen bg-surface-container-low flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <span className="material-symbols-outlined text-[64px] text-error mb-md">error</span>
          <h2 className="font-h3 text-h3 text-primary mb-sm">Failed to load vault</h2>
          <p className="font-body-md text-on-surface-variant mb-lg">{error}</p>
          <button onClick={() => navigate(-1)} className="px-md py-sm bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary">Go Back</button>
        </div>
      </div>
    );
  }

  const filteredDeposits = filterStatus === 'all' ? deposits : deposits.filter((d) => d.status === filterStatus);
  const filteredDisputes = disputes.filter((d) => !['resolved', 'denied'].includes(d.status));

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen">
      {/* Header */}
      <div className="bg-primary text-on-primary border-b-2 border-primary">
        <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin-desktop py-xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-md">
            <div>
              <p className="font-label-caps text-label-caps text-hot-pink uppercase mb-sm">Admin Control</p>
              <h1 className="font-heading text-h1-mobile md:text-h1 font-bold uppercase">Vault & Deposits</h1>
              <p className="font-body-md text-on-primary/70 mt-sm">Manage protected deposits, approve refunds, and resolve disputes.</p>
            </div>
            <Link to="/admin" className="px-md py-sm bg-acid-lime border-2 border-on-primary font-label-caps text-label-caps text-primary hover:bg-primary hover:text-on-primary transition-colors flex items-center gap-xs self-start">
              <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Admin
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin-desktop py-xl flex flex-col gap-xl">

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-md">
          {[
            { label: 'Total Held', value: money(stats.totalHeld), icon: 'shield', color: 'bg-acid-lime' },
            { label: 'Pending Release', value: money(stats.pendingRelease), icon: 'hourglass_top', color: 'bg-electric-purple' },
            { label: 'Disputed', value: money(stats.disputed), icon: 'gavel', color: 'bg-hot-pink' },
            { label: 'Released', value: money(stats.released), icon: 'check_circle', color: 'bg-surface-container' },
            { label: 'Open Disputes', value: stats.openDisputes, icon: 'warning', color: 'bg-hot-pink' },
            { label: 'Total Bookings', value: bookings.length, icon: 'calendar_today', color: 'bg-sky-cyan' },
          ].map(({ label, value, icon, color }) => (
            <article key={label} className={`${color} border-2 border-primary p-md shadow-[4px_4px_0px_0px_#000000]`}>
              <span className="material-symbols-outlined text-primary">{icon}</span>
              <p className="font-price-display text-[22px] text-primary mt-sm break-words">{value}</p>
              <p className="font-label-caps text-[10px] text-primary uppercase mt-xs">{label}</p>
            </article>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-sm border-b-2 border-primary">
          {[
            { id: 'deposits', label: 'All Deposits' },
            { id: 'releases', label: 'Release Requests' },
            { id: 'disputes', label: 'Open Disputes' },
            { id: 'bookings', label: 'Bookings' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-md py-sm font-label-caps text-label-caps border-2 border-b-0 transition-colors ${
                activeTab === id ? 'bg-primary text-on-primary' : 'bg-surface text-primary hover:bg-acid-lime'
              }`}
            >
              {label}
              {id === 'disputes' && filteredDisputes.length > 0 && (
                <span className="ml-xs px-xs py-[2px] bg-hot-pink text-white text-[10px]">{filteredDisputes.length}</span>
              )}
              {id === 'releases' && deposits.filter((d) => d.status === 'release_pending').length > 0 && (
                <span className="ml-xs px-xs py-[2px] bg-electric-purple text-white text-[10px]">{deposits.filter((d) => d.status === 'release_pending').length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Deposits Tab */}
        {activeTab === 'deposits' && (
          <div className="flex flex-col gap-md">
            <div className="flex flex-wrap gap-sm">
              {['all', 'held', 'release_pending', 'disputed', 'released'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-md py-sm border-2 border-primary font-label-caps text-label-caps ${filterStatus === s ? 'bg-primary text-on-primary' : 'bg-surface text-primary hover:bg-acid-lime'}`}
                >
                  {s === 'all' ? 'All' : s.replace('_', ' ')}
                </button>
              ))}
            </div>
            <div className="overflow-x-auto border-2 border-primary">
              <table className="w-full text-left min-w-[700px]">
                <thead className="bg-primary text-on-primary">
                  <tr>
                    <th className="px-md py-sm font-label-caps text-[10px] uppercase">Property</th>
                    <th className="px-md py-sm font-label-caps text-[10px] uppercase">Tenant</th>
                    <th className="px-md py-sm font-label-caps text-[10px] uppercase">Amount</th>
                    <th className="px-md py-sm font-label-caps text-[10px] uppercase">Status</th>
                    <th className="px-md py-sm font-label-caps text-[10px] uppercase">Held Since</th>
                    <th className="px-md py-sm font-label-caps text-[10px] uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDeposits.length === 0 ? (
                    <tr><td colSpan={6} className="px-md py-lg text-center text-on-surface-variant">No deposits found</td></tr>
                  ) : filteredDeposits.map((deposit) => (
                    <tr key={deposit.id} className="border-t-2 border-primary/20 hover:bg-surface-container-lowest">
                      <td className="px-md py-sm">
                        <p className="font-label-caps text-label-caps text-primary">{deposit.property_name}</p>
                        <p className="text-[11px] text-on-surface-variant">{deposit.booking_id?.substring(0, 8)}...</p>
                      </td>
                      <td className="px-md py-sm">
                        <p className="text-primary">{deposit.tenant_name}</p>
                        <p className="text-[11px] text-on-surface-variant">{deposit.tenant_email}</p>
                      </td>
                      <td className="px-md py-sm font-price-display text-price-display text-primary">{money(deposit.amount)}</td>
                      <td className="px-md py-sm"><StatusBadge status={deposit.status} /></td>
                      <td className="px-md py-sm text-on-surface-variant">{formatDate(deposit.held_at)}</td>
                      <td className="px-md py-sm">
                        {deposit.status === 'held' && (
                          <button onClick={() => handleRelease(deposit)} className="px-sm py-xs bg-acid-lime border-2 border-primary font-label-caps text-[10px] text-primary hover:bg-primary hover:text-on-primary transition-colors">
                            Release
                          </button>
                        )}
                        {deposit.status === 'release_pending' && (
                          <button onClick={() => handleApproveRelease(deposit)} className="px-sm py-xs bg-electric-purple border-2 border-primary font-label-caps text-[10px] text-white hover:bg-primary transition-colors">
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Releases Tab */}
        {activeTab === 'releases' && (
          <div className="flex flex-col gap-md">
            {deposits.filter((d) => d.status === 'release_pending').length === 0 ? (
              <div className="border-2 border-primary p-lg text-center text-on-surface-variant">No pending release requests</div>
            ) : deposits.filter((d) => d.status === 'release_pending').map((deposit) => (
              <article key={deposit.id} className="border-2 border-electric-purple bg-surface-container-lowest p-lg shadow-[4px_4px_0px_0px_#000000]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
                  <div>
                    <div className="flex items-center gap-sm mb-sm">
                      <StatusBadge status="release_pending" size="lg" />
                      <span className="font-label-caps text-label-caps text-on-surface-variant">Requested {formatDate(deposit.release_requested_at)}</span>
                    </div>
                    <h3 className="font-h3 text-h3 text-primary">{deposit.property_name}</h3>
                    <p className="font-body-md text-on-surface-variant">{deposit.tenant_name} · {deposit.tenant_email}</p>
                    <p className="font-price-display text-price-display text-electric-purple mt-sm">{money(deposit.amount)}</p>
                  </div>
                  <div className="flex gap-sm">
                    <button onClick={() => handleApproveRelease(deposit)} className="px-md py-sm bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary hover:bg-primary hover:text-on-primary transition-colors">
                      Approve Refund
                    </button>
                    <button onClick={async () => {
                      try {
                        await cancelDepositRelease(deposit.booking_id);
                        setDeposits((prev) => prev.map((d) => d.id === deposit.id ? { ...d, status: 'held' } : d));
                        toast.success('Release request cancelled');
                      } catch (err) {
                        toast.error(err.message);
                      }
                    }} className="px-md py-sm border-2 border-primary font-label-caps text-label-caps text-primary hover:bg-hot-pink hover:text-white transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Disputes Tab */}
        {activeTab === 'disputes' && (
          <div className="flex flex-col gap-md">
            {filteredDisputes.length === 0 ? (
              <div className="border-2 border-primary p-lg text-center text-on-surface-variant">No open disputes</div>
            ) : filteredDisputes.map((dispute) => (
              <article key={dispute.id} className="border-2 border-hot-pink bg-surface-container-lowest p-lg shadow-[4px_4px_0px_0px_#000000]">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-md">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-sm mb-sm flex-wrap">
                      <StatusBadge status={dispute.status} size="lg" />
                      <span className="font-label-caps text-label-caps text-on-surface-variant text-[10px]">
                        AI: {dispute.ai_recommendation?.replace('_', ' ')} · {Number(dispute.ai_confidence).toFixed(0)}% confidence
                      </span>
                    </div>
                    <h3 className="font-h3 text-h3 text-primary">{dispute.property_name}</h3>
                    <p className="font-body-md text-on-surface-variant mt-xs">{dispute.reason}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-md mt-md">
                      <div>
                        <p className="font-label-caps text-[10px] text-on-surface-variant uppercase">Claimed</p>
                        <p className="font-h3 text-h3 text-primary">{money(dispute.claimed_amount)}</p>
                      </div>
                      <div>
                        <p className="font-label-caps text-[10px] text-on-surface-variant uppercase">AI Recommends</p>
                        <p className="font-h3 text-h3 text-electric-purple">{money(dispute.recommended_refund)}</p>
                      </div>
                      {dispute.landlord_response && (
                        <div>
                          <p className="font-label-caps text-[10px] text-on-surface-variant uppercase">Landlord Response</p>
                          <p className="font-body-md text-on-surface-variant">{dispute.landlord_response}</p>
                        </div>
                      )}
                      {dispute.landlord_recommended_refund > 0 && (
                        <div>
                          <p className="font-label-caps text-[10px] text-on-surface-variant uppercase">Landlord Offers</p>
                          <p className="font-h3 text-h3 text-primary">{money(dispute.landlord_recommended_refund)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-sm flex-shrink-0">
                    <button
                      onClick={() => {
                        setResolveTarget(dispute);
                        setResolveRefund(dispute.recommended_refund);
                        setResolveNote('');
                      }}
                      className="px-md py-sm bg-hot-pink border-2 border-primary font-label-caps text-label-caps text-white hover:bg-primary transition-colors"
                    >
                      Resolve Dispute
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="overflow-x-auto border-2 border-primary">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-primary text-on-primary">
                <tr>
                  <th className="px-md py-sm font-label-caps text-[10px] uppercase">Tenant</th>
                  <th className="px-md py-sm font-label-caps text-[10px] uppercase">Property</th>
                  <th className="px-md py-sm font-label-caps text-[10px] uppercase">Status</th>
                  <th className="px-md py-sm font-label-caps text-[10px] uppercase">Move-in</th>
                  <th className="px-md py-sm font-label-caps text-[10px] uppercase">Rent</th>
                  <th className="px-md py-sm font-label-caps text-[10px] uppercase">Deposit</th>
                  <th className="px-md py-sm font-label-caps text-[10px] uppercase">Created</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr><td colSpan={7} className="px-md py-lg text-center text-on-surface-variant">No bookings found</td></tr>
                ) : bookings.map((booking) => (
                  <tr key={booking.id} className="border-t-2 border-primary/20 hover:bg-surface-container-lowest">
                    <td className="px-md py-sm">
                      <p className="text-primary">{booking.tenant_name}</p>
                      <p className="text-[11px] text-on-surface-variant">{booking.tenant_email}</p>
                    </td>
                    <td className="px-md py-sm text-primary">{booking.property_name}</td>
                    <td className="px-md py-sm"><StatusBadge status={booking.status} /></td>
                    <td className="px-md py-sm text-on-surface-variant">{formatDate(booking.move_in_date)}</td>
                    <td className="px-md py-sm text-primary">{money(booking.rent_amount)}</td>
                    <td className="px-md py-sm text-primary">{money(booking.deposit_amount)}</td>
                    <td className="px-md py-sm text-on-surface-variant">{formatDate(booking.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Resolve Dispute Modal */}
      {resolveTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Resolve dispute">
          <div className="absolute inset-0 bg-black/60" onClick={() => setResolveTarget(null)} />
          <div className="relative bg-surface border-2 border-primary shadow-[12px_12px_0px_0px_#000000] max-w-lg w-full p-lg">
            <button onClick={() => setResolveTarget(null)} className="absolute top-md right-md p-xs hover:bg-surface-container-high transition-colors" aria-label="Close">
              <span className="material-symbols-outlined">close</span>
            </button>
            <h2 className="font-h3 text-h3 text-primary mb-sm">Resolve Dispute</h2>
            <p className="font-body-md text-on-surface-variant mb-md">
              Property: <span className="font-label-caps text-label-caps text-primary">{resolveTarget.property_name}</span>
            </p>
            <div className="grid grid-cols-2 gap-md mb-md">
              <div className="border-2 border-primary p-md">
                <p className="font-label-caps text-label-caps text-on-surface-variant text-[10px] uppercase">AI Recommends</p>
                <p className="font-h3 text-h3 text-electric-purple">{money(resolveTarget.recommended_refund)}</p>
              </div>
              <div className="border-2 border-primary p-md">
                <p className="font-label-caps text-label-caps text-on-surface-variant text-[10px] uppercase">Claimed</p>
                <p className="font-h3 text-h3 text-primary">{money(resolveTarget.claimed_amount)}</p>
              </div>
            </div>
            <label className="block font-label-caps text-label-caps text-primary mb-xs" htmlFor="resolve-refund">Refund Amount</label>
            <input
              id="resolve-refund"
              type="number"
              min="0"
              max={resolveTarget.claimed_amount}
              value={resolveRefund}
              onChange={(e) => setResolveRefund(Number(e.target.value))}
              className="w-full border-2 border-primary p-md font-body-md bg-surface-container-lowest mb-md"
            />
            <label className="block font-label-caps text-label-caps text-primary mb-xs" htmlFor="resolve-note">Admin Note</label>
            <textarea
              id="resolve-note"
              className="w-full border-2 border-primary p-md font-body-md bg-surface-container-lowest resize-none mb-md"
              rows="3"
              placeholder="Optional note for the record..."
              value={resolveNote}
              onChange={(e) => setResolveNote(e.target.value)}
            />
            <div className="flex gap-sm">
              <button onClick={() => setResolveTarget(null)} className="px-md py-sm border-2 border-primary font-label-caps text-label-caps text-primary hover:bg-surface-container-high transition-colors">
                Cancel
              </button>
              <button onClick={() => handleResolveDispute(resolveTarget, 'refund')} disabled={isSubmitting} className="px-md py-sm bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary hover:bg-primary hover:text-on-primary transition-colors disabled:opacity-50">
                Issue Refund
              </button>
              <button onClick={() => handleResolveDispute(resolveTarget, 'deny')} disabled={isSubmitting} className="px-md py-sm bg-hot-pink border-2 border-primary font-label-caps text-label-caps text-white hover:bg-primary transition-colors disabled:opacity-50">
                Deny Claim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
