import { describe, it, expect } from 'vitest'
import { parseValues } from '../data'
import {
  buildFrequencyTable,
  meanGrouped,
  meanRaw,
  medianGrouped,
  modeGrouped,
  modeMidpoint,
  variancePopulationGrouped,
  varianceSampleGrouped,
  standardDeviation,
  variancePopulationRaw,
  varianceSampleRaw,
  computeMeasures,
} from '../math'

const SAMPLE = [1, 2, 2, 3, 4]

describe('parseValues', () => {
  it('parses values separated by spaces, commas and semicolons', () => {
    expect(parseValues('1,5 2;3,5, 4')).toEqual([1.5, 2, 3.5, 4])
  })

  it('ignores invalid tokens', () => {
    expect(parseValues('abc 1 -3 0 2.5')).toEqual([1, 2.5])
  })
})

describe('buildFrequencyTable', () => {
  const table = buildFrequencyTable(SAMPLE)

  it('counts total frequencies and number of classes', () => {
    expect(table.n).toBe(5)
    expect(table.k).toBe(4)
    expect(table.sumFi).toBe(5)
  })

  it('computes absolute, relative and cumulative frequencies', () => {
    expect(table.rows.map((row) => row.fi)).toEqual([1, 2, 1, 1])
    expect(table.rows.map((row) => row.Fi)).toEqual([1, 3, 4, 5])
    expect(table.rows.map((row) => row.fr)).toEqual([0.2, 0.4, 0.2, 0.2])
  })

  it('keeps sum of relative frequencies at 100%', () => {
    expect(table.sumFiPct).toBeCloseTo(100, 5)
  })
})

describe('mean', () => {
  it('computes raw mean', () => {
    expect(meanRaw(SAMPLE)).toBeCloseTo(2.4, 10)
  })

  it('computes grouped mean from midpoints', () => {
    const table = buildFrequencyTable(SAMPLE)
    expect(meanGrouped(table)).toBeCloseTo(2.425, 10)
  })
})

describe('median', () => {
  it('computes median from median class', () => {
    const table = buildFrequencyTable(SAMPLE)
    expect(medianGrouped(table)).toBeCloseTo(2.3125, 10)
  })
})

describe('mode', () => {
  it('computes mode by Czuber formula', () => {
    const table = buildFrequencyTable(SAMPLE)
    expect(modeGrouped(table)).toBeCloseTo(2.125, 10)
  })

  it('computes mode by midpoint of the modal class', () => {
    const table = buildFrequencyTable(SAMPLE)
    expect(modeMidpoint(table)).toBeCloseTo(2.125, 10)
  })

  it('returns null when all classes have equal frequency', () => {
    const table = buildFrequencyTable(SAMPLE)
    table.rows.forEach((row) => {
      row.fi = 2
    })
    expect(modeGrouped(table)).toBeNull()
  })
})

describe('variance and standard deviation', () => {
  const table = buildFrequencyTable(SAMPLE)
  const mean = meanGrouped(table)

  it('computes population and sample variance (grouped)', () => {
    expect(variancePopulationGrouped(table, mean)).toBeCloseTo(0.585, 10)
    expect(varianceSampleGrouped(table, mean)).toBeCloseTo(0.73125, 10)
  })

  it('computes raw variance', () => {
    expect(variancePopulationRaw(SAMPLE)).toBeCloseTo(1.04, 10)
    expect(varianceSampleRaw(SAMPLE)).toBeCloseTo(1.3, 10)
  })

  it('standard deviation is the square root of variance', () => {
    expect(standardDeviation(0.585)).toBeCloseTo(Math.sqrt(0.585), 10)
  })
})

describe('computeMeasures', () => {
  it('assembles all measures', () => {
    const table = buildFrequencyTable(SAMPLE)
    const measures = computeMeasures(table)
    expect(measures.mean).toBeCloseTo(2.425, 10)
    expect(measures.median).toBeCloseTo(2.3125, 10)
    expect(measures.mode).toBeCloseTo(2.125, 10)
    expect(measures.stdDeviationPopulation).toBeCloseTo(Math.sqrt(0.585), 10)
  })
})