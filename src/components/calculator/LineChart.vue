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
        backgroundColor: 'rgba(139, 146, 168, 0.1)',
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
        backgroundColor: 'rgba(0, 212, 255, 0.1)',
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
  const options = { ...CHART_OPTIONS }

  // Update Y-axis formatting for difference view
  if (props.viewMode === 'difference') {
    options.scales.y.ticks.callback = (value) => {
      return `£${(value / 1000).toFixed(0)}k`
    }
    // Y-axis starts from 0 for difference view
    options.scales.y.beginAtZero = true
  }

  return options
})
</script>

<style scoped>
.chart-container {
  background: var(--bg-secondary);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
  margin-bottom: var(--spacing-8);
}

@media (max-width: 768px) {
  .chart-container {
    padding: var(--spacing-4);
  }
}
</style>

