import { Link } from 'react-router-dom';

const features = [
  {
    icon: 'storefront',
    title: 'List in Minutes',
    desc: 'Create a listing with photos, pricing (daily or monthly), deposit, and availability. Publish instantly from your phone.',
    color: 'bg-acid-lime',
  },
  {
    icon: 'category',
    title: 'Any Gear, Any Budget',
    desc: 'From bikes and cameras to laptops, gaming setups, sports equipment, furniture, and event gear — if you own it, you can list it.',
    color: 'bg-electric-purple',
  },
  {
    icon: 'verified_user',
    title: 'Verified Renters',
    desc: 'Review renter profiles, rental history, and documents before approving any request. Only accept who you trust.',
    color: 'bg-primary',
  },
  {
    icon: 'payments',
    title: 'Reliable Payouts',
    desc: 'Rental amounts are collected securely via UPI with automatic tracking and a clear record of every transaction.',
    color: 'bg-acid-lime',
  },
  {
    icon: 'shield_locked',
    title: 'Deposit Protection',
    desc: 'Security deposits are held in the KeyLo Vault and only released after the item is returned and checked.',
    color: 'bg-electric-purple',
  },
  {
    icon: 'calendar_month',
    title: 'Full Control',
    desc: 'Set availability, pricing rules, and handover terms. Pause or delete a listing anytime from your dashboard.',
    color: 'bg-primary',
  },
];

const stats = [
  { value: '200+', label: 'Active Listings' },
  { value: '1,000+', label: 'Verified Renters' },
  { value: '₹1.1Cr', label: 'Rental Value Processed' },
  { value: '11', label: 'Categories to List In' },
];

const platformFeeRate = 5;

export default function ForListersPage() {
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
              <span className="material-symbols-outlined text-sm">storefront</span>
              <span className="font-label-caps text-label-caps tracking-widest uppercase">For Listers</span>
            </div>
            <h1 className="font-heading text-h1-mobile lg:text-h1 text-primary mb-lg leading-none tracking-tighter font-bold">
              List your gear.<br />
              <span className="relative inline-block">
                Earn from it.
                <div className="absolute -bottom-2 left-0 w-full h-4 bg-[#C7F000] -z-10 rotate-1" />
              </span>
              <br />
              Keep it protected.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl text-balance leading-relaxed" style={{ maxWidth: '520px' }}>
              KeyLo's peer-to-peer rental marketplace turns your idle bikes, cameras, laptops, and more into income. List once, get verified requests, and get paid securely — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-md">
              <Link to="/lister/signup" className="px-8 py-4 bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000000] transition-all flex items-center justify-center gap-2">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
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
            <h2 className="font-h2 text-h2 text-primary mb-md uppercase tracking-tight">Everything you need to rent out your stuff</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mx-auto text-balance leading-relaxed" style={{ maxWidth: '672px' }}>
              From listing to payout, KeyLo handles the entire rental lifecycle so your gear earns while you don't use it.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {features.map((feature) => (
              <div key={feature.title} className="group bg-surface border-2 border-primary p-lg hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_#000000] transition-all cursor-pointer">
                <div className={`w-12 h-12 ${feature.color} border-2 border-primary flex items-center justify-center mb-md group-hover:scale-110 transition-transform`}>
                  <span className={`material-symbols-outlined ${feature.color === 'bg-primary' ? 'text-on-primary' : 'text-primary'}`}>{feature.icon}</span>
                </div>
                <h3 className="font-h3 text-h3 text-primary mb-xs uppercase">{feature.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works for Listers */}
      <section className="w-full bg-surface px-margin-mobile lg:px-margin-desktop py-xl border-y-2 border-primary">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-h2 text-h2 text-primary mb-xl uppercase tracking-tight text-center">How It Works for Listers</h2>
          <div className="flex flex-col gap-lg">
              {[
              { step: '1', title: 'List Your Item', desc: 'Add photos, pricing (daily or monthly), deposit, and availability. Set your terms and publish instantly.' },
              { step: '2', title: 'Receive Requests', desc: 'Renters send booking requests on your listing. Review their profile, history, and documents before approving.' },
              { step: '3', title: 'Approve & Handover', desc: 'Accept a request and hand over the item. Record the handover digitally so there is proof of condition.' },
              { step: '4', title: 'Get Paid', desc: 'Rental amounts are collected via UPI. KeyLo deducts the 5% platform fee and you receive the rest.' },
              { step: '5', title: 'Track & Manage', desc: 'Follow active rentals, earnings, and availability from your lister dashboard. Pause or update listings anytime.' },
              { step: '6', title: 'Return & Review', desc: 'When the item comes back, the condition is checked. Deposits are released or disputes are handled fairly through KeyLo.' },
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
            <h2 className="font-h2 text-h2 text-primary uppercase tracking-tight">KeyLo earns when your item gets rented.</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-md max-w-2xl mx-auto">Listers keep most of the rental value, while renters pay a transparent platform fee at checkout.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            <div className="bg-surface-container-lowest border-2 border-primary p-lg shadow-[4px_4px_0px_0px_#000000]">
              <span className="material-symbols-outlined text-electric-purple text-h2 mb-md">storefront</span>
              <h3 className="font-h3 text-h3 text-primary uppercase mb-sm">Lister payout</h3>
              <p className="font-price-display text-price-display text-primary mb-sm">{100 - platformFeeRate}% of every rental</p>
              <p className="font-body-md text-body-md text-on-surface-variant">Only a {platformFeeRate}% platform fee is charged when your item is actually rented. No listing subscription and no recurring plan.</p>
            </div>
            <div className="bg-primary text-on-primary border-2 border-primary p-lg shadow-[4px_4px_0px_0px_#C7F000]">
              <span className="material-symbols-outlined text-acid-lime text-h2 mb-md">receipt_long</span>
              <h3 className="font-h3 text-h3 text-acid-lime uppercase mb-sm">Renter platform fee</h3>
              <p className="font-price-display text-price-display text-on-primary mb-sm">Shown at checkout</p>
              <p className="font-body-md text-body-md text-on-primary/80">Renters see a transparent platform fee at checkout. No hidden charges on either side of the rental.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-primary px-margin-mobile lg:px-margin-desktop py-xl border-t-2 border-primary">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-h2 text-h2 text-on-primary mb-md uppercase tracking-tight">Ready to turn idle gear into income?</h2>
          <p className="font-body-lg text-body-lg text-on-primary/70 mb-xl text-balance leading-relaxed">Join the listers turning their bikes, cameras, and tech into a side income with KeyLo.</p>
          <Link to="/lister/signup" className="inline-flex px-8 py-4 bg-acid-lime border-2 border-on-primary font-label-caps text-label-caps text-primary hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#ffffff] transition-all items-center gap-2">
            CREATE LISTER ACCOUNT <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
