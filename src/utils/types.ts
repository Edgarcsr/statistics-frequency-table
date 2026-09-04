export interface FrequencyRow {
  index: number
  lower: number
  upper: number
  className: string
  fi: number
  fr: number
  frPct: number
  Fi: number
  FiPct: number
  xi: number
  xiFi: number
}

export interface FrequencyTable {
  rows: FrequencyRow[]
  n: number
  k: number
  h: number
  min: number
  max: number
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