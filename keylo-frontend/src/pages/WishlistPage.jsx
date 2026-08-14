import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { isSupabaseConfigured } from '../lib/supabase';
import { getWishlistData, toggleSavedProperty, toggleSavedRental } from '../lib/supabaseData';
import { rentalItems, categoryImages } from '../lib/rentalCatalog';
import { formatDate } from '../lib/format';
import { EmptyState } from '../components/ui/EmptyState';

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

  return (
    <div className="w-full">
      <header className="border-b-2 border-primary pb-lg mb-xl flex flex-col md:flex-row md:items-end justify-between gap-lg">
        <div>
          <p className="font-label-caps text-label-caps text-electric-purple uppercase mb-sm">Your shortlist</p>
          <h1 className="font-heading text-h1-mobile md:text-h1 text-primary uppercase font-bold">Wishlist</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">Keep homes and rental essentials together while you compare your next move.</p>
        </div>
        <span className="font-label-caps text-label-caps text-on-surface-variant">{total} saved</span>
      </header>

      {error && <div role="alert" className="border-2 border-error bg-error/10 p-md mb-lg text-error">{error}</div>}
      {!isSupabaseConfigured && <div className="border-2 border-primary border-dashed p-lg text-center text-on-surface-variant mb-lg">Sign in with Supabase enabled to use your wishlist.</div>}

      <section className="mb-xl">
        <div className="flex items-end justify-between mb-md">
          <div>
            <p className="font-label-caps text-label-caps text-hot-pink uppercase">Flats & PGs</p>
            <h2 className="font-h3 text-h3 text-primary">Saved stays</h2>
          </div>
          <span className="font-label-caps text-label-caps text-on-surface-variant">{wishlist.properties.length}</span>
        </div>
        {wishlist.properties.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-lg">
            {wishlist.properties.map((saved) => {
              const property = saved.properties;
              return (
                <article key={property.id} className="border-2 border-primary bg-surface-container-lowest shadow-[4px_4px_0px_0px_#000000] overflow-hidden flex flex-col">
                  <div className="relative w-full aspect-[16/10] sm:aspect-video border-b-2 border-primary overflow-hidden bg-surface-container-highest">
                    <img loading="lazy" src={property.cover_image_url || fallbackImage} alt={property.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 sm:p-lg flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-md mb-xs">
                      <div>
                        <h3 className="font-h3 text-[16px] sm:text-h3 text-primary leading-tight">{property.name}</h3>
                        <p className="text-on-surface-variant text-xs sm:text-body-md mt-xs">{property.area}, {property.city} · {property.property_type === 'pg' ? 'PG' : 'Flat'}</p>
                      </div>
                      <button type="button" onClick={() => removeProperty(property.id)} aria-label={`Remove ${property.name} from wishlist`} className="p-1.5 sm:p-xs border-2 border-primary bg-hot-pink text-white flex-shrink-0">
                        <span className="material-symbols-outlined text-[18px] sm:text-[24px]" style={{ fontVariationSettings: 'FILL 1' }}>favorite</span>
                      </button>
                    </div>
                    <p className="font-price-display text-[18px] sm:text-price-display text-primary mt-auto pt-md">
                      ₹{Number(property.monthly_rent).toLocaleString('en-IN')} <span className="font-body-md text-xs sm:text-body-md text-on-surface-variant">/ month</span>
                    </p>
                    <div className="flex flex-col xs:flex-row gap-2 sm:gap-sm mt-md">
                      <Link to={`/property/${property.id}`} className="flex-1 text-center px-md py-2 sm:py-sm bg-acid-lime border-2 border-primary font-label-caps text-xs sm:text-label-caps text-primary">VIEW STAY</Link>
                      <span className="px-md py-2 sm:py-sm border-2 border-primary font-label-caps text-[10px] text-on-surface-variant text-center">Saved {formatDate(saved.created_at)}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState icon="🏠" title="No saved stays yet" description="Browse flats and PGs to start saving." action={<Link to="/find-a-stay" className="inline-block px-lg py-md bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary hover:bg-primary hover:text-on-primary transition-all duration-200">+ SAVE A STAY</Link>} />
        )}
      </section>

      <section>
        <div className="flex items-end justify-between mb-md">
          <div>
            <p className="font-label-caps text-label-caps text-hot-pink uppercase">Rent Essentials</p>
            <h2 className="font-h3 text-h3 text-primary">Saved rentals</h2>
          </div>
          <span className="font-label-caps text-label-caps text-on-surface-variant">{savedRentals.length}</span>
        </div>
        {savedRentals.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-lg">
            {savedRentals.map(({ item, created_at: createdAt }) => (
              <article key={item.id} className="border-2 border-primary bg-surface-container-lowest shadow-[4px_4px_0px_0px_#000000] overflow-hidden flex flex-col">
                <div className="relative w-full aspect-[16/10] sm:aspect-video border-b-2 border-primary overflow-hidden bg-surface-container-highest">
                  <img loading="lazy" src={item.useImage ? item.image : categoryImages[item.category] || item.image} alt={item.name} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeRental(item.id)} aria-label={`Remove ${item.name} from wishlist`} className="absolute top-2 right-2 sm:top-md sm:right-md p-1.5 sm:p-xs border-2 border-primary bg-hot-pink text-white">
                    <span className="material-symbols-outlined text-[18px] sm:text-[24px]" style={{ fontVariationSettings: 'FILL 1' }}>favorite</span>
                  </button>
                </div>
                <div className="p-4 sm:p-lg flex flex-col flex-1">
                  <p className="font-label-caps text-[10px] sm:text-label-caps text-electric-purple uppercase">{item.categoryLabel}</p>
                  <h3 className="font-h3 text-[16px] sm:text-h3 text-primary mt-xs leading-tight">{item.name}</h3>
                  <p className="font-price-display text-[18px] sm:text-price-display text-primary mt-auto pt-md">{item.price} <span className="font-body-md text-xs sm:text-body-md text-on-surface-variant">{item.period}</span></p>
                  <div className="flex flex-col xs:flex-row gap-2 sm:gap-sm mt-md">
                    <Link to={`/rentals/rent/${item.id}`} className="flex-1 text-center px-md py-2 sm:py-sm bg-primary text-on-primary border-2 border-primary font-label-caps text-xs sm:text-label-caps">VIEW ITEM</Link>
                    <span className="px-md py-2 sm:py-sm border-2 border-primary font-label-caps text-[10px] text-on-surface-variant text-center">Saved {formatDate(createdAt)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState icon="🛏️" title="No saved rentals yet" description="Browse Rent Essentials to start saving." action={<Link to="/rentals" className="inline-block px-lg py-md bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary hover:bg-primary hover:text-on-primary transition-all duration-200">+ SAVE A RENTAL</Link>} />
        )}
      </section>
    </div>
  );
}
