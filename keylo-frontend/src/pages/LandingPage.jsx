import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to find a stay with search query
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center pt-24 pb-16 px-margin-mobile md:px-margin-desktop z-10 overflow-hidden">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-xl">
          {/* Text Content */}
          <div className="lg:col-span-6 flex flex-col justify-center relative z-20 order-2 lg:order-1">
            <h1 className="font-heading text-h1-mobile md:text-h1 text-on-surface mb-6 uppercase leading-[0.95] tracking-tighter font-bold">
              Your Space.<br />
              Your Rules.<br />
              <span className="bg-acid-lime px-4 py-2 mt-4 inline-block transform -rotate-2 border-2 border-primary shadow-[8px_8px_0px_0px_#000000]">keylo</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 text-balance leading-relaxed" style={{ maxWidth: '520px' }}>
              Find verified student homes near Kolkata universities, rent what you need, and keep your security deposit protected — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/find-a-stay" className="px-8 py-4 bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000000] transition-all flex items-center justify-center gap-2">
                FIND MY SPACE <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
              <Link to="/rentals" className="px-8 py-4 bg-surface-container-lowest border-2 border-primary font-label-caps text-label-caps text-primary hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000000] transition-all flex items-center justify-center">
                EXPLORE RENTALS
              </Link>
            </div>
            {/* Floating Badges */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-electric-purple text-white border-2 border-primary rounded-full font-label-caps text-[10px]">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                AI INSPECTED
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-acid-lime text-primary border-2 border-primary rounded-full font-label-caps text-[10px]">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                DEPOSIT PROTECTED
              </div>
            </div>
          </div>

          {/* Visual Area */}
          <div className="lg:col-span-6 relative h-[500px] lg:h-[700px] order-1 lg:order-2">
            <div className="absolute inset-0 bg-surface-container-highest border-2 border-primary overflow-hidden shadow-[12px_12px_0px_0px_#000000] transform lg:rotate-2 group">
              <img
                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=85"
                alt="A modern, highly aesthetic student dormitory room bathed in natural morning light"
              />
              {/* UI Overlay 1 */}
              <div className="absolute top-8 left-[-20px] bg-surface-container-lowest border-2 border-primary p-4 shadow-[4px_4px_0px_0px_#000000] flex items-center gap-3 animate-pulse" style={{ animationDuration: '3s' }}>
                <span className="material-symbols-outlined text-[#7C3AED] text-3xl">verified</span>
                <div>
                  <p className="font-label-caps text-[10px] text-on-surface-variant">Status</p>
                  <p className="font-h3 text-[16px] text-primary">Verified Property</p>
                </div>
              </div>
              {/* UI Overlay 2 */}
              <div className="absolute bottom-12 right-[-10px] bg-[#FF3366] border-2 border-primary px-4 py-2 shadow-[4px_4px_0px_0px_#000000] flex items-center gap-2 transform -rotate-3">
                <span className="material-symbols-outlined text-white text-xl">bolt</span>
                <p className="font-label-caps text-white">Instant Booking</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="w-full bg-primary py-20 px-margin-mobile md:px-margin-desktop relative z-10 border-y-2 border-primary">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <h2 className="font-h2 text-h2 text-on-primary mb-10 text-center uppercase tracking-tight">Where are you studying in Kolkata?</h2>
          <div className="w-full flex flex-col gap-4">
            <div className="relative w-full h-[72px] bg-surface-container-lowest border-2 border-primary shadow-[8px_8px_0px_0px_#C7F000] group focus-within:ring-4 ring-[#C7F000] ring-offset-0 transition-all flex items-center pr-2">
              <span className="material-symbols-outlined absolute left-4 text-primary">search</span>
              <input
                className="w-full h-full pl-12 pr-4 bg-transparent outline-none font-body-lg text-primary placeholder:text-on-surface-variant"
                placeholder="Search Adamas, Jadavpur, Calcutta University..."
                type="text"
                value={searchQuery}
                onChange={handleSearch}
              />
              <button className="h-12 px-6 bg-primary text-on-primary font-label-caps text-label-caps border-2 border-primary hover:bg-surface-container-lowest hover:text-primary transition-colors whitespace-nowrap" onClick={handleSearchSubmit}>
                SEARCH
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <button className="px-5 py-2.5 bg-surface-container-lowest border-2 border-primary font-label-caps text-primary hover:bg-acid-lime transition-colors rounded-full flex items-center gap-2 shadow-[2px_2px_0px_0px_#000000]">
                <span className="material-symbols-outlined text-[18px]">bed</span>
                Stay
              </button>
              <button className="px-5 py-2.5 bg-surface-container-lowest border-2 border-primary font-label-caps text-primary hover:bg-acid-lime transition-colors rounded-full flex items-center gap-2 shadow-[2px_2px_0px_0px_#000000]">
                <span className="material-symbols-outlined text-[18px]">electric_scooter</span>
                Mobility
              </button>
              <button className="px-5 py-2.5 bg-surface-container-lowest border-2 border-primary font-label-caps text-primary hover:bg-acid-lime transition-colors rounded-full flex items-center gap-2 shadow-[2px_2px_0px_0px_#000000]">
                <span className="material-symbols-outlined text-[18px]">devices</span>
                Electronics
              </button>
              <button className="px-5 py-2.5 bg-surface-container-lowest border-2 border-primary font-label-caps text-primary hover:bg-acid-lime transition-colors rounded-full flex items-center gap-2 shadow-[2px_2px_0px_0px_#000000]">
                <span className="material-symbols-outlined text-[18px]">chair</span>
                Furniture
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 px-margin-mobile md:px-margin-desktop bg-surface relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6 border-b-2 border-primary pb-8">
            <h2 className="font-h2 text-h2 text-primary uppercase leading-tight tracking-tight" style={{ maxWidth: '480px' }}>Everything students need, in one place.</h2>
            <p className="font-body-md text-on-surface-variant text-balance" style={{ maxWidth: '384px' }}>No more dealing with multiple brokers or sketchy listings. Rent your entire lifestyle securely.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <Link to="/find-a-stay" className="group bg-surface-container-lowest border-2 border-primary h-full flex flex-col hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_#000000] transition-all cursor-pointer">
              <div className="h-48 w-full border-b-2 border-primary bg-surface-container-highest relative overflow-hidden">
                <img
                  className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                  src="https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=85"
                  alt="A bright, minimalist student PG room interior"
                />
                <div className="absolute top-3 left-3 w-10 h-10 bg-acid-lime border-2 border-primary rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_#000000]">
                  <span className="material-symbols-outlined text-primary">real_estate_agent</span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-h3 text-[20px] text-primary mb-2 uppercase">Find a Home</h3>
                <p className="font-body-md text-on-surface-variant text-sm mb-4">PGs, Hostels, &amp; Co-living spaces verified for students.</p>
                <div className="mt-auto flex items-center gap-1 font-label-caps text-primary group-hover:text-electric-purple transition-colors">
                  Explore Spaces <span className="material-symbols-outlined text-sm">arrow_outward</span>
                </div>
              </div>
            </Link>

            {/* Card 2 */}
            <Link to="/rentals" className="group bg-surface-container-lowest border-2 border-primary h-full flex flex-col hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_#000000] transition-all cursor-pointer mt-0 lg:mt-8">
              <div className="h-48 w-full border-b-2 border-primary bg-surface-container-highest relative overflow-hidden">
                <img
                  className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                  src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=85"
                  alt="A sleek electric scooter parked against a brutalist concrete wall"
                />
                <div className="absolute top-3 left-3 w-10 h-10 bg-[#FF3366] border-2 border-primary rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_#000000]">
                  <span className="material-symbols-outlined text-white">two_wheeler</span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-h3 text-[20px] text-primary mb-2 uppercase">Rent Mobility</h3>
                <p className="font-body-md text-on-surface-variant text-sm mb-4">Electric scooters &amp; bikes for easy campus commutes.</p>
                <div className="mt-auto flex items-center gap-1 font-label-caps text-primary group-hover:text-[#FF3366] transition-colors">
                  View Rides <span className="material-symbols-outlined text-sm">arrow_outward</span>
                </div>
              </div>
            </Link>

            {/* Card 3 */}
            <Link to="/rentals" className="group bg-surface-container-lowest border-2 border-primary h-full flex flex-col hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_#000000] transition-all cursor-pointer">
              <div className="h-48 w-full border-b-2 border-primary bg-surface-container-highest relative overflow-hidden">
                <img
                  className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                  src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=85"
                  alt="Close up of a premium laptop and tablet on a clean white desk setup"
                />
                <div className="absolute top-3 left-3 w-10 h-10 bg-[#00E5FF] border-2 border-primary rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_#000000]">
                  <span className="material-symbols-outlined text-primary">laptop_mac</span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-h3 text-[20px] text-primary mb-2 uppercase">Rent Essentials</h3>
                <p className="font-body-md text-on-surface-variant text-sm mb-4">Laptops, monitors, and study gear without the heavy price tag.</p>
                <div className="mt-auto flex items-center gap-1 font-label-caps text-primary group-hover:text-[#00E5FF] transition-colors">
                  Browse Tech <span className="material-symbols-outlined text-sm">arrow_outward</span>
                </div>
              </div>
            </Link>

            {/* Card 4 */}
            <Link to="/keylo-vault" className="group bg-[#7C3AED] border-2 border-primary h-full flex flex-col hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_#000000] transition-all cursor-pointer mt-0 lg:mt-8">
              <div className="h-48 w-full border-b-2 border-primary relative overflow-hidden bg-primary">
                <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(199,240,0,0.2)_50%,transparent_100%)] animate-[scan_3s_ease-in-out_infinite]"></div>
                <img
                  className="w-full h-full object-cover opacity-60"
                  src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=85"
                  alt="Abstract rendering of digital security"
                />
                <div className="absolute top-3 left-3 w-10 h-10 bg-white border-2 border-primary rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_#000000]">
                  <span className="material-symbols-outlined text-[#7C3AED]">shield_locked</span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-h3 text-[20px] text-white mb-2 uppercase">Stay Protected</h3>
                <p className="font-body-md text-white/80 text-sm mb-4">AI-inspected properties and secure deposit management.</p>
                <div className="mt-auto flex items-center gap-1 font-label-caps text-[#C7F000]">
                  Learn More <span className="material-symbols-outlined text-sm">arrow_outward</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
