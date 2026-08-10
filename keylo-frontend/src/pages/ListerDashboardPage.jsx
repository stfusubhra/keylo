import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import {
  getListerSession,
  getListerProfile,
  getListerItems,
  getListerRequests,
  getListerEarnings,
  getListerSettings,
  updateListerProfile,
  updateListerSettings,
  updateListerItem,
  deleteListerItem,
  changeListerPassword,
  deleteListerAccount,
  listerCategoryLabel,
  listerCategoryImages,
  fileToDataUrl,
  listerMoney,
} from '../lib/listerData';
import ListerRequestsSection from '../components/lister/ListerRequestsSection';

const inr = listerMoney;

function StatCard({ icon, label, value, sub, accent = 'bg-surface-container-lowest' }) {
  return (
    <div className={`${accent} border-2 border-primary p-lg shadow-[4px_4px_0px_0px_#000000]`}>
      <span className="material-symbols-outlined text-[28px] text-electric-purple">{icon}</span>
      <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mt-md">{label}</p>
      <p className="font-price-display text-price-display text-primary mt-xs">{value}</p>
      {sub && <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">{sub}</p>}
    </div>
  );
}

function SectionHeader({ eyebrow, title, subtitle, action }) {
  return (
    <section className="flex flex-col md:flex-row md:items-end justify-between gap-lg mb-xl">
      <div>
        <p className="font-label-caps text-label-caps text-electric-purple uppercase mb-sm">{eyebrow}</p>
        <h1 className="font-heading text-h1-mobile md:text-h1 text-primary font-bold uppercase tracking-tight">{title}</h1>
        {subtitle && <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm max-w-2xl">{subtitle}</p>}
      </div>
      {action}
    </section>
  );
}

function ConfirmModal({ open, title, body, confirmLabel = 'Delete', busy, onConfirm, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-primary/60 flex items-center justify-center p-lg" role="dialog" aria-modal="true">
      <div className="w-full max-w-md bg-surface border-2 border-primary p-lg shadow-[8px_8px_0px_0px_#C7F000]">
        <div className="flex justify-between items-start mb-md">
          <h2 className="font-h3 text-h3 text-primary">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="material-symbols-outlined text-primary">close</button>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant mb-lg">{body}</p>
        <div className="flex gap-sm">
          <button type="button" onClick={onClose} disabled={busy} className="flex-1 py-md bg-surface-container-lowest border-2 border-primary font-label-caps text-label-caps text-primary disabled:opacity-50">CANCEL</button>
          <button type="button" onClick={onConfirm} disabled={busy} className="flex-1 py-md bg-coral border-2 border-primary font-label-caps text-label-caps text-white disabled:opacity-50">
            {busy ? 'WORKING...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function OverviewSection({ profile, items, requests, earnings }) {
  const openRequests = requests.filter((r) => r.status === 'pending');
  const available = items.filter((i) => i.availability === 'available').length;
  const money = inr(earnings?.total || 0);

  return (
    <div className="flex flex-col gap-xl">
      {/* Welcome banner */}
      <section className="bg-primary text-on-primary border-2 border-primary p-lg lg:p-xl shadow-[8px_8px_0px_0px_#C7F000]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-lg">
          <div>
            <p className="font-label-caps text-label-caps text-acid-lime uppercase">Lister overview</p>
            <h2 className="font-h3 text-h3 mt-sm">Good to see you, {profile?.name?.split(' ')[0] || 'Lister'}.</h2>
            <p className="font-body-md text-body-md text-on-primary/80 mt-sm max-w-xl">
              Your gear is earning while you study. Check new rental requests and keep your listings fresh.
            </p>
          </div>
          <Link to="/lister/list-an-item" className="shrink-0 px-lg py-md bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] transition-all flex items-center gap-sm">
            + LIST AN ITEM
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
        <StatCard icon="inventory_2" label="Total listings" value={items.length} sub={`${available} available to rent`} />
        <StatCard icon="inbox" label="Open requests" value={openRequests.length} sub={openRequests.length ? 'Awaiting your reply' : 'All caught up'} accent="bg-acid-lime" />
        <StatCard icon="repeat" label="Times rented" value={items.reduce((sum, i) => sum + (i.timesRented || 0), 0)} sub="Across all your items" />
        <StatCard icon="account_balance_wallet" label="Total earnings" value={money} sub="Paid out on accepted requests" />
      </section>

      {/* Quick lists */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-xl items-start">
        <div className="bg-surface border-2 border-primary">
          <div className="flex items-center justify-between border-b-2 border-primary px-lg py-md">
            <h3 className="font-h3 text-h3 text-primary uppercase">Your listings</h3>
            <Link to="/lister/listings" className="font-label-caps text-label-caps text-primary hover:text-electric-purple transition-colors flex items-center gap-xs">VIEW ALL <span className="material-symbols-outlined text-[16px]">arrow_forward</span></Link>
          </div>
          {items.length === 0 ? (
            <div className="p-lg text-center">
              <p className="font-body-md text-body-md text-on-surface-variant mb-md">No listings yet. List your first item and start earning.</p>
              <Link to="/lister/list-an-item" className="inline-block px-lg py-md bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary">+ LIST AN ITEM</Link>
            </div>
          ) : (
            <div className="divide-y-2 divide-primary">
              {items.slice(0, 3).map((item) => (
                <Link key={item.id} to="/lister/listings" className="flex items-center gap-md px-lg py-md hover:bg-surface-container-low transition-colors">
                  <img src={item.photos?.[0] || listerCategoryImages[item.category]} alt="" className="w-14 h-14 object-cover border-2 border-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-body-lg text-body-lg text-primary font-bold truncate">{item.name}</p>
                    <p className="font-label-caps text-[10px] text-on-surface-variant uppercase">{listerCategoryLabel(item.category)} · {inr(item.pricePerDay)}/day</p>
                  </div>
                  <span className={`px-sm py-xs border-2 border-primary font-label-caps text-[10px] uppercase ${item.availability === 'available' ? 'bg-acid-lime text-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                    {item.availability === 'available' ? 'Live' : 'Hidden'}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-surface border-2 border-primary">
          <div className="flex items-center justify-between border-b-2 border-primary px-lg py-md">
            <h3 className="font-h3 text-h3 text-primary uppercase">Latest requests</h3>
            <Link to="/lister/requests" className="font-label-caps text-label-caps text-primary hover:text-electric-purple transition-colors flex items-center gap-xs">VIEW ALL <span className="material-symbols-outlined text-[16px]">arrow_forward</span></Link>
          </div>
          {requests.length === 0 ? (
            <div className="p-lg text-center">
              <p className="font-body-md text-body-md text-on-surface-variant">No rental requests yet. They show up here the moment a student books your item.</p>
            </div>
          ) : (
            <div className="divide-y-2 divide-primary">
              {requests.slice(0, 3).map((req) => (
                <Link key={req.id} to="/lister/requests" className="flex items-center gap-md px-lg py-md hover:bg-surface-container-low transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-caps text-label-caps flex-shrink-0">
                    {(req.renterName || '?').slice(0, 1).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body-md text-body-md text-primary font-bold truncate">{req.itemName}</p>
                    <p className="font-label-caps text-[10px] text-on-surface-variant uppercase">{req.renterName} · {inr(req.amount)} · {req.days} day{req.days > 1 ? 's' : ''}</p>
                  </div>
                  <span className={`px-sm py-xs border-2 border-primary font-label-caps text-[10px] uppercase ${req.status === 'pending' ? 'bg-acid-lime text-primary' : req.status === 'accepted' ? 'bg-electric-purple text-white' : 'bg-surface-container text-on-surface-variant'}`}>
                    {req.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ListingsSection({ items, profile, onRefresh }) {
  const [filter, setFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  const filtered = items.filter((i) => {
    if (filter === 'available') return i.availability === 'available';
    if (filter === 'hidden') return i.availability !== 'available';
    return true;
  });

  const toggleAvailability = async (item) => {
    setNotice('');
    try {
      await updateListerItem(item.id, profile, { ...item, availability: item.availability === 'available' ? 'unavailable' : 'available' });
      onRefresh();
    } catch (err) {
      setNotice(err.message || 'Could not update listing.');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    try {
      await deleteListerItem(deleteTarget.id, profile);
      setDeleteTarget(null);
      onRefresh();
    } catch (err) {
      setNotice(err.message || 'Could not delete listing.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-xl">
      <SectionHeader
        eyebrow="Your inventory"
        title="My listings"
        subtitle="Everything you have listed, draft or live. Toggle availability to control what appears on the public rentals page."
        action={
          <Link to="/lister/list-an-item" className="shrink-0 px-lg py-md bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-1 transition-all">
            + LIST AN ITEM
          </Link>
        }
      />

      {notice && <div role="status" className="border-2 border-primary bg-acid-lime p-md text-primary">{notice}</div>}

      {/* Filters */}
      <div className="flex flex-wrap gap-sm">
        {[
          { id: 'all', label: `All (${items.length})` },
          { id: 'available', label: `Available (${items.filter((i) => i.availability === 'available').length})` },
          { id: 'hidden', label: `Hidden (${items.filter((i) => i.availability !== 'available').length})` },
        ].map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`px-md py-sm border-2 border-primary font-label-caps text-label-caps uppercase transition-colors ${filter === f.id ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-primary hover:bg-acid-lime'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Listing cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-xl bg-surface border-2 border-primary">
          <span className="material-symbols-outlined text-[64px] text-on-surface-variant">inventory_2</span>
          <h3 className="font-h3 text-h3 text-primary mt-md">No listings here</h3>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs">List your first item to start earning.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {filtered.map((item) => (
            <article key={item.id} className="bg-surface border-2 border-primary shadow-[6px_6px_0px_0px_#000000] flex flex-col">
              <div className="relative aspect-square border-b-2 border-primary overflow-hidden bg-surface-container-high">
                <img src={item.photos?.[0] || listerCategoryImages[item.category]} alt={item.name} className="w-full h-full object-cover" />
                <span className={`absolute top-md left-md px-sm py-xs border-2 border-primary font-label-caps text-[10px] uppercase ${item.availability === 'available' ? 'bg-acid-lime text-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                  {item.availability === 'available' ? 'Live on rentals' : 'Hidden'}
                </span>
                {item.status === 'rented' && (
                  <span className="absolute top-md right-md px-sm py-xs border-2 border-primary bg-hot-pink text-white font-label-caps text-[10px] uppercase">Currently rented</span>
                )}
              </div>
              <div className="p-lg flex flex-col flex-grow gap-sm">
                <div className="flex items-start justify-between gap-sm">
                  <div className="min-w-0">
                    <h3 className="font-h3 text-h3 text-primary truncate">{item.name}</h3>
                    <p className="font-label-caps text-[10px] text-on-surface-variant uppercase mt-xs">{listerCategoryLabel(item.category)} · {item.condition} · {item.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-md">
                  <span className="font-price-display text-price-display text-primary">{inr(item.pricePerDay)}</span>
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">/day</span>
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase ml-auto">{item.timesRented || 0} rented</span>
                </div>
                <div className="mt-auto pt-md flex gap-sm">
                  <Link to={`/lister/list-an-item/${item.id}`} className="flex-1 py-md bg-surface-container-lowest border-2 border-primary font-label-caps text-label-caps text-primary text-center hover:bg-acid-lime transition-colors">
                    EDIT
                  </Link>
                  <button type="button" onClick={() => toggleAvailability(item)}
                    className={`flex-1 py-md border-2 border-primary font-label-caps text-label-caps transition-colors ${item.availability === 'available' ? 'bg-primary text-on-primary hover:bg-hot-pink' : 'bg-acid-lime text-primary'}`}>
                    {item.availability === 'available' ? 'HIDE' : 'PUBLISH'}
                  </button>
                  <button type="button" onClick={() => setDeleteTarget(item)} aria-label={`Delete ${item.name}`}
                    className="px-md py-md bg-surface border-2 border-primary font-label-caps text-label-caps text-error hover:bg-coral hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete this listing?"
        body={deleteTarget ? `"${deleteTarget.name}" will be removed from your inventory and the public rentals page. This cannot be undone.` : ''}
        confirmLabel="DELETE"
        busy={busy}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

function EarningsSection({ earnings }) {
  const ledger = earnings?.ledger || [];
  const total = earnings?.total || 0;
  const byItem = earnings?.byItem || [];
  const money = inr(total);

  return (
    <div className="flex flex-col gap-xl">
      <SectionHeader eyebrow="Your payouts" title="Earnings" subtitle="Every accepted rental request is settled to your payout account automatically. KeyLo takes a 5% platform fee on each booking." />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-md">
        <StatCard icon="account_balance_wallet" label="Total earnings" value={money} sub="Net of platform fees" accent="bg-acid-lime" />
        <StatCard icon="receipt_long" label="Payouts made" value={ledger.length} sub="All settled instantly" />
        <StatCard icon="trending_up" label="Top item" value={byItem.length ? byItem.sort((a, b) => b.earned - a.earned)[0].item.name : '—'} sub={byItem.length ? `Earned ${inr(byItem.sort((a, b) => b.earned - a.earned)[0].earned)}` : 'No earnings yet'} />
      </section>

      <section className="bg-surface border-2 border-primary">
        <div className="flex items-center justify-between border-b-2 border-primary px-lg py-md">
          <h3 className="font-h3 text-h3 text-primary uppercase">Payout ledger</h3>
          <span className="font-label-caps text-label-caps text-on-surface-variant">{ledger.length} {ledger.length === 1 ? 'entry' : 'entries'}</span>
        </div>
        {ledger.length === 0 ? (
          <div className="p-lg text-center">
            <p className="font-body-md text-body-md text-on-surface-variant">No payouts yet. Accept a rental request and it lands here instantly.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-primary bg-surface-container-lowest">
                  <th className="px-lg py-sm font-label-caps text-label-caps text-on-surface-variant uppercase">Date</th>
                  <th className="px-lg py-sm font-label-caps text-label-caps text-on-surface-variant uppercase">Description</th>
                  <th className="px-lg py-sm font-label-caps text-label-caps text-on-surface-variant uppercase text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-primary">
                {ledger.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-lg py-sm font-body-md text-body-md text-on-surface-variant whitespace-nowrap">
                      {new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-lg py-sm">
                      <p className="font-body-md text-body-md text-primary font-bold">{entry.itemName}</p>
                      <p className="font-label-caps text-[10px] text-on-surface-variant uppercase">{entry.label}</p>
                    </td>
                    <td className="px-lg py-sm font-price-display text-price-display text-primary text-right whitespace-nowrap">+{inr(entry.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {byItem.length > 0 && (
        <section className="bg-surface border-2 border-primary">
          <div className="border-b-2 border-primary px-lg py-md">
            <h3 className="font-h3 text-h3 text-primary uppercase">Earnings by item</h3>
          </div>
          <div className="divide-y-2 divide-primary">
            {byItem.map(({ item, earned, rentals }) => (
              <div key={item.id} className="flex items-center gap-md px-lg py-md">
                <img src={item.photos?.[0] || listerCategoryImages[item.category]} alt="" className="w-12 h-12 object-cover border-2 border-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-body-md text-body-md text-primary font-bold truncate">{item.name}</p>
                  <p className="font-label-caps text-[10px] text-on-surface-variant uppercase">{rentals} {rentals === 1 ? 'rental' : 'rentals'}</p>
                </div>
                <span className="font-price-display text-price-display text-primary">{inr(earned)}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ProfileSection({ profile, onRefresh }) {
  const [form, setForm] = useState({ name: profile?.name || '', email: profile?.email || '', phone: profile?.phone || '' });
  const [photo, setPhoto] = useState(profile?.photo || '');
  const [photoLoading, setPhotoLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setForm({ name: profile?.name || '', email: profile?.email || '', phone: profile?.phone || '' });
    setPhoto(profile?.photo || '');
  }, [profile?.id]);

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoLoading(true);
    try {
      setPhoto(await fileToDataUrl(file, 400, 0.72));
      setError('');
    } catch (err) {
      setError(err.message || 'Could not read that image.');
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMessage('');
    setError('');
    try {
      await updateListerProfile({ name: form.name, phone: form.phone, photo });
      setMessage('Profile updated.');
      onRefresh();
    } catch (err) {
      setError(err.message || 'Could not update profile.');
    } finally {
      setBusy(false);
    }
  };

  const fieldClass = (invalid) =>
    `w-full px-md py-md bg-surface-container-lowest border-2 ${invalid ? 'border-error' : 'border-primary'} focus:outline-none focus:ring-4 ring-[#C7F000] font-body-md text-on-surface placeholder:text-on-surface-variant/50 transition-all`;

  return (
    <div className="flex flex-col gap-xl">
      <SectionHeader eyebrow="Your account" title="Profile" subtitle="This information is shown to students when they book your items." />

      {message && <div role="status" className="border-2 border-primary bg-acid-lime p-md text-primary">{message}</div>}
      {error && <div role="alert" className="border-2 border-error bg-error/10 p-md text-error">{error}</div>}

      <form onSubmit={handleSubmit} className="max-w-2xl bg-surface border-2 border-primary p-xl shadow-[6px_6px_0px_0px_#000000] flex flex-col gap-lg">
        <div className="flex items-center gap-lg">
          {photo ? (
            <img src={photo} alt="Profile preview" className="w-20 h-20 rounded-full object-cover border-2 border-primary" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center border-2 border-primary">
              <span className="material-symbols-outlined text-[36px] text-on-surface-variant">person</span>
            </div>
          )}
          <label className="cursor-pointer">
            <span className="inline-block px-md py-sm bg-surface-container-lowest border-2 border-primary font-label-caps text-label-caps text-primary hover:bg-acid-lime transition-colors">
              {photoLoading ? 'Processing...' : photo ? 'Change photo' : 'Add photo'}
            </span>
            <input type="file" accept="image/*" onChange={handlePhoto} className="sr-only" aria-label="Profile photo" />
          </label>
        </div>

        <div>
          <label htmlFor="profileName" className="font-label-caps text-label-caps text-on-surface block mb-xs">Full name</label>
          <input id="profileName" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className={fieldClass()} required />
        </div>
        <div>
          <label htmlFor="profileEmail" className="font-label-caps text-label-caps text-on-surface block mb-xs">Email</label>
          <input id="profileEmail" value={form.email} disabled className={`${fieldClass()} opacity-50 cursor-not-allowed`} />
          <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant/70">Email is your login and cannot be changed.</p>
        </div>
        <div>
          <label htmlFor="profilePhone" className="font-label-caps text-label-caps text-on-surface block mb-xs">Phone number</label>
          <div className="relative">
            <span className="absolute left-md top-1/2 -translate-y-1/2 font-body-md text-on-surface-variant">+91</span>
            <input id="profilePhone" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} maxLength={10} className={`${fieldClass()} pl-14`} required />
          </div>
        </div>

        <button type="submit" disabled={busy} className="w-full md:w-auto px-lg py-md bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] transition-all disabled:opacity-50">
          {busy ? 'SAVING...' : 'SAVE CHANGES'}
        </button>
      </form>
    </div>
  );
}

function SettingsSection({ profile, onRefresh }) {
  const [settings, setSettings] = useState(() => getListerSettings() || {});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Password change
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwBusy, setPwBusy] = useState(false);
  const [pwMessage, setPwMessage] = useState('');
  const [pwError, setPwError] = useState('');

  // Danger zone
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const toggle = (key) => async (e) => {
    const value = e.target.checked;
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const updated = await updateListerSettings({ [key]: value });
      setSettings(updated);
      setMessage('Settings saved.');
    } catch (err) {
      setSettings((prev) => ({ ...prev, [key]: !value }));
      setError(err.message || 'Could not save settings.');
    } finally {
      setSaving(false);
    }
  };

  const savePayout = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const updated = await updateListerSettings({ payoutMode: settings.payoutMode, payoutDetail: settings.payoutDetail });
      setSettings(updated);
      setMessage('Payout details saved.');
    } catch (err) {
      setError(err.message || 'Could not save payout details.');
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (pw.next !== pw.confirm) { setPwError('New passwords do not match.'); return; }
    setPwBusy(true);
    setPwMessage('');
    setPwError('');
    try {
      await changeListerPassword({ current: pw.current, next: pw.next });
      setPw({ current: '', next: '', confirm: '' });
      setPwMessage('Password updated.');
    } catch (err) {
      setPwError(err.message || 'Could not change password.');
    } finally {
      setPwBusy(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setError('');
    try {
      await deleteListerAccount();
      window.location.href = '/';
    } catch (err) {
      setError(err.message || 'Could not delete account.');
      setDeleting(false);
    }
  };

  const switchClass = 'w-12 h-7 appearance-none bg-surface-container border-2 border-primary checked:bg-acid-lime relative cursor-pointer after:content-[""] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-primary after:border-2 after:border-primary checked:after:translate-x-5 after:transition-transform transition-colors';

  return (
    <div className="flex flex-col gap-xl">
      <SectionHeader eyebrow="Preferences" title="Settings" subtitle="Control notifications, payouts, and your account." />

      {message && <div role="status" className="border-2 border-primary bg-acid-lime p-md text-primary">{message}</div>}
      {error && <div role="alert" className="border-2 border-error bg-error/10 p-md text-error">{error}</div>}

      {/* Notifications */}
      <section className="max-w-2xl bg-surface border-2 border-primary">
        <div className="border-b-2 border-primary px-lg py-md">
          <h3 className="font-h3 text-h3 text-primary uppercase">Notifications</h3>
        </div>
        <div className="divide-y-2 divide-primary">
          <label className="flex items-center justify-between gap-lg px-lg py-md cursor-pointer">
            <div>
              <p className="font-body-md text-body-md text-primary font-bold">Email alerts</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">New rental requests and booking updates</p>
            </div>
            <input type="checkbox" checked={Boolean(settings.emailAlerts)} onChange={toggle('emailAlerts')} className={switchClass} />
          </label>
          <label className="flex items-center justify-between gap-lg px-lg py-md cursor-pointer">
            <div>
              <p className="font-body-md text-body-md text-primary font-bold">SMS alerts</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Instant text updates for urgent requests</p>
            </div>
            <input type="checkbox" checked={Boolean(settings.smsAlerts)} onChange={toggle('smsAlerts')} className={switchClass} />
          </label>
          <label className="flex items-center justify-between gap-lg px-lg py-md cursor-pointer">
            <div>
              <p className="font-body-md text-body-md text-primary font-bold">Public profile</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Show your name and rating on listings</p>
            </div>
            <input type="checkbox" checked={Boolean(settings.publicProfile)} onChange={toggle('publicProfile')} className={switchClass} />
          </label>
        </div>
        {saving && <p className="px-lg py-sm font-label-caps text-label-caps text-on-surface-variant">Saving...</p>}
      </section>

      {/* Payout */}
      <section className="max-w-2xl bg-surface border-2 border-primary">
        <div className="border-b-2 border-primary px-lg py-md">
          <h3 className="font-h3 text-h3 text-primary uppercase">Payout details</h3>
        </div>
        <form onSubmit={savePayout} className="p-lg flex flex-col gap-md">
          <div>
            <label htmlFor="payoutMode" className="font-label-caps text-label-caps text-on-surface block mb-xs">Payout method</label>
            <select id="payoutMode" value={settings.payoutMode} onChange={(e) => setSettings((p) => ({ ...p, payoutMode: e.target.value }))}
              className="w-full px-md py-md bg-surface-container-lowest border-2 border-primary font-body-md text-on-surface focus:outline-none focus:ring-4 ring-[#C7F000]">
              <option value="upi">UPI</option>
              <option value="bank">Bank transfer</option>
            </select>
          </div>
          <div>
            <label htmlFor="payoutDetail" className="font-label-caps text-label-caps text-on-surface block mb-xs">
              {settings.payoutMode === 'upi' ? 'UPI ID' : 'Account number + IFSC'}
            </label>
            <input id="payoutDetail" value={settings.payoutDetail || ''} onChange={(e) => setSettings((p) => ({ ...p, payoutDetail: e.target.value }))}
              placeholder={settings.payoutMode === 'upi' ? 'yourname@okhdfc' : 'Account / IFSC'}
              className="w-full px-md py-md bg-surface-container-lowest border-2 border-primary font-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-4 ring-[#C7F000]" />
          </div>
          <button type="submit" disabled={saving} className="w-full md:w-auto px-lg py-md bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] transition-all disabled:opacity-50">
            {saving ? 'SAVING...' : 'SAVE PAYOUT DETAILS'}
          </button>
        </form>
      </section>

      {/* Password */}
      <section className="max-w-2xl bg-surface border-2 border-primary">
        <div className="border-b-2 border-primary px-lg py-md">
          <h3 className="font-h3 text-h3 text-primary uppercase">Change password</h3>
        </div>
        <form onSubmit={changePassword} className="p-lg flex flex-col gap-md">
          {pwMessage && <div role="status" className="border-2 border-primary bg-acid-lime p-md text-primary">{pwMessage}</div>}
          {pwError && <div role="alert" className="border-2 border-error bg-error/10 p-md text-error">{pwError}</div>}
          <div>
            <label htmlFor="pwCurrent" className="font-label-caps text-label-caps text-on-surface block mb-xs">Current password</label>
            <input id="pwCurrent" type="password" value={pw.current} onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))} className="w-full px-md py-md bg-surface-container-lowest border-2 border-primary focus:outline-none focus:ring-4 ring-[#C7F000]" />
          </div>
          <div className="grid md:grid-cols-2 gap-md">
            <div>
              <label htmlFor="pwNext" className="font-label-caps text-label-caps text-on-surface block mb-xs">New password</label>
              <input id="pwNext" type="password" value={pw.next} onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))} className="w-full px-md py-md bg-surface-container-lowest border-2 border-primary focus:outline-none focus:ring-4 ring-[#C7F000]" />
            </div>
            <div>
              <label htmlFor="pwConfirm" className="font-label-caps text-label-caps text-on-surface block mb-xs">Confirm new password</label>
              <input id="pwConfirm" type="password" value={pw.confirm} onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))} className="w-full px-md py-md bg-surface-container-lowest border-2 border-primary focus:outline-none focus:ring-4 ring-[#C7F000]" />
            </div>
          </div>
          <button type="submit" disabled={pwBusy} className="w-full md:w-auto px-lg py-md bg-primary text-on-primary border-2 border-primary font-label-caps text-label-caps hover:bg-acid-lime hover:text-primary transition-all disabled:opacity-50">
            {pwBusy ? 'UPDATING...' : 'UPDATE PASSWORD'}
          </button>
        </form>
      </section>

      {/* Danger zone */}
      <section className="max-w-2xl bg-surface border-2 border-error">
        <div className="border-b-2 border-error px-lg py-md">
          <h3 className="font-h3 text-h3 text-error uppercase">Danger zone</h3>
        </div>
        <div className="p-lg">
          {confirmDelete ? (
            <div className="flex flex-col gap-md">
              <p className="font-body-md text-body-md text-on-surface-variant">
                This permanently deletes your lister account, all listings, requests and payout history for <strong className="text-primary">{profile?.email}</strong>. This cannot be undone.
              </p>
              <div className="flex gap-sm">
                <button type="button" onClick={() => setConfirmDelete(false)} disabled={deleting} className="flex-1 py-md bg-surface-container-lowest border-2 border-primary font-label-caps text-label-caps text-primary disabled:opacity-50">CANCEL</button>
                <button type="button" onClick={handleDeleteAccount} disabled={deleting} className="flex-1 py-md bg-coral border-2 border-primary font-label-caps text-label-caps text-white disabled:opacity-50">
                  {deleting ? 'DELETING...' : 'DELETE MY ACCOUNT'}
                </button>
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => setConfirmDelete(true)} className="px-lg py-md bg-surface border-2 border-error font-label-caps text-label-caps text-error hover:bg-coral hover:text-white transition-colors">
              DELETE MY ACCOUNT
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

export default function ListerDashboardPage() {
  const location = useLocation();
  const [session] = useState(() => getListerSession());
  const [profile, setProfile] = useState(() => getListerProfile());
  const [items, setItems] = useState([]);
  const [requests, setRequests] = useState([]);
  const [earnings, setEarnings] = useState({ total: 0, ledger: [], byItem: [] });
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return undefined;
    let active = true;
    (async () => {
      setLoading(true);
      const [it, rq, er] = await Promise.all([
        getListerItems(session.userId),
        getListerRequests(session.userId),
        getListerEarnings(session.userId),
      ]);
      if (!active) return;
      setItems(it);
      setRequests(rq);
      setEarnings(er);
      setProfile(getListerProfile());
      setLoading(false);
    })();
    return () => { active = false; };
  }, [session, refresh]);

  if (!session) return <Navigate to="/lister/login" replace state={{ from: location.pathname }} />;

  const section = location.pathname.replace(/^\/lister\/?/, '') || 'overview';

  return (
    <div className="flex flex-col gap-xl">
      {loading ? (
        <div className="py-xl text-center font-label-caps text-label-caps text-on-surface-variant">Loading your dashboard...</div>
      ) : section === 'overview' ? (
        <OverviewSection profile={profile} items={items} requests={requests} earnings={earnings} />
      ) : section === 'listings' ? (
        <ListingsSection items={items} profile={profile} onRefresh={() => setRefresh((n) => n + 1)} />
      ) : section === 'requests' ? (
        <ListerRequestsSection requests={requests} profile={profile} onRefresh={() => setRefresh((n) => n + 1)} />
      ) : section === 'earnings' ? (
        <EarningsSection earnings={earnings} />
      ) : section === 'profile' ? (
        <ProfileSection profile={profile} onRefresh={() => setRefresh((n) => n + 1)} />
      ) : section === 'settings' ? (
        <SettingsSection profile={profile} onRefresh={() => setRefresh((n) => n + 1)} />
      ) : (
        <OverviewSection profile={profile} items={items} requests={requests} earnings={earnings} />
      )}
    </div>
  );
}
