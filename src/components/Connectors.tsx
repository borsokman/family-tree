import { useMemo } from 'react'
import { config } from '../config'
import type { PlacedPerson, TreeLayout } from '../types'

interface SiblingGroup {
  key: string
  sx: number // where the line leaves the parents
  sy: number
  children: PlacedPerson[]
  rowTop: number
  spineX?: number // vertical list instead of a horizontal bar
  barY: number
}

const span = (g: SiblingGroup) => {
  const xs = g.spineX !== undefined ? [g.spineX] : g.children.map((c) => c.x)
  return [Math.min(g.sx, ...xs), Math.max(g.sx, ...xs)]
}

/**
 * Classic genealogy lines:
 *   spouse ── spouse            marriage line
 *          │                    drop from its middle
 *     ┌────┼────┐               sibling bar → children side by side
 *  or └─┬──┘                    or a vertical list:  ├─ child
 *                                                    └─ child
 */
export function Connectors({ layout }: { layout: TreeLayout }) {
  const { marriages, groups } = useMemo(() => {
    const { placed } = layout
    const halfW = config.boxWidth / 2
    const halfH = config.boxHeight / 2

    const marriages = layout.couples.map(([a, b]) => {
      const [l, r] = [placed.get(a)!, placed.get(b)!].sort((p, q) => p.x - q.x)
      return { key: `${a}+${b}`, x1: l.x + halfW, x2: r.x - halfW, y: l.y }
    })

    const byKey = new Map<string, SiblingGroup>()
    for (const child of placed.values()) {
      const parents = (child.person.parents ?? []).map((id) => placed.get(id)).filter((p) => p !== undefined)
      if (!parents.length) continue
      const key = parents.map((p) => p.person.id).sort().join('+')
      let g = byKey.get(key)
      if (!g) {
        const married = parents.length === 2 && layout.couples.some(([a, b]) => key === [a, b].sort().join('+'))
        g = {
          key,
          sx: parents.reduce((s, p) => s + p.x, 0) / parents.length,
          sy: married ? parents[0].y : parents[0].y + halfH,
          children: [],
          rowTop: Infinity,
          spineX: child.spineX,
          barY: 0,
        }
        byKey.set(key, g)
      }
      g.children.push(child)
      g.rowTop = Math.min(g.rowTop, child.y - halfH)
    }

    // Overlapping bars on the same row each get their own lane.
    const groups = [...byKey.values()]
    const byRow = new Map<number, SiblingGroup[]>()
    groups.forEach((g) => byRow.set(g.rowTop, [...(byRow.get(g.rowTop) ?? []), g]))
    for (const [rowTop, row] of byRow) {
      // A group whose drop starts inside another group's bar must use a higher lane,
      // otherwise its vertical line would cut through that bar and look connected to it.
      const depth = (g: SiblingGroup) =>
        row.filter((o) => o !== g && span(o)[0] < g.sx && g.sx < span(o)[1]).length
      row.sort((a, b) => depth(b) - depth(a) || span(a)[0] - span(b)[0])
      const lanes: Array<Array<[number, number]>> = []
      const lane = new Map<SiblingGroup, number>()
      for (const g of row) {
        const [lo, hi] = span(g)
        const free = (l: Array<[number, number]>) => l.every(([a, b]) => hi < a - 6 || lo > b + 6)
        let i = lanes.findIndex(free)
        if (i === -1) i = lanes.push([]) - 1
        lanes[i].push([lo, hi])
        lane.set(g, i)
      }
      const gapMid = rowTop - (config.rowHeight - config.boxHeight) / 2
      row.forEach((g) => (g.barY = gapMid + (lane.get(g)! - (lanes.length - 1) / 2) * 16))
    }
    return { marriages, groups }
  }, [layout])

  return (
    <g className="lines" aria-hidden="true">
      {marriages.map((m) => (
        <line key={m.key} className="lines__marriage" x1={m.x1} x2={m.x2} y1={m.y} y2={m.y} />
      ))}
      {groups.map((g) => {
        const [lo, hi] = span(g)
        const drop = `M${g.sx},${g.sy} V${g.barY} M${lo},${g.barY} H${hi}`
        if (g.spineX !== undefined) {
          const lastY = Math.max(...g.children.map((c) => c.y))
          const ticks = g.children.map((c) => `M${g.spineX},${c.y} H${c.x - config.boxWidth / 2}`).join(' ')
          return <path key={g.key} d={`${drop} M${g.spineX},${g.barY} V${lastY} ${ticks}`} />
        }
        return (
          <path key={g.key} d={`${drop} ${g.children.map((c) => `M${c.x},${g.barY} V${c.y - config.boxHeight / 2}`).join(' ')}`} />
        )
      })}
    </g>
  )
}
