<template>
  <div class="banner-market-indices">
    <AdaptiveLayout
      :key="index.key"
      v-for="index in indices"
      :gap="$store.getters.isMobile ? 0 : 8">
      <div class="key" v-html="$translate(index.key)"/>
      <div class="value" v-html="index.value"/>
      <div
        class="changes"
        :class="index.changes > 0 ? 'c-success' : 'c-danger'"
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

      return [{
        key: 'USD/KRW',
        value: plugins.$helpers.template.prettyPrice({ price: usdKrw }),
        changes: Math.round(o.upbitForex.signedChangeRate * 10000) / 100,
      }, {
        key: 'BTC_DOMINANCE',
        value: `${o.coincodex.btc_dominance}%`,
        changes: o.coincodex.btc_dominance_24h_change_percent,
      }, {
        key: 'TOTAL_MARKET_CAP',
        value: loc === 'en' ?
          `${Math.round(o.coincodex.total_market_cap / Math.pow(10, 12) * 10000) / 10000}T` :
          plugins.$helpers.template.koreanizedNumber({
            number: o.coincodex.total_market_cap * usdKrw,
            useBigPicture: true,
          }),
        changes: o.coincodex.total_market_cap_24h_change_percent,
      }, {
        key: 'VOL_24',
        value: loc === 'en' ?
          `${Math.round(o.coincodex.total_volume / Math.pow(10, 12) * 10000) / 10000}T` :
          plugins.$helpers.template.koreanizedNumber({
            number: o.coincodex.total_volume * usdKrw,
            useBigPicture: true,
          }),
        changes: o.coincodex.total_volume_24h_change_percent,
      }]
    })

    onMounted(() => {
      store.dispatch('loadIndices')
    })

    return {
      indices,
    }
  },
}
</script>

<style lang="scss">
.banner-market-indices {
  transition: all 0.2s ease;
  display: flex;

  .adaptive-layout {
    align-items: center;
    font-size: 12px;

    &:not(:last-child) {
      margin-right: 16px;
    }

    .key {
      white-space: nowrap;
      color: var(--color-key);
      flex: 0 0 auto;
    }

    .value {
      color: var(--color-value);
      font-weight: 500;
      flex: 0 0 auto;
    }

    .changes {
      font-weight: 300;
    }
  }
}
</style>