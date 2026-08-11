import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMarketplaceItems, marketplaceCategoryImages } from '../lib/rentalMarketplace';
import { isSupabaseConfigured } from '../lib/supabase';
import { getSavedRentalIds, toggleSavedRental } from '../lib/supabaseData';
import LoadingScreen from '../components/ui/LoadingScreen';
import { EmptyState } from '../components/ui/EmptyState';
import toast from 'react-hot-toast';

const rentalCategories = [
  { id: 'all', label: 'All Rentals' },
  { id: 'scooters', label: 'Scooters' },
  { id: 'bikes', label: 'Bikes' },
  { id: 'laptops', label: 'Laptops' },
  { id: 'furniture', label: 'Furniture' },
  { id: 'appliances', label: 'Appliances' },
  { id: 'electronics', label: 'Electronics' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'tablets', label: 'Tablets' },
  { id: 'projectors', label: 'Projectors' },
  { id: 'cameras', label: 'Cameras' },
  { id: 'phones', label: 'Phones' },
  { id: 'gadgets', label: 'Gadgets' },
  { id: 'sports', label: 'Sports' },
  { id: 'events', label: 'Events' },
];



export default function RentEssentialsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
   const [sortBy, setSortBy] = useState('popular');
   const [savedIds, setSavedIds] = useState({});
   const [items, setItems] = useState([]);
   const [loading, setLoading] = useState(true);
   const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    getMarketplaceItems().then((all) => { if (active) setItems(all); }).catch(() => {}).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    let active = true;
    getSavedRentalIds().then((ids) => { if (active) setSavedIds(ids); }).catch(() => {});
    return () => { active = false; };
  }, []);

   const handleToggleSave = async (itemId) => {
     try {
       const result = await toggleSavedRental(itemId);
       setSavedIds((current) => ({ ...current, [itemId]: result.saved }));
       toast.success(result.saved ? 'Saved to wishlist!' : 'Removed from wishlist');
     } catch (error) {
       if (error.message?.includes('signed in') || error.message?.toLowerCase().includes('auth session')) {
         navigate('/login', { state: { from: '/rentals' } });
         return;
       }
       toast.error(error.message || 'Unable to update your wishlist.');
     }
   };

  const filteredItems =
    activeCategory === 'all'
      ? items
      : items.filter((item) => item.category === activeCategory);

  const priceValue = (item) => Number(String(item.price).replace(/[^\d]/g, '')) || 0;
  const visibleItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'price-asc') return priceValue(a) - priceValue(b);
    if (sortBy === 'price-desc') return priceValue(b) - priceValue(a);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="min-h-screen bg-surface-container-low font-body-md text-on-surface">
      {/* Hero Section */}
      <section className="w-full bg-surface py-xl px-margin-mobile lg:px-margin-desktop min-h-[280px] lg:min-h-[614px] flex flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path className="text-primary" d="M0,100 L100,0 L100,100 Z" fill="currentColor" />
          </svg>
        </div>
        <div className="max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-sm mb-lg px-md py-sm bg-primary text-on-primary rounded-full border-2 border-primary shadow-[4px_4px_0px_0px_#000000]">
            <span className="material-symbols-outlined text-sm">bolt</span>
            <span className="font-label-caps text-label-caps tracking-widest uppercase">Student Marketplace</span>
          </div>
          <h1 className="font-heading text-h1-mobile lg:text-h1 text-primary mb-lg leading-none tracking-tighter font-bold">
            Rent the things that make <br className="hidden lg:block" />
            <span className="relative inline-block">
              college easier.
              <div className="absolute -bottom-2 left-0 w-full h-4 bg-[#C7F000] -z-10 rotate-1" />
            </span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant text-balance leading-relaxed" style={{ maxWidth: '672px' }}>
            Skip the heavy lifting. Get high-quality tech, transport, and furniture on flexible terms built for student life. No long-term commitments.
          </p>
        </div>
      </section>

       {/* Rental Categories & Grid */}
       <section className="w-full bg-surface-container-low px-margin-mobile lg:px-margin-desktop py-xl border-t-2 border-primary">
         {/* Category Filters */}
        <div className="flex flex-nowrap items-center gap-sm mb-lg lg:mb-xl overflow-x-auto pb-sm hide-scrollbar">
          {rentalCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-md py-sm lg:px-lg lg:py-md font-label-caps text-[10px] sm:text-label-caps rounded-full border-2 border-primary transition-all whitespace-nowrap shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-primary text-on-primary shadow-[4px_4px_0px_0px_#000000]'
                  : 'bg-surface text-primary hover:bg-[#C7F000]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between pb-lg border-b-2 border-primary mb-xl">
          <span className="font-label-caps text-label-caps text-primary">
            Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
            {activeCategory !== 'all' && ` in ${rentalCategories.find((c) => c.id === activeCategory)?.label}`}
          </span>
          <div className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">sort</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              aria-label="Sort rentals"
              className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary bg-transparent border-2 border-primary px-md py-sm focus:outline-none cursor-pointer"
            >
              <option value="popular">Sort by: Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>



        {/* Rental Grid */}
        {loading ? (
          <LoadingScreen label="Loading rentals..." />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-md lg:gap-lg">
            {visibleItems.map((item) => (
            <div
              key={item.id}
              role="link"
              tabIndex={0}
              onClick={() => navigate(`/rentals/rent/${item.id}`)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  navigate(`/rentals/rent/${item.id}`);
                }
              }}
              className="group bg-surface flex flex-col border-2 border-primary shadow-[8px_8px_0px_0px_#000000] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_#000000] transition-all duration-300 cursor-pointer"
            >
              <div className="relative w-full aspect-[4/3] sm:aspect-square border-b-2 border-primary overflow-hidden bg-surface-container-high">
                <div className="absolute top-md left-md z-10 flex gap-sm flex-wrap">
                  {item.badges.map((badge) => (
                    <span
                      key={badge.label}
                      className={`px-sm py-xs ${badge.bg} ${badge.textColor} font-label-caps text-[10px] uppercase border-2 border-primary`}
                    >
                      {badge.label}
                    </span>
                  ))}
                </div>
                <img loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                  src={item.useImage ? item.image : marketplaceCategoryImages[item.category] || item.image}
                  alt={item.name}
                />
                {!item.listerItemId && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleToggleSave(item.id);
                  }}
                  aria-label={`${savedIds[item.id] ? 'Remove' : 'Save'} ${item.name} ${savedIds[item.id] ? 'from' : 'to'} wishlist`}
                  aria-pressed={Boolean(savedIds[item.id])}
                  className={`absolute top-md right-md z-10 p-sm border-2 border-primary ${savedIds[item.id] ? 'bg-hot-pink text-white' : 'bg-surface text-primary hover:bg-acid-lime'}`}
                >
                  <span className="material-symbols-outlined" style={savedIds[item.id] ? { fontVariationSettings: 'FILL 1' } : undefined}>favorite</span>
                </button>
                )}
              </div>
              <div className="p-sm sm:p-lg flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-sm sm:mb-md">
                  <div className="min-w-0 flex-1 pr-xs">
                    <h3 className="font-h3 text-[14px] sm:text-h3 text-primary mb-xs leading-tight line-clamp-2">{item.name}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant text-[11px] sm:text-body-md hidden sm:block">{item.categoryLabel}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-price-display text-[16px] sm:text-price-display text-primary block">{item.price}</span>
                    <span className="font-label-caps text-[9px] sm:text-label-caps text-on-surface-variant uppercase">{item.period}</span>
                  </div>
                </div>
                <div className="mt-auto pt-sm sm:pt-lg">
                  <div
                    className="w-full py-sm sm:py-md bg-primary text-on-primary font-label-caps text-[10px] sm:text-label-caps border-2 border-primary hover:bg-[#C7F000] hover:text-primary transition-colors flex items-center justify-center gap-xs sm:gap-sm"
                  >
                    RENT <span className="material-symbols-outlined text-xs sm:text-sm">arrow_forward</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredItems.length === 0 && (
          <EmptyState icon="🧺" title="No items found" description="Try selecting a different category." />
        )}
      </section>
    </div>
  );
}
