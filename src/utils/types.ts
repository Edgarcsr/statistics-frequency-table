export interface FrequencyRow {
  index: number
  lower: number
  upper: number
  classLabel: string
  frequency: number
  relativePct: number
  cumulativeFrequency: number
  cumulativeRelativePct: number
  midpoint: number
  midpointTimesFrequency: number
  squaredDeviationTimesFrequency: number
}

export interface FrequencyTable {
  rows: FrequencyRow[]
  n: number
  k: number
  h: number
  min: number
  max: number
  mean: number
  sumFi: number
  sumFiPct: number
  sumXiFi: number
}

export interface Measures {
  mean: number
  median: number
  mode: number | null
  modeMidpoint: number | null
  variancePopulation: number
  varianceSample: number
  stdDeviationPopulation: number
  stdDeviationSample: number
}