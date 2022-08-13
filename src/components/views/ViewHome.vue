<template>
  <div class="view-home">
    <template v-if="$store.getters.settings.tradingview.home">
      <div class="row">
        <TradingViewSymbols/>
        <div
          @click="$store.commit('setSettings', {
            tradingviewHomeDoubleChart: !$store.getters.settings.tradingviewHomeDoubleChart,
          })"
          class="toggle-tradingview-double-chart">
          <AppToggler
            :modelValue="$store.getters.settings.tradingviewHomeDoubleChart"
            class="no-touch m-r-8"
          />
          나스닥이랑 같이보기
        </div>
      </div>
      <TradingViewTicker class="m-t-8 m-b-8"/>
      <AdaptiveLayout
        class="trading-view-double" :gap="8">
        <TradingView
          :symbol="$store.getters.settings.tradingviewSymbol"
          :interval="$store.getters.settings.tradingviewTimeframe"
        />
        <TradingView
          v-if="$store.getters.settings.tradingviewHomeDoubleChart"
          :symbol="'FOREXCOM:NSXUSD'"
          :interval="$store.getters.settings.tradingviewTimeframe"
        />
      </AdaptiveLayout>
    </template>
    <div class="row">
      <BaseAndTarget/>
    </div>
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
  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--border-base);
    padding: 8px 0;
  }

  .toggle-tradingview-double-chart {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    color: var(--text-stress);
    cursor: pointer;

    .app-checkbox {
      margin-right: 8px;
    }
  }

  @media (max-width: 479px) {
    .base-and-target {
      width: 100%;
    }
  }
}
</style>