export default function LoadingKey({ className = '' }) {
  return (
    <div
      role="img"
      aria-label="Loading"
      className={`animate-spin inline-block w-10 h-10 ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full text-primary"
      >
        {/* Key bow (ring) */}
        <circle cx="7.5" cy="15.5" r="5.5" />
        {/* Shaft */}
        <path d="m21 2-9.6 9.6" />
        {/* Teeth */}
        <path d="m15.5 7.5 3 3L22 7l-3-3" />
      </svg>
    </div>
  );
}
