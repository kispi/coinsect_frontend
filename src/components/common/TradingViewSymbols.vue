<template>
  <div class="trading-view-symbols">
    <AppDropdown
      :dropdownItems="tradingviewSymbols"
      @select-dropdown-item="o => {
        $store.commit('setSettings', { tradingviewSymbol: o.key })
      }"
    />
    <AppDropdown
      class="timeframe"
      :dropdownItems="defaultTimeframes"
      :align="'right'"
      @select-dropdown-item="o => {
        $store.commit('setSettings', { tradingviewTimeframe: o.key })
      }"
    />
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()

    const tradingviewSymbols = ref([{
      name: 'BTCUSD_BINANCE',
      key: 'BINANCE:BTCUSD',
    }, {
      name: 'BTCUSD_BYBIT',
      key: 'BYBIT:BTCUSD',
    }, {
      name: 'BTCUSD_BITSTAMP',
      key: 'BITSTAMP:BTCUSD',
    }, {
      name: 'NASDAQ',
      key: 'FOREXCOM:NSXUSD',
    }, {
      name: 'S&P 500',
      key: 'FOREXCOM:SPXUSD',
    }, {
      name: 'GOLD',
      key: 'GOLD',
    }, {
      name: 'SILVER',
      key: 'SILVER',
    }, {
      name: 'BTC_DOMINANCE',
      key: 'CRYPTOCAP:BTC.D',
    }, {
      name: 'KIMCHI_PREMIUM',
      key: 'UPBIT:BTCKRW/(BINANCE:BTCUSDT*FX_IDC:USDKRW) * 100',
    }, {
      name: 'BITCOIN_LONGS',
      key: 'BITFINEX:BTCUSDLONGS',
    }, {
      name: 'BITCOIN_SHORTS',
      key: 'BITFINEX:BTCUSDSHORTS',
    }].map(o => ({
      ...o,
      $$selected: o.key === store.getters.settings.tradingviewSymbol,
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
      key: 60 * 24,
    }, {
      name: '1주',
      key: 60 * 24 * 7,
    }].map(o => ({
      ...o,
      $$selected: o.key === store.getters.settings.tradingviewTimeframe,
    })))

    return {
      defaultTimeframes,
      tradingviewSymbols,
    }
  },
}
</script>

<style lang="scss">
.trading-view-symbols {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .timeframe {
    width: 80px;

    .wrapper-dropdown-overlay {
      .list-container {
        width: 80px;
      }
    }
  }
}
</style>