export default function Avatar({ name, avatarUrl, size = 'md' }) {
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base' }
  const initials = name?.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase() ?? '?'
  if (avatarUrl) {
    return <img src={avatarUrl} alt={name} className={`${sizes[size]} rounded-full object-cover`} />
  }
  return (
    <div className={`${sizes[size]} rounded-full bg-accent/20 text-accent font-semibold flex items-center justify-center flex-shrink-0`}>
      {initials}
    </div>
  )
}
