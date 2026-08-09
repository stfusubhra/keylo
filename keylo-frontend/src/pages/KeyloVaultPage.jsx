import { Link } from 'react-router-dom';

export default function KeyloVaultPage() {
  const timelineSteps = [
    {
      id: 1,
      label: 'Received',
      date: 'Oct 12, 2026',
      status: 'completed',
    },
    {
      id: 2,
      label: 'Move-in Done',
      date: 'Oct 15, 2026',
      status: 'completed',
    },
    {
      id: 3,
      label: 'Stay Active',
      date: 'Current State',
      status: 'current',
    },
    {
      id: 4,
      label: 'Checkout',
      date: 'Pending',
      status: 'pending',
    },
    {
      id: 5,
      label: 'Refund',
      date: 'Pending',
      status: 'pending',
    },
  ];

  return (
    <div className="bg-surface font-body-md text-on-surface px-margin-mobile lg:px-margin-desktop">
      {/* Ambient Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-acid-lime/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-electric-purple/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>

      <section className="flex flex-col md:flex-row gap-xl items-start relative z-10 w-full max-w-[1400px] mx-auto pt-lg">
        {/* Left Column: Vault Display */}
        <div className="flex-1 flex flex-col gap-md">
          <div className="flex items-center gap-xs px-sm py-xs bg-acid-lime/10 border-2 border-acid-lime w-max">
            <span
              className="material-symbols-outlined text-acid-lime text-sm"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              shield
            </span>
            <span className="font-label-caps text-label-caps text-acid-lime">
              SECURED IN KEYLO VAULT
            </span>
          </div>
          <h1 className="font-heading text-h1-mobile md:text-h1 text-surface-container-lowest mt-xs font-bold" style={{ maxWidth: '512px' }}>
            Your deposit.
            <br />
            Protected.
          </h1>
          <div className="mt-lg">
            <span className="font-label-caps text-label-caps text-on-surface-variant block mb-unit">
              Current Balance
            </span>
            <div className="font-price-display text-price-display text-acid-lime text-5xl md:text-7xl">
              ₹10,000
            </div>
          </div>
        </div>

        {/* Right Column: Vault Visualization */}
        <div className="flex-1 flex justify-center items-center w-full">
          <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
            <svg
              className="absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite]"
              viewBox="0 0 200 200"
            >
              <circle
                cx="100"
                cy="100"
                fill="none"
                r="90"
                stroke="#313030"
                strokeDasharray="10 5"
                strokeWidth="2"
              ></circle>
              <circle
                className="animate-[spin_15s_linear_infinite_reverse]"
                cx="100"
                cy="100"
                fill="none"
                r="70"
                stroke="#C7F000"
                strokeDasharray="20 10"
                strokeWidth="4"
                style={{ transformOrigin: 'center' }}
              ></circle>
            </svg>
            <div className="w-32 h-32 md:w-40 md:h-40 bg-acid-lime border-2 border-primary rounded-full flex items-center justify-center shadow-[8px_8px_0px_0px_#000000] z-10 relative overflow-hidden group">
              <div
                className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAiLz4KPHBhdGggZD0iTTAgMEw4IDhaTTAgOEw4IDBaIiBzdHJva2U9IiMxMTExMTEiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4=')] opacity-20 group-hover:scale-110 transition-transform duration-700"
              ></div>
              <span
                className="material-symbols-outlined text-primary text-5xl relative z-10"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                lock
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Vault Timeline */}
      <section className="w-full max-w-[1400px] mx-auto bg-surface-container-low border-2 border-primary p-lg md:p-xl relative z-10 shadow-[8px_8px_0px_0px_#000000]">
        <div className="flex justify-between items-center mb-lg border-b-2 border-primary pb-sm">
          <h2 className="font-h3 text-h3 text-primary">Vault Timeline</h2>
          <Link
            to="/dashboard"
            className="bg-primary text-on-primary font-label-caps text-label-caps px-md py-sm border-2 border-transparent hover:border-acid-lime transition-colors flex items-center gap-xs"
          >
            VIEW DETAILS
            <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
          </Link>
        </div>
        <div className="relative pt-xl pb-md overflow-x-auto">
          <div className="absolute top-[48px] left-0 right-0 h-0.5 bg-outline-variant z-0 min-w-[800px]"></div>
          <div className="flex justify-between items-start min-w-[800px] relative z-10 gap-sm">
            {timelineSteps.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center gap-sm flex-1 ${
                  step.status === 'pending' ? 'opacity-50' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center relative shadow-[4px_4px_0px_0px_#000000] ${
                    step.status === 'completed'
                      ? 'bg-acid-lime'
                      : step.status === 'current'
                      ? 'bg-surface ring-4 ring-acid-lime/20'
                      : 'bg-surface-container-high border-outline-variant'
                  }`}
                >
                  {step.status === 'completed' && (
                    <span
                      className="material-symbols-outlined text-primary text-sm"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check
                    </span>
                  )}
                  {step.status === 'current' && (
                    <div className="w-3 h-3 bg-acid-lime rounded-full border border-primary animate-pulse"></div>
                  )}
                </div>
                <div className="text-center">
                  <span
                    className={`font-label-caps text-label-caps ${
                      step.status === 'completed'
                        ? 'text-primary'
                        : step.status === 'current'
                        ? 'text-primary'
                        : 'text-on-surface-variant'
                    } block`}
                  >
                    {step.label}
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    {step.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
