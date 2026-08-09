import { useState, useEffect } from 'react';

export default function AIRoomInspectionPage() {
  const [progress, setProgress] = useState(87);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 3);
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-surface font-body-md text-on-surface">
      <div className="flex-1 w-full flex flex-col md:flex-row p-margin-mobile md:p-margin-desktop gap-xl relative z-10">
        {/* Left Column: AI Assessment */}
        <div className="flex-1 flex flex-col justify-center min-w-0">
          <div className="inline-flex items-center gap-sm bg-primary text-on-primary px-sm py-xs mb-lg w-max border-2 border-primary">
            <span className="material-symbols-outlined text-label-caps">
              verified
            </span>
            <span className="font-label-caps text-label-caps tracking-widest uppercase">
              AI Integrity Check
            </span>
          </div>
          <h1 className="font-heading text-h1-mobile md:text-h1 text-on-surface mb-md font-bold">
            Proof, not promises.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl" style={{ maxWidth: '672px' }}>
            Eliminate deposit disputes. Our AI scans move-in and move-out
            conditions with millimeter precision.
          </p>

          {/* Condition Report Card */}
          <div className="bg-surface-container-low border-2 border-primary p-lg mb-xl relative">
            <div className="absolute -top-4 -right-4 bg-tertiary text-on-tertiary px-md py-xs border-2 border-primary font-label-caps text-label-caps shadow-[4px_4px_0px_0px_#000000]">
              SCORE: 92/100
            </div>
            <div className="flex items-center gap-sm mb-lg">
              <span className="material-symbols-outlined text-tertiary">
                analytics
              </span>
              <span className="font-h3 text-h3 text-tertiary">
                Condition Report
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
              {/* Walls */}
              <div className="p-md bg-surface border-2 border-primary">
                <span className="block font-label-caps text-label-caps text-on-surface-variant mb-sm uppercase">
                  Walls
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-h3 text-h3 text-on-surface">Good</span>
                  <span className="material-symbols-outlined text-green-500">
                    check_circle
                  </span>
                </div>
              </div>
              {/* Furniture */}
              <div className="p-md bg-surface border-2 border-primary">
                <span className="block font-label-caps text-label-caps text-on-surface-variant mb-sm uppercase">
                  Furniture
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-h3 text-h3 text-on-surface">Good</span>
                  <span className="material-symbols-outlined text-green-500">
                    check_circle
                  </span>
                </div>
              </div>
              {/* Floor */}
              <div className="p-md bg-surface border-2 border-primary border-l-8 border-l-acid-lime">
                <span className="block font-label-caps text-label-caps text-on-surface-variant mb-sm uppercase">
                  Floor
                </span>
                <div className="flex flex-col">
                  <span className="font-h3 text-h3 text-on-surface">
                    Minor Mark
                  </span>
                  <span className="font-label-caps text-label-caps text-on-surface-variant mt-xs">
                    Scuff near door
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-xs">
            <span className="material-symbols-outlined text-[16px]">
              info
            </span>
            AI assists assessment. Humans decide.
          </p>
        </div>

        {/* Right Column: AI Scan Visualization */}
        <div className="flex-1 flex flex-col min-w-0 relative h-[614px] md:h-auto">
          <div className="absolute inset-0 bg-surface-container border-2 border-primary overflow-hidden flex flex-col group">
            <div className="bg-primary text-on-primary p-md flex items-center justify-between border-b-2 border-primary z-20">
              <span className="font-label-caps text-label-caps uppercase flex items-center gap-sm">
                <span className="material-symbols-outlined animate-pulse text-electric-purple">
                  radar
                </span>
                AI Condition Scan
              </span>
              <span
                className={`font-h3 text-h3 ${
                  progress >= 100 ? 'text-white' : 'text-acid-lime'
                }`}
                id="scan-progress"
              >
                {progress >= 100 ? 'COMPLETE' : `${progress}%`}
              </span>
            </div>
            <div className="relative flex-1 overflow-hidden">
              <div className="absolute inset-0 z-0">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCEmvRdqcSnHkWX70B0c2E4SBQyxMast326L_kjv4LDmB-KmFLkpGylf1UNA47XOfQc-winXtbgLDKfyBNUoFf0kVNaqi4VHMlprrAaIa7eRhNyWQdU0N30CUtgQzJa5t2HX9txSWuTKLDRv2kcZL3zISL0L0tombsMXKLw2zQ46tvDKqd7SIv9xRE3F4cgWFTjEypdUDFweQrmpmBkpEp5lRISWZqaOsqU8TKIqf88uaqYT1tmEbCi')",
                  }}
                ></div>
              </div>
              <div className="absolute top-0 left-0 w-full h-[5px] bg-electric-purple z-20 scan-line shadow-[0_0_15px_#7C3AED]"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-electric-purple/20 to-transparent z-10 scan-gradient mix-blend-overlay"></div>
              <div className="absolute bottom-1/4 left-1/4 z-30 opacity-0 highlight-marker">
                <div className="w-8 h-8 rounded-full border-4 border-acid-lime animate-ping absolute -inset-2"></div>
                <div className="w-4 h-4 rounded-full bg-acid-lime border-2 border-primary relative z-10"></div>
                <div className="absolute top-6 left-6 bg-surface p-sm border-2 border-primary min-w-[120px] shadow-[4px_4px_0px_0px_#000000]">
                  <span className="block font-label-caps text-label-caps text-on-surface uppercase mb-xs">
                    Detected
                  </span>
                  <span className="font-body-md text-body-md font-bold text-on-surface">
                    Floor Scuff
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-surface p-md border-t-2 border-primary z-20 flex justify-between items-center">
              <button className="font-label-caps text-label-caps px-lg py-md bg-surface border-2 border-primary hover:bg-surface-container transition-colors">
                Move-In Record
              </button>
              <span className="material-symbols-outlined text-on-surface-variant">
                compare_arrows
              </span>
              <button className="font-label-caps text-label-caps px-lg py-md bg-electric-purple text-white border-2 border-primary hover:shadow-[4px_4px_0px_0px_#000000] transition-all">
                Current Scan
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          50% { transform: translateY(100vh); }
          100% { transform: translateY(-100%); }
        }
        .scan-line {
          animation: scan 4s linear infinite;
        }
        .scan-gradient {
          animation: scan 4s linear infinite;
        }
        @keyframes appear {
          0% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        .highlight-marker {
          animation: appear 0.5s ease forwards 2s;
        }
      `}</style>
    </div>
  );
}
