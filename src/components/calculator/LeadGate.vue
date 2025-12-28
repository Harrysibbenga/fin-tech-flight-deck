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
            :aria-label="'Email address'"
            :aria-invalid="emailError ? 'true' : 'false'"
            :aria-describedby="emailError ? 'email-error' : undefined"
          />
          <button type="submit" class="submit-button" :disabled="isSubmitting">
            <span v-if="!isSubmitting">Download Blueprint</span>
            <span v-else>Submitting...</span>
            <svg
              v-if="!isSubmitting"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 10h12M10 4l6 6-6 6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>

        <div v-if="emailError" id="email-error" class="error-message" role="alert">
          {{ emailError }}
        </div>

        <p class="privacy-note">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="lock-icon">
            <path d="M12 7V5a4 4 0 00-8 0v2M4 7h8a1 1 0 011 1v5a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
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
      <button class="action-button primary" @click="downloadPDF" type="button">
        Download PDF
      </button>
      <button class="action-button secondary" @click="shareWhatsApp" type="button">
        Share on WhatsApp
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { isValidEmail } from '@/utils/validators'
import { formatCurrency, formatNumber } from '@/utils/formatters'
import jsPDF from 'jspdf'

// Inject slider values and results from parent (or use props)
const props = defineProps({
  sliderValues: {
    type: Object,
    default: () => ({})
  },
  results: {
    type: Object,
    default: () => ({})
  }
})

const email = ref('')
const emailError = ref('')
const submitted = ref(false)
const isSubmitting = ref(false)

const handleSubmit = async () => {
  emailError.value = ''

  if (!email.value.trim()) {
    emailError.value = 'Email is required'
    return
  }

  if (!isValidEmail(email.value)) {
    emailError.value = 'Please enter a valid email address'
    return
  }

  isSubmitting.value = true

  try {
    // TODO: Send email to backend/API
    // For now, simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log('Email submitted:', email.value)
    submitted.value = true
  } catch (error) {
    emailError.value = 'Something went wrong. Please try again.'
    console.error('Submission error:', error)
  } finally {
    isSubmitting.value = false
  }
}

const downloadPDF = () => {
  try {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    let yPosition = margin

    // Title
    doc.setFontSize(20)
    doc.setTextColor(0, 212, 255)
    doc.text('Your Wealth Optimization Blueprint', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 15

    // Subtitle
    doc.setFontSize(12)
    doc.setTextColor(139, 146, 168)
    doc.text('Personalized Financial Strategy Report', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 20

    // Current Situation
    doc.setFontSize(16)
    doc.setTextColor(255, 255, 255)
    doc.text('Your Current Situation', margin, yPosition)
    yPosition += 10

    doc.setFontSize(11)
    doc.setTextColor(139, 146, 168)
    const sliderValues = props.sliderValues || {}
    const results = props.results || {}
    
    if (sliderValues.age !== undefined) {
      doc.text(`Age: ${sliderValues.age} years`, margin + 5, yPosition)
      yPosition += 7
    }
    if (sliderValues.equity !== undefined) {
      doc.text(`Home Equity: ${formatCurrency(sliderValues.equity)}`, margin + 5, yPosition)
      yPosition += 7
    }
    if (sliderValues.cash !== undefined) {
      doc.text(`Available Cash: ${formatCurrency(sliderValues.cash)}`, margin + 5, yPosition)
      yPosition += 7
    }
    if (sliderValues.monthlySavings !== undefined) {
      doc.text(`Monthly Savings: ${formatCurrency(sliderValues.monthlySavings)}/month`, margin + 5, yPosition)
      yPosition += 7
    }
    
    yPosition += 10

    // Results
    doc.setFontSize(16)
    doc.setTextColor(0, 255, 136)
    doc.text('Your Optimization Results', margin, yPosition)
    yPosition += 10

    doc.setFontSize(11)
    doc.setTextColor(139, 146, 168)
    
    if (results.yearsGained !== undefined) {
      doc.setTextColor(0, 255, 136)
      doc.text(`Years You Could Gain: ${formatNumber(results.yearsGained, 1)} years`, margin + 5, yPosition)
      doc.setTextColor(139, 146, 168)
      yPosition += 7
    }
    if (results.baselineValue !== undefined) {
      doc.text(`Baseline Final Value: ${formatCurrency(results.baselineValue)}`, margin + 5, yPosition)
      yPosition += 7
    }
    if (results.optimizedValue !== undefined) {
      doc.text(`Optimized Final Value: ${formatCurrency(results.optimizedValue)}`, margin + 5, yPosition)
      yPosition += 7
    }
    if (results.valueDifference !== undefined) {
      doc.text(`Value Difference: ${formatCurrency(results.valueDifference)}`, margin + 5, yPosition)
      yPosition += 7
    }
    if (results.percentageGain !== undefined) {
      doc.text(`Percentage Gain: ${formatNumber(results.percentageGain, 2)}%`, margin + 5, yPosition)
      yPosition += 7
    }

    yPosition += 10

    // Footer note
    doc.setFontSize(9)
    doc.setTextColor(90, 96, 112)
    doc.text('For illustration purposes only. Consult a financial advisor for personalized advice.', 
      pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' })

    // Download
    doc.save('wealth-optimization-blueprint.pdf')
  } catch (error) {
    console.error('PDF generation error:', error)
    alert('Error generating PDF. Please try again.')
  }
}

const shareWhatsApp = () => {
  const text = encodeURIComponent('Check out my personalized wealth blueprint!')
  window.open(`https://wa.me/?text=${text}`, '_blank')
}
</script>

<style scoped>
.lead-gate {
  margin: var(--spacing-12) 0;
  padding: var(--spacing-8);
  background: rgba(26, 31, 46, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: var(--radius-xl);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.lead-gate::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.3), transparent);
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
  background: #0a0e14;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  color: var(--text-primary);
  font-size: var(--text-base);
  transition: all var(--duration-normal) var(--ease-in-out);
  min-height: 44px;
}

.email-input:focus {
  outline: none;
  border-color: #00d4ff;
  box-shadow: 0 0 0 4px rgba(0, 212, 255, 0.2), 0 0 20px rgba(0, 212, 255, 0.3);
}

.email-input:invalid:not(:focus):not(:placeholder-shown) {
  border-color: var(--accent-warning);
}

.email-input::placeholder {
  color: var(--text-tertiary);
}

.error-message {
  color: var(--accent-warning);
  font-size: var(--text-sm);
  margin-bottom: var(--spacing-2);
  min-height: 1.5rem;
}

.submit-button {
  padding: var(--spacing-4) var(--spacing-6);
  background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
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
  min-height: 44px;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 212, 255, 0.4),
              0 0 20px rgba(0, 212, 255, 0.3);
}

.submit-button:active:not(:disabled) {
  transform: translateY(0);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.privacy-note {
  color: var(--text-tertiary);
  font-size: var(--text-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  margin-top: var(--spacing-3);
}

.lock-icon {
  width: 16px;
  height: 16px;
  color: var(--text-tertiary);
  flex-shrink: 0;
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
  animation: checkmarkPop 0.6s var(--ease-bounce);
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
  min-height: 44px;
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

/* Focus styles */
.email-input:focus-visible {
  outline: 2px solid #00d4ff;
  outline-offset: 2px;
}

.submit-button:focus-visible,
.action-button:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .lead-gate,
  .success-download,
  .checkmark,
  .submit-button,
  .action-button,
  .email-input {
    transition: none;
    animation: none;
  }
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

