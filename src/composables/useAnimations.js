import { ref } from 'vue'
import { ANIMATION_DURATION } from '@/utils/constants'

/**
 * Animate a numeric value from start to end
 * @param {number} start - Starting value
 * @param {number} end - Ending value
 * @param {number} duration - Animation duration in milliseconds
 * @param {Function} callback - Callback function called on each frame with current value
 * @returns {Function} Cancel function to stop animation
 */
export function animateValue(start, end, duration, callback) {
  const range = end - start
  if (Math.abs(range) < 0.01) {
    callback(end)
    return () => {}
  }

  const startTime = Date.now()
  let animationFrameId = null
  let cancelled = false

  const step = () => {
    if (cancelled) {
      return
    }

    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)

    // Easing function (ease-out cubic)
    const eased = 1 - Math.pow(1 - progress, 3)
    const currentValue = start + (range * eased)

    callback(currentValue)

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(step)
    } else {
      callback(end)
    }
  }

  animationFrameId = requestAnimationFrame(step)

  // Return cancel function
  return () => {
    cancelled = true
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
  }
}

/**
 * Composable for animating numeric values
 * @param {number} initialValue - Initial value
 * @param {number} duration - Default animation duration
 * @returns {Object} Animated value and control methods
 */
export function useNumberAnimation(initialValue = 0, duration = ANIMATION_DURATION.ODOMETER) {
  const value = ref(initialValue)
  let cancelAnimation = null

  /**
   * Animate to a new value
   * @param {number} targetValue - Target value to animate to
   * @param {number} customDuration - Optional custom duration
   */
  const animateTo = (targetValue, customDuration = duration) => {
    // Cancel any existing animation
    if (cancelAnimation) {
      cancelAnimation()
    }

    const startValue = value.value
    cancelAnimation = animateValue(startValue, targetValue, customDuration, (currentValue) => {
      value.value = currentValue
    })
  }

  /**
   * Set value immediately without animation
   * @param {number} newValue - Value to set
   */
  const setValue = (newValue) => {
    if (cancelAnimation) {
      cancelAnimation()
      cancelAnimation = null
    }
    value.value = newValue
  }

  /**
   * Stop current animation
   */
  const stop = () => {
    if (cancelAnimation) {
      cancelAnimation()
      cancelAnimation = null
    }
  }

  return {
    value,
    animateTo,
    setValue,
    stop
  }
}

