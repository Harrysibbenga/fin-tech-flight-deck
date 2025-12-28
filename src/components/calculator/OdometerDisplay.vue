<template>
  <div class="odometer-container">
    <div class="odometer-label">Years You Could Gain</div>
    <div class="odometer-value" role="status" :aria-live="isAnimating ? 'polite' : 'off'">
      <span
        v-for="(digit, index) in formattedDigits"
        :key="`${digit}-${index}`"
        class="odometer-digit"
        :class="{ 'odometer-separator': digit === '.' }"
      >
        {{ digit }}
      </span>
    </div>
    <div class="odometer-sublabel">by optimizing your equity strategy</div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ANIMATION_DURATION } from '@/utils/constants'

const props = defineProps({
  value: {
    type: Number,
    default: 0
  }
})

const displayValue = ref(0)
const isAnimating = ref(false)

// Define animateValue before using it in watch
const animateValue = (start, end, duration) => {
  const range = end - start
  if (Math.abs(range) < 0.01) {
    displayValue.value = end
    return
  }

  const startTime = Date.now()
  isAnimating.value = true

  const step = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)

    // Easing function (ease-out cubic)
    const eased = 1 - Math.pow(1 - progress, 3)
    displayValue.value = start + (range * eased)

    if (progress < 1) {
      requestAnimationFrame(step)
    } else {
      displayValue.value = end
      isAnimating.value = false
    }
  }

  requestAnimationFrame(step)
}

// Animate value changes
watch(() => props.value, (newVal) => {
  animateValue(displayValue.value, newVal, ANIMATION_DURATION.ODOMETER)
}, { immediate: true })

const formattedDigits = computed(() => {
  return displayValue.value.toFixed(1).split('')
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
  gap: 4px;
  margin-bottom: var(--spacing-4);
  min-height: 80px;
}

.odometer-digit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--accent-primary);
  background: rgba(0, 212, 255, 0.1);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-sm);
  min-width: 50px;
  text-align: center;
  font-variant-numeric: tabular-nums;
  box-shadow: 0 4px 16px rgba(0, 212, 255, 0.2);
  transition: transform var(--duration-fast) var(--ease-in-out);
}

.odometer-digit.odometer-separator {
  font-size: var(--text-xl);
  min-width: 20px;
  background: transparent;
  box-shadow: none;
  padding: var(--spacing-2);
}

.odometer-sublabel {
  color: var(--text-tertiary);
  font-size: var(--text-sm);
}

@media (max-width: 768px) {
  .odometer-digit:not(.odometer-separator) {
    font-size: var(--text-2xl);
    min-width: 40px;
    padding: var(--spacing-2) var(--spacing-3);
  }

  .odometer-value {
    min-height: 60px;
  }
}
</style>

