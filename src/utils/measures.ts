import type { FrequencyTable, Measures } from './types'
import { meanGrouped } from './mean'
import { medianGrouped } from './median'
import { modeGrouped } from './mode'
import { variancePopulationGrouped, varianceSampleGrouped } from './variance'
import { standardDeviation } from './standard-deviation'

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
    variancePopulation,
    varianceSample,
    stdDeviationPopulation: standardDeviation(variancePopulation),
    stdDeviationSample: standardDeviation(varianceSample),
  }
}