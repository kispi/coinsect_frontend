<template>
  <span
    v-if="$store.getters.me.token"
    class="badge-token">
    {{ $store.getters.me.token.substring(0, 3).toUpperCase() }}
  </span>
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