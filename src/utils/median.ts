import type { FrequencyTable } from './types'

export function medianGrouped(table: FrequencyTable): number {
  if (table.n === 0) return 0
  const target = table.n / 2
  let previousFi = 0

  for (const row of table.rows) {
    if (row.Fi >= target) {
      const fAnt = previousFi
      return row.lower + ((target - fAnt) / row.fi) * table.h
    }
    previousFi = row.Fi
  }

  return 0
}