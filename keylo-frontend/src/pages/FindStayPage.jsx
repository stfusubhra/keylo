import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { isSupabaseConfigured } from '../lib/supabase';
import { listProperties, toggleSavedProperty } from '../lib/supabaseData';

const properties = [
  {
    id: 'adamas-pg', university: 'Adamas University', area: 'Barasat', name: 'Adamas Green PG', type: 'PG', distance: '0.8 km', rating: '4.8', price: '₹8,500', deposit: '₹10,000', status: 'Verified', badge: '✓ Verified', badgeClass: 'bg-acid-lime text-primary',
    amenities: ['Wi-Fi', 'Meals available', '24/7 Security'], image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=85', featured: true,
  },
  {
    id: 'adamas-flat', university: 'Adamas University', area: 'Madhyamgram', name: 'North Kolkata Student Flat', type: 'Flat', distance: '1.4 km', rating: '4.6', price: '₹14,000', deposit: '₹20,000', status: 'Available', badge: 'AI Inspected', badgeClass: 'bg-electric-purple text-white',
    amenities: ['2 bedrooms', 'Study-ready', 'Gated community'], image: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1000&q=85', featured: false,
  },
  {
    id: 'jadavpur-pg', university: 'Jadavpur University', area: 'Jadavpur', name: 'Lake View Student PG', type: 'PG', distance: '0.6 km', rating: '4.9', price: '₹9,500', deposit: '₹12,000', status: 'Fast Filling', badge: '🔥 Fast Filling', badgeClass: 'bg-hot-pink text-white',
    amenities: ['High-speed Wi-Fi', 'Laundry', 'Power backup'], image: 'https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=1000&q=85', featured: true,
  },
  {
    id: 'jadavpur-flat', university: 'Jadavpur University', area: 'Gariahat', name: 'South Kolkata 2BHK Flat', type: 'Flat', distance: '1.1 km', rating: '4.7', price: '₹18,000', deposit: '₹25,000', status: 'Available', badge: '✓ Verified', badgeClass: 'bg-acid-lime text-primary',
    amenities: ['2 bedrooms', 'Furnished', 'Metro nearby'], image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85', featured: false,
  },
  {
    id: 'calcutta-pg', university: 'University of Calcutta', area: 'Ballygunge', name: 'College Street Co-Living', type: 'PG', distance: '1.3 km', rating: '4.7', price: '₹7,800', deposit: '₹8,000', status: 'Verified', badge: '✓ Verified', badgeClass: 'bg-acid-lime text-primary',
    amenities: ['Wi-Fi', 'Housekeeping', 'Common kitchen'], image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=85', featured: false,
  },
  {
    id: 'calcutta-flat', university: 'University of Calcutta', area: 'Bhowanipore', name: 'Central Kolkata Student Flat', type: 'Flat', distance: '1.8 km', rating: '4.5', price: '₹16,500', deposit: '₹22,000', status: 'Available', badge: 'AI Inspected', badgeClass: 'bg-electric-purple text-white',
    amenities: ['1 bedroom', 'Fully furnished', 'Bus access'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBc4-R4SQhrI1Gl7NarbnIcQfeO18ZgTs4ngebY_h6w2QPAfpY9u4hg_0Ab_ezybQTdnSwkK_EM_eZ3Fq48GvhxLXfPFTsNeY6tGWUNEysavTRJf1aAMRLaOZDmOjXZ32OT0FS6MMTD1KzUKGx9UfOQlehKO98GV7kSOZM08LFTA0Jwqas0LPTH5gkO0G2LLKxOm74mJvvXPw1DIl_q3QpMlJTRzs3Mo4LoW59Zzo2RVsGzJEVEkLs_', featured: false,
  },
  {
    id: 'xaviers-pg', university: "St. Xavier's University Kolkata", area: 'New Town', name: 'New Town Scholars PG', type: 'PG', distance: '0.9 km', rating: '4.8', price: '₹10,500', deposit: '₹12,000', status: 'Verified', badge: '✓ Verified', badgeClass: 'bg-acid-lime text-primary',
    amenities: ['Wi-Fi', 'Gym', '24/7 Security'], image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1000&q=85', featured: true,
  },
  {
    id: 'xaviers-flat', university: "St. Xavier's University Kolkata", area: 'Rajarhat', name: 'Rajarhat Campus Flat', type: 'Flat', distance: '1.6 km', rating: '4.6', price: '₹19,500', deposit: '₹28,000', status: 'Available', badge: 'AI Inspected', badgeClass: 'bg-electric-purple text-white',
    amenities: ['2 bedrooms', 'Balcony', 'Parking'], image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85', featured: false,
  },
];

const universities = ['All Kolkata', 'Adamas University', 'Jadavpur University', 'University of Calcutta', "St. Xavier's University Kolkata"];

function PropertyCard({ property, saved, onToggleSave }) {
  return (
    <article className="group flex flex-col md:flex-row border-2 border-primary bg-surface-container-lowest hover:-translate-y-1 hover:translate-x-1 hover:shadow-[-4px_4px_0px_0px_#000000] transition-all" data-id={property.id}>
      <div className="w-full md:w-[240px] aspect-[4/3] md:aspect-square relative border-b-2 md:border-b-0 md:border-r-2 border-primary">
        <div className="absolute top-2 left-2 z-10"><span className={`px-2 py-1 border-2 border-primary font-label-caps text-label-caps ${property.badgeClass}`}>{property.badge}</span></div>
        <img className="w-full h-full object-cover" src={property.image} alt={`${property.name} near ${property.university}`} />
        <button
          onClick={onToggleSave}
          aria-label={`Save ${property.name}`}
          aria-pressed={saved}
          title={saved ? 'Remove from saved' : 'Save for later'}
          className={`absolute top-2 right-2 p-1 border-2 border-primary transition-colors ${saved ? 'bg-hot-pink text-white' : 'bg-surface-container-lowest text-primary hover:bg-hot-pink hover:text-white'}`}
        ><span className="material-symbols-outlined text-[20px]" style={saved ? { fontVariationSettings: 'FILL 1' } : undefined}>favorite</span></button>
      </div>
      <div className="p-md lg:p-lg flex flex-col justify-between flex-1">
        <div className="flex flex-col gap-xs">
          <div className="flex justify-between items-start gap-md"><div><p className="font-label-caps text-label-caps text-electric-purple uppercase">Near {property.university}</p><h3 className="font-h3 text-h3 text-primary line-clamp-1 group-hover:underline decoration-2 underline-offset-4">{property.name}</h3></div><div className="flex items-center gap-1 bg-surface border-2 border-primary px-2 py-0.5"><span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: 'FILL 1' }}>star</span><span className="font-label-caps text-label-caps text-primary">{property.rating}</span></div></div>
          <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">location_on</span>{property.area}, Kolkata • {property.distance} from campus</p>
          <div className="flex flex-wrap gap-xs mt-xs"><span className="px-2 py-1 bg-[#E7F7D1] border border-primary font-label-caps text-[10px] text-primary uppercase">Verified landlord</span><span className="px-2 py-1 bg-[#EDE9FE] border border-primary font-label-caps text-[10px] text-primary uppercase">AI inspected</span></div>
        </div>
        <div className="mt-md mb-md flex flex-wrap gap-2"><span className="px-2 py-1 bg-surface-container border-2 border-primary font-label-caps text-label-caps text-on-surface">{property.type}</span>{property.amenities.slice(0, 2).map((amenity) => <span key={amenity} className="px-2 py-1 bg-cyan-300 border-2 border-primary font-label-caps text-label-caps text-primary">{amenity}</span>)}</div>
        <div className="flex items-end justify-between border-t-2 border-primary pt-md mt-auto"><div className="flex flex-col"><span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Starting from</span><div className="flex items-baseline gap-1"><span className="font-price-display text-price-display text-primary tracking-tight">{property.price}</span><span className="font-body-md text-body-md text-on-surface-variant">/ mo</span></div></div><Link to={`/property/${property.id}`} className="px-lg py-sm bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary hover:-translate-y-0.5 hover:shadow-[-2px_2px_0px_0px_#000000] transition-all">View stay</Link></div>
      </div>
    </article>
  );
}

export default function FindStayPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('All Kolkata');
  const [selectedType, setSelectedType] = useState('All types');
  const [catalog, setCatalog] = useState(properties);
  const [savedIds, setSavedIds] = useState({});
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(isSupabaseConfigured);
  const [saveError, setSaveError] = useState('');

  const handleToggleSave = async (propertyId) => {
    if (!isSupabaseConfigured) {
      setSaveError('Sign in to save properties. Supabase is not configured for this deployment.');
      return;
    }
    try {
      const result = await toggleSavedProperty(propertyId);
      setSavedIds((current) => ({ ...current, [propertyId]: result.saved }));
      setSaveError('');
    } catch (err) {
      setSaveError(err.message);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    let active = true;
    listProperties()
      .then((rows) => {
        if (!active || !rows.length) return;
        setCatalog(rows.map((row) => ({
          id: row.id,
          university: row.universities?.name || 'Kolkata University',
          area: row.area,
          name: row.name,
          type: row.property_type === 'pg' ? 'PG' : 'Flat',
          distance: `${row.distance_to_university_km} km`,
          rating: row.profiles?.owner_rating || '4.8',
          price: `₹${Number(row.monthly_rent).toLocaleString('en-IN')}`,
          deposit: `₹${Number(row.security_deposit).toLocaleString('en-IN')}`,
          badge: row.is_ai_inspected ? 'AI Inspected' : '✓ Verified',
          badgeClass: row.is_ai_inspected ? 'bg-electric-purple text-white' : 'bg-acid-lime text-primary',
          amenities: row.amenities || [],
          image: row.cover_image_url || 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=85',
        })));
      })
      .catch(() => {})
      .finally(() => { if (active) setIsLoadingCatalog(false); });
    return () => { active = false; };
  }, []);

  const filteredProperties = useMemo(() => catalog.filter((property) => {
    const query = searchQuery.toLowerCase();
    return (selectedUniversity === 'All Kolkata' || property.university === selectedUniversity)
      && (selectedType === 'All types' || property.type === selectedType)
      && (!query || `${property.name} ${property.area} ${property.university} ${property.type}`.toLowerCase().includes(query));
  }), [catalog, searchQuery, selectedUniversity, selectedType]);

  return <div>
    <section className="w-full px-margin-mobile lg:px-margin-desktop py-xl border-b-2 border-primary bg-surface flex flex-col gap-lg">
      {saveError && <div role="alert" className="border-2 border-error bg-error/10 p-md font-body-md text-error">{saveError}</div>}
      <div><p className="font-label-caps text-label-caps text-electric-purple uppercase mb-sm">KeyLo Kolkata rental guide</p><h1 className="font-heading text-h1-mobile md:text-h1 text-primary tracking-tight uppercase font-bold">Find your next place.</h1><p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">Browse verified flats and PGs grouped by the university you are studying near in Kolkata.</p></div>
      <div className="flex flex-col lg:flex-row gap-md items-start lg:items-center"><form className="relative w-full lg:w-[520px] h-[64px] border-2 border-primary bg-surface-container-lowest focus-within:ring-4 ring-acid-lime flex items-center pr-2" onSubmit={(event) => event.preventDefault()}><span className="material-symbols-outlined absolute left-4 text-primary">search</span><input id="rental-search" name="rentalSearch" className="w-full h-full pl-12 pr-4 bg-transparent outline-none font-body-lg text-body-lg text-primary placeholder:text-on-surface-variant" placeholder="Search university, area, PG, or flat..." type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} /><button type="submit" className="h-12 px-6 bg-primary text-on-primary font-label-caps text-label-caps border-2 border-primary whitespace-nowrap">Search</button></form><div className="flex gap-sm"><button onClick={() => setSelectedType('All types')} className={`px-md py-sm border-2 border-primary font-label-caps text-primary ${selectedType === 'All types' ? 'bg-acid-lime' : 'bg-surface-container-lowest'}`}>All types</button><button onClick={() => setSelectedType('PG')} className={`px-md py-sm border-2 border-primary font-label-caps text-primary ${selectedType === 'PG' ? 'bg-acid-lime' : 'bg-surface-container-lowest'}`}>PGs</button><button onClick={() => setSelectedType('Flat')} className={`px-md py-sm border-2 border-primary font-label-caps text-primary ${selectedType === 'Flat' ? 'bg-acid-lime' : 'bg-surface-container-lowest'}`}>Flats</button></div></div>
      <div className="flex gap-sm overflow-x-auto pb-xs" aria-label="Filter rentals by university">{universities.map((university) => <button key={university} onClick={() => setSelectedUniversity(university)} className={`shrink-0 px-md py-sm border-2 border-primary font-label-caps text-primary transition-colors ${selectedUniversity === university ? 'bg-acid-lime text-primary shadow-[-3px_3px_0px_0px_#000000]' : 'bg-surface-container-lowest hover:bg-acid-lime'}`}>{university === 'All Kolkata' ? university : `Near ${university}`}</button>)}</div>
    </section>
    <section className="w-full px-margin-mobile lg:px-margin-desktop py-xl border-b-2 border-primary bg-surface flex flex-col gap-xl" id="property-list"><div className="flex flex-wrap items-center justify-between gap-md pb-sm border-b-2 border-primary"><span className="font-label-caps text-label-caps text-primary">{isLoadingCatalog ? 'Loading live Kolkata stays...' : `Showing ${filteredProperties.length} stays near ${selectedUniversity === 'All Kolkata' ? 'Kolkata universities' : selectedUniversity}`}</span><span className="font-label-caps text-label-caps text-on-surface-variant">Sorted by university distance</span></div>{filteredProperties.length ? filteredProperties.map((property) => <PropertyCard key={property.id} property={property} saved={Boolean(savedIds[property.id])} onToggleSave={() => handleToggleSave(property.id)} />) : <div className="py-xl text-center"><h2 className="font-h3 text-h3 text-primary">No stays found</h2><p className="font-body-md text-on-surface-variant mt-sm">Try another Kolkata university, area, or rental type.</p></div>}</section>
    <section className="hidden lg:block h-[360px] bg-[#dfe8e4] relative border-b-2 border-primary overflow-hidden" aria-label="Kolkata university rental map"><div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(28deg, transparent 48%, #8fa59c 49%, #8fa59c 50%, transparent 51%), linear-gradient(112deg, transparent 47%, #8fa59c 48%, #8fa59c 49%, transparent 50%), linear-gradient(#b7c8c1 1px, transparent 1px), linear-gradient(90deg, #b7c8c1 1px, transparent 1px)', backgroundSize: '240px 180px, 300px 220px, 48px 48px, 48px 48px' }} /><div className="absolute inset-0 flex flex-col items-center justify-center gap-lg p-xl"><div className="px-lg py-sm bg-surface-container-lowest border-2 border-primary font-h3 text-h3 text-primary shadow-[-4px_4px_0px_0px_#000000]">Kolkata University Rental Map</div><div className="flex flex-wrap justify-center gap-md">{['Adamas University', 'Jadavpur University', 'University of Calcutta', "St. Xavier's University"].map((university) => <button key={university} onClick={() => setSelectedUniversity(university === "St. Xavier's University" ? "St. Xavier's University Kolkata" : university)} className="px-md py-sm bg-acid-lime border-2 border-primary font-label-caps text-primary shadow-[-3px_3px_0px_0px_#000000] hover:-translate-y-0.5">Near {university}</button>)}</div><p className="font-label-caps text-label-caps text-primary bg-surface-container-lowest px-md py-sm border-2 border-primary">Showing rental zones around Kolkata campuses</p></div></section>
  </div>;
}
