export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-app-text">{label}</label>}
      <input
        className={`w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-app-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent ${error ? 'border-red-400' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
