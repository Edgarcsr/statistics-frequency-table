import type { FrequencyTable } from './types'

export function meanRaw(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

export function meanGrouped(table: FrequencyTable): number {
  if (table.n === 0) return 0
  return table.sumXiFi / table.n
}