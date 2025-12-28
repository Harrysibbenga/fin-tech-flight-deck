<template>
  <div class="app-container">
    <header class="app-header">
      <h1>Wealth Efficiency Calculator</h1>
      <p>Discover how many years you're losing</p>
    </header>

    <main class="app-main">
      <!-- Placeholder for components -->
    </main>

    <footer class="app-footer">
      <p>© 2024 Wealth Optimization. For illustration purposes only.</p>
    </footer>
  </div>
</template>

<script setup>
// App setup - will be populated as components are built
</script>

<style scoped>
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

