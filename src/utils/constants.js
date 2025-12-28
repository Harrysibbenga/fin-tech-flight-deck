/**
 * Application constants
 */

export const DEFAULT_SLIDER_VALUES = {
  age: 32,
  equity: 75000,
  cash: 15000,
  monthlySavings: 500,
  investmentInterest: 50
}

export const SLIDER_RANGES = {
  age: { min: 25, max: 70, step: 1 },
  equity: { min: 0, max: 500000, step: 5000 },
  cash: { min: 0, max: 100000, step: 1000 },
  monthlySavings: { min: 0, max: 5000, step: 50 },
  investmentInterest: { min: 0, max: 100, step: 1 }
}

export const CALCULATION_CONSTANTS = {
  BASELINE_ANNUAL_RETURN: 0.05,    // 5% - typical savings/conservative investment
  OPTIMIZED_ANNUAL_RETURN: 0.07,   // 7% - equity-leveraged property returns
  LEVERAGE_MULTIPLIER: 1.0,        // Remove leverage multiplier (was causing inflation)
  YEARS_PROJECTION: 30
}

export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 250,
  SLOW: 400,
  ODOMETER: 1000
}

export const DEBOUNCE_DELAY = 16 // 60fps = 16ms

