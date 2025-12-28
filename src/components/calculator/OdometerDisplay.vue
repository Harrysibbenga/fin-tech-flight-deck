<template>
  <div class="odometer-container">
    <div class="odometer-label">Years You Could Gain</div>

    <!-- Skeleton loader while calculating -->
    <div v-if="loading" class="odometer-skeleton">
      <Skeleton width="60px" height="72px" radius="12px" />
      <div class="odometer-separator" aria-hidden="true"></div>
      <Skeleton width="60px" height="72px" radius="12px" />
    </div>

    <!-- Actual odometer display -->
    <div v-else class="odometer-value" role="status" :aria-live="isAnimating ? 'polite' : 'off'">
      <!-- Whole number digits -->
      <div
        v-for="(digit, index) in wholeNumberDigits"
        :key="`whole-${index}`"
        class="odometer-digit-container"
        :class="{ 'pulse-scale': shouldPulse, 'settled': !isAnimating && hasInitialAnimationRun }"
        :style="{ '--digit-value': digit.currentValue }"
      >
        <div class="odometer-digit-inner" :class="{ 'value-updated': digitUpdated }">
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
        :class="{ 'pulse-scale': shouldPulse, 'settled': !isAnimating && hasInitialAnimationRun }"
        :style="{ '--digit-value': decimalDigit.currentValue }"
      >
        <div class="odometer-digit-inner" :class="{ 'value-updated': digitUpdated }">
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
import Skeleton from '@/components/common/Skeleton.vue'

const props = defineProps({
  value: {
    type: Number,
    default: 0
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const isAnimating = ref(false)
const digitUpdated = ref(false)
const shouldPulse = ref(false)
const hasInitialAnimationRun = ref(false)

// Digit state for each position
const wholeNumberDigits = ref([])
const decimalDigit = ref({ currentValue: 0, displayValue: '0' })

/**
 * Initialize digits array based on max expected value
 * We'll support up to 999.9 years
 * Always ensures at least one whole number digit for "0.0" display
 */
const initializeDigits = (initialValue = 0, animate = false) => {
  const wholePart = Math.floor(initialValue)
  const decimalPart = Math.floor((initialValue % 1) * 10)

  // Always ensure at least one whole number digit for "0.0" display
  const wholeString = wholePart.toString() || '0'
  wholeNumberDigits.value = wholeString.split('').map((char, index) => ({
    position: index,
    currentValue: parseInt(char, 10),
    displayValue: char,
    targetValue: parseInt(char, 10)
  }))

  // If no digits, ensure we have at least "0"
  if (wholeNumberDigits.value.length === 0) {
    wholeNumberDigits.value = [{
      position: 0,
      currentValue: 0,
      displayValue: '0',
      targetValue: 0
    }]
  }

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
const animateToValue = async (targetValue, triggerPulse = true) => {
  // Ensure value is at least 0.1 to avoid showing 0.0
  const safeValue = Math.max(0.1, targetValue)
  const wholePart = Math.floor(safeValue)
  const decimalPart = Math.floor((safeValue % 1) * 10)

  const wholeString = wholePart.toString()
  const targetDigits = wholeString.split('').map(char => parseInt(char, 10))

  // Ensure we have enough digit containers (support up to 999)
  // Always maintain at least one digit for proper layout
  while (wholeNumberDigits.value.length < targetDigits.length) {
    wholeNumberDigits.value.unshift({
      position: -1,
      currentValue: 0,
      displayValue: '0',
      targetValue: 0
    })
  }

  // If we have more digits than needed, keep only necessary ones (but always at least 1)
  if (targetDigits.length < wholeNumberDigits.value.length && targetDigits.length > 0) {
    const excess = wholeNumberDigits.value.length - targetDigits.length
    wholeNumberDigits.value = wholeNumberDigits.value.slice(excess)
  }

  // Ensure we always have at least one digit
  if (wholeNumberDigits.value.length === 0) {
    wholeNumberDigits.value = [{
      position: 0,
      currentValue: 0,
      displayValue: '0',
      targetValue: 0
    }]
  }

  isAnimating.value = true

  // Animate all digits simultaneously
  const animationPromises = [
    ...wholeNumberDigits.value.map((digit, index) => {
      const targetDigit = targetDigits[index]
      return animateDigit(digit, targetDigit !== undefined ? targetDigit : 0, ANIMATION_DURATION.ODOMETER)
    }),
    animateDigit(decimalDigit.value, decimalPart, ANIMATION_DURATION.ODOMETER)
  ]

  await Promise.all(animationPromises)
  isAnimating.value = false

  // Mark that initial animation has run
  if (!hasInitialAnimationRun.value) {
    hasInitialAnimationRun.value = true
  }

  // Trigger pulse animation when value settles
  if (triggerPulse) {
    shouldPulse.value = true
    setTimeout(() => {
      shouldPulse.value = false
    }, 600)
  }
}

// Initialize on mount - immediately show "0.0" then animate
onMounted(() => {
  // Initialize at 0 immediately
  initializeDigits(0)

  // Animate to actual value after page load settles
  setTimeout(() => {
    if (props.value !== undefined && !isNaN(props.value) && props.value > 0) {
      animateToValue(Math.max(0.5, props.value))
    } else {
      // Default animation to show it works
      animateToValue(0.5)
    }
  }, 600)
})

// Watch for value changes after initial load
watch(() => props.value, (newVal, oldVal) => {
  if (!hasInitialAnimationRun.value) {
    hasInitialAnimationRun.value = true
    return // Skip - initial animation handles this
  }

  if (newVal !== undefined && !isNaN(newVal) && newVal > 0 && newVal !== oldVal) {
    animateToValue(newVal)
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
  /* Fixed dimensions to prevent shifting/resizing during animation */
  width: 60px;
  min-width: 60px;
  max-width: 60px;
  height: 72px;
  min-height: 72px;
  max-height: 72px;
  padding: var(--spacing-3) var(--spacing-4);
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.odometer-digit-container.pulse-scale {
  animation: scalePulse 0.6s ease-out;
}

@keyframes scalePulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}

.odometer-digit-container.settled {
  animation: settleScale 0.3s ease-out;
}

@keyframes settleScale {
  0% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
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
  transition: transform var(--duration-fast) var(--ease-in-out),
              color var(--duration-normal) var(--ease-in-out);
}

.odometer-digit-inner.value-updated {
  animation: colorPulse 0.5s ease-out;
}

@keyframes colorPulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
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

/* Skeleton loader styles */
.odometer-skeleton {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-bottom: var(--spacing-4);
  min-height: 80px;
}

@media (max-width: 768px) {
  .odometer-skeleton {
    gap: 6px;
    min-height: 60px;
  }
}

@media (max-width: 768px) {
  .odometer-digit-container {
    width: 48px;
    min-width: 48px;
    max-width: 48px;
    height: 60px;
    min-height: 60px;
    max-height: 60px;
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
    animation: none;
  }

  .odometer-digit-container {
    transition: none;
    animation: none;
  }

  .odometer-digit-container.settled {
    animation: none;
  }

  .odometer-container {
    animation: none;
  }
}
</style>
