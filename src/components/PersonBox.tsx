import { config } from '../config'
import type { PlacedPerson } from '../types'

/** Splits "Айпери Эрмекбаева" into first name / rest so it fits on two lines. */
function splitName(name: string): [string, string] {
  const i = name.indexOf(' ')
  return i === -1 ? [name, ''] : [name.slice(0, i), name.slice(i + 1)]
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join('')
}

function years(born?: string, died?: string) {
  if (born && died) return `${born} – ${died}`
  if (born) return born
  if (died) return `† ${died}`
  return ''
}

const PHOTO_R = 24

export function PersonBox({ placed, highlighted, dimmed, onSelect, onHover }: {
  placed: PlacedPerson
  highlighted: boolean
  dimmed: boolean
  onSelect: (id: string) => void
  /** Called with the box's screen position on hover, and null when the mouse leaves. */
  onHover: (rect: DOMRect | null) => void
}) {
  const { person, x, y } = placed
  const w = config.boxWidth
  const h = config.boxHeight
  const [first, rest] = splitName(person.name)
  const lifespan = years(person.born, person.died)

  const lines: Array<{ text: string; cls: string }> = [
    { text: first, cls: 'person__first' },
    ...(rest ? [{ text: rest, cls: 'person__last' }] : []),
    ...(lifespan ? [{ text: lifespan, cls: 'person__years' }] : []),
    ...(person.extra ? [{ text: person.extra, cls: 'person__extra' }] : []),
  ]
  const lineH = 15
  const top = h / 2 - ((lines.length - 1) * lineH) / 2
  const cx = 14 + PHOTO_R
  const textX = cx + PHOTO_R + 10
  const clipId = `photo-${person.id}`
  const photoUrl = person.photo ? `${import.meta.env.BASE_URL}${person.photo.replace(/^\//, '')}` : undefined

  return (
    <g
      className={`person person--${person.gender ?? 'u'}${highlighted ? ' is-highlighted' : ''}${dimmed ? ' is-dimmed' : ''}`}
      transform={`translate(${x - w / 2} ${y - h / 2})`}
      role="button"
      tabIndex={0}
      aria-label={person.name}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(person.id)
      }}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(person.id)}
      onMouseEnter={(e) => onHover(e.currentTarget.getBoundingClientRect())}
      onMouseLeave={() => onHover(null)}
      onFocus={(e) => onHover(e.currentTarget.getBoundingClientRect())}
      onBlur={() => onHover(null)}
    >
      <rect className="person__box" width={w} height={h} rx={8} />

      <clipPath id={clipId}>
        <circle cx={cx} cy={h / 2} r={PHOTO_R} />
      </clipPath>
      <circle className="person__photo-bg" cx={cx} cy={h / 2} r={PHOTO_R} />
      {photoUrl ? (
        <image
          href={photoUrl}
          x={cx - PHOTO_R}
          y={h / 2 - PHOTO_R}
          width={PHOTO_R * 2}
          height={PHOTO_R * 2}
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${clipId})`}
        />
      ) : (
        <text className="person__initials" x={cx} y={h / 2} textAnchor="middle" dominantBaseline="central">
          {initials(person.name)}
        </text>
      )}
      <circle className="person__photo-ring" cx={cx} cy={h / 2} r={PHOTO_R} />

      {lines.map((l, i) => (
        <text key={i} className={l.cls} x={textX} y={top + i * lineH} dominantBaseline="central">
          {l.text}
        </text>
      ))}
    </g>
  )
}
