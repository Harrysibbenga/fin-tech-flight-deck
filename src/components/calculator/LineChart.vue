<template>
  <div class="chart-container">
    <Line
      :data="chartData"
      :options="chartOptions"
      :style="{ height: `${height}px` }"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
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
  Filler
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
          backgroundColor: 'rgba(0, 255, 136, 0.2)',
          borderWidth: 3,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
          fill: true,
          fillColor: '#00ff88'
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
        backgroundColor: (context) => {
          if (!context.chart.chartArea) {
            return 'rgba(0, 212, 255, 0.1)'
          }
          const ctx = context.chart.ctx
          const gradient = ctx.createLinearGradient(
            0,
            context.chart.chartArea.top,
            0,
            context.chart.chartArea.bottom
          )
          gradient.addColorStop(0, 'rgba(0, 212, 255, 0)')
          gradient.addColorStop(1, 'rgba(0, 212, 255, 0.15)')
          return gradient
        },
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        fill: true
      }
    ]
  }
})

const chartOptions = computed(() => {
  const options = JSON.parse(JSON.stringify(CHART_OPTIONS)) // Deep clone

  // Update Y-axis formatting
  options.scales.y.ticks.callback = (value) => {
    return `£${(value / 1000).toFixed(0)}k`
  }
  options.scales.y.ticks.color = '#8b92a8'

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

  return options
})
</script>

<style scoped>
.chart-container {
  background: var(--bg-secondary);
  border: none;
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
  margin-bottom: var(--spacing-8);
  outline: none;
}

@media (max-width: 768px) {
  .chart-container {
    padding: var(--spacing-4);
  }
}
</style>

