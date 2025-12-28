<template>
  <div class="optimization-section">
    <div class="toggle-container" @click="toggleView">
      <div class="toggle-header">
        <h3>Compare Strategies</h3>
        <p>{{ viewMode === 'side-by-side' ? 'Viewing both trajectories together' : 'Showing the difference between strategies' }}</p>
      </div>

      <div class="toggle-control">
        <span class="view-label" :class="{ active: viewMode === 'side-by-side' }">Side by Side</span>
        <button
          class="toggle-button"
          :class="{ active: viewMode === 'difference' }"
          type="button"
          :aria-label="viewMode === 'side-by-side' ? 'Switch to difference view' : 'Switch to side by side view'"
          :aria-pressed="viewMode === 'difference'"
        >
          <span class="toggle-slider"></span>
        </button>
        <span class="view-label" :class="{ active: viewMode === 'difference' }">Difference View</span>
      </div>
    </div>

    <transition name="view-fade">
      <div class="view-info" :key="viewMode">
        <div class="info-icon">
          <svg v-if="viewMode === 'side-by-side'" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 3h8v8H3V3zM13 3h8v8h-8V3zM3 13h8v8H3v-8zM13 13h8v8h-8v-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 12h18M12 3v18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="12" r="2" fill="currentColor"/>
          </svg>
        </div>
        <div class="info-text">
          <h4>{{ viewMode === 'side-by-side' ? 'Both Trajectories' : 'Difference Highlighted' }}</h4>
          <p v-if="viewMode === 'side-by-side'">
            Compare your current path with the optimized strategy side by side
          </p>
          <p v-else>
            See the exact value difference between strategies over time
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: 'side-by-side',
    validator: (value) => ['side-by-side', 'difference'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue'])

const viewMode = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const toggleView = () => {
  viewMode.value = viewMode.value === 'side-by-side' ? 'difference' : 'side-by-side'
}
</script>

<style scoped>
.optimization-section {
  margin: var(--spacing-8) 0;
}

.toggle-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-6);
  background: var(--bg-secondary);
  border: 2px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  transition: all var(--duration-normal) var(--ease-in-out);
  cursor: pointer;
  gap: var(--spacing-6);
}

.toggle-container:hover {
  border-color: rgba(0, 212, 255, 0.3);
  background: var(--bg-tertiary);
}

.toggle-header {
  flex: 1;
}

.toggle-header h3 {
  color: var(--text-primary);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  margin-bottom: var(--spacing-2);
}

.toggle-header p {
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.toggle-control {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  flex-shrink: 0;
}

.view-label {
  color: var(--text-tertiary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  transition: color var(--duration-normal) var(--ease-in-out);
}

.view-label.active {
  color: var(--text-primary);
  font-weight: var(--font-semibold);
}

.toggle-button {
  position: relative;
  width: 64px;
  height: 32px;
  background: var(--bg-primary);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-in-out);
  overflow: hidden;
  flex-shrink: 0;
}

.toggle-button.active {
  background: var(--gradient-accent);
  border-color: transparent;
}

.toggle-slider {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  transition: transform var(--duration-normal) var(--ease-bounce);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.toggle-button.active .toggle-slider {
  transform: translateX(32px);
}

.view-info {
  margin-top: var(--spacing-6);
  padding: var(--spacing-6);
  background: rgba(0, 212, 255, 0.05);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: var(--radius-lg);
  display: flex;
  gap: var(--spacing-4);
  align-items: center;
}

.info-icon {
  width: 48px;
  height: 48px;
  background: rgba(0, 212, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-primary);
  flex-shrink: 0;
}

.info-text h4 {
  color: var(--text-primary);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  margin-bottom: var(--spacing-2);
}

.info-text p {
  color: var(--text-secondary);
  font-size: var(--text-sm);
  margin: 0;
}

/* Animation */
.view-fade-enter-active,
.view-fade-leave-active {
  transition: all var(--duration-slow) var(--ease-in-out);
}

.view-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.view-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 768px) {
  .toggle-container {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-4);
  }

  .toggle-control {
    justify-content: space-between;
    width: 100%;
  }

  .view-info {
    flex-direction: column;
    text-align: center;
  }
}
</style>
