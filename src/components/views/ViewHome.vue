<template>
  <div class="view-home">
    <template v-if="$store.getters.settings.tradingview.home">
      <TradingViewSymbols/>
      <TradingViewTicker class="m-t-8 m-b-8"/>
      <TradingView :interval="$store.getters.settings.tradingviewTimeframe"/>
    </template>
    <BaseAndTarget class="m-t-8 m-b-8"/>
    <RealTimePrices v-if="prepared && !$store.getters.isSSR"/>
  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import BaseAndTarget from './real-time-prices//BaseAndTarget'
import RealTimePrices from './real-time-prices/RealTimePrices'

export default {
  components: {
    BaseAndTarget,
    RealTimePrices,
  },
  setup() {
    const store = useStore()

    const prepared = ref(null)

    watch([
      () => store.getters.settings.baseExchange,
      () => store.getters.settings.baseExchangeMarket,
    ],
      () => {
        prepared.value = false
        setTimeout(() => prepared.value = true)
      },
    )

    onMounted(() => {
      prepared.value = true
    })

    return {
      prepared,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-home {
  .base-and-target {
    border-bottom: 1px solid var(--border-base);
  }
}
</style>