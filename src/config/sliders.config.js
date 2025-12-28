import { formatYears, formatCurrency, formatMonthly } from '@/utils/formatters'

/**
 * Slider configurations for the calculator
 * Each slider defines its label, range, default value, and formatting function
 */
export const SLIDER_CONFIGS = [
  {
    id: 'age',
    label: 'Your Age',
    min: 25,
    max: 70,
    step: 1,
    default: 32,
    format: (val) => `${val} years`
  },
  {
    id: 'equity',
    label: 'Current Home Equity',
    min: 0,
    max: 500000,
    step: 5000,
    default: 75000,
    format: (val) => formatCurrency(val, 'GBP', 0)
  },
  {
    id: 'cash',
    label: 'Available Cash',
    min: 0,
    max: 100000,
    step: 1000,
    default: 15000,
    format: (val) => formatCurrency(val, 'GBP', 0)
  },
  {
    id: 'monthlySavings',
    label: 'Monthly Savings',
    min: 0,
    max: 5000,
    step: 50,
    default: 500,
    format: (val) => formatMonthly(val)
  },
  {
    id: 'investmentInterest',
    label: 'Investment Property Interest',
    min: 0,
    max: 100,
    step: 1,
    default: 50,
    format: (val) => `${val}%`
  }
]

/**
 * Get slider configuration by ID
 * @param {string} id - Slider ID
 * @returns {Object|null} Slider configuration or null if not found
 */
export function getSliderConfig(id) {
  return SLIDER_CONFIGS.find(config => config.id === id) || null
}

/**
 * Get default slider values as an object
 * @returns {Object} Object with slider IDs as keys and default values as values
 */
export function getDefaultSliderValues() {
  return SLIDER_CONFIGS.reduce((acc, config) => {
    acc[config.id] = config.default
    return acc
  }, {})
}

