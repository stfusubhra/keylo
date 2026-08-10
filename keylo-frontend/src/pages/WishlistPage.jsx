import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { isSupabaseConfigured } from '../lib/supabase';
import { getWishlistData, toggleSavedProperty, toggleSavedRental } from '../lib/supabaseData';
import { rentalItems, categoryImages } from '../lib/rentalCatalog';
import { formatDate } from '../lib/format';

const fallbackImage = 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=85';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState({ properties: [], rentals: [] });
  const [error, setError] = useState('');

  const refresh = () => getWishlistData().then(setWishlist).catch((err) => setError(err.message || 'Unable to load your wishlist.'));
  useEffect(() => { if (isSupabaseConfigured) refresh(); }, []);

  const removeProperty = async (propertyId) => {
    try { await toggleSavedProperty(propertyId); setWishlist((current) => ({ ...current, properties: current.properties.filter((item) => item.properties?.id !== propertyId) })); } catch (err) { setError(err.message); }
  };
  const removeRental = async (itemId) => {
    try { await toggleSavedRental(itemId); setWishlist((current) => ({ ...current, rentals: current.rentals.filter((item) => item.item_id !== itemId) })); } catch (err) { setError(err.message); }
  };

  const savedRentals = wishlist.rentals.map((saved) => ({ ...saved, item: rentalItems.find((item) => item.id === Number(saved.item_id)) })).filter((saved) => saved.item);
  const total = wishlist.properties.length + savedRentals.length;

  return <div className="bg-surface min-h-screen font-body-md text-on-surface">
    <header className="border-b-2 border-primary pb-lg mb-xl flex flex-col md:flex-row md:items-end justify-between gap-lg"><div><p className="font-label-caps text-label-caps text-electric-purple uppercase mb-sm">Your shortlist</p><h1 className="font-heading text-h1-mobile md:text-h1 text-primary uppercase font-bold">Wishlist</h1><p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">Keep homes and rental essentials together while you compare your next move.</p></div><span className="font-label-caps text-label-caps text-on-surface-variant">{total} saved</span></header>
    {error && <div role="alert" className="border-2 border-error bg-error/10 p-md mb-lg text-error">{error}</div>}
    {!isSupabaseConfigured && <div className="border-2 border-primary border-dashed p-lg text-center text-on-surface-variant">Sign in with Supabase enabled to use your wishlist.</div>}

    <section className="mb-xl"><div className="flex items-end justify-between mb-md"><div><p className="font-label-caps text-label-caps text-hot-pink uppercase">Flats & PGs</p><h2 className="font-h3 text-h3 text-primary">Saved stays</h2></div><span className="font-label-caps text-label-caps text-on-surface-variant">{wishlist.properties.length}</span></div>
      {wishlist.properties.length ? <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">{wishlist.properties.map((saved) => { const property = saved.properties; return <article key={property.id} className="border-2 border-primary bg-surface-container-lowest shadow-[4px_4px_0px_0px_#000000] overflow-hidden"><img src={property.cover_image_url || fallbackImage} alt={property.name} className="w-full h-44 object-cover border-b-2 border-primary" /><div className="p-lg"><div className="flex items-start justify-between gap-md"><div><h3 className="font-h3 text-h3 text-primary">{property.name}</h3><p className="text-on-surface-variant mt-xs">{property.area}, {property.city} · {property.property_type === 'pg' ? 'PG' : 'Flat'}</p></div><button type="button" onClick={() => removeProperty(property.id)} aria-label={`Remove ${property.name} from wishlist`} className="p-xs border-2 border-primary bg-hot-pink text-white"><span className="material-symbols-outlined" style={{ fontVariationSettings: 'FILL 1' }}>favorite</span></button></div><p className="font-price-display text-price-display text-primary mt-md">₹{Number(property.monthly_rent).toLocaleString('en-IN')} <span className="font-body-md text-on-surface-variant">/ month</span></p><div className="flex gap-sm mt-md"><Link to={`/property/${property.id}`} className="flex-1 text-center px-md py-sm bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary">VIEW STAY</Link><span className="px-md py-sm border-2 border-primary font-label-caps text-[10px] text-on-surface-variant">Saved {formatDate(saved.created_at)}</span></div></div></article>; })}</div> : <div className="border-2 border-primary border-dashed p-lg text-on-surface-variant">No saved stays yet. <Link to="/find-a-stay" className="text-primary underline">Browse flats and PGs.</Link></div>}
    </section>

    <section><div className="flex items-end justify-between mb-md"><div><p className="font-label-caps text-label-caps text-hot-pink uppercase">Rent Essentials</p><h2 className="font-h3 text-h3 text-primary">Saved rentals</h2></div><span className="font-label-caps text-label-caps text-on-surface-variant">{savedRentals.length}</span></div>
      {savedRentals.length ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">{savedRentals.map(({ item, created_at: createdAt }) => <article key={item.id} className="border-2 border-primary bg-surface-container-lowest shadow-[4px_4px_0px_0px_#000000] overflow-hidden"><div className="relative"><img src={item.useImage ? item.image : categoryImages[item.category] || item.image} alt={item.name} className="w-full h-44 object-cover border-b-2 border-primary" /><button type="button" onClick={() => removeRental(item.id)} aria-label={`Remove ${item.name} from wishlist`} className="absolute top-md right-md p-xs border-2 border-primary bg-hot-pink text-white"><span className="material-symbols-outlined" style={{ fontVariationSettings: 'FILL 1' }}>favorite</span></button></div><div className="p-lg"><p className="font-label-caps text-label-caps text-electric-purple uppercase">{item.categoryLabel}</p><h3 className="font-h3 text-h3 text-primary mt-xs">{item.name}</h3><p className="font-price-display text-price-display text-primary mt-md">{item.price} <span className="font-body-md text-on-surface-variant">{item.period}</span></p><div className="flex gap-sm mt-md"><Link to={`/rentals/rent/${item.id}`} className="flex-1 text-center px-md py-sm bg-primary text-on-primary border-2 border-primary font-label-caps text-label-caps">VIEW ITEM</Link><span className="px-md py-sm border-2 border-primary font-label-caps text-[10px] text-on-surface-variant">Saved {formatDate(createdAt)}</span></div></div></article>)}</div> : <div className="border-2 border-primary border-dashed p-lg text-on-surface-variant">No saved rentals yet. <Link to="/rentals" className="text-primary underline">Browse Rent Essentials.</Link></div>}
    </section>
  </div>;
}
