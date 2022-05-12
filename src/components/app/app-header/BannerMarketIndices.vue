<template>
  <div
    v-if="$store.getters.indices"
    ref="refBannerMarketIndices"
    class="banner-market-indices">
    <div class="overlay-left"/>
    <div class="overlay-right"/>
    <div
      class="marquee-unit"
      :key="num"
      v-for="num in $helpers.numArray($store.getters.isMobile ? 1 : 2)">
      <AdaptiveLayout
        :key="index.key"
        v-for="index in indices"
        :gap="$store.getters.isMobile ? 0 : 8">
        <div class="key" v-html="$translate(index.key)"/>
        <div class="value f-mono" v-html="index.value"/>
        <div
          class="changes f-mono"
          :class="index.changes > 0 ? 'c-price-up' : 'c-price-down'"
          v-html="`${index.changes > 0 ? '+' : ''}${index.changes}%`"
        />
      </AdaptiveLayout>
    </div>
  </div>
</template>

<script>
import { computed, getCurrentInstance, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const refBannerMarketIndices = ref(null)

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
      store.dispatch('loadIndices').then(checkMarqueeSize)
      setTimeout(loadIndices, 60 * 1000)
    }

    const checkMarqueeSize = () => {
      if (store.getters.isSSR) return

      setTimeout(() => {
        const dom = document.getElementsByClassName('marquee-unit')[0]
        if (dom) refBannerMarketIndices.value.style.setProperty('--marquee-width', `${dom.clientWidth}px`)
      })
    }

    onMounted(loadIndices)

    watch([
      () => store.getters.windowInnerWidth,
      () => store.getters.translation.locale,
    ], checkMarqueeSize)

    return {
      refBannerMarketIndices,
      indices,
    }
  },
}
</script>

<style lang="scss">
.banner-market-indices {
  position: relative;

  .marquee-unit {
    display: flex;
  }

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
      line-height: 16px;
    }

    .value {
      color: var(--text-stress);
      font-weight: 500;
      flex: 0 0 auto;
      line-height: 16px;
    }

    .changes {
      font-weight: 300;
    }
  }

  .overlay-left,
  .overlay-right {
    display: none;
  }

  @media (min-width: 768px) {
    max-width: 480px;
    overflow: hidden;
    display: flex;

    .overlay-left,
    .overlay-right {
      position: absolute;
      width: 40px;
      top: 0;
      bottom: 0;
      display: initial;
      z-index: 1;

      &.overlay-left {
        left: 0;
        background: linear-gradient(to right, var(--background-base), transparent);
      }

      &.overlay-right {
        right: 0;
        background: linear-gradient(to left, var(--background-base), transparent);
      }
    }

    @keyframes marqueeX {
      from {
        transform: translateX(0); // 밴드 1개 길이 + 마진 한 단위
      }

      to {
        transform: translateX(calc(-1 * (var(--marquee-width) + 16px)));
      }
    }

    .marquee-unit {
      animation: marqueeX 16s linear infinite;
      margin-right: 16px;
    }
  }

  @media (min-width: 992px) {
    max-width: 720px;
  }
}
</style>