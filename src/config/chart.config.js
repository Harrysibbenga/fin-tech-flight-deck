/**
 * Chart.js configuration for the calculator
 * Dark theme optimized for FinTech aesthetic
 */

export const CHART_COLORS = {
  baseline: {
    border: 'rgba(139, 146, 168, 0.5)',
    background: 'rgba(139, 146, 168, 0.1)'
  },
  optimized: {
    border: '#00d4ff',
    background: 'rgba(0, 212, 255, 0.1)'
  },
  grid: 'rgba(255, 255, 255, 0.05)',
  text: '#8b92a8',
  tooltipBg: 'rgba(18, 24, 32, 0.95)',
  tooltipBorder: 'rgba(0, 212, 255, 0.3)'
}

export const CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false
  },
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
        boxWidth: 12,
        boxHeight: 12
      }
    },
    tooltip: {
      backgroundColor: CHART_COLORS.tooltipBg,
      titleColor: '#ffffff',
      bodyColor: CHART_COLORS.text,
      borderColor: CHART_COLORS.tooltipBorder,
      borderWidth: 1,
      padding: 16,
      displayColors: true,
      cornerRadius: 8,
      callbacks: {
        label: (context) => {
          return `£${context.parsed.y.toLocaleString()}`
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: CHART_COLORS.grid,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        drawBorder: false
      },
      ticks: {
        color: CHART_COLORS.text,
        font: { size: 12 }
      }
    },
    y: {
      grid: {
        color: CHART_COLORS.grid,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        drawBorder: false
      },
      ticks: {
        color: CHART_COLORS.text,
        font: { size: 12 },
        callback: (value) => `£${(value / 1000).toFixed(0)}k`
      }
    }
  }
}

/**
 * Create chart dataset for baseline trajectory
 * @param {Array<number>} data - Data points
 * @returns {Object} Chart.js dataset configuration
 */
export function createBaselineDataset(data) {
  return {
    label: 'Current Trajectory',
    data,
    borderColor: CHART_COLORS.baseline.border,
    backgroundColor: CHART_COLORS.baseline.background,
    borderWidth: 2,
    borderDash: [5, 5],
    tension: 0.4,
    pointRadius: 0,
    pointHoverRadius: 6,
    fill: false
  }
}

/**
 * Create chart dataset for optimized trajectory
 * @param {Array<number>} data - Data points
 * @returns {Object} Chart.js dataset configuration
 */
export function createOptimizedDataset(data) {
  return {
    label: 'Optimized Trajectory',
    data,
    borderColor: CHART_COLORS.optimized.border,
    backgroundColor: CHART_COLORS.optimized.background,
    borderWidth: 3,
    tension: 0.4,
    pointRadius: 0,
    pointHoverRadius: 6,
    fill: true
  }
}

