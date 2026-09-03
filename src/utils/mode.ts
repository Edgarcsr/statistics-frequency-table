import type { FrequencyTable } from './types'

export function modeGrouped(table: FrequencyTable): number | null {
  if (table.rows.length === 0) return null

  const maxFi = Math.max(...table.rows.map((row) => row.fi))
  if (maxFi === 0) return null

  const allEqual = table.rows.every((row) => row.fi === maxFi)
  if (allEqual) return null

  const modalIndex = table.rows.findIndex((row) => row.fi === maxFi)
  const modal = table.rows[modalIndex]

  const d1 = modal.fi - (modalIndex > 0 ? table.rows[modalIndex - 1].fi : 0)
  const d2 = modal.fi - (modalIndex < table.rows.length - 1 ? table.rows[modalIndex + 1].fi : 0)
  const denominator = d1 + d2

  if (denominator === 0) return modal.lower

  return modal.lower + (d1 / denominator) * table.h
}