<template>
  <div
    v-if="$store.getters.indices"
    class="banner-market-indices">
    <AdaptiveLayout
      @click="onClickIndex(index)"
      :gap="$store.getters.isMobile ? 0 : 8"
      :class="{
        'items-center': !$store.getters.isMobile,
        'cursor-pointer': index.link,
      }"
      :key="index.key"
      v-for="index in indices"
    >
      <div class="key" v-html="$translate(index.key)"/>
      <div class="value f-mono" v-html="index.value"/>
      <div
        class="changes f-mono"
        :class="index.changes > 0 ? 'c-price-up' : 'c-price-down'"
        v-html="`${index.changes > 0 ? '+' : ''}${index.changes}%`"
      />
    </AdaptiveLayout>
  </div>
</template>

<script>
import { computed, getCurrentInstance, onMounted, onUnmounted, ref } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const interv = ref(null)

    const indices = computed(() => {
      const o = store.getters.indices
      if (!o) return

      const usdKrw = store.getters.usdKrw

      return [{
        key: 'USD/KRW',
        link: 'https://www.tradingview.com/chart/tKmOIPae/?symbol=USDKRW',
        value: usdKrw.toLocaleString(undefined, { maximumFractionDigits: 1 }),
        changes: Math.round(o.signedChangeRate * 10000) / 100,
      }, {
        key: 'BTC_DOMINANCE',
        link: 'https://www.tradingview.com/chart/tKmOIPae/?symbol=CRYPTOCAP%3ABTC.D',
        value: `${o.btcDominance}%`,
        changes: o.btcDominance24hChangePercent,
      }, {
        key: 'TOTAL_MARKET_CAP',
        value: plugins.$helpers.number.pretty.cap({ cap: o.totalMarketCap, baseCurrency: 'usd' }),
        changes: o.totalMarketCap24hChangePercent,
      }]
    })

    const onClickIndex = index => {
      if (!index.link) return

      window.open(index.link, '_blank', 'noreferrer')
    }

    onMounted(() => {
      store.dispatch('loadIndices')

      if (store.getters.isSSR) return

      interv.value = setInterval(() => store.dispatch('loadIndices'), 60 * 1000 * 5)
    })

    onUnmounted(() => {
      if (store.getters.isSSR) return

      clearInterval(interv.value)
    })

    return {
      indices,
      onClickIndex,
    }
  },
}
</script>

<style lang="scss">
.banner-market-indices {
  display: flex;

  .adaptive-layout {
    white-space: nowrap;
    font-size: 12px;

    &:not(:last-child) {
      margin-right: 16px;
    }

    .key {
      color: var(--text-base);
      flex: 0 0 auto;
      line-height: 16px;
    }

    .value {
      color: var(--text-stress);
      font-weight: 500;
      flex: 0 0 auto;
      line-height: 16px;
    }
  }
}
</style>
