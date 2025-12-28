<template>
  <div class="optimization-section">
    <div class="toggle-container" :class="{ active: modelValue }" @click="toggleOptimization">
      <div class="toggle-header">
        <h3>{{ modelValue ? 'Optimized Strategy Active' : 'Activate Optimization' }}</h3>
        <p>{{ modelValue ? 'See your accelerated growth path' : 'Discover your potential' }}</p>
      </div>

      <button
        class="toggle-button"
        :class="{ active: modelValue }"
        type="button"
        :aria-label="modelValue ? 'Disable optimization' : 'Enable optimization'"
        :aria-pressed="modelValue"
      >
        <span class="toggle-slider"></span>
        <span class="toggle-label">{{ modelValue ? 'ON' : 'OFF' }}</span>
      </button>
    </div>

    <transition name="success-fade">
      <div v-if="modelValue" class="success-state">
        <div class="success-icon">✓</div>
        <div class="success-text">
          <h4>Success! Your optimized path is active</h4>
          <p>You could gain <strong>{{ formatYears(yearsGained) }}</strong> by optimizing your strategy</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { formatYears } from '@/utils/formatters'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  yearsGained: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:modelValue'])

const toggleOptimization = () => {
  emit('update:modelValue', !props.modelValue)
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

.toggle-container.active {
  border-color: var(--accent-primary);
  background: linear-gradient(
    135deg,
    rgba(0, 212, 255, 0.1) 0%,
    rgba(124, 58, 237, 0.1) 100%
  );
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

.toggle-button {
  position: relative;
  width: 80px;
  height: 40px;
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
  top: 4px;
  left: 4px;
  width: 30px;
  height: 30px;
  background: white;
  border-radius: 50%;
  transition: transform var(--duration-normal) var(--ease-bounce);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.toggle-button.active .toggle-slider {
  transform: translateX(40px);
}

.toggle-label {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-tertiary);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  pointer-events: none;
  transition: all var(--duration-normal) var(--ease-in-out);
}

.toggle-button.active .toggle-label {
  left: 12px;
  right: auto;
  color: white;
}

.success-state {
  margin-top: var(--spacing-6);
  padding: var(--spacing-6);
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid rgba(0, 255, 136, 0.3);
  border-radius: var(--radius-lg);
  display: flex;
  gap: var(--spacing-4);
  align-items: center;
}

.success-icon {
  width: 48px;
  height: 48px;
  background: var(--accent-success);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--bg-primary);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  flex-shrink: 0;
  animation: checkmarkPop 0.6s var(--ease-bounce);
}

.success-text h4 {
  color: var(--accent-success);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  margin-bottom: var(--spacing-2);
}

.success-text p {
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.success-text strong {
  color: var(--accent-success);
  font-weight: var(--font-bold);
}

/* Animation */
.success-fade-enter-active,
.success-fade-leave-active {
  transition: all var(--duration-slow) var(--ease-in-out);
}

.success-fade-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.success-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@keyframes checkmarkPop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .toggle-container {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-4);
  }

  .toggle-button {
    align-self: flex-end;
  }

  .success-state {
    flex-direction: column;
    text-align: center;
  }
}
</style>

