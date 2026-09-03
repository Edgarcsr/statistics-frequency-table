import { meanRaw } from './mean'

export function standardDeviation(variance: number): number {
  return Math.sqrt(variance)
}

export function variancePopulationRaw(values: number[]): number {
  if (values.length === 0) return 0
  const mean = meanRaw(values)
  return values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length
}

export function varianceSampleRaw(values: number[]): number {
  if (values.length <= 1) return 0
  const mean = meanRaw(values)
  return values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (values.length - 1)
}