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
   * Calculate years gained - how many years earlier you reach your goal with optimization
   * Uses a more realistic approach based on when optimized reaches baseline's final value
   * @param {Array<number>} baselineTrajectory - Baseline growth trajectory array
   * @param {Array<number>} optimizedTrajectory - Optimized growth trajectory array
   * @returns {number} Years gained by optimizing
   */
  const calculateYearsGained = (baselineTrajectory, optimizedTrajectory) => {
    const baselineFinal = baselineTrajectory[baselineTrajectory.length - 1]

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

    // DEBUG: Log calculation values (TEMPORARY - remove after debugging)
    if (process.env.NODE_ENV === 'development') {
      console.log('[Years Calculation] Baseline final:', baselineFinal)
      console.log('[Years Calculation] Optimized trajectory:', optimizedTrajectory.slice(0, 5), '...', optimizedTrajectory.slice(-5))
      console.log('[Years Calculation] Years to reach baseline:', yearsToReachBaseline)
      console.log('[Years Calculation] Total years:', totalYears)
      console.log('[Years Calculation] Years gained (before bounds):', yearsGained)
    }

    // Return with bounds: minimum 0.5, maximum 12 (more realistic cap)
    const boundedYearsGained = Math.min(12, Math.max(0.5, yearsGained))
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[Years Calculation] Years gained (final):', boundedYearsGained)
    }
    
    return boundedYearsGained
  }

  /**
   * Main calculation results
   */
  const results = computed(() => {
    try {
      const { age, equity, cash, monthlySavings } = sliderValues.value
      const years = CALCULATION_CONSTANTS.YEARS_PROJECTION

      // Always calculate both trajectories
      const baselineTrajectory = calculateBaselineTrajectory(equity, cash, monthlySavings, years)
      const optimizedTrajectory = calculateOptimizedTrajectory(equity, cash, monthlySavings, years)

      // Get final values
      const baselineFinal = baselineTrajectory[baselineTrajectory.length - 1]
      const optimizedFinal = optimizedTrajectory[optimizedTrajectory.length - 1]

      // Use the new trajectory-based calculation
      const yearsGained = calculateYearsGained(baselineTrajectory, optimizedTrajectory)

      const valueDifference = optimizedFinal - baselineFinal
      const percentageGain = baselineFinal > 0
        ? ((optimizedFinal - baselineFinal) / baselineFinal) * 100
        : 0

      return {
        baselineValue: Math.round(baselineFinal),
        optimizedValue: Math.round(optimizedFinal),
        yearsGained: parseFloat(yearsGained.toFixed(1)),
        percentageGain: parseFloat(percentageGain.toFixed(2)),
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
   * Chart data for visualization
   */
  const chartData = computed(() => {
    try {
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
    } catch (error) {
      // Error boundary: return empty arrays to prevent chart errors
      const emptyArray = Array.from({ length: CALCULATION_CONSTANTS.YEARS_PROJECTION + 1 }, () => 0)
      return {
        baseline: emptyArray,
        optimized: emptyArray,
        difference: emptyArray,
        labels: Array.from({ length: CALCULATION_CONSTANTS.YEARS_PROJECTION + 1 }, (_, i) => `Year ${i + 1}`)
      }
    }
  })

  return {
    results,
    chartData
  }
}

