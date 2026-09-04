import { describe, it, expect } from 'vitest'
import { parseValues } from '../data'
import {
  average,
  numberOfClasses,
  totalAmplitude,
  classAmplitude,
  frequencyInClass,
  buildFrequencyTable,
  medianGrouped,
  modeGrouped,
  variancePopulationGrouped,
  varianceSampleGrouped,
  standardDeviation,
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

describe('basic calculations', () => {
  it('average is sum divided by count', () => {
    expect(average(SAMPLE)).toBeCloseTo(2.4, 10)
  })

  it('number of classes is the square root rounded up', () => {
    expect(numberOfClasses(5)).toBe(3)
    expect(numberOfClasses(30)).toBe(6)
  })

  it('total amplitude is max minus min', () => {
    expect(totalAmplitude(1, 4)).toBe(3)
  })

  it('class amplitude is total amplitude divided by number of classes', () => {
    expect(classAmplitude(3, 3)).toBe(1)
  })

  it('frequency in class counts values inside the limits', () => {
    expect(frequencyInClass(SAMPLE, 1, 2, false)).toBe(1)
    expect(frequencyInClass(SAMPLE, 2, 3, false)).toBe(2)
    expect(frequencyInClass(SAMPLE, 3, 4, true)).toBe(2)
  })
})

describe('buildFrequencyTable', () => {
  const table = buildFrequencyTable(SAMPLE)

  it('counts total frequencies and number of classes', () => {
    expect(table.n).toBe(5)
    expect(table.k).toBe(3)
    expect(table.sumFi).toBe(5)
  })

  it('computes absolute, relative and cumulative frequencies', () => {
    expect(table.rows.map((row) => row.frequency)).toEqual([1, 2, 2])
    expect(table.rows.map((row) => row.cumulativeFrequency)).toEqual([1, 3, 5])
    expect(table.rows.map((row) => row.relativePct)).toEqual([20, 40, 40])
    expect(table.rows.map((row) => row.cumulativeRelativePct)).toEqual([20, 60, 100])
  })

  it('keeps sum of relative frequencies at 100%', () => {
    expect(table.sumFiPct).toBeCloseTo(100, 5)
  })

  it('computes mean and squared deviations per class', () => {
    expect(table.mean).toBeCloseTo(2.7, 10)
    expect(table.rows.map((row) => row.midpoint)).toEqual([1.5, 2.5, 3.5])
    const deviations = table.rows.map((row) => row.squaredDeviationTimesFrequency)
    expect(deviations[0]).toBeCloseTo(1.44, 10)
    expect(deviations[1]).toBeCloseTo(0.08, 10)
    expect(deviations[2]).toBeCloseTo(1.28, 10)
  })
})

describe('median', () => {
  it('computes median from median class (triangle relation)', () => {
    const table = buildFrequencyTable(SAMPLE)
    expect(medianGrouped(table)).toBeCloseTo(2.75, 10)
  })
})

describe('mode', () => {
  it('computes mode by Czuber formula', () => {
    const table = buildFrequencyTable(SAMPLE)
    expect(modeGrouped(table)).toBeCloseTo(3, 10)
  })

  it('returns null when all classes have equal frequency', () => {
    const table = buildFrequencyTable(SAMPLE)
    table.rows.forEach((row) => {
      row.frequency = 2
    })
    expect(modeGrouped(table)).toBeNull()
  })
})

describe('variance and standard deviation', () => {
  const table = buildFrequencyTable(SAMPLE)

  it('computes population and sample variance (grouped)', () => {
    expect(variancePopulationGrouped(table)).toBeCloseTo(0.56, 10)
    expect(varianceSampleGrouped(table)).toBeCloseTo(0.7, 10)
  })

  it('standard deviation is the square root of variance', () => {
    expect(standardDeviation(0.56)).toBeCloseTo(Math.sqrt(0.56), 10)
  })
})

describe('computeMeasures', () => {
  it('assembles all measures', () => {
    const table = buildFrequencyTable(SAMPLE)
    const measures = computeMeasures(table)
    expect(measures.mean).toBeCloseTo(2.7, 10)
    expect(measures.median).toBeCloseTo(2.75, 10)
    expect(measures.mode).toBeCloseTo(3, 10)
    expect(measures.modeMidpoint).toBeCloseTo(2.5, 10)
    expect(measures.stdDeviationPopulation).toBeCloseTo(Math.sqrt(0.56), 10)
  })
})