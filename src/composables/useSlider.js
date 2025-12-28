import { ref, watch } from 'vue'
import { DEBOUNCE_DELAY } from '@/utils/constants'

/**
 * Composable for managing slider state with debouncing
 * @param {number} initialValue - Initial slider value
 * @param {Function} callback - Optional callback to call after debounce
 * @returns {Object} Slider state and methods
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

