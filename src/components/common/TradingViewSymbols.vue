<template>
  <div
    class="trading-view-symbols"
    :gap="8">
    <AppDropdown
      :dropdownItems="tradingviewSymbols"
      @select-dropdown-item="o => onChange(o, 'symbol')"
    />
    <AppDropdown
      class="timeframe"
      :dropdownItems="defaultTimeframes"
      @select-dropdown-item="o => onChange(o, 'interval')"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

const props = defineProps({
  chartIndex: {
    type: Number,
    required: true,
  },
})

const { store } = useGlobalHooks()

const chart = computed(() => store.getters.charts[props.chartIndex])

const onChange = (o, key) => {
  chart.value[key] = o.key
  store.commit('setCharts', store.getters.charts)
}

const tradingviewSymbols = ref([{
  name: 'BTCUSDT',
  key: 'BTCUSDT',
  img: require('@/assets/images/binance.svg'),
}, {
  name: 'USDX',
  key: 'USDX',
  img: 'https://s3-symbol-logo.tradingview.com/indices/u-s-dollar-index--600.png',
}, {
  name: 'NASDAQ',
  key: 'NSXUSD',
  img: 'https://s3-symbol-logo.tradingview.com/indices/nasdaq-100.svg',
}, {
  name: 'S&P 500',
  key: 'SPXUSD',
  img: 'https://s3-symbol-logo.tradingview.com/indices/s-and-p-500.svg',
}, {
  name: 'GOLD',
  key: 'GOLD',
  img: 'https://s3-symbol-logo.tradingview.com/metal/gold.svg',
}, {
  name: 'SILVER',
  key: 'SILVER',
  img: 'https://s3-symbol-logo.tradingview.com/metal/silver.svg',
}, {
  name: 'BTC_DOMINANCE',
  key: 'BTC.D',
  img: 'https://static.upbit.com/logos/BTC.png',
}, {
  name: 'ETH_DOMINANCE',
  key: 'ETH.D',
  img: 'https://static.upbit.com/logos/ETH.png',
}, {
  name: 'BITCOIN_LONGS',
  key: 'BTCUSDLONGS',
  img: 'https://static.upbit.com/logos/BTC.png',
}, {
  name: 'BITCOIN_SHORTS',
  key: 'BTCUSDSHORTS',
  img: 'https://static.upbit.com/logos/BTC.png',
}].map(o => ({
  ...o,
  $$selected: o.key === chart.value.symbol,
})))

const defaultTimeframes = ref([{
  name: '1분',
  key: 1,
}, {
  name: '3분',
  key: 3,
}, {
  name: '5분',
  key: 5,
}, {
  name: '15분',
  key: 15,
}, {
  name: '1시간',
  key: 60,
}, {
  name: '4시간',
  key: 240,
}, {
  name: '1일',
  key: 'D',
}, {
  name: '1주',
  key: 'W',
}].map(o => ({
  ...o,
  $$selected: o.key === chart.value.interval,
})))
</script>

<style lang="scss">
.trading-view-symbols {
  display: flex;
  align-items: center;

  .app-dropdown {
    font-size: 12px;

    .clickable-area {
      padding: 4px 0;
    }
  }

  .timeframe {
    width: 80px;
    margin-left: 8px;

    .wrapper-dropdown-overlay {
      .list-container {
        width: 80px;
      }
    }
  }
}
</style>