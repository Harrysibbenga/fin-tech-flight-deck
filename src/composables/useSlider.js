import { ref, watch } from 'vue'
import { DEBOUNCE_DELAY } from '@/utils/constants'

/**
 * Composable for managing slider state with debouncing
 * 
 * Debounces slider updates to improve performance during rapid value changes.
 * Updates UI immediately but delays callback execution.
 * 
 * @param {number} initialValue - Initial slider value
 * @param {Function|null} callback - Optional callback function called after debounce delay (default: 16ms)
 * @returns {Object} Slider state and control methods
 *   @returns {import('vue').Ref<number>} value - Current slider value (updates immediately)
 *   @returns {import('vue').Ref<number>} debouncedValue - Debounced slider value
 *   @returns {Function} updateValue - Update slider value with debouncing
 *   @returns {Function} reset - Reset slider to initial value
 */
export function useSlider(initialValue = 0, callback = null) {
  const value = ref(initialValue)
  const debouncedValue = ref(initialValue)
  let debounceTimer = null

  /**
   * Update slider value with debouncing
   * @param {number} newValue - New slider value
   */
  const updateValue = (newValue) => {
    value.value = newValue

    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    // Set new timer for debounced update
    debounceTimer = setTimeout(() => {
      debouncedValue.value = newValue
      if (callback && typeof callback === 'function') {
        callback(newValue)
      }
    }, DEBOUNCE_DELAY)
  }

  /**
   * Reset slider to initial value
   */
  const reset = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    value.value = initialValue
    debouncedValue.value = initialValue
  }

  return {
    value,
    debouncedValue,
    updateValue,
    reset
  }
}

