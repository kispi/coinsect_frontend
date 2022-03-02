<template>
  <RouterLink
    :to="'/'"
    class="app-logo">
    coinsect.io
  </RouterLink>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.app-logo {
  color: var(--brand-primary);
  font-size: 24px;
  font-weight: 700;
}

#app.dark {
  .app-logo {
    text-shadow: 0 0 4px rgba(255, 255, 255, 0.25), 0 0 8px rgba(68, 149, 255, 0.4);
  }
}
</style>