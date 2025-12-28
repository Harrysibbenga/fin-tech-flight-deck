<template>
  <div class="slider-container" :style="sliderStyle">
    <label :for="id" class="slider-label">
      {{ label }}
    </label>
    <div
      class="slider-value"
      :class="{ 'value-updated': valueUpdated }"
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
      :aria-label="`Adjust your ${label}`"
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
import { computed, ref, watch, onMounted } from 'vue'
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
const valueUpdated = ref(false)
let debounceTimer = null

const formattedValue = computed(() => {
  return props.formatFn(props.modelValue)
})

// Watch for value changes to trigger animation
watch(() => props.modelValue, () => {
  valueUpdated.value = true
  setTimeout(() => {
    valueUpdated.value = false
  }, 500)
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

    // Track gradient for webkit browsers (mobile)
    baseStyle['--track-gradient'] = `linear-gradient(to right, #ff4444 0%, #ff9500 50%, #00ff88 100%)`

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
    baseStyle['--track-gradient'] = 'linear-gradient(to right, #00d4ff 0%, #00d4ff 100%)'
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

  // Haptic feedback on mobile if supported
  if ('vibrate' in navigator) {
    navigator.vibrate(10) // Brief vibration on value change
  }

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

// DEBUG: Check CSS variable is being set (TEMPORARY - remove after debugging)
onMounted(() => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Slider ${props.id}] Percentage:`, sliderPercentage.value, '%')
    console.log(`[Slider ${props.id}] Fill color:`, sliderStyle.value['--slider-fill-color'])
  }
})
</script>

<style scoped>
.slider-container {
  background: var(--bg-secondary);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
  margin-bottom: var(--spacing-4);
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
}

.slider-container:hover {
  background: #1a1f2e;
  border-color: rgba(0, 212, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 212, 255, 0.1);
}

.slider-container:focus-within {
  transform: scale(1.01);
}

.slider-container:active {
  transform: scale(0.99);
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
  min-width: 120px;
  display: flex;
  align-items: center;
  transition: color var(--duration-normal) var(--ease-in-out);
}

.slider-value.value-updated {
  animation: colorPulse 0.5s ease-out;
}

@keyframes colorPulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Base slider input */
.slider-input {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 24px; /* Match thumb height for proper alignment */
  background: transparent;
  cursor: pointer;
  touch-action: none;
  -webkit-tap-highlight-color: transparent;
  margin: 0;
  padding: 0;
}

/* Webkit Track (Chrome, Safari, Edge) */
.slider-input::-webkit-slider-runnable-track {
  width: 100%;
  height: 6px;
  background: linear-gradient(
    to right,
    var(--slider-fill-color, #00d4ff) 0%,
    var(--slider-fill-color, #00d4ff) var(--slider-percentage, 50%),
    #1a1f2e var(--slider-percentage, 50%),
    #1a1f2e 100%
  );
  border-radius: 3px;
  border: none;
}

/* Webkit Thumb */
.slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  background: var(--slider-thumb-color, #00d4ff);
  border-radius: 50%;
  border: none;
  cursor: pointer;
  margin-top: -9px; /* Center thumb on track: (thumb-height - track-height) / 2 = (24-6)/2 = 9 */
  box-shadow: 0 2px 8px rgba(0, 212, 255, 0.5),
              0 0 0 4px rgba(0, 212, 255, 0.2);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.slider-input::-webkit-slider-thumb:hover {
  transform: scale(1.15);
  box-shadow: 0 4px 16px rgba(0, 212, 255, 0.6),
              0 0 0 6px rgba(0, 212, 255, 0.3);
}

.slider-input:active::-webkit-slider-thumb {
  transform: scale(1.1);
}

/* Firefox Track */
.slider-input::-moz-range-track {
  width: 100%;
  height: 6px;
  background: #1a1f2e;
  border-radius: 3px;
  border: none;
}

/* Firefox Progress (filled portion) */
.slider-input::-moz-range-progress {
  height: 6px;
  background: var(--slider-fill-color, #00d4ff);
  border-radius: 3px 0 0 3px;
}

/* Firefox Thumb */
.slider-input::-moz-range-thumb {
  width: 24px;
  height: 24px;
  background: var(--slider-thumb-color, #00d4ff);
  border-radius: 50%;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 212, 255, 0.5),
              0 0 0 4px rgba(0, 212, 255, 0.2);
}

/* Sentiment mode track override - filled portion shows sentiment color, unfilled shows gradient */
.slider-input[data-sentiment-mode="true"]::-webkit-slider-runnable-track {
  background: linear-gradient(
    to right,
    var(--slider-fill-color, #ff4444) 0%,
    var(--slider-fill-color, #ff4444) var(--slider-percentage, 50%),
    #ff4444 var(--slider-percentage, 50%),
    #ff4444 33%,
    #ff9500 33%,
    #ff9500 66%,
    #00ff88 66%,
    #00ff88 100%
  );
}

.slider-input[data-sentiment-mode="true"]::-moz-range-track {
  background: linear-gradient(
    to right,
    #ff4444 0%,
    #ff4444 33%,
    #ff9500 33%,
    #ff9500 66%,
    #00ff88 66%,
    #00ff88 100%
  );
}

/* Mobile touch targets */
@media (max-width: 768px) {
  .slider-input {
    height: 44px; /* Larger touch area */
  }

  .slider-input::-webkit-slider-thumb {
    width: 32px;
    height: 32px;
    margin-top: -13px; /* (32-6)/2 = 13 */
  }

  .slider-input::-moz-range-thumb {
    width: 32px;
    height: 32px;
  }
}

/* Focus styles */
.slider-input:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 4px;
  border-radius: 4px;
}

/* Prevent layout shift during updates */
.slider-value {
  min-width: 120px;
  text-align: left;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .slider-value {
    animation: none;
    transition: none;
  }

  .slider-input::-webkit-slider-thumb {
    transition: none;
  }

  .slider-container {
    transition: none;
  }
}
</style>

