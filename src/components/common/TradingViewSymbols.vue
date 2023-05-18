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

<script>
import { computed, ref } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  props: {
    chartIndex: Number,
  },
  setup(props) {
    const { store } = useGlobalHooks()

    const chart = computed(() => store.getters.charts[props.chartIndex])

    const onChange = (o, key) => {
      chart.value[key] = o.key
      store.commit('setCharts', store.getters.charts)
    }

    const tradingviewSymbols = ref([{
      name: 'BTCUSDT_BINANCE',
      key: 'BINANCE:BTCUSDT',
      img: require('@/assets/images/binance.svg'),
    }, {
      name: 'BTCUSDT_BYBIT',
      key: 'BYBIT:BTCUSDT',
      img: require('@/assets/images/bybit.svg'),
    }, {
      name: 'BTCUSD_BITSTAMP',
      key: 'BITSTAMP:BTCUSD',
      img: require('@/assets/images/bitstamp.svg'),
    }, {
      name: 'USDX',
      key: 'USDX',
      img: 'https://s3-symbol-logo.tradingview.com/indices/u-s-dollar-index--600.png',
    }, {
      name: 'NASDAQ',
      key: 'FOREXCOM:NSXUSD',
      img: 'https://s3-symbol-logo.tradingview.com/indices/nasdaq-100.svg',
    }, {
      name: 'S&P 500',
      key: 'FOREXCOM:SPXUSD',
      img: 'https://s3-symbol-logo.tradingview.com/indices/s-and-p-500.svg'
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
      key: 'CRYPTOCAP:BTC.D',
      img: 'https://static.upbit.com/logos/BTC.png',
    }, {
      name: 'ETH_DOMINANCE',
      key: 'CRYPTOCAP:ETH.D',
      img: 'https://static.upbit.com/logos/ETH.png',
    }, {
      name: 'KIMCHI_PREMIUM',
      key: 'UPBIT:BTCKRW/(BINANCE:BTCUSDT*FX_IDC:USDKRW) * 100',
      img: 'https://static.upbit.com/logos/BTC.png',
    }, {
      name: 'BITCOIN_LONGS',
      key: 'BITFINEX:BTCUSDLONGS',
      img: 'https://static.upbit.com/logos/BTC.png',
    }, {
      name: 'BITCOIN_SHORTS',
      key: 'BITFINEX:BTCUSDSHORTS',
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

    return {
      chart,
      defaultTimeframes,
      tradingviewSymbols,
      onChange,
    }
  },
}
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