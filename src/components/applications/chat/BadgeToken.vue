<template>
  <div
    v-if="token"
    class="badge-token">
    {{ (token || '').substring(0, 3).toUpperCase() }}
  </div>
</template>

<script setup>
defineProps({
  token: {
    type: String,
    default: '',
  },
})
</script>

<style lang="scss" scoped>
.badge-token {
  border: 1px solid rgba(255, 255, 255, 0.25);
  padding: 0 4px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 300;
  background: var(--background-light);
  white-space: nowrap;
}
</style>