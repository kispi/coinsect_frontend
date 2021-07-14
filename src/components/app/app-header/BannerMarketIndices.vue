<template>
  <div class="banner-market-indices">
    <AdaptiveLayout
      :key="index.key"
      v-for="index in indices"
      :gap="8">
      <div class="key" v-html="$translate(index.key)"/>
      <div class="value" v-html="index.value"/>
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

      return [{
        key: 'USD/KRW',
        value: plugins.$helpers.template.prettyPrice(o.usdKrw),
      }, {
        key: 'BTC_DOMINANCE',
        value: `${o.dominance.btc}%`,
      }, {
        key: 'TOTAL_MARKET_CAP',
        value: plugins.$helpers.template.pricify(o.totalMarketCap, 'usd', true),
      }, {
        key: 'VOL_24',
        value: plugins.$helpers.template.pricify(o.vol24, 'usd', true),
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

    &:not(:last-child) {
      margin-right: 16px;
    }

    .key {
      font-size: 12px;
      color: var(--color-key);
      flex: 0 0 auto;
    }

    .value {
      font-size: 13px;
      color: var(--color-value);
    }
  }
}
</style>