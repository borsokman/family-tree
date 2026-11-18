import { useState } from 'react'
import type { Person } from '../types'

export interface PreviewState {
  person: Person
  /** Screen rectangle of the hovered box. */
  rect: DOMRect
}

const GAP = 12 // between the box and the card
const EDGE = 8 // keep away from the window edge
const MAX_W = 420
const MAX_H = 520
const PAD = 18 // card padding + border, each direction
const NAME_H = 30 // the name under the photo

/**
 * The whole photo (not cropped), shown next to a box while the mouse is over it.
 * It goes on whichever side of the box (above, below, right, left) has room for
 * the biggest picture, so it never covers the box itself.
 */
export function PhotoPreview({ preview }: { preview: PreviewState | null }) {
  const [natural, setNatural] = useState<Record<string, [number, number]>>({})

  if (!preview?.person.photo) return null
  const src = `${import.meta.env.BASE_URL}${preview.person.photo.replace(/^\//, '')}`
  const size = natural[src]

  // Until the picture's real size is known, load it invisibly.
  if (!size) {
    return (
      <img
        src={src}
        alt=""
        style={{ position: 'fixed', visibility: 'hidden', pointerEvents: 'none' }}
        onLoad={(e) => {
          const img = e.currentTarget
          setNatural((n) => ({ ...n, [src]: [img.naturalWidth, img.naturalHeight] }))
        }}
      />
    )
  }

  const [nw, nh] = size
  const { rect } = preview
  const vw = window.innerWidth
  const vh = window.innerHeight
  const fullW = vw - 2 * EDGE - PAD
  const fullH = vh - 2 * EDGE - PAD - NAME_H
  const sides = [
    { side: 'above', w: fullW, h: rect.top - GAP - EDGE - PAD - NAME_H },
    { side: 'below', w: fullW, h: vh - rect.bottom - GAP - EDGE - PAD - NAME_H },
    { side: 'right', w: vw - rect.right - GAP - EDGE - PAD, h: fullH },
    { side: 'left', w: rect.left - GAP - EDGE - PAD, h: fullH },
  ].map((o) => ({ ...o, scale: Math.min(MAX_W / nw, MAX_H / nh, o.w / nw, o.h / nh) }))
  const best = sides.reduce((a, b) => (b.scale > a.scale + 0.01 ? b : a))
  const imgW = Math.round(nw * Math.max(best.scale, 0.05))
  const imgH = Math.round(nh * Math.max(best.scale, 0.05))
  const cardW = imgW + PAD
  const cardH = imgH + PAD + NAME_H

  let top: number
  let left: number
  if (best.side === 'above' || best.side === 'below') {
    top = best.side === 'above' ? rect.top - GAP - cardH : rect.bottom + GAP
    left = rect.left + rect.width / 2 - cardW / 2
  } else {
    left = best.side === 'right' ? rect.right + GAP : rect.left - GAP - cardW
    top = rect.top + rect.height / 2 - cardH / 2
  }
  top = Math.min(Math.max(EDGE, top), vh - cardH - EDGE)
  left = Math.min(Math.max(EDGE, left), vw - cardW - EDGE)

  return (
    <div className="photo-preview" style={{ top, left, width: cardW }} aria-hidden="true">
      <img src={src} alt="" width={imgW} height={imgH} />
      <div className="photo-preview__name">{preview.person.name}</div>
    </div>
  )
}
