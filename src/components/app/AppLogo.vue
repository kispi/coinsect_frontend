<template>
  <RouterLink
    :to="'/'"
    class="app-logo"
    @click="$store.commit('setShowNavigation', false)">
    coinsect
  </RouterLink>
</template>

<style lang="scss" scoped>
.app-logo {
  color: var(--text-stress);
  font-size: 24px;
  font-family: 'Ubuntu', sans-serif;
  font-style: italic;
}
</style>