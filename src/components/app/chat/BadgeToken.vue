<template>
  <div
    v-if="token"
    class="badge-token">
    {{ token.substring(0, 3).toUpperCase() }}
  </div>
</template>

<script>
export default {
  props: {
    token: String,
  },
}
</script>

<style lang="scss" scoped>
.badge-token {
  border: 1px solid var(--border-base);
  padding: 0 4px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 300;
}
</style>