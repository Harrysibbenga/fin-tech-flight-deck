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
   * Calculate years gained - how many years earlier you reach your goal with optimization
   * Handles edge cases like zero monthly savings
   * @param {Array<number>} baselineTrajectory - Baseline growth trajectory array
   * @param {Array<number>} optimizedTrajectory - Optimized growth trajectory array
   * @returns {number} Years gained by optimizing
   */
  const calculateYearsGained = (baselineTrajectory, optimizedTrajectory) => {
    const baselineFinal = baselineTrajectory[baselineTrajectory.length - 1]
    
    // Validate inputs
    if (!baselineFinal || !isFinite(baselineFinal) || baselineFinal <= 0) {
      return 0.5 // Default minimum for invalid baseline
    }

    // Find which year the optimized trajectory first exceeds baseline's final value
    let yearsToReachBaseline = optimizedTrajectory.length - 1 // Default to full period
    
    for (let year = 0; year < optimizedTrajectory.length; year++) {
      if (optimizedTrajectory[year] >= baselineFinal) {
        yearsToReachBaseline = year
        break
      }
    }
    
    // Years gained = total years - years needed with optimization
    const totalYears = baselineTrajectory.length - 1
    const yearsGained = totalYears - yearsToReachBaseline
    
    // Handle edge cases
    if (!isFinite(yearsGained) || isNaN(yearsGained)) {
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

