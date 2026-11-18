/**
 * One family member. Generations are NOT stored — they are computed from `parents`:
 *   - no parents listed → top row, unless a partner sits lower
 *   - parents listed    → one row below the lowest parent
 *   - partners          → always on the same row, side by side
 */
export interface Person {
  /** Unique, stable id (latin letters, dashes). Never change it once used. */
  id: string
  /** Full name as it should appear in the box. */
  name: string
  /** 'm' / 'f' — only used for the colour accent on the box. */
  gender?: 'm' | 'f'
  /** Ids of mother/father (0, 1 or 2). With two parents the line starts between them. */
  parents?: string[]
  /** Ids of spouses. Only one side needs to list it. Several are allowed. */
  partners?: string[]
  /** Year or full date of birth / death, as text: "1955", "12.03.1955". */
  born?: string
  died?: string
  /** Photo file in /public/photos, e.g. "photos/sagyn.jpg". Without it, initials are shown. */
  photo?: string
  /** Small grey line inside the box, e.g. "жена · 4 детей". */
  extra?: string
}

export interface PlacedPerson {
  person: Person
  generation: number
  x: number // box centre
  y: number // box centre
  /** Set when this person is part of a vertical sibling list: x of its vertical line. */
  spineX?: number
}

export interface TreeLayout {
  placed: Map<string, PlacedPerson>
  couples: Array<[string, string]>
  width: number
  height: number
}
