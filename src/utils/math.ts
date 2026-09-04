import type { FrequencyRow, FrequencyTable, Measures } from './types'

export function roundTo(value: number, precision = 2): number {
  const factor = 10 ** precision
  return Math.round(value * factor) / factor
}

export function sturgesK(n: number): number {
  if (n <= 0) return 0
  return Math.max(1, Math.ceil(1 + 3.322 * Math.log10(n)))
}

export function totalAmplitude(min: number, max: number): number {
  return max - min
}

export function classWidth(min: number, max: number, k: number): number {
  if (k <= 0 || max <= min) return 0
  return roundTo(totalAmplitude(min, max) / k, 2)
}

function countInClass(values: number[], lower: number, upper: number, isLast: boolean): number {
  return values.reduce((count, value) => {
    if (value < lower) return count
    if (isLast) return value <= upper ? count + 1 : count
    return value < upper ? count + 1 : count
  }, 0)
}

export function buildFrequencyTable(values: number[]): FrequencyTable {
  const n = values.length
  const min = Math.min(...values)
  const max = Math.max(...values)
  const k = sturgesK(n)
  const h = classWidth(min, max, k)

  const rows: FrequencyRow[] = []
  let Fi = 0
  let sumXiFi = 0
  let sumFiPct = 0

  for (let i = 0; i < k; i++) {
    const lower = i === 0 ? min : roundTo(min + i * h, 2)
    const upper = i === k - 1 ? max : roundTo(min + (i + 1) * h, 2)
    const isLast = i === k - 1
    const fi = countInClass(values, lower, upper, isLast)
    const fr = n > 0 ? fi / n : 0
    const frPct = fr * 100
    Fi += fi
    const FiPct = n > 0 ? (Fi / n) * 100 : 0
    const xi = classMidpoint(lower, upper)
    const xiFi = xi * fi
    sumXiFi += xiFi
    sumFiPct += frPct

    rows.push({
      index: i + 1,
      lower,
      upper,
      className: `${String(lower)} — ${String(upper)}`,
      fi,
      fr,
      frPct,
      Fi,
      FiPct,
      xi,
      xiFi,
    })
  }

  return {
    rows,
    n,
    k,
    h,
    min,
    max,
    sumFi: Fi,
    sumFiPct,
    sumXiFi: sumXiFi,
  }
}

export function meanRaw(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

export function meanGrouped(table: FrequencyTable): number {
  if (table.n === 0) return 0
  return table.sumXiFi / table.n
}

export function classMidpoint(lower: number, upper: number): number {
  return (lower + upper) / 2
}

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

export function modeMidpoint(table: FrequencyTable): number | null {
  if (table.rows.length === 0) return null
  const modal = table.rows.find((row) => row.fi === Math.max(...table.rows.map((r) => r.fi)))
  if (!modal || modal.fi === 0) return null
  return classMidpoint(modal.lower, modal.upper)
}

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

export function computeMeasures(table: FrequencyTable): Measures {
  const mean = meanGrouped(table)
  const median = medianGrouped(table)
  const mode = modeGrouped(table)
  const variancePopulation = variancePopulationGrouped(table, mean)
  const varianceSample = varianceSampleGrouped(table, mean)

  return {
    mean,
    median,
    mode,
    modeMidpoint: modeMidpoint(table),
    variancePopulation,
    varianceSample,
    stdDeviationPopulation: standardDeviation(variancePopulation),
    stdDeviationSample: standardDeviation(varianceSample),
  }
}