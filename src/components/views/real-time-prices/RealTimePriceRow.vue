<template>
  <tr
    @click="setDocumentTitleTicker"
    class="real-time-price-row">
    <td class="ticker-symbol">
      <div class="flex-row items-center">
        <img :src="`https://static.upbit.com/logos/${ticker.$$symbol}.png`" class="flex-wrap m-r-4">
        <div
          v-html="ticker.$$name[$store.getters.translation.locale]"
          class="name lines-1"
          :class="ticker.$$symbol === $store.getters.settings.documentTitleTicker ? 'c-brand-primary' : 'c-text-stress'"
        />
      </div>
      <div class="functions">
        <i
          @click="toggleFavorite"
          class="fa-star c-bitcoin o-0"
          :class="$store.getters.settings.favorites[ticker.$$symbol] ? 'fa' : 'fal'"
        />
        <div v-html="ticker.$$symbol" class="symbol"/>
        <i class="fal fa-book-open o-0"/>
      </div>
    </td>
    <td>
      <div
        class="ticker-current-price-base f-700"
        :class="priceColor(ticker.$$changeRate1D)"
        v-html="$helpers.number.pretty.price({ price: ticker.$$tradePriceBase, baseCurrency: 'krw' })"
      />
      <div
        :class="ticker.$$tradePriceTarget ? '' : 'o-0'"
        class="ticker-current-price-target"
        v-html="$helpers.number.pretty.price({ price: ticker.$$tradePriceTarget, baseCurrency: 'krw' })" 
      />
    </td>
    <td class="ticker-premium">
      <div :class="ticker.$$premiumRate ? '' : 'o-0'">
        <div
          :class="priceColor(ticker.$$premiumRate)"
          v-html="`${autoFrac(ticker.$$premiumRate)}%`"
        />
        <div
          v-html="$helpers.number.pretty.price({ price: ticker.$$premiumPrice, baseCurrency: 'krw' })"
        />
      </div>
    </td>
    <td class="ticker-changes-24h" :class="priceColor(ticker.$$changeRate1D)">
      <div v-html="`${autoFrac(ticker.$$changeRate1D)}%`"/>
      <div v-html="$helpers.number.pretty.price({ price: ticker.$$changePrice24H, baseCurrency: 'krw' })"/>
    </td>
    <td v-if="!$store.getters.isMobile" class="ticker-changes-52w-high">
      <div
        :class="priceColor(ticker.$$changeRate52WH)"
        v-html="`${autoFrac(ticker.$$changeRate52WH)}%`"
      />
      <div v-html="$helpers.number.pretty.price({ price: ticker.$$highest52WeekPrice, baseCurrency: 'krw' })"/>
    </td>
    <td v-if="!$store.getters.isMobile" class="ticker-changes-52w-high">
      <div
        :class="priceColor(ticker.$$changeRate52WL)"
        v-html="`${autoFrac(ticker.$$changeRate52WL, 2)}%`"
      />
      <div v-html="$helpers.number.pretty.price({ price: ticker.$$lowest52WeekPrice, baseCurrency: 'krw' })"/>
    </td>
    <td class="ticker-vol-24h">
      <div v-html="$helpers.number.pretty.cap({ cap: ticker.$$vol24HBase, baseCurrency: 'krw', numKorUnits: (ticker.$$vol24HBase >= Math.pow(10, 8) && !$store.getters.isMobile) ? 2 : 1 })"/>
      <div v-html="$helpers.number.pretty.cap({ cap: ticker.$$vol24HTarget, baseCurrency: 'usd', numKorUnits: (ticker.$$vol24HTarget >= Math.pow(10, 8) && !$store.getters.isMobile) ? 2 : 1 })"/>
    </td>
  </tr>
</template>

<script>
import { getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import useUpbit from '@/hooks/websockets/upbit'

export default {
  props: ['ticker'],
  setup(props) {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const { setDocumentTitle } = useUpbit()

    const autoFrac = (price, numFrac) => (price || 0).toLocaleString(undefined, {
      maximumFractionDigits: numFrac || (Math.abs(price) >= 100 ? 0 : 2),
      minimumFractionDigits: numFrac || (Math.abs(price) >= 100 ? 0 : 2),
    })

    const priceColor = rate => {
      if (rate > 0) return 'c-price-up-upbit'
      if (rate === 0) return 'c-price-same-upbit'
      if (rate < 0) return 'c-price-down-upbit'
    }

    const toggleFavorite = () => {
      const favorites = store.getters.settings.favorites
      if (favorites[props.ticker.$$symbol]) delete favorites[props.ticker.$$symbol]
      else favorites[props.ticker.$$symbol] = true
      store.commit('setSettings', { favorites })
    }

    const setDocumentTitleTicker = () => {
      const settings = store.getters.settings
      settings.documentTitleTicker = props.ticker.$$symbol
      store.commit('setSettings', settings)
      setDocumentTitle(props.ticker)
      settings.documentTitleTicker = props.ticker.$$symbol
      plugins.$toast.success(plugins.$translate('TOAST_REAL_TIME_TICKER_SELECTED').replace(/%s/, props.ticker.$$symbol))
    }

    return {
      autoFrac,
      priceColor,
      setDocumentTitleTicker,
      toggleFavorite,
    }
  },
}
</script>

<style lang="scss" scoped>
.real-time-price-row {
  cursor: pointer;

  .ticker-symbol {
    img {
      width: 16px;
    }

    .functions {
      display: flex;
      align-items: center;
      margin-top: 4px;

      .symbol {
        font-weight: 300;
        margin: 0 8px 0 4px;
      }
    }

    .name {
      font-weight: 500;

      @media (max-width: 767px) {
        max-width: 80px;
      }

      @media (max-width: 479px) {
        max-width: 48px;
      }
    }
  }

  &:hover {
    background: var(--brand-primary-hover-bg);
  }
}
</style>