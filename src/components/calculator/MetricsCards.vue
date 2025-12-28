<template>
  <div class="metrics-grid">
    <div class="metric-card">
      <span class="metric-label">Final Portfolio Value</span>
      <span class="metric-value">{{ formattedOptimizedValue }}</span>
      <span class="metric-badge positive">Optimized</span>
    </div>

    <div class="metric-card">
      <span class="metric-label">Value Difference</span>
      <span class="metric-value positive">+{{ formattedDifference }}</span>
      <span class="metric-sublabel">vs current strategy</span>
    </div>

    <div class="metric-card">
      <span class="metric-label">ROI Improvement</span>
      <span class="metric-value positive">+{{ percentageGain }}%</span>
      <span class="metric-sublabel">over 30 years</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatCurrency } from '@/utils/formatters'

const props = defineProps({
  optimizedValue: { type: Number, required: true },
  valueDifference: { type: Number, required: true },
  percentageGain: { type: Number, required: true }
})

const formattedOptimizedValue = computed(() => formatCurrency(props.optimizedValue, 'GBP', 0))
const formattedDifference = computed(() => formatCurrency(props.valueDifference, 'GBP', 0))
</script>

<style scoped>
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-8);
}

.metric-card {
  background: var(--bg-secondary);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  padding: var(--spacing-4) var(--spacing-6);
  text-align: center;
  transition: all var(--duration-normal) var(--ease-in-out);
}

.metric-card:hover {
  border-color: rgba(0, 212, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 212, 255, 0.1);
}

.metric-label {
  display: block;
  color: var(--text-secondary);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--spacing-2);
}

.metric-value {
  display: block;
  color: var(--text-primary);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  font-variant-numeric: tabular-nums;
  margin-bottom: var(--spacing-1);
}

.metric-value.positive {
  color: var(--accent-success);
}

.metric-badge {
  display: inline-block;
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: rgba(0, 255, 136, 0.1);
  color: var(--accent-success);
}

.metric-sublabel {
  display: block;
  color: var(--text-tertiary);
  font-size: var(--text-xs);
}

@media (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-3);
  }

  .metric-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
  }

  .metric-value {
    font-size: var(--text-lg);
    margin-bottom: 0;
  }

  .metric-badge,
  .metric-sublabel {
    display: none;
  }
}
</style>

