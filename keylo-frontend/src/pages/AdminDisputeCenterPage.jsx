export default function AdminDisputeCenterPage() {
  return (
    <div className="bg-surface font-body-md text-on-surface">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-error-container/20 via-surface/0 to-transparent pointer-events-none z-0"></div>
      <div className="absolute top-0 right-12 w-64 h-64 bg-error-container/10 rounded-full blur-3xl -z-10"></div>

      <div className="py-xl relative z-10 w-full max-w-[1400px] mx-auto">
        <header className="mb-xl flex items-end justify-between border-b-2 border-primary pb-md">
          <div>
            <span className="inline-block bg-hot-pink text-on-error px-sm py-xs font-label-caps text-label-caps uppercase border-2 border-primary shadow-[4px_4px_0px_0px_#000000] mb-md transform -rotate-2">
              Requires Action
            </span>
            <h1 className="font-heading text-h1-mobile md:text-h1 text-primary uppercase tracking-tighter font-bold">
              Dispute Center
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">
              Reviewing Dispute #KL-2048
            </p>
          </div>
          <div className="text-right">
            <p className="font-label-caps text-label-caps text-primary uppercase bg-electric-purple text-white px-md py-sm border-2 border-primary">
              AI Assists. Humans Decide.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-gutter items-start">
          {/* Left Column: Photo Evidence */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-lg">
            <div className="bg-surface-container-lowest border-2 border-primary p-md relative group hover:shadow-[8px_8px_0px_0px_#000000] transition-shadow duration-300">
              <h2 className="font-h3 text-h3 text-primary mb-md uppercase border-b-2 border-primary pb-sm flex justify-between items-center">
                Evidence Comparison
                <span className="material-symbols-outlined text-primary">image_search</span>
              </h2>
              <div className="grid grid-cols-2 gap-md">
                {/* Move-In Photo */}
                <div className="relative group/img overflow-hidden border-2 border-primary">
                  <div className="absolute top-0 left-0 bg-primary text-on-primary font-label-caps text-label-caps px-sm py-xs z-10">
                    Move-In (Jan 10, 2024)
                  </div>
                  <img
                    className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover/img:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8PQ5ysJ_ejNvSxee4ptat_cpd9TRqSt_HFf38zAkjfg1EizN4by18F7vhAyV6xcoH32whARXbFAjQyDl0qC_DsbuGschbxhD_ZVEl7fMdVJHPM5A8ZV-V87DJ8BOV2bW65XrhcZE-7E0EjkO7KOqqzNJGzxTZanl2gym_cvXN5fVSOOqoOWOGL6fHIO6BYURt8xmq1CAXfPB5ULyG_Babp3RtLebw1-7D3PrGsCS73kSBbvMISXOl"
                    alt="Move-in condition"
                  />
                </div>

                {/* Move-Out Photo with AI Overlay */}
                <div className="relative group/img overflow-hidden border-2 border-coral">
                  <div className="absolute top-0 left-0 bg-coral text-on-error font-label-caps text-label-caps px-sm py-xs z-10">
                    Move-Out (Aug 15, 2024)
                  </div>
                  <img
                    className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover/img:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWJRCIoST7eD7WW75GNUTG2QDpJvd5Po7cUX5jGFq5YtqL6_Zsu7A1GfKNpvdKcg9IieNxXtBb6B3APAKuKFEyL1zDz3MkbsGTZbxUXXfzTuPOvQlK6MEoAxrUy77IaRzIj8Px0NGrW0wLffxrmRO7kuuJlw8gyMVid0RwhukePVztDzSMDcSWpTZ4gTMC_xfxTS3deCG3i5y19htLKx8CntoBOFui8gtmHFifH-hC_CVL78Cq3D4W"
                    alt="Move-out condition"
                  />
                  {/* AI Damage Highlight Overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    <svg height="100%" preserveAspectRatio="none" viewBox="0 0 400 300" width="100%">
                      <rect className="animate-[dash_2s_linear_infinite]" fill="none" height="80" stroke="#7C3AED" strokeDasharray="8 8" strokeWidth="4" width="100" x="150" y="100"></rect>
                      <line stroke="#7C3AED" strokeWidth="2" x1="250" x2="300" y1="140" y2="100"></line>
                      <circle cx="300" cy="100" fill="#7C3AED" r="4"></circle>
                      <text fill="#7C3AED" fontFamily="Space Grotesk" fontSize="12" fontWeight="bold" x="310" y="105">
                        DAMAGE DETECTED
                      </text>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Statement Log */}
            <div className="bg-surface-container-low border-2 border-primary p-lg">
              <h3 className="font-h3 text-h3 text-primary mb-md uppercase border-b-2 border-primary pb-sm">
                Statement Log
              </h3>
              <div className="space-y-md">
                {/* Owner Statement */}
                <div className="flex gap-md">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-h3 text-h3 shrink-0">
                    O
                  </div>
                  <div className="bg-surface-container-lowest border-2 border-primary p-md flex-1 relative">
                    <div className="absolute w-4 h-4 bg-surface-container-lowest border-t-2 border-l-2 border-primary -left-[9px] top-4 rotate-[-45deg]"></div>
                    <div className="flex justify-between items-center mb-xs">
                      <span className="font-label-caps text-label-caps text-primary">Owner (Rajesh M.)</span>
                      <span className="text-xs text-on-surface-variant font-mono">15 Aug, 14:30</span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface">
                      "Student left a huge dent in the living room wall. Needs replastering and paint. Requesting ₹1,500 from security deposit."
                    </p>
                  </div>
                </div>

                {/* Student Statement */}
                <div className="flex gap-md flex-row-reverse">
                  <div className="w-10 h-10 rounded-full border-2 border-primary bg-acid-lime flex items-center justify-center text-primary font-h3 text-h3 shrink-0">
                    S
                  </div>
                  <div className="bg-surface-container-lowest border-2 border-primary p-md flex-1 relative">
                    <div className="absolute w-4 h-4 bg-surface-container-lowest border-r-2 border-b-2 border-primary -right-[9px] top-4 rotate-[-45deg]"></div>
                    <div className="flex justify-between items-center mb-xs">
                      <span className="font-label-caps text-label-caps text-primary">Student (Alex C.)</span>
                      <span className="text-xs text-on-surface-variant font-mono">16 Aug, 09:15</span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface">
                      "The scuff was already there when I moved in, it just got slightly worse. I shouldn't pay for pre-existing wear and tear."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Analysis & Actions */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-lg sticky top-[100px]">
            {/* AI Assessment Card */}
            <div className="bg-electric-purple text-white border-2 border-primary p-lg relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 text-[100px] text-white/10 font-bold material-symbols-outlined">
                smart_toy
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-sm mb-md">
                  <span className="material-symbols-outlined text-h2 font-h2">bolt</span>
                  <h2 className="font-h3 text-h3 uppercase">AI Assessment</h2>
                </div>
                <div className="bg-surface-container-lowest border-2 border-primary p-md text-primary mb-md">
                  <div className="flex justify-between items-end mb-sm">
                    <span className="font-label-caps text-label-caps text-on-surface-variant">
                      Estimated Repair Cost
                    </span>
                    <span className="font-price-display text-price-display">₹1,200</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container border-2 border-primary">
                    <div className="h-full bg-electric-purple w-[89%]"></div>
                  </div>
                  <div className="flex justify-between mt-xs">
                    <span className="text-xs font-mono">Confidence</span>
                    <span className="text-xs font-mono font-bold">89%</span>
                  </div>
                </div>
                <p className="font-body-md text-body-md text-white/90">
                  <strong>Analysis:</strong> Image comparison reveals new structural damage (dent depth ~0.5cm) not present in Move-In photo. Not standard wear & tear.
                </p>
              </div>
            </div>

            {/* Claim Summary */}
            <div className="bg-surface-container-lowest border-2 border-primary p-lg">
              <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-md">
                Claim Summary
              </h3>
              <div className="flex flex-col gap-sm">
                <div className="flex justify-between items-center py-sm border-b-2 border-surface-container-highest">
                  <span className="font-body-md text-body-md">Owner Request</span>
                  <span className="font-price-display text-price-display text-[24px]">₹1,500</span>
                </div>
                <div className="flex justify-between items-center py-sm border-b-2 border-surface-container-highest">
                  <span className="font-body-md text-body-md">Student Offer</span>
                  <span className="font-price-display text-price-display text-[24px]">₹0</span>
                </div>
                <div className="flex justify-between items-center py-sm pt-md">
                  <span className="font-h3 text-h3">Difference</span>
                  <span className="font-price-display text-price-display text-coral">₹1,500</span>
                </div>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="flex flex-col gap-md">
              <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase ml-xs">
                Admin Actions
              </h3>
              <button className="w-full bg-acid-lime border-2 border-primary py-md px-lg font-h3 text-h3 text-primary uppercase hover:shadow-[6px_6px_0px_0px_#000000] hover:-translate-y-1 hover:-translate-x-1 transition-all active:shadow-[0px_0px_0px_0px_#000000] active:translate-x-0 active:translate-y-0 flex items-center justify-between group">
                Approve AI Claim (₹1,200)
                <span className="material-symbols-outlined transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
              <div className="grid grid-cols-2 gap-sm">
                <button className="bg-surface-container-lowest border-2 border-primary py-sm px-md font-label-caps text-label-caps text-primary uppercase hover:bg-primary hover:text-on-primary transition-colors">
                  Request Evidence
                </button>
                <button className="bg-surface-container-lowest border-2 border-coral text-coral py-sm px-md font-label-caps text-label-caps uppercase hover:bg-coral hover:text-white transition-colors">
                  Reject Claim
                </button>
              </div>
              <div className="mt-md bg-surface-container border-2 border-primary p-sm border-dashed">
                <label className="font-label-caps text-label-caps text-primary uppercase block mb-xs">
                  Custom Resolution (₹)
                </label>
                <div className="flex gap-sm">
                  <input
                    className="flex-1 bg-surface-container-lowest border-2 border-primary px-sm py-xs font-body-md text-body-md focus:outline-none focus:ring-4 focus:ring-acid-lime/50 transition-all"
                    placeholder="Enter amount..."
                    type="number"
                  />
                  <button className="bg-primary text-on-primary px-md font-label-caps text-label-caps uppercase hover:bg-surface-container-highest hover:text-primary border-2 border-primary transition-colors">
                    Set
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -16;
          }
        }
      `}</style>
    </div>
  );
}