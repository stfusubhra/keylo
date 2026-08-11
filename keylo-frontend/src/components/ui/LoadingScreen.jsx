import LoadingKey from './LoadingKey';

/**
 * LoadingScreen – full-page or section loading state built around the
 * animated KeyLo key mascot.
 *
 * Usage:
 *   if (loading) return <LoadingScreen label="Loading your stays..." className="min-h-screen" />;
 *   {loading && <LoadingScreen label="Searching Kolkata..." />}
 *
 * Props:
 *   label     – screen-reader-friendly text shown under the key (default "Loading...")
 *   className – extra classes to control height/background (default "min-h-[40vh]")
 */
export default function LoadingScreen({ label = 'Loading...', className = 'min-h-[40vh]' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-md ${className}`}
    >
      <LoadingKey />
      <p className="font-label-caps text-label-caps text-primary">{label}</p>
    </div>
  );
}
