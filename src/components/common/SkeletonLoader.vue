<template>
  <div :class="['skeleton-loader', className]" :style="style">
    <div
      v-for="(line, index) in linesArray"
      :key="index"
      :class="['skeleton-line', { 'skeleton-line-short': line.short }]"
    ></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  lines: {
    type: [Number, Array],
    default: 1
  },
  className: {
    type: String,
    default: ''
  },
  style: {
    type: Object,
    default: () => ({})
  }
})

// Convert lines prop to array format
// If number, create array of simple objects
// If array, use it directly (expecting [{ short: boolean }])
const linesArray = computed(() => {
  if (typeof props.lines === 'number') {
    return Array.from({ length: props.lines }, () => ({ short: false }))
  }
  // If array, ensure each item has short property
  return props.lines.map(line => 
    typeof line === 'object' && line !== null 
      ? { short: line.short || false }
      : { short: false }
  )
})
</script>

<style scoped>
.skeleton-loader {
  width: 100%;
}

.skeleton-line {
  height: 20px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 12px;
}

.skeleton-line:last-child {
  margin-bottom: 0;
}

.skeleton-line-short {
  width: 60%;
}

@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .skeleton-line {
    animation: none;
    background: rgba(255, 255, 255, 0.05);
  }
}
</style>

