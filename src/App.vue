<template>
  <div class="app-container">
    <header class="app-header">
      <h1>Wealth Efficiency Calculator</h1>
      <p>Discover how many years you're losing</p>
    </header>

    <main class="app-main">
      <!-- Sliders Section -->
      <section class="sliders-section">
        <h2>Your Current Situation</h2>
        <SliderInput
          v-for="slider in sliderConfigs"
          :key="slider.id"
          v-memo="[sliderValues[slider.id], slider]"
          :id="slider.id"
          :label="slider.label"
          :min="slider.min"
          :max="slider.max"
          :step="slider.step"
          v-model="sliderValues[slider.id]"
          :format-fn="slider.format"
          :sentiment-mode="slider.sentimentMode || false"
          :sentiment-ranges="slider.sentimentRanges || []"
        />
      </section>

      <!-- Results Section -->
      <section class="results-section">
        <OdometerDisplay :value="results.yearsGained" />

        <div class="chart-wrapper" v-memo="[chartData.baseline, chartData.optimized, chartData.difference, viewMode]">
          <LineChart
            :baseline-data="chartData.baseline"
            :optimized-data="chartData.optimized"
            :difference-data="chartData.difference"
            :labels="chartData.labels"
            :view-mode="viewMode"
            :height="400"
          />
        </div>

        <OptimizationToggle v-model="viewMode" />
      </section>

      <!-- Lead Gate -->
      <section class="lead-section">
        <LeadGate />
      </section>
    </main>

    <footer class="app-footer">
      <p>© 2024 Wealth Optimization. For illustration purposes only.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SliderInput from './components/calculator/SliderInput.vue'
import OdometerDisplay from './components/calculator/OdometerDisplay.vue'
import LineChart from './components/calculator/LineChart.vue'
import OptimizationToggle from './components/calculator/OptimizationToggle.vue'
import LeadGate from './components/calculator/LeadGate.vue'
import { SLIDER_CONFIGS, getDefaultSliderValues } from './config/sliders.config'
import { useCalculations } from './composables/useCalculations'

// Slider configurations
const sliderConfigs = SLIDER_CONFIGS

// Initialize slider values with defaults
const sliderValues = ref(getDefaultSliderValues())

// View mode state: 'side-by-side' or 'difference'
const viewMode = ref('side-by-side')

// Use calculations composable (always calculates both trajectories)
const { results, chartData } = useCalculations(sliderValues)
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #0a0e14 0%, #121820 100%);
  color: var(--text-primary);
  padding: var(--spacing-8);
}

.app-header {
  text-align: center;
  margin-bottom: var(--spacing-12);
}

.app-header h1 {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--spacing-3);
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.app-header p {
  color: var(--text-secondary);
  font-size: var(--text-lg);
}

.app-main {
  max-width: 1200px;
  margin: 0 auto;
}

.app-footer {
  text-align: center;
  padding: var(--spacing-8) 0;
  color: var(--text-tertiary);
  font-size: var(--text-sm);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  margin-top: var(--spacing-12);
}

section {
  margin-bottom: var(--spacing-12);
}

section h2 {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  margin-bottom: var(--spacing-6);
  color: var(--text-primary);
}

.chart-wrapper {
  margin-bottom: var(--spacing-8);
}

@media (max-width: 768px) {
  .app-container {
    padding: var(--spacing-4);
  }

  .app-header h1 {
    font-size: var(--text-2xl);
  }

  .chart-wrapper {
    margin-bottom: var(--spacing-6);
  }
}
</style>

