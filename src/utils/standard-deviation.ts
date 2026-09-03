import { meanRaw } from './mean'

export function standardDeviation(variance: number): number {
  return Math.sqrt(variance)
}

export function variancePopulationRaw(heights: number[]): number {
  if (heights.length === 0) return 0
  const mean = meanRaw(heights)
  return heights.reduce((sum, value) => sum + (value - mean) ** 2, 0) / heights.length
}

export function varianceSampleRaw(heights: number[]): number {
  if (heights.length <= 1) return 0
  const mean = meanRaw(heights)
  return heights.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (heights.length - 1)
}