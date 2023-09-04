<template>
  <div class="trading-view">
    <div class="trading-view-container">
      <div :id="`tradingview_upbit_${symbol}`"/>
    </div>
  </div>
</template>

<script>
import useGlobalHooks from '@/hooks/global-hooks'
import { onMounted, onUnmounted, watch, ref } from 'vue'

export default {
  props: {
    symbol: {
      type: String,
      required: true,
    },
    interval: {
      required: true,
      default: 15,
    },
  },
  setup(props) {
    const { store } = useGlobalHooks()

    const timeout = ref(null)

    const init = () => {
      if (typeof TradingView === 'undefined') return

      new TradingView.widget({
        autosize: true,
        symbol: props.symbol,
        interval: (props.interval || 15).toString(),
        timezone: 'Asia/Seoul',
        theme: store.getters.settings.theme,
        locale: store.getters.settings.locale,
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        allow_symbol_change: true,
        hide_side_toolbar: !store.getters.settings.chartTool,
        container_id: `tradingview_upbit_${props.symbol}`,
      })
    }

    watch([
      () => store.getters.settings.theme,
      () => store.getters.settings.locale,
      () => store.getters.settings.chartTool,
      () => props.symbol,
      () => props.interval,
    ],
      () => setTimeout(init),
    )

    onMounted(() => {
      timeout.value = setTimeout(init, 500)
    })

    onUnmounted(() => {
      clearTimeout(timeout.value)
    })
  },
}
</script>

<style lang="scss" scoped>
.trading-view {
  --min-height: 280px;
  height: var(--min-height);
  min-height: var(--min-height);
  resize: vertical;
  overflow: hidden;

  .trading-view-container {
    height: 100%;

    > div {
      height: 100%;
    }
  }
}
</style>