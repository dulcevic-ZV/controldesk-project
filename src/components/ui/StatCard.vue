<template>
  <div class="stat-card">
    <div class="stat-card__icon" :style="{ color: color, background: `${color}18` }">
      <i :class="icon" />
    </div>
    <div class="stat-card__body">
      <span class="stat-card__value">{{ value }}</span>
      <span class="stat-card__label">{{ label }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: [Number, String],
  icon:  String,
  color: { type: String, default: 'var(--cd-accent)' }
})
</script>

<style scoped>
.stat-card {
  background: var(--cd-surface);
  border: 1px solid var(--cd-border);
  border-radius: var(--cd-radius-lg);
  padding: 1.25rem 1.5rem;
  display: flex; align-items: center; gap: 1rem;
  transition: border-color 0.2s;
}
.stat-card:hover { border-color: rgba(255,255,255,0.14); }
.stat-card__icon {
  width: 44px; height: 44px;
  border-radius: var(--cd-radius-sm);
  display: grid; place-items: center;
  font-size: 1.2rem; flex-shrink: 0;
}
.stat-card__body { display: flex; flex-direction: column; }
.stat-card__value { font-size: 1.75rem; font-weight: 700; line-height: 1; letter-spacing: -0.03em; }
.stat-card__label { font-size: 0.78rem; color: var(--cd-text-muted); margin-top: 0.2rem; font-weight: 500; }
</style>
