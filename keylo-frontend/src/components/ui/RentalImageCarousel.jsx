import { useEffect, useRef, useState } from 'react';

/**
 * RentalImageCarousel
 *
 * Keylo-styled image carousel used on the rental details page. Supports
 * mouse dragging, trackpad swiping (horizontal wheel), and touchscreen
 * swiping via unified pointer events, with smooth CSS transitions and
 * left/right buttons plus indicator dots. Single-image listings render
 * as a plain image without controls.
 */
export default function RentalImageCarousel({ images = [], alt = '', className = '' }) {
  const slides = images.filter(Boolean);
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef(null);
  const drag = useRef(null); // { startX, startIndex, deltaX }

  // Reset to the first slide whenever the image set changes (e.g. another item).
  useEffect(() => {
    setIndex(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides]);

  const goTo = (i) => {
    setIndex(((i % count) + count) % count);
  };

  const handlePointerDown = (e) => {
    if (count <= 1) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    drag.current = { startX: e.clientX, startIndex: index, deltaX: 0 };
    setDragging(true);
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* noop */ }
  };

  const handlePointerMove = (e) => {
    if (!drag.current) return;
    const deltaX = e.clientX - drag.current.startX;
    drag.current.deltaX = deltaX;
    const track = trackRef.current;
    if (track) {
      track.style.transition = 'none';
      track.style.transform = `translateX(calc(${-drag.current.startIndex * 100}% + ${deltaX}px))`;
    }
  };

  const settleDrag = () => {
    if (!drag.current) return;
    const { startIndex, deltaX } = drag.current;
    const track = trackRef.current;
    const width = track?.clientWidth || 1;
    const threshold = Math.min(90, width * 0.2);
    const target = Math.abs(deltaX) > threshold
      ? startIndex + (deltaX < 0 ? 1 : -1)
      : startIndex;
    const wrapped = ((target % count) + count) % count;
    drag.current = null;
    if (track) {
      // Re-enable the CSS transition first, then park the track at the
      // wrapped target so the release animates straight there with no jump.
      track.style.transition = '';
      track.style.transform = `translateX(-${wrapped * 100}%)`;
    }
    setDragging(false);
    setIndex(wrapped);
  };

  const handlePointerUp = settleDrag;
  const handlePointerCancel = settleDrag;

  // Trackpad horizontal swipe support: only react when horizontal dominates.
  const handleWheel = (e) => {
    if (count <= 1 || drag.current) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 20) {
      e.preventDefault();
      goTo(index + (e.deltaX > 0 ? 1 : -1));
    }
  };

  const handleKeyDown = (e) => {
    if (count <= 1) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
  };

  if (!slides.length) return null;

  return (
    <div
      className={`relative w-full aspect-video overflow-hidden border-2 border-primary bg-surface-container-lowest select-none touch-pan-y ${className}`}
      role="region"
      aria-label={`Photos of ${alt}`}
      tabIndex={count > 1 ? 0 : -1}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={trackRef}
        className={`flex h-full w-full transition-transform duration-500 ease-out ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ transform: `translateX(-${index * 100}%)` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onWheel={handleWheel}
      >
        {slides.map((src, i) => (
          <div key={`${src}-${i}`} className="w-full h-full flex-shrink-0 flex items-center justify-center">
            <img
              src={src}
              alt={i === 0 ? alt : `${alt} — photo ${i + 1}`}
              draggable={false}
              loading={i === 0 ? 'eager' : 'lazy'}
              className="w-full h-full object-cover pointer-events-none"
            />
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          {/* Left / Right navigation */}
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous photo"
            className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-surface/90 border-2 border-primary text-primary hover:bg-acid-lime transition-colors"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next photo"
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-surface/90 border-2 border-primary text-primary hover:bg-acid-lime transition-colors"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>

          {/* Indicators */}
          <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-sm bg-surface/80 border-2 border-primary px-md py-xs">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to photo ${i + 1}`}
                aria-current={i === index}
                className={`w-2.5 h-2.5 rounded-full border-2 border-primary transition-colors ${i === index ? 'bg-primary' : 'bg-surface-container-lowest hover:bg-acid-lime'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
