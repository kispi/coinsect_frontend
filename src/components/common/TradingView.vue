<template>
  <div class="trading-view">
    <div class="trading-view-container">
      <div id="tradingview_6f69e"/>
    </div>
  </div>
</template>

<script>
import helpers from '@/helpers'
import { onMounted, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  props: {
    symbol: String,
  },
  setup(props) {
    const store = useStore()

    const init = async () => {
      await helpers.dom.loadScript({ url: 'https://s3.tradingview.com/tv.js' })
      new TradingView.widget({
        autosize: true,
        symbol: props.symbol || 'BINANCE:BTCUSDT',
        interval: 15,
        timezone: 'Asia/Seoul',
        theme: store.getters.settings.theme,
        locale: store.getters.translation.locale,
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: 'tradingview_6f69e',
      })
    }

    watch([
      () => store.getters.settings.theme,
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
  margin-bottom: 8px;
  resize: vertical;
  overflow: auto;

  .trading-view-container {
    height: 100%;
    padding-bottom: 16px;

    > div {
      height: 100%;
    }
  }
}
</style>