import { useEffect, useState } from 'react';
import { getAdminAnalytics } from '../lib/supabaseData';
import { isSupabaseConfigured } from '../lib/supabase';

const bookingStatusLabels = { pending: 'Pending', confirmed: 'Confirmed', active: 'Active', completed: 'Completed', cancelled: 'Cancelled', disputed: 'Disputed' };
const propertyStatusLabels = { draft: 'Draft', published: 'Published', paused: 'Paused', archived: 'Archived' };

export default function AdminAnalyticsPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    let active = true;
    getAdminAnalytics().then((rows) => { if (active) setData(rows); }).catch((err) => { if (active) setError(err.message); });
    return () => { active = false; };
  }, []);

  const counts = (rows, labelMap, key) => (rows || []).reduce((acc, row) => {
    const label = key ? labelMap[row[key]] || row[key] : labelMap[row] || row;
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});

  const userCounts = counts(data?.users || [], { student: 'Students', landlord: 'Landlords', admin: 'Admins' }, 'role');
  const propertyCounts = counts(data?.properties || [], propertyStatusLabels, 'status');
  const bookingCounts = counts(data?.bookings || [], bookingStatusLabels, 'status');
  const paidPayments = (data?.payments || []).filter((payment) => payment.status === 'paid');
  const feesCollected = paidPayments.filter((payment) => payment.payment_type === 'tenant_first_booking_fee').reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const rentCollected = paidPayments.filter((payment) => payment.payment_type === 'rent').reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const commissionEarned = rentCollected * 0.05;
  const depositsHeld = (data?.deposits || []).filter((deposit) => ['held', 'release_pending'].includes(deposit.status)).reduce((sum, deposit) => sum + Number(deposit.amount || 0), 0);
  const publishedProperties = (data?.properties || []).filter((property) => property.status === 'published');
  const averageTrust = publishedProperties.length
    ? (publishedProperties.reduce((sum, property) => sum + Number(property.trust_score || 0), 0) / publishedProperties.length).toFixed(0)
    : '—';

  const statCards = [
    ['Accounts', (data?.users || []).length, 'people', 'bg-electric-purple'],
    ['Listings', (data?.properties || []).length, 'apartment', 'bg-acid-lime'],
    ['Bookings', (data?.bookings || []).length, 'calendar_today', 'bg-hot-pink'],
    ['Deposits held', `₹${depositsHeld.toLocaleString('en-IN')}`, 'shield', 'bg-sky-cyan'],
    ['KeyLo fees', `₹${feesCollected.toLocaleString('en-IN')}`, 'payments', 'bg-electric-purple'],
    ['5% commission', `₹${commissionEarned.toLocaleString('en-IN')}`, 'percent', 'bg-acid-lime'],
    ['Avg trust score', averageTrust, 'verified', 'bg-hot-pink'],
  ];

  const bar = (label, value, total, color) => (
    <div key={label} className="flex items-center gap-md">
      <span className="w-28 shrink-0 font-label-caps text-label-caps text-on-surface-variant uppercase">{label}</span>
      <div className="flex-1 h-6 bg-surface-container border-2 border-primary">
        <div className={`h-full ${color} border-r-2 border-primary transition-all duration-700`} style={{ width: `${total ? Math.max(4, (value / total) * 100) : 0}%` }}></div>
      </div>
      <span className="w-12 text-right font-label-caps text-label-caps text-primary">{value}</span>
    </div>
  );

  const totalUsers = data?.users?.length || 0;
  const totalProperties = data?.properties?.length || 0;
  const totalBookings = data?.bookings?.length || 0;

  return (
    <div className="w-full">
      <header className="border-b-2 border-primary pb-lg mb-xl">
        <p className="font-label-caps text-label-caps text-hot-pink uppercase mb-sm">Admin insights</p>
        <h1 className="font-heading text-h1-mobile md:text-h1 text-primary uppercase font-bold">Analytics</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">Live counts from bookings, deposits, and payments in the KeyLo demo.</p>
      </header>
      {error && <div role="alert" className="bg-error/10 border-2 border-error p-md mb-lg text-error">{error}</div>}
      {!isSupabaseConfigured && <p className="border-2 border-primary border-dashed p-lg text-center font-body-md text-on-surface-variant mb-lg">Connect Supabase and sign in as an admin to see platform analytics.</p>}

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md mb-xl">
        {statCards.map(([label, value, icon, color]) => (
          <div key={label} className={`${color} border-2 border-primary p-lg shadow-[4px_4px_0px_0px_#000000]`}>
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-primary">{icon}</span>
            </div>
            <p className="font-price-display text-price-display text-primary mt-md">{value}</p>
            <p className="font-label-caps text-label-caps text-primary uppercase mt-xs">{label}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
        <div className="bg-surface-container-lowest border-2 border-primary p-lg">
          <h2 className="font-h3 text-h3 text-primary mb-lg border-b-2 border-primary pb-sm">Accounts by role</h2>
          <div className="flex flex-col gap-md">
            {Object.entries(userCounts).map(([label, value]) => bar(label, value, totalUsers, 'bg-acid-lime'))}
          </div>
        </div>
        <div className="bg-surface-container-lowest border-2 border-primary p-lg">
          <h2 className="font-h3 text-h3 text-primary mb-lg border-b-2 border-primary pb-sm">Listings by status</h2>
          <div className="flex flex-col gap-md">
            {Object.entries(propertyCounts).map(([label, value]) => bar(label, value, totalProperties, 'bg-electric-purple'))}
          </div>
        </div>
        <div className="bg-surface-container-lowest border-2 border-primary p-lg">
          <h2 className="font-h3 text-h3 text-primary mb-lg border-b-2 border-primary pb-sm">Bookings by status</h2>
          <div className="flex flex-col gap-md">
            {Object.entries(bookingCounts).map(([label, value]) => bar(label, value, totalBookings, 'bg-sky-cyan'))}
          </div>
        </div>
        <div className="bg-surface-container-lowest border-2 border-primary p-lg">
          <h2 className="font-h3 text-h3 text-primary mb-lg border-b-2 border-primary pb-sm">Revenue model</h2>
          <div className="flex flex-col gap-md font-body-md text-body-md">
            <div className="flex justify-between border-2 border-primary p-md bg-surface-container"><span className="text-on-surface-variant">Tenant booking fees collected</span><span className="font-price-display text-[20px] text-primary">₹{feesCollected.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between border-2 border-primary p-md bg-surface-container"><span className="text-on-surface-variant">Rent collected (5% landlord fee basis)</span><span className="font-price-display text-[20px] text-primary">₹{rentCollected.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between border-2 border-primary p-md bg-acid-lime"><span className="text-primary font-bold">KeyLo earnings (fees + 5%)</span><span className="font-price-display text-[20px] text-primary">₹{(feesCollected + commissionEarned).toLocaleString('en-IN')}</span></div>
            <p className="font-label-caps text-label-caps text-on-surface-variant">All payments are test-mode demo records; no real money is charged.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
