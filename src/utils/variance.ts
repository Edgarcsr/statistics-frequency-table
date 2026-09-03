import type { FrequencyTable } from './types'

function sumSquaredDeviationsGrouped(table: FrequencyTable, mean: number): number {
  return table.rows.reduce(
    (sum, row) => sum + row.fi * (row.xi - mean) ** 2,
    0,
  )
}

export function variancePopulationGrouped(table: FrequencyTable, mean: number): number {
  if (table.n === 0) return 0
  return sumSquaredDeviationsGrouped(table, mean) / table.n
}

export function varianceSampleGrouped(table: FrequencyTable, mean: number): number {
  if (table.n <= 1) return 0
  return sumSquaredDeviationsGrouped(table, mean) / (table.n - 1)
}