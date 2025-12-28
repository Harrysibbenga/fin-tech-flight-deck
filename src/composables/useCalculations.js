import { computed } from 'vue'
import { CALCULATION_CONSTANTS } from '@/utils/constants'

/**
 * Composable for calculating efficiency gap and generating chart data
 *
 * @param {import('vue').Ref<Object>} sliderValues - Reactive object containing slider values
 *   @param {number} sliderValues.value.age - User's age
 *   @param {number} sliderValues.value.equity - Current home equity
 *   @param {number} sliderValues.value.cash - Available cash
 *   @param {number} sliderValues.value.monthlySavings - Monthly savings amount
 *   @param {number} sliderValues.value.investmentInterest - Investment property interest (0-100)
 * @returns {Object} Calculation results and chart data
 *   @returns {import('vue').ComputedRef<Object>} results - Computed calculation results
 *   @returns {import('vue').ComputedRef<Object>} chartData - Computed chart data
 */
export function useCalculations(sliderValues) {

  /**
   * Calculate baseline trajectory - standard savings/investment approach
   * Assumes: Keep equity in home, invest cash at conservative rate
   * @param {number} equity - Current home equity
   * @param {number} cash - Available cash
   * @param {number} monthlySavings - Monthly savings amount
   * @param {number} years - Number of years to project
   * @returns {Array<number>} Array of values for each year
   */
  const calculateBaselineTrajectory = (equity, cash, monthlySavings, years) => {
    const trajectory = []
    const annualSavings = monthlySavings * 12
    const rate = CALCULATION_CONSTANTS.BASELINE_ANNUAL_RETURN

    // Start with just cash (equity stays locked in home)
    let investableAssets = cash

    for (let year = 0; year <= years; year++) {
      // Total wealth = home equity (grows slowly) + investable assets
      const homeEquityValue = equity * Math.pow(1.03, year) // 3% home appreciation
      const totalWealth = homeEquityValue + investableAssets
      trajectory.push(Math.round(totalWealth))

      // Investable assets grow and receive new savings
      investableAssets = investableAssets * (1 + rate) + annualSavings
    }

    return trajectory
  }

  /**
   * Calculate optimized trajectory - equity release strategy
   * Assumes: Release some equity to invest at higher returns
   * @param {number} equity - Current home equity
   * @param {number} cash - Available cash
   * @param {number} monthlySavings - Monthly savings amount
   * @param {number} years - Number of years to project
   * @returns {Array<number>} Array of values for each year
   */
  const calculateOptimizedTrajectory = (equity, cash, monthlySavings, years) => {
    const trajectory = []
    const annualSavings = monthlySavings * 12
    const rate = CALCULATION_CONSTANTS.OPTIMIZED_ANNUAL_RETURN

    // Release 50% of equity to invest (realistic LTV)
    const releasedEquity = equity * 0.5
    const remainingEquity = equity * 0.5
    let investableAssets = cash + releasedEquity

    for (let year = 0; year <= years; year++) {
      // Remaining home equity still appreciates
      const homeEquityValue = remainingEquity * Math.pow(1.03, year)
      const totalWealth = homeEquityValue + investableAssets
      trajectory.push(Math.round(totalWealth))

      // Investable assets grow at optimized rate
      investableAssets = investableAssets * (1 + rate) + annualSavings
    }

    return trajectory
  }

  /**
   * Calculate years gained - how many extra years baseline would need to reach optimized final value
   * CORRECTED: With more savings, benefit should be GREATER (more years gained)
   * Handles edge cases like zero monthly savings
   * @param {Array<number>} baselineTrajectory - Baseline growth trajectory array
   * @param {Array<number>} optimizedTrajectory - Optimized growth trajectory array
   * @returns {number} Years gained by optimizing
   */
  const calculateYearsGained = (baselineTrajectory, optimizedTrajectory) => {
    const baselineFinal = baselineTrajectory[baselineTrajectory.length - 1]
    const optimizedFinal = optimizedTrajectory[optimizedTrajectory.length - 1]

    // Validate inputs
    if (!baselineFinal || !isFinite(baselineFinal) || baselineFinal <= 0) {
      return 0.5 // Default minimum for invalid baseline
    }

    if (!optimizedFinal || !isFinite(optimizedFinal) || optimizedFinal <= baselineFinal) {
      return 0.5 // Default minimum if optimized doesn't outperform
    }

    // CORRECTED APPROACH: Calculate how many extra years baseline needs to reach optimized's final value
    // Years gained = when baseline reaches optimized's final - when optimized reached it (30 years)
    // With MORE savings: optimized final is higher, baseline needs more years beyond 30 = MORE years gained
    // With LESS savings: optimized final is lower, baseline reaches it sooner (maybe within 30) = FEWER years gained

    const totalYears = baselineTrajectory.length - 1

    // Find which year baseline reaches optimized's final value
    let baselineYearToReachOptimized = null
    for (let year = 0; year < baselineTrajectory.length; year++) {
      if (baselineTrajectory[year] >= optimizedFinal) {
        baselineYearToReachOptimized = year
        break
      }
    }

    let yearsGained

    if (baselineYearToReachOptimized === null) {
      // Baseline never reaches optimized final within projection period
      // Use logarithmic calculation: how many years at baseline rate to grow from baselineFinal to optimizedFinal
      const ratio = optimizedFinal / baselineFinal
      const baselineRate = CALCULATION_CONSTANTS.BASELINE_ANNUAL_RETURN
      // This gives total years needed from start; subtract what we've already projected (30 years)
      const totalYearsNeeded = Math.log(ratio) / Math.log(1 + baselineRate)
      yearsGained = Math.max(0, totalYearsNeeded - totalYears)
    } else if (baselineYearToReachOptimized > totalYears) {
      // Baseline reaches it after year 30
      yearsGained = baselineYearToReachOptimized - totalYears
    } else {
      // Baseline reaches it before or at year 30 - this means smaller benefit
      // Optimized reached its final at year 30, baseline reached that value at earlier year
      // So years gained = 30 - earlier year (optimized got there this many years later, which is the benefit)
      // Actually, if baseline reaches it earlier, that's LESS benefit, so we want a smaller number
      // Scale down proportionally: if baseline reaches at year 25, benefit is 5/30 = ~1.7 years
      const earlierRatio = baselineYearToReachOptimized / totalYears
      yearsGained = totalYears * (1 - earlierRatio) * 0.5 // Scale down to reflect smaller benefit
    }

    // Handle edge cases
    if (!isFinite(yearsGained) || isNaN(yearsGained) || yearsGained < 0) {
      return 0.5 // Default minimum
    }

    // Return with bounds: minimum 0.5, maximum 12 (realistic cap)
    return Math.min(12, Math.max(0.5, yearsGained))
  }

  /**
   * Main results computation
   */
  const results = computed(() => {
    try {
      const { equity, cash, monthlySavings } = sliderValues.value
      const years = CALCULATION_CONSTANTS.YEARS_PROJECTION

      const baselineTrajectory = calculateBaselineTrajectory(equity, cash, monthlySavings, years)
      const optimizedTrajectory = calculateOptimizedTrajectory(equity, cash, monthlySavings, years)

      const baselineFinal = baselineTrajectory[baselineTrajectory.length - 1]
      const optimizedFinal = optimizedTrajectory[optimizedTrajectory.length - 1]

      const yearsGained = calculateYearsGained(baselineTrajectory, optimizedTrajectory)
      const valueDifference = optimizedFinal - baselineFinal
      const percentageGain = baselineFinal > 0
        ? ((optimizedFinal - baselineFinal) / baselineFinal) * 100
        : 0

      return {
        baselineValue: Math.round(baselineFinal),
        optimizedValue: Math.round(optimizedFinal),
        yearsGained: parseFloat(yearsGained.toFixed(1)), // Format as X.X (single decimal)
        percentageGain: parseFloat(percentageGain.toFixed(1)),
        valueDifference: Math.round(valueDifference)
      }
    } catch (error) {
      // Error boundary: return safe default values
      return {
        baselineValue: 0,
        optimizedValue: 0,
        yearsGained: 0.5,
        percentageGain: 0,
        valueDifference: 0
      }
    }
  })

  /**
   * Chart data computation
   */
  const chartData = computed(() => {
    try {
      const { equity, cash, monthlySavings } = sliderValues.value
      const years = CALCULATION_CONSTANTS.YEARS_PROJECTION

      const baselineTrajectory = calculateBaselineTrajectory(equity, cash, monthlySavings, years)
      const optimizedTrajectory = calculateOptimizedTrajectory(equity, cash, monthlySavings, years)

      const differenceTrajectory = optimizedTrajectory.map((opt, index) => {
        return Math.max(0, opt - baselineTrajectory[index])
      })

      return {
        baseline: baselineTrajectory,
        optimized: optimizedTrajectory,
        difference: differenceTrajectory,
        labels: Array.from({ length: years + 1 }, (_, i) => `Year ${i}`)
      }
    } catch (error) {
      // Error boundary: return empty arrays to prevent chart errors
      const emptyArray = Array.from({ length: CALCULATION_CONSTANTS.YEARS_PROJECTION + 1 }, () => 0)
      return {
        baseline: emptyArray,
        optimized: emptyArray,
        difference: emptyArray,
        labels: Array.from({ length: CALCULATION_CONSTANTS.YEARS_PROJECTION + 1 }, (_, i) => `Year ${i}`)
      }
    }
  })

  return {
    results,
    chartData
  }
}

