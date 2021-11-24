<template>
  <div class="view-marketcaps">
    <AppLoading :loading="$store.getters.loading.marketcaps"/>
    <PoweredBy :by="'coingecko'"/>
    <MarketcapsCoingecko class="m-t-24"/>
  </div>
</template>

<script>
import MarketcapsCoingecko from './MarketcapsCoingecko'

export default {
  components: { MarketcapsCoingecko },
}
</script>

<style lang="scss">
.view-marketcaps {
  padding-bottom: 120px;

  .app-dropdown {
    text-transform: uppercase;
    white-space: nowrap;
  }
}
</style>