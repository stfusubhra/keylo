import { useState } from 'react';
import VirtualTourModal from './VirtualTourModal';

const VirtualTourButton = ({ tourUrl, propertyName }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!tourUrl) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-xs px-lg py-md bg-electric-purple text-white border-2 border-primary font-label-caps text-label-caps hover:-translate-y-1 hover:shadow-hard transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        aria-label={`Take virtual tour of ${propertyName}`}
      >
        <span className="material-symbols-outlined text-[20px]" aria-hidden="true">360</span>
        Virtual Tour
      </button>
      <VirtualTourModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        tourUrl={tourUrl}
        propertyName={propertyName}
      />
    </>
  );
};

export default VirtualTourButton;