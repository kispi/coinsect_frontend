<template>
  <div
    v-if="$store.getters.indices"
    class="banner-market-indices">
    <AdaptiveLayout
      :key="index.key"
      v-for="index in indices"
      :gap="$store.getters.isMobile ? 0 : 8">
      <div class="key" v-html="$translate(index.key)"/>
      <div class="value" v-html="index.value"/>
      <div
        class="changes"
        :class="index.changes > 0 ? 'c-price-up-upbit' : 'c-price-down-upbit'"
        v-html="`${index.changes > 0 ? '+' : ''}${index.changes}%`"
      />
    </AdaptiveLayout>
  </div>
</template>

<script>
import { computed, getCurrentInstance, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const indices = computed(() => {
      const o = store.getters.indices
      if (!o) return

      const loc = store.getters.translation.locale
      const usdKrw = store.getters.usdKrw
      const numUnits = store.getters.windowInnerWidth >= 992 ? 2 : 1

      return [{
        key: 'USD/KRW',
        value: usdKrw.toLocaleString(undefined, { maximumFractionDigits: 1 }),
        changes: Math.round(o.upbitForex.signedChangeRate * 10000) / 100,
      }, {
        key: 'BTC_DOMINANCE',
        value: `${o.coincodex.btc_dominance}%`,
        changes: o.coincodex.btc_dominance_24h_change_percent,
      }, {
        key: 'TOTAL_MARKET_CAP',
        value: plugins.$helpers.number.pretty.cap({ cap: o.coincodex.total_market_cap, baseCurrency: 'usd' }),
        changes: o.coincodex.total_market_cap_24h_change_percent,
      }, {
        key: 'VOL_24',
        value: plugins.$helpers.number.pretty.cap({ cap: o.coincodex.total_volume, baseCurrency: 'usd' }),
        changes: o.coincodex.total_volume_24h_change_percent,
      }]
    })

    const loadIndices = () => {
      store.dispatch('loadIndices')
      setTimeout(loadIndices, 60 * 1000)
    }

    onMounted(loadIndices)

    return {
      indices,
    }
  },
}
</script>

<style lang="scss">
.banner-market-indices {
  display: flex;

  .adaptive-layout {
    white-space: nowrap;
    align-items: center;
    font-size: 12px;

    &:not(:last-child) {
      margin-right: 16px;
    }

    .key {
      color: var(--text-base);
      flex: 0 0 auto;
    }

    .value {
      color: var(--text-stress);
      font-weight: 500;
      flex: 0 0 auto;
    }

    .changes {
      font-weight: 300;
    }
  }
}
</style>