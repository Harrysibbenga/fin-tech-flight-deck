/**
 * Validate email address
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email is valid
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') {
    return false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

/**
 * Validate that a value is within a range
 * @param {number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} True if value is within range
 */
export function isInRange(value, min, max) {
  if (typeof value !== 'number' || isNaN(value)) {
    return false
  }

  return value >= min && value <= max
}

/**
 * Validate that a value is a positive number
 * @param {number} value - Value to validate
 * @returns {boolean} True if value is positive
 */
export function isPositive(value) {
  return typeof value === 'number' && !isNaN(value) && value >= 0
}

/**
 * Validate that a value is not empty
 * @param {*} value - Value to validate
 * @returns {boolean} True if value is not empty
 */
export function isNotEmpty(value) {
  if (value === null || value === undefined) {
    return false
  }

  if (typeof value === 'string') {
    return value.trim().length > 0
  }

  if (Array.isArray(value)) {
    return value.length > 0
  }

  return true
}

