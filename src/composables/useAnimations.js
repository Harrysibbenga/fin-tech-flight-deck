import { ref } from 'vue'
import { ANIMATION_DURATION } from '@/utils/constants'

/**
 * Animate a numeric value from start to end using requestAnimationFrame
 * 
 * Uses cubic ease-out easing function for smooth animation.
 * 
 * @param {number} start - Starting value
 * @param {number} end - Ending value
 * @param {number} duration - Animation duration in milliseconds
 * @param {Function} callback - Callback function called on each animation frame with current value
 * @returns {Function} Cancel function to stop the animation
 * 
 * @example
 * const cancel = animateValue(0, 100, 1000, (value) => {
 *   console.log(value) // Logs values from 0 to 100 over 1 second
 * })
 * // Later: cancel() to stop animation
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
 * Composable for animating numeric values with smooth transitions
 * 
 * Provides reactive animated values and control methods for number animations.
 * Uses requestAnimationFrame for 60fps animations.
 * 
 * @param {number} initialValue - Initial value (default: 0)
 * @param {number} duration - Default animation duration in milliseconds (default: 1000)
 * @returns {Object} Animated value and control methods
 *   @returns {import('vue').Ref<number>} value - Reactive animated value
 *   @returns {Function} animateTo - Animate to target value
 *   @returns {Function} setValue - Set value immediately without animation
 *   @returns {Function} stop - Stop current animation
 * 
 * @example
 * const { value, animateTo } = useNumberAnimation(0, 500)
 * animateTo(100) // Animates from 0 to 100 over 500ms
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

