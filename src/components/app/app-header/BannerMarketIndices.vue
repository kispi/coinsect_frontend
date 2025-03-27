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
    </AdaptiveLayout>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  setup() {
    const { helpers, store } = useGlobalHooks()

    const interv = ref(null)

    const indices = computed(() => {
      const o = store.getters.indices
      if (!o) return

      const usdKrw = store.getters.usdKrw

      return [{
        key: 'USD/KRW',
        link: 'https://www.tradingview.com/chart/tKmOIPae/?symbol=USDKRW',
        value: usdKrw.toLocaleString(undefined, { maximumFractionDigits: 1 }),
      }, {
        key: 'BTC_DOMINANCE',
        link: 'https://www.tradingview.com/chart/tKmOIPae/?symbol=CRYPTOCAP%3ABTC.D',
        value: `${o.btcDominance}%`,
      }, {
        key: 'TOTAL_MARKET_CAP',
        link: 'https://www.tradingview.com/chart/tKmOIPae/?symbol=CRYPTOCAP%3ATOTAL',
        value: helpers.number.pretty.cap({ cap: o.totalMarketCap, baseCurrency: 'usd' }),
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
  gap: 16px;

  .adaptive-layout {
    white-space: nowrap;
    font-size: 12px;

    .key {
      color: var(--text-base);
      flex: 0 0 auto;
    }

    .value {
      color: var(--text-stress);
      font-weight: 500;
      flex: 0 0 auto;
    }
  }

  @media (max-width: 479px) {
    .adaptive-layout {
      font-size: 10px;
    }
  }
}
</style>
