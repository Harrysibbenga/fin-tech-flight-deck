# FinTech Efficiency Calculator - Requirements Document
**Project:** Premium FinTech Interactive Dashboard (Vue.js)
**Client:** Hayden Wilson - Financial Planning Brand
**Timeline:** Demo in 48 hours, Full project 10-14 days
**Budget:** $600 fixed price

---

## 🎯 Project Overview

Build a single-page interactive "Efficiency Calculator" that helps 30-35 year old professionals discover their "Efficiency Gap" - the years they're losing by not optimizing home equity.

**Visual Reference:** Premium FinTech aesthetic similar to:
- Stake (trading app)
- Revolut (banking app)
- Apple Health (iOS app)

---

## 🎨 Design Requirements

### Color Palette
```css
/* Primary Colors */
--bg-primary: #0a0e14;           /* Deep dark background */
--bg-secondary: #121820;         /* Card/panel background */
--bg-tertiary: #1a1f2e;          /* Elevated elements */

/* Accent Colors */
--accent-primary: #00d4ff;       /* Neon blue (primary CTA) */
--accent-secondary: #7c3aed;     /* Purple (secondary accent) */
--accent-success: #00ff88;       /* Green (success state) */
--accent-warning: #ff9500;       /* Orange (warnings) */

/* Text Colors */
--text-primary: #ffffff;         /* Main text */
--text-secondary: #8b92a8;       /* Secondary text */
--text-tertiary: #5a6070;        /* Disabled/tertiary text */

/* Gradient Overlays */
--gradient-card: linear-gradient(135deg, #1a1f2e 0%, #121820 100%);
--gradient-accent: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
--gradient-success: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%);
```

### Typography
```css
/* Font Family */
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', 
             'Inter', 'Roboto', sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;     /* 12px - small labels */
--text-sm: 0.875rem;    /* 14px - body text */
--text-base: 1rem;      /* 16px - default */
--text-lg: 1.125rem;    /* 18px - subheadings */
--text-xl: 1.5rem;      /* 24px - section titles */
--text-2xl: 2rem;       /* 32px - main numbers */
--text-3xl: 3rem;       /* 48px - hero numbers */

/* Font Weights */
--font-light: 300;
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line Heights */
--leading-tight: 1.2;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### Spacing System
```css
/* Spacing Scale */
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */

/* Border Radius */
--radius-sm: 8px;       /* Small cards */
--radius-md: 12px;      /* Medium cards */
--radius-lg: 16px;      /* Large cards */
--radius-xl: 24px;      /* Hero elements */
--radius-full: 9999px;  /* Pills/buttons */
```

### Animation & Transitions
```css
/* Timing Functions */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0.0, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* Duration */
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 400ms;

/* Example Transitions */
transition: all var(--duration-normal) var(--ease-in-out);
```

---

## 🏗️ Component Structure

### 1. App Container
```html
<div id="app" class="app-container">
  <!-- Full viewport, centered content -->
</div>
```

**Styling:**
- Full viewport height (100vh)
- Dark gradient background
- Centered content (max-width: 1200px)
- Padding: 24px mobile, 48px desktop
- Overflow hidden (no scrollbars visible)

---

### 2. Input Deck (Sliders Section)

**5-6 Custom Sliders:**

#### Slider 1: Age
- Label: "Your Age"
- Range: 25-70
- Default: 32
- Step: 1
- Units: "years"

#### Slider 2: Home Equity
- Label: "Current Home Equity"
- Range: £0 - £500,000
- Default: £75,000
- Step: £5,000
- Units: "£"
- Format: Currency (e.g., "£75,000")

#### Slider 3: Available Cash
- Label: "Available Cash"
- Range: £0 - £100,000
- Default: £15,000
- Step: £1,000
- Units: "£"
- Format: Currency

#### Slider 4: Monthly Savings
- Label: "Monthly Savings"
- Range: £0 - £5,000
- Default: £500
- Step: £50
- Units: "£/month"
- Format: Currency per month

#### Slider 5: Investment Property (Optional)
- Label: "Investment Property Interest"
- Range: 0-100 (No to Yes scale)
- Default: 50
- Visual: Gradient fill (red → yellow → green)

**Slider Component Design:**
```css
.slider-container {
  background: var(--bg-secondary);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
  margin-bottom: var(--spacing-4);
  transition: all var(--duration-normal) var(--ease-in-out);
}

.slider-container:hover {
  background: var(--bg-tertiary);
  border-color: rgba(0, 212, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 212, 255, 0.1);
}

.slider-label {
  color: var(--text-secondary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  margin-bottom: var(--spacing-2);
  display: block;
}

.slider-value {
  color: var(--accent-primary);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--spacing-4);
  display: block;
  font-variant-numeric: tabular-nums; /* Monospace numbers */
}

/* Custom Range Slider Styling */
input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(
    to right,
    var(--accent-primary) 0%,
    var(--accent-primary) var(--slider-percentage),
    var(--bg-primary) var(--slider-percentage),
    var(--bg-primary) 100%
  );
  outline: none;
  transition: background var(--duration-fast);
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--accent-primary);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 212, 255, 0.5),
              0 0 0 4px rgba(0, 212, 255, 0.2);
  transition: all var(--duration-normal) var(--ease-bounce);
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 16px rgba(0, 212, 255, 0.6),
              0 0 0 6px rgba(0, 212, 255, 0.3);
}

input[type="range"]:active::-webkit-slider-thumb {
  transform: scale(1.1);
}

/* Firefox */
input[type="range"]::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--accent-primary);
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 212, 255, 0.5);
}
```

---

### 3. The Engine (Calculation Logic)

**Formula Structure (Example - client will provide actual formulas):**

```javascript
// Efficiency Gap Calculation
const calculateEfficiencyGap = (age, equity, cash, monthlySavings) => {
  // Baseline growth (current trajectory)
  const baselineGrowth = equity + (cash * 12 * 0.04); // 4% annual return
  
  // Optimized growth (with equity optimization)
  const optimizedGrowth = (equity * 1.08) + (cash * 12 * 0.07); // 8% leveraged return
  
  // Efficiency gap in years
  const yearsDifference = (optimizedGrowth - baselineGrowth) / (monthlySavings * 12);
  
  return {
    baselineValue: baselineGrowth,
    optimizedValue: optimizedGrowth,
    yearsGained: Math.abs(yearsDifference),
    percentageGain: ((optimizedGrowth - baselineGrowth) / baselineGrowth) * 100
  };
};

// Reactive calculation
const results = computed(() => {
  return calculateEfficiencyGap(
    sliders.value.age,
    sliders.value.equity,
    sliders.value.cash,
    sliders.value.monthlySavings
  );
});
```

**Performance Requirements:**
- Calculations must update in < 16ms (60fps)
- Use `computed()` properties for reactivity
- Debounce slider input if calculations are heavy
- Round numbers appropriately (2 decimal places for currency)

---

### 4. Real-Time Visualization

#### A. Line Graph (Main Visualization)

**Library:** Chart.js (lightweight, 60kb minified)

**Configuration:**
```javascript
import { Line } from 'vue-chartjs';

const chartData = {
  labels: Array.from({ length: 30 }, (_, i) => `Year ${i + 1}`),
  datasets: [
    {
      label: 'Current Trajectory',
      data: calculateBaselineTrajectory(),
      borderColor: 'rgba(139, 146, 168, 0.5)', // Muted gray
      backgroundColor: 'rgba(139, 146, 168, 0.1)',
      borderWidth: 2,
      borderDash: [5, 5], // Dashed line
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6,
    },
    {
      label: 'Optimized Trajectory',
      data: calculateOptimizedTrajectory(),
      borderColor: '#00d4ff', // Neon blue
      backgroundColor: 'rgba(0, 212, 255, 0.1)',
      borderWidth: 3,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6,
      fill: true,
    }
  ]
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        color: '#ffffff',
        font: {
          size: 14,
          weight: 500
        },
        padding: 20,
        usePointStyle: true,
      }
    },
    tooltip: {
      backgroundColor: 'rgba(18, 24, 32, 0.95)',
      titleColor: '#ffffff',
      bodyColor: '#8b92a8',
      borderColor: 'rgba(0, 212, 255, 0.3)',
      borderWidth: 1,
      padding: 16,
      displayColors: true,
      callbacks: {
        label: (context) => {
          return `£${context.parsed.y.toLocaleString()}`;
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.05)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      ticks: {
        color: '#8b92a8',
        font: { size: 12 }
      }
    },
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.05)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      ticks: {
        color: '#8b92a8',
        font: { size: 12 },
        callback: (value) => `£${(value / 1000).toFixed(0)}k`
      }
    }
  }
};
```

**Container Styling:**
```css
.chart-container {
  background: var(--bg-secondary);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
  height: 400px;
  margin-bottom: var(--spacing-8);
}

@media (max-width: 768px) {
  .chart-container {
    height: 300px;
  }
}
```

#### B. Odometer Display (Years Gained)

**Component:**
```vue
<template>
  <div class="odometer-container">
    <div class="odometer-label">Years You Could Gain</div>
    <div class="odometer-value">
      <span class="odometer-digit" v-for="(digit, index) in formattedValue" :key="index">
        {{ digit }}
      </span>
    </div>
    <div class="odometer-sublabel">by optimizing your equity strategy</div>
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue';

const props = defineProps({
  value: Number
});

const displayValue = ref(0);

// Animate value changes
watch(() => props.value, (newVal) => {
  animateValue(displayValue.value, newVal, 1000);
});

const animateValue = (start, end, duration) => {
  const range = end - start;
  const startTime = Date.now();
  
  const step = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function
    const eased = 1 - Math.pow(1 - progress, 3);
    displayValue.value = start + (range * eased);
    
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };
  
  requestAnimationFrame(step);
};

const formattedValue = computed(() => {
  return displayValue.value.toFixed(1).split('');
});
</script>

<style scoped>
.odometer-container {
  text-align: center;
  padding: var(--spacing-8);
  background: var(--gradient-card);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: var(--radius-xl);
  margin-bottom: var(--spacing-8);
}

.odometer-label {
  color: var(--text-secondary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: var(--spacing-4);
}

.odometer-value {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  margin-bottom: var(--spacing-4);
}

.odometer-digit {
  display: inline-block;
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--accent-primary);
  background: rgba(0, 212, 255, 0.1);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-sm);
  min-width: 50px;
  text-align: center;
  font-variant-numeric: tabular-nums;
  box-shadow: 0 4px 16px rgba(0, 212, 255, 0.2);
}

.odometer-digit:nth-child(2) {
  /* Decimal point - smaller */
  font-size: var(--text-xl);
  min-width: 20px;
  background: transparent;
  box-shadow: none;
}

.odometer-sublabel {
  color: var(--text-tertiary);
  font-size: var(--text-sm);
}

@media (max-width: 768px) {
  .odometer-digit {
    font-size: var(--text-2xl);
    min-width: 40px;
    padding: var(--spacing-2) var(--spacing-3);
  }
}
</style>
```

---

### 5. The Optimization Toggle (CTA Switch)

**Component:**
```vue
<template>
  <div class="optimization-section">
    <div class="toggle-container" :class="{ active: isOptimized }">
      <div class="toggle-header">
        <h3>{{ isOptimized ? 'Optimized Strategy Active' : 'Activate Optimization' }}</h3>
        <p>{{ isOptimized ? 'See your accelerated growth path' : 'Discover your potential' }}</p>
      </div>
      
      <button 
        class="toggle-button" 
        :class="{ active: isOptimized }"
        @click="toggleOptimization"
      >
        <span class="toggle-slider"></span>
        <span class="toggle-label">{{ isOptimized ? 'ON' : 'OFF' }}</span>
      </button>
    </div>
    
    <transition name="success-fade">
      <div v-if="isOptimized" class="success-state">
        <div class="success-icon">✓</div>
        <div class="success-text">
          <h4>Success! Your optimized path is active</h4>
          <p>You could gain <strong>{{ yearsGained }}</strong> years by optimizing your strategy</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isOptimized = ref(false);
const props = defineProps({
  yearsGained: Number
});

const toggleOptimization = () => {
  isOptimized.value = !isOptimized.value;
};
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
}

.toggle-container:hover {
  border-color: rgba(0, 212, 255, 0.3);
  background: var(--bg-tertiary);
}

.toggle-container.active {
  border-color: var(--accent-primary);
  background: linear-gradient(135deg, 
    rgba(0, 212, 255, 0.1) 0%, 
    rgba(124, 58, 237, 0.1) 100%);
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
.success-fade-enter-active, .success-fade-leave-active {
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
</style>
```

---

### 6. Lead Gate (Email Capture)

**Component:**
```vue
<template>
  <div class="lead-gate" v-if="!submitted">
    <div class="lead-gate-content">
      <h3>Download Your Personalized Blueprint</h3>
      <p>Get a detailed PDF showing your optimized wealth strategy</p>
      
      <form @submit.prevent="handleSubmit" class="lead-form">
        <div class="input-group">
          <input 
            type="email" 
            v-model="email" 
            placeholder="Enter your email"
            required
            class="email-input"
          />
          <button type="submit" class="submit-button">
            <span>Download Blueprint</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        
        <p class="privacy-note">
          We respect your privacy. Unsubscribe anytime.
        </p>
      </form>
    </div>
  </div>
  
  <div class="success-download" v-else>
    <div class="success-animation">
      <div class="checkmark">✓</div>
    </div>
    <h3>Blueprint Sent!</h3>
    <p>Check your email for your personalized wealth optimization blueprint</p>
    <div class="download-actions">
      <button class="action-button primary" @click="downloadPDF">
        Download PDF
      </button>
      <button class="action-button secondary" @click="shareWhatsApp">
        Share on WhatsApp
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const submitted = ref(false);

const handleSubmit = () => {
  // TODO: Send email to backend/API
  console.log('Email submitted:', email.value);
  submitted.value = true;
};

const downloadPDF = () => {
  // TODO: Generate and download PDF
  console.log('Downloading PDF...');
};

const shareWhatsApp = () => {
  const text = encodeURIComponent('Check out my personalized wealth blueprint!');
  window.open(`https://wa.me/?text=${text}`, '_blank');
};
</script>

<style scoped>
.lead-gate {
  margin: var(--spacing-12) 0;
  padding: var(--spacing-8);
  background: var(--gradient-card);
  border: 2px solid rgba(0, 212, 255, 0.2);
  border-radius: var(--radius-xl);
  text-align: center;
}

.lead-gate-content h3 {
  color: var(--text-primary);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--spacing-3);
}

.lead-gate-content p {
  color: var(--text-secondary);
  font-size: var(--text-base);
  margin-bottom: var(--spacing-6);
}

.input-group {
  display: flex;
  gap: var(--spacing-3);
  max-width: 600px;
  margin: 0 auto var(--spacing-3);
}

.email-input {
  flex: 1;
  padding: var(--spacing-4) var(--spacing-6);
  background: var(--bg-primary);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  color: var(--text-primary);
  font-size: var(--text-base);
  transition: all var(--duration-normal) var(--ease-in-out);
}

.email-input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 4px rgba(0, 212, 255, 0.1);
}

.email-input::placeholder {
  color: var(--text-tertiary);
}

.submit-button {
  padding: var(--spacing-4) var(--spacing-6);
  background: var(--gradient-accent);
  border: none;
  border-radius: var(--radius-full);
  color: white;
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  transition: all var(--duration-normal) var(--ease-in-out);
  white-space: nowrap;
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 212, 255, 0.4);
}

.submit-button:active {
  transform: translateY(0);
}

.privacy-note {
  color: var(--text-tertiary);
  font-size: var(--text-xs);
}

.success-download {
  text-align: center;
  padding: var(--spacing-8);
}

.success-animation {
  margin-bottom: var(--spacing-6);
}

.checkmark {
  width: 80px;
  height: 80px;
  background: var(--accent-success);
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--bg-primary);
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  animation: checkmark-pop 0.6s var(--ease-bounce);
}

@keyframes checkmark-pop {
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

.success-download h3 {
  color: var(--text-primary);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--spacing-3);
}

.success-download p {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-6);
}

.download-actions {
  display: flex;
  gap: var(--spacing-4);
  justify-content: center;
}

.action-button {
  padding: var(--spacing-4) var(--spacing-6);
  border-radius: var(--radius-full);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-in-out);
}

.action-button.primary {
  background: var(--gradient-accent);
  border: none;
  color: white;
}

.action-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 212, 255, 0.4);
}

.action-button.secondary {
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: var(--text-primary);
}

.action-button.secondary:hover {
  border-color: var(--accent-primary);
  background: rgba(0, 212, 255, 0.1);
}

@media (max-width: 768px) {
  .input-group {
    flex-direction: column;
  }
  
  .download-actions {
    flex-direction: column;
  }
  
  .action-button {
    width: 100%;
  }
}
</style>
```

---

## 📱 Responsive Design Requirements

### Breakpoints
```css
/* Mobile First Approach */
/* Extra Small: 0-374px */
/* Small: 375px-639px */
/* Medium: 640px-767px */
/* Large: 768px-1023px */
/* Extra Large: 1024px+ */

@media (max-width: 639px) {
  /* Mobile styles */
  .app-container {
    padding: var(--spacing-4);
  }
  
  .slider-container {
    padding: var(--spacing-4);
  }
  
  .chart-container {
    height: 250px;
  }
  
  .odometer-digit {
    font-size: var(--text-xl);
    min-width: 36px;
  }
}

@media (min-width: 640px) and (max-width: 767px) {
  /* Tablet styles */
}

@media (min-width: 768px) {
  /* Desktop styles */
  .app-container {
    padding: var(--spacing-8);
  }
}
```

### Mobile-Specific Optimizations
- Touch targets minimum 44x44px
- Increased padding on interactive elements
- Larger font sizes for readability
- Simplified layouts (stack instead of grid)
- Reduced motion on low-end devices

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🚀 Performance Requirements

### Target Metrics
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Lighthouse Performance Score: 90+
- Mobile Lighthouse Score: 85+

### Optimization Strategies
1. **Bundle Size:**
   - Target: < 200kb gzipped
   - Use Vue 3 composition API (smaller bundle)
   - Tree-shake Chart.js (only import Line component)
   - No heavy dependencies

2. **Rendering:**
   - Use `v-memo` for slider components
   - Debounce slider updates (16ms for 60fps)
   - Use CSS transforms for animations (GPU accelerated)
   - Lazy load non-critical components

3. **Network:**
   - Inline critical CSS
   - Preload fonts
   - Use CDN for Chart.js if needed

---

## 🛠️ Tech Stack

### Core
```json
{
  "vue": "^3.4.0",
  "chart.js": "^4.4.0",
  "vue-chartjs": "^5.3.0"
}
```

### Build Tool
- **Vite** (ultra-fast, optimized for Vue 3)
- Development server with HMR
- Optimized production builds

### Optional Enhancements
- **VueUse** - Utility composables (if needed)
- **Headless UI** - Accessible components (if needed)

---

## 📦 Project Structure

```
fintech-calculator/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── SliderInput.vue
│   │   ├── OdometerDisplay.vue
│   │   ├── LineChart.vue
│   │   ├── OptimizationToggle.vue
│   │   └── LeadGate.vue
│   ├── composables/
│   │   ├── useCalculations.js
│   │   └── useAnimations.js
│   ├── assets/
│   │   └── styles/
│   │       ├── variables.css
│   │       ├── base.css
│   │       └── animations.css
│   ├── App.vue
│   └── main.js
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## 🎨 App.vue Structure

```vue
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
          v-for="slider in sliders"
          :key="slider.id"
          v-model="sliderValues[slider.id]"
          :config="slider"
        />
      </section>

      <!-- Results Section -->
      <section class="results-section">
        <OdometerDisplay :value="results.yearsGained" />
        
        <div class="chart-wrapper">
          <LineChart :data="chartData" :options="chartOptions" />
        </div>

        <OptimizationToggle 
          v-model="isOptimized"
          :yearsGained="results.yearsGained"
        />
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
import { ref, computed } from 'vue';
import SliderInput from './components/SliderInput.vue';
import OdometerDisplay from './components/OdometerDisplay.vue';
import LineChart from './components/LineChart.vue';
import OptimizationToggle from './components/OptimizationToggle.vue';
import LeadGate from './components/LeadGate.vue';
import { useCalculations } from './composables/useCalculations';

// Slider configurations
const sliders = [
  {
    id: 'age',
    label: 'Your Age',
    min: 25,
    max: 70,
    step: 1,
    default: 32,
    format: (val) => `${val} years`
  },
  {
    id: 'equity',
    label: 'Current Home Equity',
    min: 0,
    max: 500000,
    step: 5000,
    default: 75000,
    format: (val) => `£${val.toLocaleString()}`
  },
  // ... other sliders
];

// Reactive slider values
const sliderValues = ref({
  age: 32,
  equity: 75000,
  cash: 15000,
  monthlySavings: 500
});

const isOptimized = ref(false);

// Use calculation composable
const { results, chartData } = useCalculations(sliderValues, isOptimized);
</script>

<style>
@import './assets/styles/variables.css';
@import './assets/styles/base.css';
@import './assets/styles/animations.css';

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

section {
  margin-bottom: var(--spacing-12);
}

section h2 {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  margin-bottom: var(--spacing-6);
  color: var(--text-primary);
}

.app-footer {
  text-align: center;
  padding: var(--spacing-8) 0;
  color: var(--text-tertiary);
  font-size: var(--text-sm);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  margin-top: var(--spacing-12);
}

@media (max-width: 768px) {
  .app-container {
    padding: var(--spacing-4);
  }
  
  .app-header h1 {
    font-size: var(--text-2xl);
  }
}
</style>
```

---

## 🎬 Animation Guidelines

### Micro-Interactions
```css
/* Button Hover */
button:hover {
  transform: translateY(-2px);
  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Card Hover */
.card:hover {
  box-shadow: 0 8px 32px rgba(0, 212, 255, 0.15);
  transform: translateY(-4px);
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Slider Interaction */
input[type="range"]:active::-webkit-slider-thumb {
  transform: scale(1.15);
  transition: transform 150ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Number Counter Animation */
@keyframes countup {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.odometer-digit {
  animation: countup 400ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Loading States
```vue
<div class="skeleton-loader" v-if="loading">
  <div class="skeleton-line"></div>
  <div class="skeleton-line short"></div>
</div>

<style>
.skeleton-line {
  height: 20px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 12px;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
```

---

## 🧪 Testing Requirements

### Manual Testing Checklist
- [ ] All sliders update calculations in real-time
- [ ] Chart updates smoothly without lag
- [ ] Odometer animation is smooth
- [ ] Toggle switch works and updates visuals
- [ ] Email form validates properly
- [ ] Responsive on mobile (320px to 768px)
- [ ] Works on Safari, Chrome, Firefox
- [ ] Touch interactions work on mobile
- [ ] No console errors
- [ ] All animations run at 60fps

### Browser Support
- Chrome/Edge: Latest 2 versions
- Safari: Latest 2 versions (iOS + macOS)
- Firefox: Latest 2 versions
- Mobile Safari iOS: 14+
- Chrome Android: Latest

---

## 🚢 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Performance Checks Before Deploy
- [ ] Bundle size < 200kb gzipped
- [ ] Lighthouse score 90+ (desktop)
- [ ] Lighthouse score 85+ (mobile)
- [ ] No console errors/warnings
- [ ] All images optimized
- [ ] Fonts preloaded

---

## 📝 Additional Notes

### Client Will Provide
1. **Actual calculation formulas** (Google Sheet)
2. **Specific copy/messaging**
3. **Brand logo** (if any)
4. **Exact number of sliders** (5-6 confirmed)

### Nice-to-Have Enhancements (If Time Permits)
- Print-friendly version
- Social sharing meta tags
- Analytics integration (Google Analytics)
- A/B testing framework
- Accessibility improvements (ARIA labels, keyboard navigation)

---

## ✅ Cursor AI Instructions

When building this with Cursor, use these prompts:

**Initial Setup:**
```
Create a Vue 3 + Vite project with the following:
- Dark FinTech aesthetic (colors: #0a0e14 background, #00d4ff accent)
- 5 custom range sliders with neon styling
- Chart.js line chart component
- Odometer-style number display with animation
- Mobile-first responsive design
- All components in src/components/
```

**For Sliders:**
```
Create a SliderInput.vue component with:
- Custom range input styling (neon blue track)
- Large thumb with glow effect
- Animated value display above slider
- Props: modelValue, min, max, step, label, formatFn
- Emit: update:modelValue
- Smooth hover/active states
```

**For Chart:**
```
Create LineChart.vue using Chart.js with:
- Two datasets: baseline (dashed gray) and optimized (solid neon blue)
- Dark theme (background #121820)
- Gradient fill under optimized line
- Smooth curves (tension: 0.4)
- Responsive height
- Y-axis formatted as currency (£)
```

**For Odometer:**
```
Create OdometerDisplay.vue with:
- Animated number counter using requestAnimationFrame
- Each digit in separate box with neon glow
- Smooth easing function (cubic ease-out)
- Format: X.X years (one decimal place)
- Center aligned with labels above/below
```

---

## 🎯 Success Criteria

The demo is ready when:
- ✅ All 5 sliders work and update calculations
- ✅ Chart displays and updates smoothly
- ✅ Odometer animates value changes
- ✅ Works perfectly on mobile (tested on phone)
- ✅ Dark FinTech aesthetic matches Stake/Revolut
- ✅ No lag or jank (60fps)
- ✅ Clean, professional code
- ✅ Deployed to Vercel with working URL

---

**Total Estimated Build Time with Cursor:** 3-4 hours
**Target Completion:** 48 hours from now
**Deployment:** Vercel (free, instant)
