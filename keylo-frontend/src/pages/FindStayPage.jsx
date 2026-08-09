import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { isSupabaseConfigured } from '../lib/supabase';
import { listProperties, toggleSavedProperty, getSavedPropertyIds } from '../lib/supabaseData';
import { demoProperties, universities, colleges } from '../lib/demoCatalog';
import KolkataUniversityMap from '../components/ui/KolkataUniversityMap';

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
          <div className="flex justify-between items-start gap-md"><div><p className="font-label-caps text-label-caps text-electric-purple uppercase">Near {property.university}</p><Link to={`/property/${property.id}`}><h3 className="font-h3 text-h3 text-primary line-clamp-1 group-hover:underline decoration-2 underline-offset-4">{property.name}</h3></Link></div><div className="flex items-center gap-1 bg-surface border-2 border-primary px-2 py-0.5"><span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: 'FILL 1' }}>star</span><span className="font-label-caps text-label-caps text-primary">{property.rating}</span></div></div>
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
  const [catalog, setCatalog] = useState(demoProperties);
  const [savedIds, setSavedIds] = useState({});
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(isSupabaseConfigured);
  const [saveError, setSaveError] = useState('');
  const [catalogError, setCatalogError] = useState('');

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
    getSavedPropertyIds()
      .then((saved) => { if (active) setSavedIds(saved); })
      .catch(() => {});
    listProperties()
      .then((rows) => {
        if (!active) return;
        if (!rows.length) {
          setCatalog([]);
          return;
        }
        setCatalog(rows.map((row) => {
          const demo = demoProperties.find((d) => d.id === row.id) || {};
          return {
          id: row.id,
          university: row.universities?.name || 'Kolkata University',
          area: row.area,
          name: row.name,
          type: row.property_type === 'pg' ? 'PG' : 'Flat',
          distance: `${row.distance_to_university_km} km`,
          rating: row.profiles?.owner_rating != null ? String(row.profiles.owner_rating) : (demoProperties.find((d) => d.name === row.name)?.rating || '4.8'),
          price: `₹${Number(row.monthly_rent).toLocaleString('en-IN')}`,
          deposit: `₹${Number(row.security_deposit).toLocaleString('en-IN')}`,
          badge: row.is_ai_inspected ? 'AI Inspected' : '✓ Verified',
          badgeClass: row.is_ai_inspected ? 'bg-electric-purple text-white' : 'bg-acid-lime text-primary',
          amenities: row.amenities || [],
          image: row.cover_image_url || 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=85',
          lat: demo.lat,
          lng: demo.lng,
          };
        }));
      })
      .catch((err) => {
        if (!active) return;
        setCatalog([]);
        setCatalogError(err.message || 'We could not load live Kolkata listings. Please try again.');
      })
      .finally(() => { if (active) setIsLoadingCatalog(false); });
    return () => { active = false; };
  }, []);

  const filteredProperties = useMemo(() => catalog.filter((property) => {
    const query = searchQuery.toLowerCase();
    return (selectedUniversity === 'All Kolkata' || property.university === selectedUniversity)
      && (selectedType === 'All types' || property.type === selectedType)
      && (!query || `${property.name} ${property.area} ${property.university} ${property.type}`.toLowerCase().includes(query));
  }), [catalog, searchQuery, selectedUniversity, selectedType]);

  const handleSelectUniversity = (universityName) => {
    setSelectedUniversity(universityName);
    document.getElementById('property-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return <div>
    <section className="w-full px-margin-mobile lg:px-margin-desktop py-xl border-b-2 border-primary bg-surface flex flex-col gap-lg">
      {saveError && <div role="alert" className="border-2 border-error bg-error/10 p-md font-body-md text-error">{saveError}</div>}
      <div><p className="font-label-caps text-label-caps text-electric-purple uppercase mb-sm">KeyLo Kolkata rental guide</p><h1 className="font-heading text-h1-mobile md:text-h1 text-primary tracking-tight uppercase font-bold">Find your next place.</h1><p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">Browse verified flats and PGs grouped by the university you are studying near in Kolkata.</p></div>
      <div className="flex flex-col lg:flex-row gap-md items-start lg:items-center"><form className="relative w-full lg:w-[520px] h-[64px] border-2 border-primary bg-surface-container-lowest focus-within:ring-4 ring-acid-lime flex items-center pr-2" onSubmit={(event) => event.preventDefault()}><span className="material-symbols-outlined absolute left-4 text-primary">search</span><input id="rental-search" name="rentalSearch" className="w-full h-full pl-12 pr-4 bg-transparent outline-none font-body-lg text-body-lg text-primary placeholder:text-on-surface-variant" placeholder="Search university, area, PG, or flat..." type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} /><button type="submit" className="h-12 px-6 bg-primary text-on-primary font-label-caps text-label-caps border-2 border-primary whitespace-nowrap">Search</button></form><div className="flex gap-sm"><button onClick={() => setSelectedType('All types')} className={`px-md py-sm border-2 border-primary font-label-caps text-primary ${selectedType === 'All types' ? 'bg-acid-lime' : 'bg-surface-container-lowest'}`}>All types</button><button onClick={() => setSelectedType('PG')} className={`px-md py-sm border-2 border-primary font-label-caps text-primary ${selectedType === 'PG' ? 'bg-acid-lime' : 'bg-surface-container-lowest'}`}>PGs</button><button onClick={() => setSelectedType('Flat')} className={`px-md py-sm border-2 border-primary font-label-caps text-primary ${selectedType === 'Flat' ? 'bg-acid-lime' : 'bg-surface-container-lowest'}`}>Flats</button></div></div>
      <div className="flex gap-sm overflow-x-auto pb-xs" aria-label="Filter rentals by university">{universities.map((university) => <button key={university} onClick={() => setSelectedUniversity(university)} className={`shrink-0 px-md py-sm border-2 border-primary font-label-caps text-primary transition-colors ${selectedUniversity === university ? 'bg-acid-lime text-primary shadow-[-3px_3px_0px_0px_#000000]' : 'bg-surface-container-lowest hover:bg-acid-lime'}`}>{university === 'All Kolkata' ? university : `Near ${university}`}</button>)}</div>
    </section>
       <section className="w-full px-margin-mobile lg:px-margin-desktop py-xl border-b-2 border-primary bg-surface flex flex-col gap-xl" id="property-list">{catalogError && <div role="alert" className="border-2 border-error bg-error/10 p-md font-body-md text-error">{catalogError}</div>}<div className="flex flex-wrap items-center justify-between gap-md pb-sm border-b-2 border-primary"><span className="font-label-caps text-label-caps text-primary">{isLoadingCatalog ? 'Loading live Kolkata stays...' : `Showing ${filteredProperties.length} ${filteredProperties.length === 1 ? 'stay' : 'stays'} near ${selectedUniversity === 'All Kolkata' ? 'Kolkata universities' : selectedUniversity}`}</span><span className="font-label-caps text-label-caps text-on-surface-variant">Sorted by university distance</span></div>{filteredProperties.length ? filteredProperties.map((property) => <PropertyCard key={property.id} property={property} saved={Boolean(savedIds[property.id])} onToggleSave={() => handleToggleSave(property.id)} />) : <div className="py-xl text-center"><h2 className="font-h3 text-h3 text-primary">No stays found</h2><p className="font-body-md text-on-surface-variant mt-sm">Try another Kolkata university, area, or rental type.</p></div>}</section>
    <section className="w-full py-xl border-b-2 border-primary bg-surface flex flex-col gap-lg" aria-label="Kolkata university rental map">
      <div className="px-margin-mobile lg:px-margin-desktop flex flex-wrap items-end justify-between gap-md">
        <div>
          <p className="font-label-caps text-label-caps text-electric-purple uppercase mb-sm">Campus map</p>
          <h2 className="font-h2 text-h2 text-primary uppercase tracking-tight">Kolkata University Rental Map</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs max-w-2xl">Campuses are highlighted on the map — tap a pin to jump to stays near that college, or tap a stay to open it.</p>
        </div>
        <div className="flex flex-wrap gap-sm">{['Adamas University', 'Jadavpur University', 'University of Calcutta', "St. Xavier's University Kolkata"].map((university) => <button key={university} onClick={() => handleSelectUniversity(university)} className={`px-md py-sm border-2 border-primary font-label-caps text-primary transition-colors ${selectedUniversity === university ? 'bg-acid-lime shadow-[-3px_3px_0px_0px_#000000]' : 'bg-surface-container-lowest hover:bg-acid-lime'}`}>Near {university}</button>)}</div>
      </div>
      <div className="px-margin-mobile lg:px-margin-desktop">
        <KolkataUniversityMap properties={catalog} colleges={colleges} selectedUniversity={selectedUniversity} onSelectUniversity={handleSelectUniversity} />
      </div>
    </section>
  </div>;
}
