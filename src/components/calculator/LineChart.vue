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
  labels: {
    type: Array,
    default: () => []
  },
  height: {
    type: Number,
    default: 400
  }
})

const chartData = computed(() => {
  return {
    labels: props.labels.length > 0
      ? props.labels
      : Array.from({ length: Math.max(props.baselineData.length, props.optimizedData.length) }, (_, i) => `Year ${i + 1}`),
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

const chartOptions = computed(() => CHART_OPTIONS)
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

