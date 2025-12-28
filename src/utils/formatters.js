/**
 * Format a number as currency with consistent formatting
 * @param {number} value - The number to format
 * @param {string} currency - Currency code (default: 'GBP')
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(value, currency = 'GBP', decimals = 0) {
  if (typeof value !== 'number' || isNaN(value)) {
    return currency === 'GBP' ? '£0' : '$0'
  }

  // Use toLocaleString for consistent formatting
  const formatted = value.toLocaleString('en-GB', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })

  return currency === 'GBP' ? `£${formatted}` : `$${formatted}`
}

/**
 * Format a number with thousand separators (en-GB format)
 * @param {number} value - The number to format
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted number string
 */
export function formatNumber(value, decimals = 0) {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0'
  }

  return value.toLocaleString('en-GB', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

/**
 * Format a number as years with one decimal place
 * @param {number} value - The number to format
 * @returns {string} Formatted years string
 */
export function formatYears(value) {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0.0 years'
  }

  return `${value.toFixed(1)} years`
}

/**
 * Format a number as percentage
 * @param {number} value - The number to format (0-100)
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(value, decimals = 1) {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0%'
  }

  return `${value.toFixed(decimals)}%`
}

/**
 * Format currency per month
 * @param {number} value - The monthly amount
 * @returns {string} Formatted currency per month string
 */
export function formatMonthly(value) {
  return `${formatCurrency(value)}/month`
}

