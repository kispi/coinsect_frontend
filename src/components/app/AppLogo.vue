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
  text-shadow: 1px 1px 1px var(--brand-primary-bg);
}
</style>