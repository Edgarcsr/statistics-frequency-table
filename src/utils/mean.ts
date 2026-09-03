import type { FrequencyTable } from './types'

export function meanRaw(heights: number[]): number {
  if (heights.length === 0) return 0
  return heights.reduce((sum, value) => sum + value, 0) / heights.length
}

export function meanGrouped(table: FrequencyTable): number {
  if (table.n === 0) return 0
  return table.sumXiFi / table.n
}