<template>
  <div class="app-container" :class="{ 'app-loaded': isLoaded }">
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

        <MetricsCards
          :optimized-value="results.optimizedValue"
          :value-difference="results.valueDifference"
          :percentage-gain="results.percentageGain"
        />

        <transition name="chart-fade" mode="out-in">
          <div
            class="chart-wrapper"
            :key="viewMode"
          >
            <LineChart
              :baseline-data="chartData.baseline"
              :optimized-data="chartData.optimized"
              :difference-data="chartData.difference"
              :labels="chartData.labels"
              :view-mode="viewMode"
              :height="400"
            />
          </div>
        </transition>

        <OptimizationToggle v-model="viewMode" />
      </section>

      <!-- Lead Gate -->
      <section class="lead-section">
        <LeadGate :slider-values="sliderValues" :results="results" />
      </section>
    </main>

    <footer class="app-footer">
      <p>© 2025 Wealth Optimization. For illustration purposes only.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import SliderInput from './components/calculator/SliderInput.vue'
import OdometerDisplay from './components/calculator/OdometerDisplay.vue'
import MetricsCards from './components/calculator/MetricsCards.vue'
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

// Page load state for fade-in animation
const isLoaded = ref(false)

// Use calculations composable (always calculates both trajectories)
const { results, chartData } = useCalculations(sliderValues)

// Trigger fade-in animation on mount
onMounted(() => {
  // Calculations run immediately via computed properties
  // Trigger fade-in animation
  setTimeout(() => {
    isLoaded.value = true
  }, 10)
})
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #0a0e14 0%, #121820 100%);
  color: var(--text-primary);
  padding: var(--spacing-8);
  opacity: 0;
  transition: opacity 400ms ease-out;
}

.app-container.app-loaded {
  opacity: 1;
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

/* Chart transition animation */
.chart-fade-enter-active,
.chart-fade-leave-active {
  transition: opacity var(--duration-slow) var(--ease-in-out),
              transform var(--duration-slow) var(--ease-in-out);
}

.chart-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.chart-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Focus styles for accessibility */
section:focus-within {
  outline: 2px solid rgba(0, 212, 255, 0.2);
  outline-offset: 4px;
  border-radius: var(--radius-md);
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .app-container {
    transition: none;
  }

  .chart-fade-enter-active,
  .chart-fade-leave-active {
    transition: none;
  }
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

