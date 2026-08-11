/**
 * Skeleton – content-placeholder loading components.
 *
 * Replace text-only "Loading…" / "Checking your session…" with
 * skeleton shapes that hint at the real page structure.
 *
 * Usage:
 *   import { Skeleton, CardSkeleton, TextBlockSkeleton } from '../../components/ui/Skeleton';
 *
 *   if (loading) return <Skeleton className="min-h-[60vh]" />;
 *   if (loading) return <CardSkeleton count={6} />;
 */

// ── Bare skeleton block ────────────────────────────────────────────────

export function Skeleton({ className = '', ...rest }) {
  return (
    <div
      aria-hidden="true"
      className={`bg-surface-container-high animate-pulse rounded-md ${className}`}
      {...rest}
    />
  );
}

// ── Text line (variable width) ─────────────────────────────────────────

export function TextLine({ width = '100%', className = '' }) {
  return (
    <Skeleton
      className={`h-4 ${className}`}
      style={{ width }}
    />
  );
}

// ── Avatar / icon circle ───────────────────────────────────────────────

export function CircleSkeleton({ size = 40, className = '' }) {
  return (
    <Skeleton
      className={`rounded-full ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

// ── Single rental / listing card skeleton ──────────────────────────────

export function RentalCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="bg-surface flex flex-col border-2 border-primary shadow-[8px_8px_0px_0px_#000000]"
    >
      {/* Image placeholder */}
      <Skeleton className="w-full aspect-[4/3] sm:aspect-square border-b-2 border-primary rounded-none" />
      {/* Content */}
      <div className="p-sm sm:p-lg flex flex-col flex-grow gap-sm">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex justify-between mt-auto pt-sm">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-24 rounded-none" />
        </div>
      </div>
    </div>
  );
}

// ── Property card skeleton ─────────────────────────────────────────────

export function PropertyCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="bg-surface-container-lowest border-2 border-primary shadow-[8px_8px_0px_0px_#000000]"
    >
      <Skeleton className="w-full h-44 border-b-2 border-primary rounded-none" />
      <div className="p-lg space-y-3">
        <Skeleton className="h-5 w-3/5" />
        <Skeleton className="h-3 w-2/5" />
        <Skeleton className="h-6 w-1/3" />
        <div className="flex gap-sm">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
    </div>
  );
}

// ── Grid of card skeletons ─────────────────────────────────────────────

export function CardGridSkeleton({ _columns = 3, count = 6, card: CardComponent = RentalCardSkeleton }) {
  return (
    <div
      aria-hidden="true"
      className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-md lg:gap-lg"
    >
      {Array.from({ length: count }).map((_, i) => (
        <CardComponent key={i} />
      ))}
    </div>
  );
}

// ── Full-page skeleton (centred text block + card grid) ────────────────

export function PageSkeleton() {
  return (
    <div className="w-full animate-pulse px-margin-mobile lg:px-margin-desktop py-xl">
      <div className="max-w-6xl mx-auto space-y-xl">
        {/* Header */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        {/* Filters bar */}
        <div className="flex gap-sm">
          <Skeleton className="h-10 w-24 rounded-none" />
          <Skeleton className="h-10 w-24 rounded-none" />
          <Skeleton className="h-10 w-24 rounded-none" />
        </div>
        {/* Results header */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        {/* Card grid */}
        <CardGridSkeleton />
      </div>
    </div>
  );
}