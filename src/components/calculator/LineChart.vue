<template>
  <div class="chart-container">
    <!-- Skeleton loader while data is empty -->
    <div v-if="isLoading" class="chart-skeleton">
      <div class="skeleton skeleton-chart-bar" v-for="n in 30" :key="n" :style="{ height: `${Math.random() * 60 + 20}%` }"></div>
    </div>
    <!-- Actual chart -->
    <Line
      v-else
      :data="chartData"
      :options="chartOptions"
      :style="{ height: `${height}px` }"
      class="chart-canvas"
    />
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'vue-chartjs'
import annotationPlugin from 'chartjs-plugin-annotation'
import { CHART_OPTIONS } from '@/config/chart.config'

// Register Chart.js components (tree-shaking)
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  annotationPlugin
)

const props = defineProps({
  baselineData: {
    type: Array,
    required: true
  },
  optimizedData: {
    type: Array,
    required: true
  },
  differenceData: {
    type: Array,
    default: () => []
  },
  labels: {
    type: Array,
    default: () => []
  },
  height: {
    type: Number,
    default: 400
  },
  viewMode: {
    type: String,
    default: 'side-by-side',
    validator: (value) => ['side-by-side', 'difference'].includes(value)
  }
})

const chartData = computed(() => {
  const labels = props.labels.length > 0
    ? props.labels
    : Array.from({ length: Math.max(props.baselineData.length, props.optimizedData.length) }, (_, i) => `Year ${i + 1}`)

  if (props.viewMode === 'difference' && props.differenceData.length > 0) {
    // Difference view: show only the difference line
    return {
      labels,
      datasets: [
        {
          label: 'Value Difference',
          data: props.differenceData,
          borderColor: '#00ff88',
          backgroundColor: 'rgba(0, 255, 136, 0.15)',
          borderWidth: 3,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#00ff88',
          pointHoverBorderColor: '#ffffff',
          pointHoverBorderWidth: 2,
          fill: {
            target: 'origin',
            above: 'rgba(0, 255, 136, 0.12)'
          }
        }
      ]
    }
  }

  // Side by side view: show both trajectories
  return {
    labels,
    datasets: [
      {
        label: 'Current Trajectory',
        data: props.baselineData,
        borderColor: 'rgba(139, 146, 168, 0.5)',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        fill: false
      },
      {
        label: 'Optimized Trajectory',
        data: props.optimizedData,
        borderColor: '#00d4ff',
        backgroundColor: 'rgba(0, 212, 255, 0.15)',
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#00d4ff',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
        fill: {
          target: 'origin',
          above: 'rgba(0, 212, 255, 0.12)'
        }
      }
    ]
  }
})

const chartOptions = computed(() => {
  const options = JSON.parse(JSON.stringify(CHART_OPTIONS)) // Deep clone

  // Update Y-axis formatting with consistent formatting
  options.scales.y.ticks.callback = (value) => {
    const thousands = Math.round(value / 1000)
    return `£${thousands.toLocaleString('en-GB')}k`
  }
  options.scales.y.ticks.color = '#8b92a8'
  options.scales.y.ticks.font = {
    ...options.scales.y.ticks.font,
    variantNumeric: 'tabular-nums'
  }

  // Update X-axis to show only Year 5, 10, 15, 20, 25, 30
  if (options.scales.x && options.scales.x.ticks) {
    options.scales.x.ticks.callback = function(value, index, ticks) {
      const labels = this.chart.data.labels
      if (labels && labels[index]) {
        const label = labels[index]
        if (typeof label === 'string' && label.includes('Year')) {
          const yearNum = parseInt(label.replace('Year ', ''))
          if (yearNum % 5 === 0 && yearNum > 0) {
            return label
          }
        }
      }
      return ''
    }
  }

  // Y-axis starts from 0 for difference view
  if (props.viewMode === 'difference') {
    options.scales.y.beginAtZero = true
  }

  // Handle window resize smoothly
  options.responsive = true
  options.maintainAspectRatio = false

  // Animation settings for smooth initial render
  options.animation = {
    duration: 0 // Disable initial animation for faster render
  }

  // Improve legend positioning for mobile - use reactive check
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
  if (isMobile) {
    options.plugins.legend.position = 'bottom'
    options.plugins.legend.labels.padding = 10
    options.plugins.legend.labels.boxWidth = 10
    options.plugins.legend.labels.boxHeight = 10
  } else {
    options.plugins.legend.position = 'top'
    options.plugins.legend.labels.padding = 20
    options.plugins.legend.labels.boxWidth = 12
    options.plugins.legend.labels.boxHeight = 12
  }

  // Use circle point style for cleaner look
  options.plugins.legend.labels.usePointStyle = true

  // Add milestone markers at Year 10, 20, 30
  // Note: Chart.js uses 0-indexed data indices, so Year 10 = index 9, Year 20 = index 19, Year 30 = index 29
  if (props.viewMode === 'side-by-side') {
    options.plugins.annotation = {
      annotations: {
        year10: {
          type: 'line',
          xMin: 9, // Year 10 (0-indexed)
          xMax: 9,
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          borderDash: [4, 4],
          label: {
            display: true,
            content: 'Year 10',
            position: 'start',
            backgroundColor: 'rgba(26, 31, 46, 0.9)',
            color: '#8b92a8',
            font: { size: 10 },
            padding: 4,
            borderRadius: 4
          }
        },
        year20: {
          type: 'line',
          xMin: 19, // Year 20 (0-indexed)
          xMax: 19,
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          borderDash: [4, 4],
          label: {
            display: true,
            content: 'Year 20',
            position: 'start',
            backgroundColor: 'rgba(26, 31, 46, 0.9)',
            color: '#8b92a8',
            font: { size: 10 },
            padding: 4,
            borderRadius: 4
          }
        },
        year30: {
          type: 'line',
          xMin: 29, // Year 30 (0-indexed)
          xMax: 29,
          borderColor: 'rgba(0, 212, 255, 0.3)',
          borderWidth: 2,
          borderDash: [4, 4],
          label: {
            display: true,
            content: 'Target',
            position: 'end',
            backgroundColor: 'rgba(0, 212, 255, 0.2)',
            color: '#00d4ff',
            font: { size: 11, weight: 'bold' },
            padding: 4,
            borderRadius: 4
          }
        }
      }
    }
  }

  return options
})

// Check if chart data is loading
const isLoading = computed(() => {
  return !props.baselineData ||
         props.baselineData.length === 0 ||
         !props.optimizedData ||
         props.optimizedData.length === 0
})

// Handle window resize for smooth chart updates
let resizeObserver = null

onMounted(() => {
  // Chart.js handles resize automatically, but we ensure smooth updates
  if (window.ResizeObserver) {
    resizeObserver = new ResizeObserver(() => {
      // Chart will automatically resize via responsive option
    })
  }
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})
</script>

<style scoped>
.chart-container {
  background: linear-gradient(180deg, var(--bg-secondary) 0%, rgba(0, 212, 255, 0.02) 100%);
  border: none;
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
  margin-bottom: var(--spacing-8);
  outline: none;
  position: relative;
  /* Prevent layout shift */
  min-height: 400px;
}

.chart-container:focus-within {
  outline: 2px solid rgba(0, 212, 255, 0.3);
  outline-offset: 2px;
}

/* Subtle glow effect around the optimized line using CSS filter */
.chart-canvas {
  filter: drop-shadow(0 0 8px rgba(0, 212, 255, 0.3));
}

/* Chart skeleton loader */
.chart-skeleton {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 400px;
  gap: 4px;
  padding: var(--spacing-4);
}

.skeleton-chart-bar {
  flex: 1;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 100%
  );
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px 4px 0 0;
  min-height: 20px;
}

@media (max-width: 768px) {
  .chart-container {
    padding: var(--spacing-4);
  }

  .chart-canvas {
    filter: drop-shadow(0 0 6px rgba(0, 212, 255, 0.25));
  }

  .chart-skeleton {
    height: 300px;
    gap: 2px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .chart-canvas {
    filter: none;
  }
}
</style>

