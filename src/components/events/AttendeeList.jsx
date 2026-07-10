import Avatar from '../ui/Avatar'

export default function AttendeeList({ attendees }) {
  if (!attendees.length) return <p className="text-sm text-muted">No one yet — be the first!</p>
  return (
    <div className="flex flex-col gap-3">
      {attendees.map(({ profile_id, profiles }) => (
        <div key={profile_id} className="flex items-center gap-3">
          <Avatar name={profiles?.display_name} avatarUrl={profiles?.avatar_url} />
          <div>
            <p className="text-sm font-medium text-app-text">{profiles?.display_name ?? 'Parent'}</p>
            {profiles?.kids_ages?.length > 0 && (
              <p className="text-xs text-muted">
                Kids: {profiles.kids_ages.map(a => `${a}y`).join(', ')}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
