<template>
  <div class="slider-container" :style="sliderStyle">
    <label :for="id" class="slider-label">
      {{ label }}
    </label>
    <div
      class="slider-value"
      :id="`${id}-value`"
      :style="{ color: sliderValueColor }"
    >
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
      :data-sentiment-mode="sentimentMode"
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
  },
  sentimentMode: {
    type: Boolean,
    default: false
  },
  sentimentRanges: {
    type: Array,
    default: () => []
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

const currentSentiment = computed(() => {
  if (!props.sentimentMode || props.sentimentRanges.length === 0) {
    return null
  }

  const value = props.modelValue
  return props.sentimentRanges.find(
    range => value >= range.min && value <= range.max
  ) || props.sentimentRanges[1] // Default to middle range
})

const sliderStyle = computed(() => {
  const baseStyle = {
    '--slider-percentage': `${sliderPercentage.value}%`
  }

  if (props.sentimentMode && props.sentimentRanges.length > 0 && currentSentiment.value) {
    const sentiment = currentSentiment.value
    const percentage = sliderPercentage.value

    // Create gradient: filled portion shows sentiment color, unfilled shows full gradient
    // Full track gradient: red (0-33%) → orange/yellow (34-66%) → green (67-100%)
    baseStyle['--slider-background'] = `linear-gradient(to right,
      ${sentiment.color} 0%,
      ${sentiment.color} ${percentage}%,
      #ff4444 ${percentage}%,
      #ff4444 33%,
      #ff9500 33%,
      #ff9500 66%,
      #00ff88 66%,
      #00ff88 100%
    )`

    baseStyle['--slider-thumb-color'] = sentiment.color
    baseStyle['--slider-fill-color'] = sentiment.color
  } else {
    baseStyle['--slider-background'] = `linear-gradient(
      to right,
      #00d4ff 0%,
      #00d4ff ${sliderPercentage.value}%,
      #0a0e14 ${sliderPercentage.value}%,
      #0a0e14 100%
    )`
    baseStyle['--slider-fill-color'] = '#00d4ff'
    baseStyle['--slider-thumb-color'] = '#00d4ff'
  }

  return baseStyle
})

const sliderValueColor = computed(() => {
  if (props.sentimentMode && currentSentiment.value) {
    return currentSentiment.value.color
  }
  return 'var(--accent-primary)'
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
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--spacing-4);
  display: block;
  font-variant-numeric: tabular-nums;
  min-height: 2.5rem;
  display: flex;
  align-items: center;
  transition: color var(--duration-normal) var(--ease-in-out);
}

.slider-input {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  outline: none;
  transition: background var(--duration-normal) var(--ease-in-out);
  cursor: pointer;
  background: var(--slider-background, linear-gradient(
    to right,
    #00d4ff 0%,
    #00d4ff var(--slider-percentage),
    #0a0e14 var(--slider-percentage),
    #0a0e14 100%
  ));
}

/* Webkit browsers (Chrome, Safari, Edge) */
.slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--slider-thumb-color, #00d4ff);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 212, 255, 0.5),
              0 0 0 4px rgba(0, 212, 255, 0.2);
  transition: all var(--duration-normal) cubic-bezier(0.68, -0.55, 0.265, 1.55);
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
  background: var(--slider-thumb-color, #00d4ff);
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 212, 255, 0.5),
              0 0 0 4px rgba(0, 212, 255, 0.2);
  transition: all var(--duration-normal) cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.slider-input::-moz-range-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 16px rgba(0, 212, 255, 0.6),
              0 0 0 6px rgba(0, 212, 255, 0.3);
}

.slider-input:active::-moz-range-thumb {
  transform: scale(1.1);
}

.slider-input::-moz-range-track {
  height: 6px;
  border-radius: 3px;
  background: #0a0e14;
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

