<template>
  <div class="trading-view">
    <div class="trading-view-container">
      <div :id="`tradingview_upbit_${symbol}`"/>
    </div>
  </div>
</template>

<script>
import { onMounted, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  props: {
    symbol: String,
  },
  setup(props) {
    const store = useStore()

    const init = () => {
      if (typeof TradingView === 'undefined') return

      new TradingView.widget({
        autosize: true,
        symbol: props.symbol || store.getters.settings.tradingviewSymbol,
        interval: 15,
        timezone: 'Asia/Seoul',
        theme: store.getters.settings.theme,
        locale: store.getters.translation.locale,
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: `tradingview_upbit_${props.symbol}`,
      })
    }

    watch([
      () => store.getters.settings.theme,
      () => store.getters.settings.tradingviewSymbol,
      () => store.getters.translation.locale,
      () => props,
    ], init)

    onMounted(init)
  }
}
</script>

<style lang="scss" scoped>
.trading-view {
  height: 320px;
  resize: vertical;
  overflow: auto;

  .trading-view-container {
    height: 100%;

    > div {
      height: 100%;
    }
  }
}
</style>