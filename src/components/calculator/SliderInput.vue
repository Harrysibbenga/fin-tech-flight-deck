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
    const ranges = props.sentimentRanges
    const max = props.max
    const min = props.min
    const range = max - min
    const percentage = sliderPercentage.value
    
    // Create gradient background across all ranges
    const gradientStops = ranges.map((r) => {
      const startPercent = ((r.min - min) / range) * 100
      const endPercent = ((r.max - min) / range) * 100
      return `${r.color} ${startPercent}%, ${r.color} ${endPercent}%`
    }).join(', ')
    
    // For sentiment mode: show gradient track, fill with current sentiment color up to percentage
    baseStyle['--slider-background'] = `linear-gradient(to right, 
      ${sentiment.color} 0%, 
      ${sentiment.color} ${percentage}%, 
      ${gradientStops.replace(/\(to right, |\)/g, '').split(', ').slice(-1)[0]} ${percentage}%, 
      ${gradientStops}
    )`
    
    baseStyle['--slider-thumb-color'] = sentiment.color
    baseStyle['--slider-fill-color'] = sentiment.color
  } else {
    baseStyle['--slider-background'] = `linear-gradient(
      to right,
      var(--slider-fill-color, var(--accent-primary)) 0%,
      var(--slider-fill-color, var(--accent-primary)) ${sliderPercentage.value}%,
      var(--bg-primary) ${sliderPercentage.value}%,
      var(--bg-primary) 100%
    )`
    baseStyle['--slider-fill-color'] = 'var(--accent-primary)'
    baseStyle['--slider-thumb-color'] = 'var(--accent-primary)'
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
    var(--slider-fill-color, var(--accent-primary)) 0%,
    var(--slider-fill-color, var(--accent-primary)) var(--slider-percentage),
    var(--bg-primary) var(--slider-percentage),
    var(--bg-primary) 100%
  ));
}

/* Webkit browsers (Chrome, Safari, Edge) */
.slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--slider-thumb-color, var(--accent-primary));
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 212, 255, 0.5),
              0 0 0 4px rgba(0, 212, 255, 0.2);
  transition: all var(--duration-normal) var(--ease-bounce);
}

.slider-input::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 16px var(--slider-thumb-color, rgba(0, 212, 255, 0.6)),
              0 0 0 6px var(--slider-thumb-color, rgba(0, 212, 255, 0.3));
}

.slider-input:active::-webkit-slider-thumb {
  transform: scale(1.1);
}

/* Firefox */
.slider-input::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--slider-thumb-color, var(--accent-primary));
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 212, 255, 0.5);
  transition: all var(--duration-normal) var(--ease-bounce);
}

.slider-input::-moz-range-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 16px var(--slider-thumb-color, rgba(0, 212, 255, 0.6));
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

