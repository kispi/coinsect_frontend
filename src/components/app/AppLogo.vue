<template>
  <RouterLink
    :to="'/'"
    class="app-logo"
    @click="store.commit('setShowNavigation', false)">
    coinsect
  </RouterLink>
</template>

<script setup>
import useGlobalHooks from '@/hooks/global-hooks'

const { store } = useGlobalHooks()
</script>

<style lang="scss" scoped>
.app-logo {
  color: var(--text-stress);
  font-size: 24px;
  font-family: 'Ubuntu', sans-serif;
  font-style: italic;
}
</style>