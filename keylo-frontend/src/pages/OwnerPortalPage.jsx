export default function OwnerPortalPage() {
  return (
    <div className="bg-surface-container-low font-body-md text-on-surface">
      {/* Ambient Background */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary rounded-full blur-[120px] opacity-10 -z-10 mix-blend-multiply"></div>
      <div className="absolute top-1/2 -left-32 w-72 h-72 bg-acid-lime rounded-full blur-[100px] opacity-10 -z-10 mix-blend-multiply"></div>

      <section className="flex flex-col gap-sm">
        <div className="flex items-baseline gap-sm">
          <h1 className="font-heading text-h1-mobile md:text-h1 text-on-surface font-bold">Good morning</h1>
          <span className="font-h2 text-h2">👋</span>
        </div>
        <p className="font-body-lg text-body-lg text-on-surface-variant" style={{ maxWidth: '672px' }}>
          Here is what's happening with your properties today. Revenue is up{' '}
          <span className="text-electric-purple font-bold">+12%</span> compared to last month.
        </p>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter w-full">
        <div className="bg-surface-container border-2 border-primary p-lg flex flex-col gap-md relative overflow-hidden group hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              Total Properties
            </span>
            <span className="material-symbols-outlined text-primary">apartment</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="font-price-display text-price-display text-on-surface">12</span>
            <span className="font-body-md text-body-md text-on-surface-variant">Active</span>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-acid-lime rounded-full opacity-0 group-hover:opacity-20 transition-opacity blur-xl"></div>
        </div>

        <div className="bg-surface-container border-2 border-primary p-lg flex flex-col gap-md relative overflow-hidden group hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              Total Rooms
            </span>
            <span className="material-symbols-outlined text-primary">meeting_room</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="font-price-display text-price-display text-on-surface">86</span>
            <span className="font-body-md text-body-md text-on-surface-variant">Listed</span>
          </div>
        </div>

        <div className="bg-surface-container border-2 border-primary p-lg flex flex-col gap-md relative overflow-hidden group hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              Occupancy Rate
            </span>
            <span className="material-symbols-outlined text-primary">group</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="font-price-display text-price-display text-on-surface">94%</span>
            <span className="font-body-md text-body-md text-electric-purple font-bold">↑ 2%</span>
          </div>
          <div className="w-full bg-outline-variant h-1 mt-2">
            <div className="bg-acid-lime h-full w-[94%]"></div>
          </div>
        </div>

        <div className="bg-primary text-on-primary border-2 border-primary p-lg flex flex-col gap-md relative overflow-hidden group hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="font-label-caps text-label-caps text-on-primary/70 uppercase">
              Est. Revenue
            </span>
            <span className="material-symbols-outlined text-on-primary">payments</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="font-price-display text-price-display text-on-primary">₹7.4L</span>
            <span className="font-body-md text-body-md text-acid-lime">This Mo.</span>
          </div>
          <svg className="absolute bottom-0 right-0 w-32 h-16 opacity-50" preserveAspectRatio="none" viewBox="0 0 100 50">
            <path d="M0 50 L20 40 L40 45 L60 20 L80 30 L100 10 L100 50 Z" fill="#C7F000" opacity="0.2"></path>
            <path d="M0 50 L20 40 L40 45 L60 20 L80 30 L100 10" fill="none" stroke="#C7F000" strokeWidth="2"></path>
          </svg>
        </div>
      </section>

      <div className="w-full h-px bg-outline-variant"></div>

      {/* Revenue Performance & Quick Actions */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-xl w-full">
        <div className="lg:col-span-2 flex flex-col gap-lg">
          <div className="flex items-center justify-between">
            <h2 className="font-h2 text-h2 text-on-surface">Revenue Performance</h2>
            <button className="bg-surface-container border-2 border-primary px-md py-sm font-label-caps text-label-caps text-on-surface hover:bg-acid-lime transition-colors">
              Export CSV
            </button>
          </div>
          <div className="w-full bg-surface-container border-2 border-primary p-lg h-[400px] flex flex-col justify-end relative">
            <div className="absolute top-lg right-lg flex gap-md">
              <div className="flex items-center gap-xs">
                <div className="w-3 h-3 bg-electric-purple"></div>
                <span className="font-label-caps text-label-caps text-on-surface-variant">Revenue</span>
              </div>
              <div className="flex items-center gap-xs">
                <div className="w-3 h-3 bg-acid-lime"></div>
                <span className="font-label-caps text-label-caps text-on-surface-variant">Expenses</span>
              </div>
            </div>
            <svg className="w-full h-full pt-12" preserveAspectRatio="none" viewBox="0 0 800 300">
              <g className="text-outline-variant" stroke="currentColor" strokeDasharray="4,4" strokeWidth="1">
                <line x1="0" x2="800" y1="50" y2="50"></line>
                <line x1="0" x2="800" y1="125" y2="125"></line>
                <line x1="0" x2="800" y1="200" y2="200"></line>
                <line x1="0" x2="800" y1="275" y2="275"></line>
              </g>
              <path d="M0 250 L100 200 L200 220 L300 150 L400 180 L500 100 L600 120 L700 50 L800 80 L800 300 L0 300 Z" fill="#7C3AED" opacity="0.1"></path>
              <path d="M0 250 L100 200 L200 220 L300 150 L400 180 L500 100 L600 120 L700 50 L800 80" fill="none" stroke="#7C3AED" strokeWidth="4"></path>
              <path d="M0 280 L100 270 L200 260 L300 275 L400 250 L500 265 L600 240 L700 255 L800 230" fill="none" stroke="#C7F000" strokeWidth="4"></path>
            </svg>
            <div className="flex justify-between mt-sm font-label-caps text-label-caps text-on-surface-variant px-sm">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-lg">
          <h2 className="font-h2 text-h2 text-on-surface">Quick Actions</h2>
          <div className="flex flex-col gap-sm">
            <button className="w-full bg-surface-container border-2 border-primary p-md flex items-center justify-between group hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] hover:bg-acid-lime transition-all">
              <div className="flex items-center gap-md">
                <span className="material-symbols-outlined text-primary">add_business</span>
                <span className="font-h3 text-h3 text-on-surface">Add Property</span>
              </div>
              <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
            <button className="w-full bg-surface-container border-2 border-primary p-md flex items-center justify-between group hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] transition-all">
              <div className="flex items-center gap-md">
                <span className="material-symbols-outlined text-primary">person_add</span>
                <span className="font-h3 text-h3 text-on-surface">Invite Tenant</span>
              </div>
              <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
            <button className="w-full bg-surface-container border-2 border-primary p-md flex items-center justify-between group hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] transition-all">
              <div className="flex items-center gap-md">
                <span className="material-symbols-outlined text-primary">receipt_long</span>
                <span className="font-h3 text-h3 text-on-surface">View Invoices</span>
              </div>
              <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
            <div className="mt-md p-md border-2 border-primary bg-electric-purple text-on-primary flex flex-col gap-md relative overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-20">
                <span className="material-symbols-outlined text-[80px]">auto_awesome</span>
              </div>
              <h3 className="font-h3 text-h3 relative z-10">AI Insights</h3>
              <p className="font-body-md text-body-md relative z-10 text-on-primary/90">
                Based on current market trends, consider adjusting rent for{' '}
                <span className="font-bold underline">Skyline Heights</span> by +5% next cycle.
              </p>
              <button className="self-start mt-sm font-label-caps text-label-caps border-b-2 border-on-primary pb-xs hover:text-acid-lime hover:border-acid-lime transition-colors relative z-10">
                Review Market Data
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Table */}
      <section className="flex flex-col gap-lg mt-xl">
        <div className="flex overflow-x-auto border-b-2 border-primary hide-scrollbar">
          <button className="px-lg py-md font-label-caps text-label-caps text-primary bg-acid-lime border-t-2 border-l-2 border-r-2 border-primary relative top-[2px]">Properties</button>
          <button className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary">Tenants</button>
          <button className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary">Rentals</button>
          <button className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary">Deposits</button>
          <button className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary">Claims</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {/* Property 1 */}
          <div className="bg-surface-container border-2 border-primary flex flex-col group hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] transition-all">
            <div className="h-48 w-full bg-cover bg-center border-b-2 border-primary" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCpExGbXyraqpksKphCniratWPE67-OzfaUw_nT01UxaI4Zo37Mh7YU8nIMNR6C7Cs4SmaCKbLoMZMC9RkJxLwuimwo9xvguiUDtr3l3z0IQcgdkH2TKmdXAiExQPEOo7c1KR4Y-MVC34tgGJYUZsQh79kkAY3zRLUMdhxmza44C3-1XGJuof7elSGKavEp2Q19XHbrGyunxk6V3U7QP1931cbLCQZUA1Uk1_q2QcquReiosdHUHTJW')" }}></div>
            <div className="p-md flex flex-col gap-sm">
              <div className="flex justify-between items-start">
                <h3 className="font-h3 text-h3 text-on-surface">Skyline Heights</h3>
                <span className="bg-acid-lime text-primary px-xs py-xs font-label-caps text-[10px] border border-primary">100% OCCUPIED</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">42 Units • Barasat, Kolkata</p>
              <div className="mt-md flex gap-sm">
                <button className="flex-1 bg-surface border-2 border-primary py-sm font-label-caps text-label-caps text-primary hover:bg-surface-dim transition-colors">Manage</button>
                <button className="p-sm bg-surface border-2 border-primary text-primary hover:bg-surface-dim transition-colors">
                  <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                </button>
              </div>
            </div>
          </div>

          {/* Property 2 */}
          <div className="bg-surface-container border-2 border-primary flex flex-col group hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] transition-all">
            <div className="h-48 w-full bg-cover bg-center border-b-2 border-primary" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC2AYdJX5fETmEYlAYH5m_cVhrNS8KOTaECGx5H4Vkn0e8z8s4J6VC1JoHVStlZBcK2jCWqKZ-u7Hg8LsFPSe1HPdzzntsro7OOFP6PMW9fFrWr_JmRdwqbH6vrVgD63dRxFB0GQ5imm46N-olklHzt03L8MPoOYYdJ5DwdtOWD7gKoJffG0X778C3Aiqha1M2AUQvWFrYEMjOunBdKudHpvT9mmX_v3lj_m1XIADLQirwNbG8uZEFE')" }}></div>
            <div className="p-md flex flex-col gap-sm">
              <div className="flex justify-between items-start">
                <h3 className="font-h3 text-h3 text-on-surface">The Hive Co-living</h3>
                <span className="bg-hot-pink text-white px-xs py-xs font-label-caps text-[10px] border border-primary">2 VACANCIES</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">24 Units • Jadavpur, Kolkata</p>
              <div className="mt-md flex gap-sm">
                <button className="flex-1 bg-surface border-2 border-primary py-sm font-label-caps text-label-caps text-primary hover:bg-surface-dim transition-colors">Manage</button>
                <button className="p-sm bg-surface border-2 border-primary text-primary hover:bg-surface-dim transition-colors">
                  <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                </button>
              </div>
            </div>
          </div>

          {/* Property 3 - Add New */}
          <div className="bg-surface-container border-2 border-primary flex flex-col group hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] transition-all">
            <div className="h-48 w-full bg-cover bg-center border-b-2 border-primary flex items-center justify-center bg-surface-dim">
              <span className="material-symbols-outlined text-[48px] text-outline-variant">add_photo_alternate</span>
            </div>
            <div className="p-md flex flex-col gap-sm">
              <div className="flex justify-between items-start">
                <h3 className="font-h3 text-h3 text-on-surface">Greenwood Block</h3>
                <span className="bg-electric-purple text-white px-xs py-xs font-label-caps text-[10px] border border-primary">ONBOARDING</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">20 Units • New Town, Kolkata</p>
              <div className="mt-md flex gap-sm">
                <button className="flex-1 bg-acid-lime border-2 border-primary py-sm font-label-caps text-label-caps text-primary hover:bg-[#b0d400] transition-colors">Complete Setup</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
