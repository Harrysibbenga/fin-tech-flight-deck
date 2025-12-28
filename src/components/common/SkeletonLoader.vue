<template>
  <div :class="['skeleton-loader', className]" :style="style">
    <div
      v-for="(line, index) in lines"
      :key="index"
      :class="['skeleton-line', { 'skeleton-line-short': line.short }]"
    ></div>
  </div>
</template>

<script setup>
defineProps({
  lines: {
    type: Number,
    default: 1
  },
  className: {
    type: String,
    default: ''
  },
  style: {
    type: Object,
    default: () => ({})
  }
})
</script>

<style scoped>
.skeleton-loader {
  width: 100%;
}

.skeleton-line {
  height: 20px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 12px;
}

.skeleton-line:last-child {
  margin-bottom: 0;
}

.skeleton-line-short {
  width: 60%;
}

@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .skeleton-line {
    animation: none;
    background: rgba(255, 255, 255, 0.05);
  }
}
</style>
