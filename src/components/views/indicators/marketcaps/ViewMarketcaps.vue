<template>
  <div class="view-marketcaps">
    <PoweredBy :by="'coinmarketcap'"/>
    <MarketcapsCoinmarketcap class="m-t-24"/>
  </div>
</template>

<script>
import MarketcapsCoinmarketcap from './MarketcapsCoinmarketcap'

export default {
  components: { MarketcapsCoinmarketcap },
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