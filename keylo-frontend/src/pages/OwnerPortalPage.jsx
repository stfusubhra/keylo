import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { isSupabaseConfigured } from '../lib/supabase';
import { createProperty, getOwnerData, listUniversities } from '../lib/supabaseData';

const emptyForm = { name: '', universityId: '', area: '', propertyType: 'pg', monthlyRent: '', securityDeposit: '', distance: '', description: '' };

export default function OwnerPortalPage() {
  const location = useLocation();
  const [ownerData, setOwnerData] = useState({ properties: [], bookings: [] });
  const [universities, setUniversities] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const refresh = () => getOwnerData().then(setOwnerData).catch((err) => setError(err.message));

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    listUniversities().then(setUniversities).catch(() => {});
    refresh();
    return undefined;
  }, []);

  const handleChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      await createProperty(form);
      setForm(emptyForm);
      setShowForm(false);
      setMessage('Property saved as a draft. Publish it after adding verification documents.');
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const isLive = isSupabaseConfigured && ownerData.properties.length > 0;
  const totalRent = ownerData.bookings.reduce((sum, booking) => sum + Number(booking.rent_amount || 0), 0);
  const commission = totalRent * 0.05;
  const sectionTitle = location.pathname.includes('/properties') ? 'Properties' : location.pathname.includes('/tenants') ? 'Tenants' : location.pathname.includes('/deposits') ? 'Deposits' : location.pathname.includes('/claims') ? 'Claims' : 'Landlord overview';

  return (
    <div className="bg-surface-container-low min-h-screen font-body-md text-on-surface">
      <div className="flex flex-col gap-xl">
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-lg">
          <div><p className="font-label-caps text-label-caps text-electric-purple uppercase mb-sm">KeyLo landlord workspace</p><h1 className="font-heading text-h1-mobile md:text-h1 text-on-surface font-bold uppercase">{sectionTitle}</h1><p className="font-body-lg text-body-lg text-on-surface-variant mt-sm max-w-2xl">Manage Kolkata listings, see tenant activity, and track KeyLo's 5% success fee on collected rent.</p></div><button onClick={() => setShowForm(true)} className="px-lg py-md bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary shadow-[4px_4px_0px_0px_#000000]">+ Add property</button>
        </section>

        {message && <div className="border-2 border-primary bg-acid-lime p-md font-body-md text-primary">{message}</div>}
        {error && <div role="alert" className="border-2 border-error bg-error/10 p-md font-body-md text-error">{error}</div>}

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
          {[[isLive ? ownerData.properties.length : '—', 'Published properties', 'apartment'], [isLive ? ownerData.bookings.length : '—', 'Bookings', 'calendar_today'], [isLive ? `₹${commission.toLocaleString('en-IN')}` : '—', '5% KeyLo fee', 'payments'], [isLive ? 'Live' : 'Connect account', 'Data status', 'cloud_done']].map(([value, label, icon]) => <div key={label} className="bg-surface-container border-2 border-primary p-lg"><div className="flex justify-between"><span className="font-label-caps text-label-caps text-on-surface-variant uppercase">{label}</span><span className="material-symbols-outlined text-primary">{icon}</span></div><p className="font-price-display text-price-display text-primary mt-lg">{value}</p></div>)}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
          <div className="bg-primary text-on-primary border-2 border-primary p-lg shadow-[8px_8px_0px_0px_#C7F000]"><p className="font-label-caps text-label-caps text-acid-lime uppercase mb-sm">Revenue model</p><h2 className="font-h3 text-h3 text-on-primary">Only pay when rent is collected.</h2><p className="font-body-md text-body-md text-on-primary/80 mt-md">KeyLo deducts 5% from collected rent. There are no listing subscriptions or monthly plans.</p><div className="mt-lg border-t border-on-primary/30 pt-md flex justify-between"><span className="font-label-caps text-label-caps text-on-primary/70">Current booked rent</span><span className="font-price-display text-price-display text-acid-lime">₹{totalRent.toLocaleString('en-IN')}</span></div></div>
          <div className="bg-surface-container-lowest border-2 border-primary p-lg"><div className="flex items-center justify-between mb-md"><h2 className="font-h3 text-h3 text-primary">Recent bookings</h2><span className="font-label-caps text-label-caps text-on-surface-variant">Live data</span></div>{ownerData.bookings.length ? ownerData.bookings.slice(0, 4).map((booking) => <div key={booking.id} className="border-t-2 border-primary py-md flex justify-between gap-md"><div><p className="font-body-md text-body-md text-primary">{booking.properties?.name || 'Property booking'}</p><p className="font-label-caps text-label-caps text-on-surface-variant uppercase">{booking.status}</p></div><div className="text-right"><p className="font-price-display text-[20px] text-primary">₹{Number(booking.rent_amount).toLocaleString('en-IN')}</p><p className="font-label-caps text-[10px] text-electric-purple">5% fee: ₹{(Number(booking.rent_amount) * 0.05).toLocaleString('en-IN')}</p></div></div>) : <p className="border-t-2 border-primary pt-md text-on-surface-variant">No bookings yet. Publish a verified Kolkata property to start receiving applications.</p>}</div>
        </section>

        <section className="bg-surface-container border-2 border-primary p-lg"><div className="flex items-center justify-between border-b-2 border-primary pb-md mb-md"><div><p className="font-label-caps text-label-caps text-electric-purple uppercase">Inventory</p><h2 className="font-h3 text-h3 text-primary">Your properties</h2></div><span className="font-label-caps text-label-caps text-on-surface-variant">{ownerData.properties.length} records</span></div>{ownerData.properties.length ? <div className="grid grid-cols-1 md:grid-cols-2 gap-md">{ownerData.properties.map((property) => <article key={property.id} className="bg-surface-container-lowest border-2 border-primary p-md flex justify-between gap-md"><div><h3 className="font-h3 text-h3 text-primary">{property.name}</h3><p className="font-body-md text-body-md text-on-surface-variant">{property.area}, Kolkata · {property.property_type.toUpperCase()}</p></div><span className="h-fit px-sm py-xs bg-acid-lime border border-primary font-label-caps text-[10px] text-primary uppercase">{property.status}</span></article>)}</div> : <div className="py-lg text-center"><span className="material-symbols-outlined text-[48px] text-on-surface-variant">add_business</span><p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">Your live properties will appear here.</p></div>}</section>
      </div>

      {showForm && <div className="fixed inset-0 z-[100] bg-primary/60 flex items-center justify-center p-lg"><form onSubmit={handleSubmit} className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-surface border-2 border-primary p-lg shadow-[8px_8px_0px_0px_#C7F000]"><div className="flex justify-between items-center mb-lg"><div><p className="font-label-caps text-label-caps text-electric-purple uppercase">New inventory</p><h2 className="font-h3 text-h3 text-primary">Add a Kolkata property</h2></div><button type="button" onClick={() => setShowForm(false)} className="material-symbols-outlined text-primary" aria-label="Close form">close</button></div><div className="grid grid-cols-1 md:grid-cols-2 gap-md">{[['name', 'Property name', 'e.g. Jadavpur Scholar House'], ['area', 'Area', 'e.g. Jadavpur'], ['monthlyRent', 'Monthly rent', '8500'], ['securityDeposit', 'Security deposit', '10000'], ['distance', 'Distance to university (km)', '0.8']].map(([name, label, placeholder]) => <label key={name} className="flex flex-col gap-xs"><span className="font-label-caps text-label-caps text-primary">{label}</span><input required name={name} value={form[name]} onChange={handleChange} placeholder={placeholder} className="border-2 border-primary px-md py-md bg-surface-container-lowest text-primary" /></label>)}<label className="flex flex-col gap-xs"><span className="font-label-caps text-label-caps text-primary">University</span><select required name="universityId" value={form.universityId} onChange={handleChange} className="border-2 border-primary px-md py-md bg-surface-container-lowest text-primary"><option value="">Choose university</option>{universities.map((university) => <option key={university.id} value={university.id}>{university.name}</option>)}</select></label><label className="flex flex-col gap-xs"><span className="font-label-caps text-label-caps text-primary">Property type</span><select name="propertyType" value={form.propertyType} onChange={handleChange} className="border-2 border-primary px-md py-md bg-surface-container-lowest text-primary"><option value="pg">PG</option><option value="flat">Flat</option></select></label><label className="md:col-span-2 flex flex-col gap-xs"><span className="font-label-caps text-label-caps text-primary">Description</span><textarea name="description" value={form.description} onChange={handleChange} rows="3" className="border-2 border-primary px-md py-md bg-surface-container-lowest text-primary" placeholder="Tell students what makes this space safe and useful." /></label></div><button type="submit" className="w-full mt-lg py-md bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary">SAVE AS DRAFT</button></form></div>}
    </div>
  );
}
