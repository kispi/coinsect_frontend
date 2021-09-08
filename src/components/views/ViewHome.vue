<template>
  <div class="view-home view-layout-default">
    <TradingView v-if="$store.getters.settings.tradingview === 'show'"/>
    <RealTimePrices/>
  </div>
</template>

<script>
import RealTimePrices from './real-time-prices/RealTimePrices'

export default {
  components: {
    RealTimePrices,
  },
}
</script>