import type { FrequencyRow, FrequencyTable } from './types'

export function roundTo(value: number, precision = 2): number {
  const factor = 10 ** precision
  return Math.round(value * factor) / factor
}

export function sturgesK(n: number): number {
  if (n <= 0) return 0
  return Math.max(1, Math.ceil(1 + 3.322 * Math.log10(n)))
}

export function classWidth(min: number, max: number, k: number): number {
  if (k <= 0 || max <= min) return 0
  return roundTo((max - min) / k, 2)
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
    const xi = (lower + upper) / 2
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

