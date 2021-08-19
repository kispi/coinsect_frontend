<template>
  <div class="view-home">
    <!-- <TradingView v-if="$store.getters.settings.tradingview === 'show'"/> -->
    <OrderbookBybit
      @load-orderbook="scrollCenter"
      :market="'BTCUSD'"
    />
    <!-- <RealTimePrices/> -->
  </div>
</template>

<script>
import RealTimePrices from './real-time-prices/RealTimePrices'

export default {
  components: {
    // RealTimePrices,
  },
}
</script>

<style lang="scss" scoped>
.view-home {
  max-width: 992px;
  margin: auto;
  padding: var(--app-default-page-padding);
}
</style>