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
        :class="index.changes > 0 ? 'c-price-up' : 'c-price-down'"
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

      const usdKrw = store.getters.usdKrw

      return [{
        key: 'USD/KRW',
        value: usdKrw.toLocaleString(undefined, { maximumFractionDigits: 1 }),
        changes: Math.round(o.signedChangeRate * 10000) / 100,
      }, {
        key: 'BTC_DOMINANCE',
        value: `${o.btcDominance}%`,
        changes: o.btcDominance24hChangePercent,
      }, {
        key: 'TOTAL_MARKET_CAP',
        value: plugins.$helpers.number.pretty.cap({ cap: o.totalMarketCap, baseCurrency: 'usd' }),
        changes: o.totalMarketCap24hChangePercent,
      }, {
        key: 'VOL_24',
        value: plugins.$helpers.number.pretty.cap({ cap: o.totalVolume, baseCurrency: 'usd' }),
        changes: o.totalVolume24hChangePercent,
      }]
    })

    const loadIndices = () => {
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