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
 * @param {import('vue').Ref<boolean>} isOptimized - Reactive boolean for optimization state
 * @returns {Object} Calculation results and chart data
 *   @returns {import('vue').ComputedRef<Object>} results - Computed calculation results
 *   @returns {import('vue').ComputedRef<Object>} chartData - Computed chart data
 */
export function useCalculations(sliderValues) {
  /**
   * Calculate baseline growth trajectory (current strategy)
   * @param {number} equity - Current home equity
   * @param {number} cash - Available cash
   * @param {number} monthlySavings - Monthly savings amount
   * @param {number} years - Number of years to project
   * @returns {Array<number>} Array of values for each year
   */
  const calculateBaselineTrajectory = (equity, cash, monthlySavings, years) => {
    const trajectory = []
    let currentValue = equity + cash

    for (let year = 0; year <= years; year++) {
      trajectory.push(Math.round(currentValue))
      // Compound: previous total grows at baseline rate + annual savings added
      currentValue = currentValue * (1 + CALCULATION_CONSTANTS.BASELINE_ANNUAL_RETURN) + (monthlySavings * 12)
    }

    return trajectory
  }

  /**
   * Calculate optimized growth trajectory (with equity optimization)
   * Each year compounds on the previous year's total
   * @param {number} equity - Current home equity
   * @param {number} cash - Available cash
   * @param {number} monthlySavings - Monthly savings amount
   * @param {number} years - Number of years to project
   * @returns {Array<number>} Array of values for each year
   */
  const calculateOptimizedTrajectory = (equity, cash, monthlySavings, years) => {
    const trajectory = []
    let currentValue = equity + cash

    for (let year = 0; year <= years; year++) {
      trajectory.push(Math.round(currentValue))
      // Optimized: higher return rate with leverage effect on growth
      currentValue = currentValue * (1 + CALCULATION_CONSTANTS.OPTIMIZED_ANNUAL_RETURN) + (monthlySavings * 12)
    }

    return trajectory
  }

  /**
   * Calculate the efficiency gap (years gained)
   * Years gained = how many extra years baseline would need to reach optimized final value
   * Uses logarithmic calculation based on compound growth
   * @param {number} baselineFinal - Final value with baseline strategy
   * @param {number} optimizedFinal - Final value with optimized strategy
   * @param {number} monthlySavings - Monthly savings amount (used for validation)
   * @returns {number} Years gained by optimizing
   */
  const calculateYearsGained = (baselineFinal, optimizedFinal, monthlySavings) => {
    if (baselineFinal <= 0 || optimizedFinal <= baselineFinal) {
      return 0.5 // Minimum meaningful value
    }

    // Calculate how many extra years baseline would need at its growth rate
    // Formula: years = log(optimizedFinal / baselineFinal) / log(1 + growthRate)
    const yearsGained = Math.log(optimizedFinal / baselineFinal) / Math.log(1 + CALCULATION_CONSTANTS.BASELINE_ANNUAL_RETURN)

    // Cap at 15 years maximum for realistic display
    // Minimum 0.5 years to always show meaningful value
    return Math.max(0.5, Math.min(15, yearsGained))
  }

  /**
   * Main calculation results
   */
  const results = computed(() => {
    const { age, equity, cash, monthlySavings } = sliderValues.value
    const years = CALCULATION_CONSTANTS.YEARS_PROJECTION

    // Always calculate both trajectories
    const baselineTrajectory = calculateBaselineTrajectory(equity, cash, monthlySavings, years)
    const optimizedTrajectory = calculateOptimizedTrajectory(equity, cash, monthlySavings, years)

    // Get final values
    const baselineFinal = baselineTrajectory[baselineTrajectory.length - 1]
    const optimizedFinal = optimizedTrajectory[optimizedTrajectory.length - 1]

    // Calculate metrics
    const yearsGained = calculateYearsGained(baselineFinal, optimizedFinal, monthlySavings)

    const valueDifference = optimizedFinal - baselineFinal
    const percentageGain = baselineFinal > 0
      ? ((optimizedFinal - baselineFinal) / baselineFinal) * 100
      : 0

    return {
      baselineValue: baselineFinal,
      optimizedValue: optimizedFinal,
      yearsGained: parseFloat(yearsGained.toFixed(1)),
      percentageGain: parseFloat(percentageGain.toFixed(2)),
      valueDifference: parseFloat(valueDifference.toFixed(2))
    }
  })

  /**
   * Chart data for visualization
   */
  const chartData = computed(() => {
    const { equity, cash, monthlySavings } = sliderValues.value
    const years = CALCULATION_CONSTANTS.YEARS_PROJECTION

    // Always calculate both trajectories
    const baselineTrajectory = calculateBaselineTrajectory(equity, cash, monthlySavings, years)
    const optimizedTrajectory = calculateOptimizedTrajectory(equity, cash, monthlySavings, years)

    // Calculate difference for difference view
    const differenceTrajectory = optimizedTrajectory.map((opt, index) => {
      return opt - baselineTrajectory[index]
    })

    return {
      baseline: baselineTrajectory,
      optimized: optimizedTrajectory,
      difference: differenceTrajectory,
      labels: Array.from({ length: years + 1 }, (_, i) => `Year ${i + 1}`)
    }
  })

  return {
    results,
    chartData
  }
}

