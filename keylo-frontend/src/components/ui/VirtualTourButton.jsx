import { useState } from 'react';
import { X } from 'lucide-react';

const VirtualTourModal = ({ isOpen, onClose, tourUrl, propertyName }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="virtual-tour-title"
    >
      <div className="relative w-full max-w-4xl aspect-[16/9] bg-white rounded-xl overflow-hidden shadow-2xl border-2 border-primary">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-surface text-on-surface-variant hover:text-primary rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label="Close virtual tour"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="absolute inset-0 flex items-center justify-center">
          {tourUrl ? (
            <iframe
              src={tourUrl}
              className="w-full h-full border-0"
              title={`${propertyName} Virtual Tour`}
              allow="xr; camera; gyroscope; fullscreen; autoplay"
              allowFullScreen
              loading="lazy"
            />
            ) : (
              <div className="text-center p-8 text-on-surface-variant">
                <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-2xl text-primary">360</span>
                </div>
                <h3 className="font-h3 text-primary mb-2">Virtual Tour Coming Soon</h3>
                <p className="font-body-md text-on-surface-variant">
                  This property doesn't have a virtual tour yet. Book a visit to explore in person!
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default VirtualTourModal;