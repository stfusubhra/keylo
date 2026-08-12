import { Link } from 'react-router-dom';

// Shown to signed-out visitors on /keylo-vault. Explains what the KeyLo Vault
// is and prompts them to log in, instead of silently bouncing to /login.
export default function VaultLoginRequiredPage() {
  return (
    <div className="relative overflow-hidden bg-surface font-body-md text-on-surface">
      {/* Ambient Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-acid-lime/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-electric-purple/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

      <div className="relative z-10 max-w-6xl mx-auto px-margin-mobile lg:px-margin-desktop py-xl flex flex-col gap-xl">

        {/* ── Header ── */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-xs px-sm py-xs bg-acid-lime/10 border-2 border-acid-lime w-max mb-md">
            <span className="material-symbols-outlined text-acid-lime text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
            <span className="font-label-caps text-label-caps text-acid-lime">SECURED IN KEYLO VAULT</span>
          </div>
          <h1 className="font-heading text-h1-mobile md:text-h1 text-primary font-bold leading-tight">
            Your deposit. <span className="text-acid-lime">Protected.</span>
          </h1>
          <div className="mt-md border-2 border-primary bg-surface-container-lowest p-md shadow-[4px_4px_0px_0px_#000000]">
            <div className="flex items-start gap-sm">
              <span className="material-symbols-outlined text-2xl bg-acid-lime text-primary border-2 border-primary p-xs" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
              <p className="font-body-md text-primary font-medium leading-relaxed">
                When you book a stay through KeyLo, your security deposit is held in escrow by KeyLo —{' '}
                <mark className="bg-acid-lime text-primary px-xs py-[1px] font-bold">never handed straight to the landlord</mark>.
                Your money stays protected until move-out and is refunded to you, not the landlord.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-lg gap-y-xs mt-md">
            <span className="flex items-center gap-xs font-label-caps text-label-caps text-primary text-[10px] uppercase">
              <span className="material-symbols-outlined text-sm text-acid-lime" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              Escrow-held, never landlord-held
            </span>
            <span className="flex items-center gap-xs font-label-caps text-label-caps text-primary text-[10px] uppercase">
              <span className="material-symbols-outlined text-sm text-acid-lime" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              100% refund guarantee
            </span>
            <span className="flex items-center gap-xs font-label-caps text-label-caps text-primary text-[10px] uppercase">
              <span className="material-symbols-outlined text-sm text-acid-lime" style={{ fontVariationSettings: "'FILL' 1" }}>gavel</span>
              AI-assisted disputes
            </span>
          </div>
        </div>

        {/* ── How the vault works ── */}
        <div className="grid md:grid-cols-3 gap-lg">
          <div className="bg-surface-container-lowest border-2 border-primary p-lg shadow-[4px_4px_0px_0px_#000000]">
            <span className="material-symbols-outlined text-acid-lime text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>search</span>
            <h2 className="font-h3 text-h3 text-primary mt-md mb-xs">Book a stay</h2>
            <p className="font-body-md text-on-surface-variant">
              Find a verified PG or flat and pay your security deposit through KeyLo at checkout.
            </p>
          </div>
          <div className="bg-surface-container-lowest border-2 border-primary p-lg shadow-[4px_4px_0px_0px_#000000]">
            <span className="material-symbols-outlined text-acid-lime text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
            <h2 className="font-h3 text-h3 text-primary mt-md mb-xs">Locked in escrow</h2>
            <p className="font-body-md text-on-surface-variant">
              KeyLo holds your deposit in escrow for the whole stay — the landlord never touches your money.
            </p>
          </div>
          <div className="bg-surface-container-lowest border-2 border-primary p-lg shadow-[4px_4px_0px_0px_#000000]">
            <span className="material-symbols-outlined text-acid-lime text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>refund</span>
            <h2 className="font-h3 text-h3 text-primary mt-md mb-xs">Refund at move-out</h2>
            <p className="font-body-md text-on-surface-variant">
              Request your refund at checkout — or open a dispute and our team reviews it within 24 hours.
            </p>
          </div>
        </div>

        {/* ── Log in prompt ── */}
        <div className="bg-surface-container-lowest border-2 border-primary shadow-[8px_8px_0px_0px_#000000] p-lg md:p-xl flex flex-col md:flex-row md:items-center md:justify-between gap-lg">
          <div className="flex items-start gap-md">
            <span className="material-symbols-outlined text-[40px] text-primary bg-acid-lime border-2 border-primary p-sm flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>shield_locked</span>
            <div>
              <h2 className="font-h3 text-h3 text-primary mb-xs">Log in to see your vault</h2>
              <p className="font-body-md text-on-surface-variant max-w-lg">
                Your deposits, refund requests, and dispute history live here. Sign in to view your protected balance and track every release.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-sm shrink-0">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-sm px-lg py-md bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary hover:bg-primary hover:text-on-primary transition-colors"
            >
              LOG IN <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-sm px-lg py-md bg-primary border-2 border-primary font-label-caps text-label-caps text-on-primary hover:bg-acid-lime hover:text-primary transition-colors"
            >
              CREATE ACCOUNT
            </Link>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-xs font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
