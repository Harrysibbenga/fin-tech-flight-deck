<template>
  <button
    :class="['btn', `btn-${variant}`, { 'btn-full': fullWidth }]"
    :disabled="disabled"
    :type="type"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'button'
  }
})

defineEmits(['click'])
</script>

<style scoped>
.btn-full {
  width: 100%;
}

.btn:focus-visible {
  outline: 2px solid var(--accent-primary, #00d4ff);
  outline-offset: 2px;
}

.btn:disabled:focus-visible {
  outline: none;
}
</style>

