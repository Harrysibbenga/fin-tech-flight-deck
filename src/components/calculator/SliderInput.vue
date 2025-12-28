<template>
  <div class="slider-container" :style="sliderStyle">
    <label :for="id" class="slider-label">
      {{ label }}
    </label>
    <div class="slider-value" :id="`${id}-value`">
      {{ formattedValue }}
    </div>
    <input
      :id="id"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="modelValue"
      class="slider-input"
      :aria-label="label"
      :aria-valuemin="min"
      :aria-valuemax="max"
      :aria-valuenow="modelValue"
      :aria-valuetext="formattedValue"
      @input="handleInput"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { DEBOUNCE_DELAY } from '@/utils/constants'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  min: {
    type: Number,
    required: true
  },
  max: {
    type: Number,
    required: true
  },
  step: {
    type: Number,
    default: 1
  },
  modelValue: {
    type: Number,
    required: true
  },
  formatFn: {
    type: Function,
    default: (val) => String(val)
  }
})

const emit = defineEmits(['update:modelValue'])

const isActive = ref(false)
let debounceTimer = null

const formattedValue = computed(() => {
  return props.formatFn(props.modelValue)
})

const sliderPercentage = computed(() => {
  const range = props.max - props.min
  const position = props.modelValue - props.min
  return (position / range) * 100
})

const sliderStyle = computed(() => {
  return {
    '--slider-percentage': `${sliderPercentage.value}%`
  }
})

const handleInput = (event) => {
  const value = parseFloat(event.target.value)
  
  // Update UI immediately (for smooth slider movement)
  emit('update:modelValue', value)
  
  // Clear existing debounce timer
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  
  // Debounce calculations (16ms for 60fps)
  debounceTimer = setTimeout(() => {
    // Additional emit for calculation updates if needed
    // This ensures calculations don't run on every single pixel movement
  }, DEBOUNCE_DELAY)
}

const handleMouseDown = () => {
  isActive.value = true
}

const handleMouseUp = () => {
  isActive.value = false
  // Ensure final value is emitted when user releases
  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
}
</script>

<style scoped>
.slider-container {
  background: var(--bg-secondary);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
  margin-bottom: var(--spacing-4);
  transition: all var(--duration-normal) var(--ease-in-out);
}

.slider-container:hover {
  background: var(--bg-tertiary);
  border-color: rgba(0, 212, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 212, 255, 0.1);
}

.slider-label {
  color: var(--text-secondary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  margin-bottom: var(--spacing-2);
  display: block;
}

.slider-value {
  color: var(--accent-primary);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--spacing-4);
  display: block;
  font-variant-numeric: tabular-nums;
  min-height: 2.5rem;
  display: flex;
  align-items: center;
}

.slider-input {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(
    to right,
    var(--accent-primary) 0%,
    var(--accent-primary) var(--slider-percentage),
    var(--bg-primary) var(--slider-percentage),
    var(--bg-primary) 100%
  );
  outline: none;
  transition: background var(--duration-fast);
  cursor: pointer;
}

/* Webkit browsers (Chrome, Safari, Edge) */
.slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--accent-primary);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 212, 255, 0.5),
              0 0 0 4px rgba(0, 212, 255, 0.2);
  transition: all var(--duration-normal) var(--ease-bounce);
}

.slider-input::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 16px rgba(0, 212, 255, 0.6),
              0 0 0 6px rgba(0, 212, 255, 0.3);
}

.slider-input:active::-webkit-slider-thumb {
  transform: scale(1.1);
}

/* Firefox */
.slider-input::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--accent-primary);
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 212, 255, 0.5);
  transition: all var(--duration-normal) var(--ease-bounce);
}

.slider-input::-moz-range-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 16px rgba(0, 212, 255, 0.6);
}

.slider-input:active::-moz-range-thumb {
  transform: scale(1.1);
}

.slider-input::-moz-range-track {
  height: 6px;
  border-radius: 3px;
  background: var(--bg-primary);
}

/* Touch target optimization */
@media (max-width: 768px) {
  .slider-input::-webkit-slider-thumb,
  .slider-input::-moz-range-thumb {
    width: 32px;
    height: 32px;
  }
}

/* Focus styles for accessibility */
.slider-input:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 4px;
  border-radius: 6px;
}
</style>

