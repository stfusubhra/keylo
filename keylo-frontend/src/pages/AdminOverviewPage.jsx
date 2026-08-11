import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminOverview } from '../lib/supabaseData';
import { isSupabaseConfigured } from '../lib/supabase';
import { formatDate, formatDateTime } from '../lib/format';

const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;
const statusClass = (status) => status === 'confirmed' || status === 'active' || status === 'paid'
  ? 'bg-acid-lime text-primary' : status === 'disputed' || status === 'cancelled'
    ? 'bg-hot-pink text-white' : 'bg-surface-container text-primary';

function Status({ value }) {
  return <span className={`px-sm py-xs border-2 border-primary font-label-caps text-[10px] uppercase ${statusClass(value)}`}>{value}</span>;
}

function Table({ headers, children, empty = 'No records found.' }) {
  return (
    <div className="overflow-x-auto border-2 border-primary -mx-4 px-4 sm:mx-0 sm:px-0">
      <table className="w-full text-left min-w-[500px] sm:min-w-0">
        <thead className="bg-primary text-on-primary">
          <tr>{headers.map((header) => <th key={header} className="px-md py-sm font-label-caps text-[10px] uppercase whitespace-nowrap">{header}</th>)}</tr>
        </thead>
        <tbody>{children || <tr><td colSpan={headers.length} className="px-md py-lg text-on-surface-variant">{empty}</td></tr>}</tbody>
      </table>
    </div>
  );
}

export default function AdminOverviewPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    let active = true;
    getAdminOverview().then((result) => { if (active) setData(result); }).catch((err) => { if (active) setError(err.message || 'Unable to load admin overview.'); });
    return () => { active = false; };
  }, []);

  const users = data?.users || [];
  const tenants = users.filter((user) => user.role === 'student');
  const landlords = users.filter((user) => user.role === 'landlord');
  const bookings = data?.bookings || [];
  const activeBookings = bookings.filter((booking) => ['pending', 'confirmed', 'active', 'disputed'].includes(booking.status));
  const visibleBookings = filter === 'active' ? activeBookings : filter === 'completed' ? bookings.filter((booking) => booking.status === 'completed') : bookings;
  const depositsHeld = (data?.deposits || []).filter((deposit) => ['held', 'release_pending', 'disputed'].includes(deposit.status)).reduce((sum, deposit) => sum + Number(deposit.amount || 0), 0);
  const _pendingReleases = (data?.deposits || []).filter((deposit) => deposit.status === 'release_pending').length;
  const paidTotal = (data?.payments || []).filter((payment) => payment.status === 'paid').reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const disputed = (data?.disputes || []).filter((item) => !['resolved', 'denied'].includes(item.status));
  const latestUsers = users.slice(0, 8);

  return <div className="w-full">
    <header className="border-b-2 border-primary pb-lg mb-xl flex flex-col md:flex-row md:items-end justify-between gap-lg">
      <div><p className="font-label-caps text-label-caps text-hot-pink uppercase mb-sm">Admin operations</p><h1 className="font-heading text-h1-mobile md:text-h1 text-primary uppercase font-bold">Platform overview</h1><p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">Tenants, landlords, stays, Rent Essentials, money movement, and trust controls in one view.</p></div>
      <div className="flex flex-wrap gap-sm"><Link to="/admin/users" className="px-md py-sm bg-surface-container-lowest border-2 border-primary font-label-caps text-label-caps text-primary">USER DIRECTORY</Link><Link to="/admin/vault" className="px-md py-sm bg-hot-pink border-2 border-primary font-label-caps text-label-caps text-white">VAULT & DEPOSITS</Link><Link to="/admin/analytics" className="px-md py-sm bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary">ANALYTICS</Link></div>
    </header>
    {error && <div role="alert" className="bg-error/10 border-2 border-error p-md mb-lg text-error">{error}</div>}
    {!isSupabaseConfigured && <div className="border-2 border-primary border-dashed p-lg mb-lg text-on-surface-variant">Connect Supabase and sign in as an admin to see live operational data.</div>}

    <section className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-md mb-xl">
      {[
        ['Tenants', tenants.length, 'school', 'bg-acid-lime'],
        ['Landlords', landlords.length, 'apartment', 'bg-electric-purple'],
        ['Active bookings', activeBookings.length, 'calendar_today', 'bg-hot-pink'],
        ['Rental bookings', (data?.rentals || []).length, 'inventory_2', 'bg-sky-cyan'],
        ['Deposits held', money(depositsHeld), 'shield', 'bg-acid-lime'],
        ['Paid volume', money(paidTotal), 'payments', 'bg-electric-purple'],
        ['Pending releases', _pendingReleases, 'hourglass_top', 'bg-electric-purple'],
      ].map(([label, value, icon, color]) => <article key={label} className={`${color} border-2 border-primary p-md shadow-[4px_4px_0px_0px_#000000] min-w-0`}><span className="material-symbols-outlined text-primary">{icon}</span><p className="font-price-display text-[26px] text-primary mt-sm break-words">{value}</p><p className="font-label-caps text-[10px] text-primary uppercase mt-xs">{label}</p></article>)}
    </section>

    {/* ── Tenants ── */}
    <section className="mb-xl">
      <div className="flex items-end justify-between mb-md"><div><p className="font-label-caps text-label-caps text-electric-purple uppercase">People</p><h2 className="font-h3 text-h3 text-primary">Tenants</h2></div><span className="font-label-caps text-label-caps text-on-surface-variant">{tenants.length} total</span></div>
      <Table headers={['Tenant', 'Email', 'Joined', 'Verified']}>
        {tenants.slice(0, 8).map((tenant) => <tr key={tenant.id} className="border-t-2 border-primary/20"><td className="px-md py-sm text-primary">{tenant.full_name}</td><td className="px-md py-sm text-on-surface-variant">{tenant.email}</td><td className="px-md py-sm text-on-surface-variant">{formatDate(tenant.created_at)}</td><td className="px-md py-sm"><Status value={tenant.is_verified ? 'verified' : 'unverified'} /></td></tr>)}
      </Table>
    </section>

    {/* ── Landlords ── */}
    <section className="mb-xl">
      <div className="flex items-end justify-between mb-md"><div><p className="font-label-caps text-label-caps text-electric-purple uppercase">People</p><h2 className="font-h3 text-h3 text-primary">Landlords</h2></div><span className="font-label-caps text-label-caps text-on-surface-variant">{landlords.length} total</span></div>
      <Table headers={['Landlord', 'Email', 'Listings', 'Verified']}>
        {landlords.slice(0, 8).map((landlord) => <tr key={landlord.id} className="border-t-2 border-primary/20"><td className="px-md py-sm text-primary">{landlord.full_name}</td><td className="px-md py-sm text-on-surface-variant">{landlord.email}</td><td className="px-md py-sm text-on-surface-variant">{(data?.properties || []).filter((property) => property.landlord_id === landlord.id).length}</td><td className="px-md py-sm"><Status value={landlord.is_verified ? 'verified' : 'unverified'} /></td></tr>)}
      </Table>
    </section>

    <section className="mb-xl"><div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-md"><div><p className="font-label-caps text-label-caps text-electric-purple uppercase">Stay operations</p><h2 className="font-h3 text-h3 text-primary">Bookings</h2></div><div className="flex gap-sm"><button onClick={() => setFilter('all')} className={`px-md py-sm border-2 border-primary font-label-caps text-label-caps ${filter === 'all' ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-primary'}`}>All</button><button onClick={() => setFilter('active')} className={`px-md py-sm border-2 border-primary font-label-caps text-label-caps ${filter === 'active' ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-primary'}`}>Active</button><button onClick={() => setFilter('completed')} className={`px-md py-sm border-2 border-primary font-label-caps text-label-caps ${filter === 'completed' ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-primary'}`}>Completed</button></div></div><Table headers={['Tenant', 'Property', 'Landlord', 'Status', 'Booked', 'Move-in', 'Financials']}>
      {visibleBookings.map((booking) => <tr key={booking.id} className="border-t-2 border-primary/20"><td className="px-md py-sm"><p className="text-primary">{booking.tenant_name}</p><p className="text-[11px] text-on-surface-variant">{booking.tenant_email}</p></td><td className="px-md py-sm text-primary">{booking.property_name}<br /><span className="text-[11px] text-on-surface-variant">{booking.property_area}</span></td><td className="px-md py-sm text-on-surface-variant">{booking.landlord_name}<br /><span className="text-[11px]">{booking.landlord_email}</span></td><td className="px-md py-sm"><Status value={booking.status} /></td><td className="px-md py-sm text-on-surface-variant">{formatDateTime(booking.booked_at)}</td><td className="px-md py-sm text-on-surface-variant">{formatDate(booking.move_in_date)}</td><td className="px-md py-sm text-primary">Rent {money(booking.rent_amount)}<br /><span className="text-[11px] text-on-surface-variant">Deposit {money(booking.deposit_amount)}</span></td></tr>)}
    </Table></section>

    <section className="mb-xl"><div className="mb-md"><p className="font-label-caps text-label-caps text-electric-purple uppercase">Rent Essentials</p><h2 className="font-h3 text-h3 text-primary">Rental bookings</h2></div><Table headers={['Tenant', 'Item', 'Status', 'Dates', 'Total']}>
      {(data?.rentals || []).slice(0, 10).map((rental) => <tr key={rental.id} className="border-t-2 border-primary/20"><td className="px-md py-sm"><p className="text-primary">{rental.tenant_name}</p><p className="text-[11px] text-on-surface-variant">{rental.tenant_email}</p></td><td className="px-md py-sm text-primary">{rental.item_name}<br /><span className="text-[11px] text-on-surface-variant">{rental.duration} {rental.period}{rental.duration > 1 ? 's' : ''} · {rental.fulfilment}</span></td><td className="px-md py-sm"><Status value={rental.status} /></td><td className="px-md py-sm text-on-surface-variant">{formatDate(rental.start_date)} → {formatDate(rental.end_date)}</td><td className="px-md py-sm text-primary">{money(rental.total)}</td></tr>)}
    </Table></section>

    <section className="mb-xl"><div className="mb-md"><p className="font-label-caps text-label-caps text-hot-pink uppercase">Trust & safety</p><h2 className="font-h3 text-h3 text-primary">Open disputes</h2></div><Table headers={['Tenant', 'Property', 'Status', 'Claimed', 'Opened']}>
      {disputed.map((item) => <tr key={item.id} className="border-t-2 border-primary/20"><td className="px-md py-sm text-primary">{item.tenant_name}<br /><span className="text-[11px] text-on-surface-variant">{item.tenant_email}</span></td><td className="px-md py-sm text-primary">{item.property_name}</td><td className="px-md py-sm"><Status value={item.status} /></td><td className="px-md py-sm text-primary">{money(item.claimed_amount)}</td><td className="px-md py-sm text-on-surface-variant">{formatDateTime(item.created_at)}</td></tr>)}
    </Table></section>

    <section className="mb-xl"><div className="mb-md"><p className="font-label-caps text-label-caps text-electric-purple uppercase">Money movement</p><h2 className="font-h3 text-h3 text-primary">Recent payments</h2></div><Table headers={['Payer', 'Type', 'Status', 'Amount', 'Paid at']}>
      {(data?.payments || []).slice(0, 10).map((payment) => <tr key={payment.id} className="border-t-2 border-primary/20"><td className="px-md py-sm text-primary">{payment.payer_name}<br /><span className="text-[11px] text-on-surface-variant">{payment.payer_email}</span></td><td className="px-md py-sm text-on-surface-variant uppercase text-[11px]">{payment.payment_type.replaceAll('_', ' ')}</td><td className="px-md py-sm"><Status value={payment.status} /></td><td className="px-md py-sm text-primary">{money(payment.amount)}</td><td className="px-md py-sm text-on-surface-variant">{payment.paid_at ? formatDateTime(payment.paid_at) : '—'}</td></tr>)}
    </Table></section>

    <section><div className="mb-md"><p className="font-label-caps text-label-caps text-electric-purple uppercase">Latest accounts</p><h2 className="font-h3 text-h3 text-primary">Recent users</h2></div><Table headers={['Name', 'Role', 'Email', 'Last sign-in']}>
      {latestUsers.map((user) => <tr key={user.id} className="border-t-2 border-primary/20"><td className="px-md py-sm text-primary">{user.full_name}</td><td className="px-md py-sm"><Status value={user.role} /></td><td className="px-md py-sm text-on-surface-variant">{user.email}</td><td className="px-md py-sm text-on-surface-variant">{user.last_sign_in_at ? formatDateTime(user.last_sign_in_at) : 'Never'}</td></tr>)}
    </Table></section>
  </div>;
}
