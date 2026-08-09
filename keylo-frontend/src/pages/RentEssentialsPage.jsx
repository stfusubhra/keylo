import { useState } from 'react';
import { Link } from 'react-router-dom';
import { rentalItems, categoryImages } from '../lib/rentalCatalog';

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
];



export default function RentEssentialsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const filteredItems =
    activeCategory === 'all'
      ? rentalItems
      : rentalItems.filter((item) => item.category === activeCategory);

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
      <section className="w-full bg-surface py-xl px-margin-mobile lg:px-margin-desktop min-h-[400px] lg:min-h-[614px] flex flex-col justify-center relative overflow-hidden">
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
        <div className="flex flex-nowrap items-center gap-md mb-xl overflow-x-auto pb-sm hide-scrollbar">
          {rentalCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-lg py-md font-label-caps text-label-caps rounded-full border-2 border-primary transition-all whitespace-nowrap shrink-0 ${
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {visibleItems.map((item) => (
            <div
              key={item.id}
              className="group bg-surface flex flex-col border-2 border-primary shadow-[8px_8px_0px_0px_#000000] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_#000000] transition-all duration-300"
            >
              <div className="relative w-full aspect-square border-b-2 border-primary overflow-hidden bg-surface-container-high">
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
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                  src={item.useImage ? item.image : categoryImages[item.category] || item.image}
                  alt={item.name}
                />
              </div>
              <div className="p-lg flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-md">
                  <div>
                    <h3 className="font-h3 text-h3 text-primary mb-xs">{item.name}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">{item.categoryLabel}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-price-display text-price-display text-primary block">{item.price}</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">{item.period}</span>
                  </div>
                </div>
                <div className="mt-auto pt-lg">
                  <Link
                    to={`/rentals/rent/${item.id}`}
                    className="w-full py-md bg-primary text-on-primary font-label-caps text-label-caps border-2 border-primary hover:bg-[#C7F000] hover:text-primary transition-colors flex items-center justify-center gap-sm"
                  >
                    RENT NOW <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-xl">
            <span className="material-symbols-outlined text-[64px] text-on-surface-variant mb-md">inventory_2</span>
            <h3 className="font-h3 text-h3 text-primary mb-xs">No items found</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">Try selecting a different category.</p>
          </div>
        )}
      </section>
    </div>
  );
}
