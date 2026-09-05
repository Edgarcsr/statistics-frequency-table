import type { FrequencyRow, FrequencyTable, Measures } from './types'

export function average(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

export function numberOfClasses(n: number): number {
  if (n <= 0) return 0
  return Math.ceil(Math.sqrt(n))
}

export function sturgesK(n: number): number {
  if (n <= 0) return 0
  return Math.max(1, Math.ceil(1 + 3.322 * Math.log10(n)))
}

export function totalAmplitude(min: number, max: number): number {
  return roundTo(max - min, 2)
}

// This is the distance between each class from one another
export function classAmplitude(total: number, k: number): number {
  if (k <= 0 || total <= 0) return 0
  return roundTo(total / k, 2)
}

export function frequencyInClass(
  values: number[],
  lower: number,
  upper: number,
  isLast: boolean,
): number {
  return values.reduce((count, value) => {
    if (value >= lower && value < upper) return count + 1
    if (isLast && value === upper) return count + 1
    return count
  }, 0)
}

export function buildFrequencyTable(values: number[]): FrequencyTable {
  const n = values.length
  const min = Math.min(...values)
  const max = Math.max(...values)
  const k = numberOfClasses(n)
  const h = classAmplitude(totalAmplitude(min, max), k)

  const rows: FrequencyRow[] = []
  let cumulativeFrequency = 0
  let sumXiFi = 0
  let sumFiPct = 0

  for (let i = 0; i < k; i++) {
    const lower = i === 0 ? min : roundTo(min + i * h, 2)
    const upper =
      i === k - 1
        ? Math.max(max, roundTo(min + (i + 1) * h, 2))
        : roundTo(min + (i + 1) * h, 2)
    const isLast = i === k - 1
    const frequency = frequencyInClass(values, lower, upper, isLast)
    const relativePct = n > 0 ? (frequency / n) * 100 : 0
    cumulativeFrequency += frequency
    const cumulativeRelativePct = n > 0 ? (cumulativeFrequency / n) * 100 : 0
    const midpoint = classMidpoint(lower, upper)
    const midpointTimesFrequency = midpoint * frequency
    sumXiFi += midpointTimesFrequency
    sumFiPct += relativePct

    rows.push({
      index: i + 1,
      lower,
      upper,
      classLabel: `${String(lower)} — ${String(upper)}`,
      frequency,
      relativePct,
      cumulativeFrequency,
      cumulativeRelativePct,
      midpoint,
      midpointTimesFrequency,
      squaredDeviationTimesFrequency: 0,
    })
  }

  const mean = n > 0 ? sumXiFi / n : 0

  for (const row of rows) {
    row.squaredDeviationTimesFrequency = row.frequency * (row.midpoint - mean) ** 2
  }

  return {
    rows,
    n,
    k,
    h,
    min,
    max,
    mean,
    sumFi: cumulativeFrequency,
    sumFiPct,
    sumXiFi,
  }
}

export function meanGrouped(table: FrequencyTable): number {
  if (table.n === 0) return 0
  return table.sumXiFi / table.n
}

export function medianGrouped(table: FrequencyTable): number {
  if (table.n === 0) return 0
  const target = table.n / 2
  let previousFrequency = 0

  for (const row of table.rows) {
    if (row.cumulativeFrequency >= target) {
      const frequencyAnt = previousFrequency
      return row.lower + ((target - frequencyAnt) / row.frequency) * table.h
    }
    previousFrequency = row.cumulativeFrequency
  }

  return 0
}

export function modeGrouped(table: FrequencyTable): number | null {
  if (table.rows.length === 0) return null

  const maxFrequency = Math.max(...table.rows.map((row) => row.frequency))
  if (maxFrequency === 0) return null

  const allEqual = table.rows.every((row) => row.frequency === maxFrequency)
  if (allEqual) return null

  const modalIndex = table.rows.findIndex((row) => row.frequency === maxFrequency)
  const modal = table.rows[modalIndex]

  const d1 = modal.frequency - (modalIndex > 0 ? table.rows[modalIndex - 1].frequency : 0)
  const d2 =
    modal.frequency - (modalIndex < table.rows.length - 1 ? table.rows[modalIndex + 1].frequency : 0)
  const denominator = d1 + d2

  if (denominator === 0) return modal.lower

  return modal.lower + (d1 / denominator) * table.h
}

function sumSquaredDeviationsGrouped(table: FrequencyTable, mean: number): number {
  return table.rows.reduce(
    (sum, row) => sum + row.frequency * (row.midpoint - mean) ** 2,
    0,
  )
}

export function variancePopulationGrouped(table: FrequencyTable): number {
  if (table.n === 0) return 0
  return sumSquaredDeviationsGrouped(table, meanGrouped(table)) / table.n
}

export function varianceSampleGrouped(table: FrequencyTable): number {
  if (table.n <= 1) return 0
  return sumSquaredDeviationsGrouped(table, meanGrouped(table)) / (table.n - 1)
}

export function standardDeviation(variance: number): number {
  return Math.sqrt(variance)
}

function modeMidpoint(table: FrequencyTable): number | null {
  if (table.rows.length === 0) return null
  const maxFrequency = Math.max(...table.rows.map((row) => row.frequency))
  const modal = table.rows.find((row) => row.frequency === maxFrequency)
  if (!modal || modal.frequency === 0) return null
  return classMidpoint(modal.lower, modal.upper)
}

export function computeMeasures(table: FrequencyTable): Measures {
  const mean = meanGrouped(table)
  const variancePopulation = variancePopulationGrouped(table)
  const varianceSample = varianceSampleGrouped(table)

  return {
    mean,
    median: medianGrouped(table),
    mode: modeGrouped(table),
    modeMidpoint: modeMidpoint(table),
    variancePopulation,
    varianceSample,
    stdDeviationPopulation: standardDeviation(variancePopulation),
    stdDeviationSample: standardDeviation(varianceSample),
  }
}

function roundTo(value: number, precision = 2): number {
  const factor = 10 ** precision
  return Math.round(value * factor) / factor
}

function classMidpoint(lower: number, upper: number): number {
  return (lower + upper) / 2
}