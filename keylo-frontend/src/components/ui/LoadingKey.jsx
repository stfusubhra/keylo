export default function LoadingKey() {
  return (
    <div className="animate-spin inline-block w-10 h-10">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full text-primary"
      >
        <path d="M17 21H7a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5h10a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5zM7 8h10M7 12h3M7 16h2" />
        <path d="M12 7v10" />
      </svg>
    </div>
  );
}