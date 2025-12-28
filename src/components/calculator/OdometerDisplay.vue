<template>
  <div class="odometer-container">
    <div class="odometer-label">Years You Could Gain</div>
    <div class="odometer-value" role="status" :aria-live="isAnimating ? 'polite' : 'off'">
      <!-- Whole number digits -->
      <div
        v-for="(digit, index) in wholeNumberDigits"
        :key="`whole-${index}`"
        class="odometer-digit-container"
        :style="{ '--digit-value': digit.currentValue }"
      >
        <div class="odometer-digit-inner">
          {{ digit.displayValue }}
        </div>
      </div>

      <!-- Separator dot -->
      <div class="odometer-separator" aria-hidden="true">
        <span class="separator-dot"></span>
      </div>

      <!-- Decimal digit -->
      <div
        class="odometer-digit-container"
        :style="{ '--digit-value': decimalDigit.currentValue }"
      >
        <div class="odometer-digit-inner">
          {{ decimalDigit.displayValue }}
        </div>
      </div>
    </div>
    <div class="odometer-sublabel">by optimizing your equity strategy</div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { ANIMATION_DURATION } from '@/utils/constants'

const props = defineProps({
  value: {
    type: Number,
    default: 0
  }
})

const isAnimating = ref(false)

// Digit state for each position
const wholeNumberDigits = ref([])
const decimalDigit = ref({ currentValue: 0, displayValue: '0' })

/**
 * Initialize digits array based on max expected value
 * We'll support up to 999.9 years
 */
const initializeDigits = (initialValue = 0) => {
  const wholePart = Math.floor(initialValue)
  const decimalPart = Math.floor((initialValue % 1) * 10)

  // Create array for whole number digits (support up to 3 digits)
  const wholeString = wholePart.toString()
  wholeNumberDigits.value = wholeString.split('').map((char, index) => ({
    position: index,
    currentValue: parseInt(char, 10),
    displayValue: char,
    targetValue: parseInt(char, 10)
  }))

  decimalDigit.value = {
    currentValue: decimalPart,
    displayValue: decimalPart.toString(),
    targetValue: decimalPart
  }
}

/**
 * Animate a single digit from current to target value
 */
const animateDigit = (digit, targetValue, duration) => {
  const startValue = digit.currentValue
  const endValue = targetValue

  if (startValue === endValue) {
    digit.displayValue = endValue.toString()
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    const startTime = Date.now()
    const range = endValue - startValue

    const step = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3)
      const currentValue = Math.floor(startValue + (range * eased))

      digit.currentValue = currentValue
      digit.displayValue = currentValue.toString()

      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        digit.currentValue = endValue
        digit.displayValue = endValue.toString()
        resolve()
      }
    }

    requestAnimationFrame(step)
  })
}

/**
 * Parse value into digits and animate them
 */
const animateToValue = async (targetValue) => {
  // Ensure value is at least 0.1 to avoid showing 0.0
  const safeValue = Math.max(0.1, targetValue)
  const wholePart = Math.floor(safeValue)
  const decimalPart = Math.floor((safeValue % 1) * 10)

  const wholeString = wholePart.toString()
  const targetDigits = wholeString.split('').map(char => parseInt(char, 10))

  // Ensure we have enough digit containers
  while (wholeNumberDigits.value.length < targetDigits.length) {
    wholeNumberDigits.value.unshift({
      position: -1,
      currentValue: 0,
      displayValue: '0',
      targetValue: 0
    })
  }

  // Remove leading zeros if value decreased
  if (targetDigits.length < wholeNumberDigits.value.length) {
    wholeNumberDigits.value = wholeNumberDigits.value.slice(-targetDigits.length)
  }

  // Update target values
  targetDigits.forEach((target, index) => {
    const digitIndex = wholeNumberDigits.value.length - targetDigits.length + index
    if (wholeNumberDigits.value[digitIndex]) {
      wholeNumberDigits.value[digitIndex].targetValue = target
    }
  })

  decimalDigit.value.targetValue = decimalPart

  isAnimating.value = true

  // Animate all digits simultaneously
  const animationPromises = [
    ...wholeNumberDigits.value.map((digit, index) => {
      const targetDigit = targetDigits[targetDigits.length - wholeNumberDigits.value.length + index]
      return animateDigit(digit, targetDigit !== undefined ? targetDigit : 0, ANIMATION_DURATION.ODOMETER)
    }),
    animateDigit(decimalDigit.value, decimalPart, ANIMATION_DURATION.ODOMETER)
  ]

  await Promise.all(animationPromises)
  isAnimating.value = false
}

// Watch for value changes
watch(() => props.value, (newVal) => {
  if (newVal !== undefined && !isNaN(newVal)) {
    animateToValue(newVal)
  }
}, { immediate: false })

// Initialize with calculated value on mount
onMounted(() => {
  const initialValue = props.value || 0.1
  initializeDigits(initialValue)
  if (props.value > 0) {
    animateToValue(props.value)
  }
})
</script>

<style scoped>
.odometer-container {
  text-align: center;
  padding: var(--spacing-8);
  background: var(--gradient-card);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: var(--radius-xl);
  margin-bottom: var(--spacing-8);
}

.odometer-label {
  color: var(--text-secondary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: var(--spacing-4);
}

.odometer-value {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-bottom: var(--spacing-4);
  min-height: 80px;
}

.odometer-digit-container {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #1a1f2e;
  border-radius: 12px;
  min-width: 60px;
  min-height: 72px;
  padding: var(--spacing-3) var(--spacing-4);
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
  overflow: hidden;
}

.odometer-digit-inner {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--accent-primary);
  font-variant-numeric: tabular-nums;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  transition: transform var(--duration-fast) var(--ease-in-out);
}

/* Flip animation effect */
.odometer-digit-container .odometer-digit-inner {
  animation: none;
}

.odometer-separator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  height: 72px;
  padding: 0 var(--spacing-2);
}

.separator-dot {
  width: 4px;
  height: 4px;
  background: var(--accent-primary);
  border-radius: 50%;
  opacity: 0.6;
  box-shadow: 0 0 8px rgba(0, 212, 255, 0.4);
}

.odometer-sublabel {
  color: var(--text-tertiary);
  font-size: var(--text-sm);
}

@media (max-width: 768px) {
  .odometer-digit-container {
    min-width: 48px;
    min-height: 60px;
    padding: var(--spacing-2) var(--spacing-3);
  }

  .odometer-digit-inner {
    font-size: var(--text-2xl);
  }

  .odometer-value {
    min-height: 60px;
    gap: 6px;
  }

  .odometer-separator {
    min-width: 12px;
    height: 60px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .odometer-digit-inner {
    transition: none;
  }
}
</style>
