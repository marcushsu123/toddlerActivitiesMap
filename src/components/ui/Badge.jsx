export default function Badge({ children, color = 'green' }) {
  const colors = {
    green: 'bg-accent/10 text-accent',
    orange: 'bg-accent-2/10 text-accent-2',
    gray: 'bg-muted/10 text-muted',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  )
}
