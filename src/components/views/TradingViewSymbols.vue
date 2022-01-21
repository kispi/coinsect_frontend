<template>
  <AppDropdown
    class="trading-view-symbols"
    :dropdownItems="tradingviewSymbols"
    @select-dropdown-item="o => {
      $store.commit('setSettings', { tradingviewSymbol: o.key })
    }"
  />
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()

    const tradingviewSymbols = ref([{
      name: 'BTCUSD_BITSTAMP',
      key: 'BITSTAMP:BTCUSD',
    }, {
      name: 'BTCUSD_BINANCE',
      key: 'BINANCE:BTCUSD',
    }, {
      name: 'BTCUSD_BYBIT',
      key: 'BYBIT:BTCUSD',
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

    return {
      tradingviewSymbols,
    }
  },
}
</script>