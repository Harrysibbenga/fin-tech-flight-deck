<template>
  <div :class="['card', { 'card-elevated': elevated }]">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  elevated: {
    type: Boolean,
    default: false
  }
})
</script>

