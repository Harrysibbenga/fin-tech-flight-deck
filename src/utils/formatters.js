/**
 * Format a number as currency
 * @param {number} value - The number to format
 * @param {string} currency - Currency code (default: 'GBP')
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(value, currency = 'GBP', decimals = 0) {
  if (typeof value !== 'number' || isNaN(value)) {
    return currency === 'GBP' ? '£0' : '$0'
  }

  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value)
}

/**
 * Format a number with thousand separators
 * @param {number} value - The number to format
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted number string
 */
export function formatNumber(value, decimals = 0) {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0'
  }

  return new Intl.NumberFormat('en-GB', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value)
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

