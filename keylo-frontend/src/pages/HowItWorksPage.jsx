import { Link } from 'react-router-dom';

const steps = [
  {
    id: 1,
    number: '01',
    title: 'Discover',
    icon: 'search',
    color: 'bg-acid-lime',
    textColor: 'text-primary',
    description: 'Browse verified properties with clear pricing, photos, and amenities. Filter by location, budget, and room type to find your perfect stay.',
    features: ['AI-verified listings', 'Transparent pricing', 'Detailed amenities', 'Real-time availability'],
  },
  {
    id: 2,
    number: '02',
    title: 'Understand',
    icon: 'psychology',
    color: 'bg-electric-purple',
    textColor: 'text-white',
    description: 'View the complete rental agreement before committing. Our AI assistant breaks down complicated clauses into simple language you can trust.',
    features: ['AI agreement assistant', 'Plain-language summaries', 'Key clause highlights', 'No hidden terms'],
  },
  {
    id: 3,
    number: '03',
    title: 'Agree',
    icon: 'handshake',
    color: 'bg-primary',
    textColor: 'text-on-primary',
    description: 'Sign your digital rental agreement with confidence. Every agreement is backed by blockchain for a verifiable, tamper-resistant record.',
    features: ['Digital signatures', 'Blockchain-verified', 'Tamper-resistant history', 'Instant agreement status'],
  },
  {
    id: 4,
    number: '04',
    title: 'Pay',
    icon: 'payments',
    color: 'bg-acid-lime',
    textColor: 'text-primary',
    description: 'Pay rent and deposits using familiar UPI payments. Tenants pay a transparent one-time KeyLo fee on their first booking; there are no subscription charges.',
    features: ['UPI payments', 'First-booking fee only', 'Automatic receipts', 'No subscription'],
  },
  {
    id: 5,
    number: '05',
    title: 'Secure Deposit',
    icon: 'shield_locked',
    color: 'bg-electric-purple',
    textColor: 'text-white',
    description: 'Your security deposit is protected in escrow according to your agreement terms. No more worrying about losing your deposit unfairly.',
    features: ['Escrow-protected deposit', 'Clear deposit status', 'Transparent release rules', 'Dispute protection'],
  },
  {
    id: 6,
    number: '06',
    title: 'Live & Manage',
    icon: 'home',
    color: 'bg-primary',
    textColor: 'text-on-primary',
    description: 'Track payments, submit maintenance requests, and access your rental documents — all from one dashboard throughout your lease.',
    features: ['Payment tracking', 'Maintenance requests', 'Document access', 'Agreement status'],
  },
  {
    id: 7,
    number: '07',
    title: 'Complete',
    icon: 'task_alt',
    color: 'bg-acid-lime',
    textColor: 'text-primary',
    description: 'When your lease ends, KeyLo guides both parties through a fair deposit release. No disputes? Deposit returns smoothly. Dispute? It stays protected.',
    features: ['Guided lease completion', 'Fair deposit release', 'Dispute resolution', 'Complete rental history'],
  },
];

const trustFeatures = [
  { icon: 'verified', title: 'Verified Agreements', desc: 'Every agreement is blockchain-verified for a tamper-resistant record.' },
  { icon: 'lock', title: 'Protected Deposits', desc: 'Escrow-secured deposits with transparent release conditions.' },
  { icon: 'receipt_long', title: 'Payment Records', desc: 'Clear, accessible payment history for both tenants and landlords.' },
  { icon: 'psychology', title: 'AI Assistant', desc: 'Understand your agreement in plain language, no legal degree needed.' },
];

export default function HowItWorksPage() {
  return (
    <div className="bg-surface-container-low font-body-md text-on-surface">
      {/* Hero */}
      <section className="w-full bg-surface px-margin-mobile lg:px-margin-desktop py-xl lg:py-[120px] border-b-2 border-primary relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path className="text-primary" d="M0,0 L100,0 L100,100 Z" fill="currentColor" />
            <path className="text-primary" d="M0,100 L100,0 L0,0 Z" fill="currentColor" />
          </svg>
        </div>
        <div className="max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-sm mb-lg px-md py-sm bg-primary text-on-primary rounded-full border-2 border-primary shadow-[4px_4px_0px_0px_#000000]">
            <span className="material-symbols-outlined text-sm">route</span>
            <span className="font-label-caps text-label-caps tracking-widest uppercase">The KeyLo Journey</span>
          </div>
          <h1 className="font-heading text-h1-mobile lg:text-h1 text-primary mb-lg leading-none tracking-tighter font-bold">
            From agreement to move-in,<br className="hidden lg:block" />
            <span className="relative inline-block">
              all in one place.
              <div className="absolute -bottom-2 left-0 w-full h-4 bg-[#C7F000] -z-10 rotate-1" />
            </span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant text-balance leading-relaxed" style={{ maxWidth: '672px' }}>
            KeyLo brings the entire rental lifecycle together — discover, agree, pay, secure, and manage. No brokers, no paperwork, no stress. Just a smarter way to rent.
          </p>
        </div>
      </section>

      {/* Steps Timeline */}
      <section className="w-full px-margin-mobile lg:px-margin-desktop py-xl">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-h2 text-h2 text-primary mb-xl uppercase tracking-tight text-center">Seven Steps. Zero Friction.</h2>
          <div className="flex flex-col gap-lg">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex flex-col md:flex-row gap-md ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Step Number Badge */}
                <div className="flex md:flex-col items-center gap-md md:gap-sm flex-shrink-0">
                  <div className={`w-16 h-16 ${step.color} ${step.textColor} border-2 border-primary flex items-center justify-center font-h2 text-h2 shadow-[4px_4px_0px_0px_#000000] flex-shrink-0`}>
                    {step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block w-[2px] h-12 bg-primary/20" />
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 bg-surface border-2 border-primary p-lg shadow-[6px_6px_0px_0px_#000000] mb-md">
                  <div className="flex items-center gap-sm mb-md">
                    <span className="material-symbols-outlined text-primary">{step.icon}</span>
                    <h3 className="font-h3 text-h3 text-primary uppercase">{step.title}</h3>
                  </div>
                  <p className="font-body-lg text-body-lg text-on-surface-variant mb-md">{step.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
                    {step.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-xs">
                        <span className="material-symbols-outlined text-acid-lime text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        <span className="font-body-md text-body-md text-on-surface">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Features */}
      <section className="w-full bg-primary px-margin-mobile lg:px-margin-desktop py-xl border-y-2 border-primary">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-h2 text-h2 text-on-primary mb-xl uppercase tracking-tight text-center">Why Trust KeyLo?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
            {trustFeatures.map((feature) => (
              <div key={feature.title} className="bg-on-primary border-2 border-on-primary p-lg text-primary">
                <div className="w-12 h-12 bg-acid-lime border-2 border-primary flex items-center justify-center mb-md">
                  <span className="material-symbols-outlined text-primary">{feature.icon}</span>
                </div>
                <h3 className="font-h3 text-h3 text-primary mb-xs">{feature.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full px-margin-mobile lg:px-margin-desktop py-xl bg-surface">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-h2 text-h2 text-primary mb-md uppercase tracking-tight">Ready to rent smarter?</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl text-balance leading-relaxed">Join KeyLo today and experience a simpler, safer way to rent.</p>
          <div className="flex flex-col sm:flex-row gap-md justify-center">
            <Link to="/find-a-stay" className="px-8 py-4 bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000000] transition-all flex items-center justify-center gap-2">
              FIND YOUR SPACE <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
            <Link to="/signup" className="px-8 py-4 bg-primary text-on-primary border-2 border-primary font-label-caps text-label-caps hover:bg-surface hover:text-primary transition-all flex items-center justify-center">
              CREATE ACCOUNT
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
