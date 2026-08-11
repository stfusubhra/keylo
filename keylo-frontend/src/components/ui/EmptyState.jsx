export function EmptyState({ icon = '📭', title = 'Nothing here', description = '', action }) {
  return (
    <div className="text-center py-xl">
      <span className="material-symbols-outlined text-[64px] text-on-surface-variant mb-md">
        {/* If icon is an emoji, we just render it; if it's a material symbol we could map, but for simplicity we use emoji */}
        {icon}
      </span>
      <h3 className="font-h3 text-h3 text-primary mb-xs">{title}</h3>
      <p className="font-body-md text-body-md text-on-surface-variant">{description}</p>
      {action && (
        <div className="mt-lg">
          {action}
        </div>
      )}
    </div>
  );
}