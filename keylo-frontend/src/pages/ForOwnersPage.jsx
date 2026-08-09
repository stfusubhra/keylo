import { Link } from 'react-router-dom';

const features = [
  {
    icon: 'apartment',
    title: 'List Properties',
    desc: 'Create detailed listings with photos, pricing, and amenities. Reach verified tenants actively looking for housing.',
    color: 'bg-acid-lime',
  },
  {
    icon: 'group',
    title: 'Find Tenants',
    desc: 'Connect with legitimate, verified tenants. Review profiles and rental history before accepting.',
    color: 'bg-electric-purple',
  },
  {
    icon: 'description',
    title: 'Digital Agreements',
    desc: 'Create clear rental agreements with digital signatures. Blockchain-verified for a tamper-resistant record.',
    color: 'bg-primary',
  },
  {
    icon: 'payments',
    title: 'Reliable Payments',
    desc: 'Receive rent on time with UPI payments. Automatic tracking and records for every transaction.',
    color: 'bg-acid-lime',
  },
  {
    icon: 'shield_locked',
    title: 'Deposit Protection',
    desc: 'Security deposits held in escrow according to agreement terms. Protection for both you and your tenant.',
    color: 'bg-electric-purple',
  },
  {
    icon: 'build',
    title: 'Maintenance Management',
    desc: 'Receive and track maintenance requests from tenants. Resolve issues quickly with a clear status trail.',
    color: 'bg-primary',
  },
];

const stats = [
  { value: '500+', label: 'Active Listings' },
  { value: '1,200+', label: 'Verified Tenants' },
  { value: '₹2.4Cr', label: 'Rent Processed' },
  { value: '99.2%', label: 'On-time Payments' },
];

const landlordCommissionRate = 5;

export default function ForOwnersPage() {
  return (
    <div className="bg-surface-container-low font-body-md text-on-surface">
      {/* Hero */}
      <section className="w-full bg-surface px-margin-mobile lg:px-margin-desktop py-xl lg:py-[120px] border-b-2 border-primary relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path className="text-primary" d="M0,100 L100,0 L100,100 Z" fill="currentColor" />
          </svg>
        </div>
        <div className="max-w-5xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-xl items-center">
          <div>
            <div className="inline-flex items-center gap-sm mb-lg px-md py-sm bg-primary text-on-primary rounded-full border-2 border-primary shadow-[4px_4px_0px_0px_#000000]">
              <span className="material-symbols-outlined text-sm">business</span>
              <span className="font-label-caps text-label-caps tracking-widest uppercase">For Landlords</span>
            </div>
            <h1 className="font-heading text-h1-mobile lg:text-h1 text-primary mb-lg leading-none tracking-tighter font-bold">
              Manage properties.<br />
              <span className="relative inline-block">
                Find tenants.
                <div className="absolute -bottom-2 left-0 w-full h-4 bg-[#C7F000] -z-10 rotate-1" />
              </span>
              <br />
              Stay protected.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl text-balance leading-relaxed" style={{ maxWidth: '520px' }}>
              KeyLo makes property management simpler and more trustworthy. List your properties, create digital agreements, receive reliable UPI payments, and protect yourself against disputes — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-md">
              <Link to="/signup" className="px-8 py-4 bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000000] transition-all flex items-center justify-center gap-2">
                START LISTING <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <Link to="/how-it-works" className="px-8 py-4 bg-surface-container-lowest border-2 border-primary font-label-caps text-label-caps text-primary hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000000] transition-all flex items-center justify-center">
                SEE HOW IT WORKS
              </Link>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-surface-container-lowest border-2 border-primary p-xl shadow-[8px_8px_0px_0px_#000000]">
            <h3 className="font-h3 text-h3 text-primary mb-lg uppercase">KeyLo by the Numbers</h3>
            <div className="grid grid-cols-2 gap-lg">
              {stats.map((stat) => (
                <div key={stat.label} className="border-2 border-primary p-md bg-surface">
                  <p className="font-price-display text-price-display text-primary">{stat.value}</p>
                  <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mt-xs">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full px-margin-mobile lg:px-margin-desktop py-xl">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-xl">
            <h2 className="font-h2 text-h2 text-primary mb-md uppercase tracking-tight">Everything you need to manage rentals</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mx-auto text-balance leading-relaxed" style={{ maxWidth: '672px' }}>
              From listing to lease completion, KeyLo handles the entire rental lifecycle so you can focus on what matters.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {features.map((feature) => (
              <div key={feature.title} className="group bg-surface border-2 border-primary p-lg hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_#000000] transition-all cursor-pointer">
                <div className={`w-12 h-12 ${feature.color} border-2 border-primary flex items-center justify-center mb-md group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined text-primary">{feature.icon}</span>
                </div>
                <h3 className="font-h3 text-h3 text-primary mb-xs uppercase">{feature.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works for Owners */}
      <section className="w-full bg-surface px-margin-mobile lg:px-margin-desktop py-xl border-y-2 border-primary">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-h2 text-h2 text-primary mb-xl uppercase tracking-tight text-center">How It Works for Owners</h2>
          <div className="flex flex-col gap-lg">
              {[
              { step: '1', title: 'List Your Property', desc: 'Create a listing with photos, rent, deposit, and amenities. Set your terms and availability.' },
              { step: '2', title: 'Review Tenants', desc: 'Receive applications from verified tenants. Review profiles, rental history, and documents before accepting.' },
              { step: '3', title: 'Create Agreement', desc: 'Generate a digital rental agreement with clear terms. The tenant reviews and signs digitally.' },
              { step: '4', title: 'Receive Payments', desc: 'Tenant pays deposit and rent via UPI. KeyLo deducts the 5% success fee from collected rent and records every payment.' },
              { step: '5', title: 'Manage & Maintain', desc: 'Track rent payments, manage maintenance requests, and access all documents from one dashboard.' },
              { step: '6', title: 'Complete Lease', desc: 'When the lease ends, guide the tenant through deposit release. Disputes are handled fairly through KeyLo.' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-md bg-surface-container-lowest border-2 border-primary p-lg shadow-[4px_4px_0px_0px_#000000]">
                <div className="w-12 h-12 bg-primary text-on-primary border-2 border-primary flex items-center justify-center font-h3 text-h3 flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-h3 text-h3 text-primary mb-xs">{item.title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue Model */}
      <section className="w-full px-margin-mobile lg:px-margin-desktop py-xl bg-surface border-y-2 border-primary">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-xl">
            <p className="font-label-caps text-label-caps text-electric-purple uppercase mb-sm">No subscriptions. No monthly plans.</p>
            <h2 className="font-h2 text-h2 text-primary uppercase tracking-tight">KeyLo earns when a rental happens.</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-md max-w-2xl mx-auto">Landlords pay a small success fee on collected rent, while tenants pay a one-time KeyLo fee on their first booking.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            <div className="bg-surface-container-lowest border-2 border-primary p-lg shadow-[4px_4px_0px_0px_#000000]">
              <span className="material-symbols-outlined text-electric-purple text-h2 mb-md">business</span>
              <h3 className="font-h3 text-h3 text-primary uppercase mb-sm">Landlord success fee</h3>
              <p className="font-price-display text-price-display text-primary mb-sm">{landlordCommissionRate}% of rent</p>
              <p className="font-body-md text-body-md text-on-surface-variant">Only charged when KeyLo helps fill and manage a rental. No listing subscription and no recurring platform plan.</p>
            </div>
            <div className="bg-primary text-on-primary border-2 border-primary p-lg shadow-[4px_4px_0px_0px_#C7F000]">
              <span className="material-symbols-outlined text-acid-lime text-h2 mb-md">receipt_long</span>
              <h3 className="font-h3 text-h3 text-acid-lime uppercase mb-sm">Tenant first-booking fee</h3>
              <p className="font-price-display text-price-display text-on-primary mb-sm">One-time fee</p>
              <p className="font-body-md text-body-md text-on-primary/80">A transparent fee is shown at checkout only on the tenant's first KeyLo booking. Future rent payments have no subscription charge.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-primary px-margin-mobile lg:px-margin-desktop py-xl border-t-2 border-primary">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-h2 text-h2 text-on-primary mb-md uppercase tracking-tight">Ready to list your properties?</h2>
          <p className="font-body-lg text-body-lg text-on-primary/70 mb-xl text-balance leading-relaxed">Join hundreds of landlords managing their rentals smarter with KeyLo.</p>
          <Link to="/signup" className="inline-flex px-8 py-4 bg-acid-lime border-2 border-on-primary font-label-caps text-label-caps text-primary hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#ffffff] transition-all items-center gap-2">
            CREATE OWNER ACCOUNT <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
