import { config } from '../config'
import type { Person, PlacedPerson, TreeLayout } from '../types'

/** Typos in ids are shown on the page so mistakes are easy to spot. */
export function validateFamily(people: Person[]): string[] {
  const ids = new Set<string>()
  const problems: string[] = []
  for (const p of people) {
    if (ids.has(p.id)) problems.push(`duplicate id "${p.id}"`)
    ids.add(p.id)
  }
  for (const p of people) {
    for (const ref of p.parents ?? []) if (!ids.has(ref)) problems.push(`${p.id}: unknown parent "${ref}"`)
    for (const ref of p.partners ?? []) if (!ids.has(ref)) problems.push(`${p.id}: unknown partner "${ref}"`)
    if ((p.parents?.length ?? 0) > 2) problems.push(`${p.id}: more than two parents`)
  }
  return problems
}

const STACK_INDENT = 26 // room for the vertical line left of stacked boxes
const SPINE = 10 // x of that vertical line inside the indent

/**
 * One person of the family with the spouses who married in, side by side,
 * plus everything that descends from them.
 */
interface Node {
  members: string[]
  depth: number
  groups: Group[]
  width: number // width of the whole family branch
  unitLeft: number // where the couple sits inside the branch
  kidsLeft: number // where the children start inside the branch
  attach: number // x of the blood relative (where the line from the parents arrives)
}

/** Children of one pair of parents (or one parent). */
interface Group {
  drop: number // x of the line leaving the parents, relative to the couple
  kids: Node[]
  stacked: boolean // listed vertically instead of side by side
  width: number
  anchor: number // x the line arrives at, relative to the group
}

/**
 * Classic top-down layout: every family branch gets its own band of space,
 * parents sit centred above their children, so lines go straight down and
 * different families never overlap. Children without families of their own
 * are listed vertically to keep the tree narrow.
 */
export function computeLayout(people: Person[]): TreeLayout {
  const W = config.columnWidth
  const GAP = config.groupGap
  const stackStep = config.boxHeight + 16
  const byId = new Map(people.map((p) => [p.id, p]))
  const order = new Map(people.map((p, i) => [p.id, i]))

  const partnerMap = new Map<string, string[]>()
  const couples: Array<[string, string]> = []
  const link = (a: string, b: string) => partnerMap.set(a, [...(partnerMap.get(a) ?? []), b])
  for (const p of people) {
    for (const q of p.partners ?? []) {
      if (!byId.has(q) || partnerMap.get(p.id)?.includes(q)) continue
      link(p.id, q)
      link(q, p.id)
      couples.push([p.id, q])
    }
  }
  const partnersOf = (id: string) => partnerMap.get(id) ?? []
  const parentsOf = (id: string) => (byId.get(id)!.parents ?? []).filter((p) => byId.has(p))
  const isBlood = (id: string) => parentsOf(id).length > 0
  const rootOf = (id: string): string => (isBlood(id) ? rootOf(parentsOf(id)[0]) : id)

  // When both spouses come from families in the tree, the couple is drawn in the
  // husband's family; the wife's line comes over from her parents.
  const livesWith = new Map<string, string>()
  for (const [a, b] of couples) {
    if (!isBlood(a) || !isBlood(b)) continue
    const [home, guest] = byId.get(a)!.gender === 'f' && byId.get(b)!.gender !== 'f' ? [b, a] : [a, b]
    livesWith.set(guest, home)
  }

  /** The person in the middle, spouses around: one spouse → right; several → alternating. */
  function membersOf(id: string) {
    const spouses = partnersOf(id).filter((q) => !isBlood(q) || livesWith.get(q) === id)
    if (spouses.length >= 2) {
      const left = spouses.filter((_, i) => i % 2 === 0).reverse()
      return [...left, id, ...spouses.filter((_, i) => i % 2 === 1)]
    }
    if (spouses.length === 1) {
      const s = spouses[0]
      // A wife from another family sits on the side her family is drawn on.
      const fromLeft = isBlood(s) && order.get(rootOf(s))! < order.get(rootOf(id))!
      return fromLeft ? [s, id] : [id, s]
    }
    return [id]
  }

  const used = new Set<string>()
  const rowLines: number[] = []
  const lineWidth = (n: Node) => n.members.length * W

  function build(id: string, depth: number): Node {
    const members = membersOf(id)
    members.forEach((m) => used.add(m))
    rowLines[depth] = Math.max(rowLines[depth] ?? 1, 1)

    const kids = people.filter(
      (c) => !used.has(c.id) && !livesWith.has(c.id) && parentsOf(c.id).some((p) => members.includes(p)),
    )
    const byKey = new Map<string, string[]>()
    for (const c of kids) {
      const key = parentsOf(c.id).filter((p) => members.includes(p)).sort().join('+')
      byKey.set(key, [...(byKey.get(key) ?? []), c.id])
    }
    const xIn = (m: string) => members.indexOf(m) * W + W / 2
    const groups: Group[] = [...byKey.entries()]
      .map(([key, ids]) => {
        const drop = key.split('+').reduce((s, p) => s + xIn(p), 0) / key.split('+').length
        const nodes = ids.map((k) => build(k, depth + 1))
        const stacked = config.stackLeafSiblings && nodes.length >= 2 && nodes.every((n) => !n.groups.length)
        if (stacked) {
          rowLines[depth + 1] = Math.max(rowLines[depth + 1] ?? 1, nodes.length)
          return { drop, kids: nodes, stacked, width: STACK_INDENT + Math.max(...nodes.map(lineWidth)), anchor: SPINE }
        }
        let x = 0
        const attaches = nodes.map((n) => {
          const a = x + n.attach
          x += n.width + GAP
          return a
        })
        return { drop, kids: nodes, stacked, width: x - GAP, anchor: (attaches[0] + attaches.at(-1)!) / 2 }
      })
      .sort((a, b) => a.drop - b.drop)

    // Centre the parents above their children.
    const unitW = members.length * W
    let unitLeft = 0
    let kidsLeft = 0
    let kidsW = 0
    if (groups.length) {
      let x = 0
      let anchors = 0
      for (const g of groups) {
        anchors += x + g.anchor
        x += g.width + GAP
      }
      kidsW = x - GAP
      unitLeft = anchors / groups.length - groups.reduce((s, g) => s + g.drop, 0) / groups.length
      if (unitLeft < 0) {
        kidsLeft = -unitLeft
        unitLeft = 0
      }
    }
    return {
      members,
      depth,
      groups,
      width: Math.max(unitLeft + unitW, kidsLeft + kidsW),
      unitLeft,
      kidsLeft,
      attach: unitLeft + xIn(id),
    }
  }

  // One tree per top ancestor, left to right in the order of the data file.
  const roots: Node[] = []
  for (const p of people) {
    if (used.has(p.id) || isBlood(p.id) || partnersOf(p.id).some(isBlood)) continue
    const group = [p.id, ...partnersOf(p.id)]
    const hub = group.reduce((a, b) => (partnersOf(b).length > partnersOf(a).length ? b : a))
    roots.push(build(hub, 0))
  }
  for (const p of people) if (!used.has(p.id)) roots.push(build(p.id, 0)) // anything unreachable

  // Rows: a row with a vertical list is taller.
  const rowTop: number[] = []
  let top = config.margin
  rowLines.forEach((n, d) => {
    rowTop[d] = top
    top += (n - 1) * stackStep + config.rowHeight
  })

  const placed = new Map<string, PlacedPerson>()
  const put = (id: string, x: number, depth: number, line = 0, spineX?: number) =>
    placed.set(id, {
      person: byId.get(id)!,
      generation: depth,
      x,
      y: rowTop[depth] + line * stackStep + config.boxHeight / 2,
      spineX,
    })

  function place(n: Node, left: number) {
    n.members.forEach((m, i) => put(m, left + n.unitLeft + i * W + W / 2, n.depth))
    let x = left + n.kidsLeft
    for (const g of n.groups) {
      if (g.stacked) {
        g.kids.forEach((k, line) =>
          k.members.forEach((m, i) => put(m, x + STACK_INDENT + i * W + W / 2, k.depth, line, x + SPINE)),
        )
      } else {
        let kx = x
        for (const k of g.kids) {
          place(k, kx)
          kx += k.width + GAP
        }
      }
      x += g.width + GAP
    }
  }
  let x = config.margin
  for (const r of roots) {
    place(r, x)
    x += r.width + GAP * 2
  }

  return {
    placed,
    couples,
    width: x - GAP * 2 + config.margin + (W - config.boxWidth) / 2,
    height: top - config.rowHeight + config.boxHeight + config.margin,
  }
}
