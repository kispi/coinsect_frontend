<template>
  <tr
    @click="setDocumentTitleTicker"
    class="real-time-price-row">
    <td class="ticker-symbol">
      <div class="image-name">
        <AppImg :src="symbol.thumb" class="flex-wrap m-r-8"/>
        <div
          v-html="symbol[$store.getters.translation.locale] || symbol.en"
          class="name lines-1"
          :class="ticker.$$symbol === $store.getters.settings.documentTitleTicker ? 'text-underline f-700' : ''"
        />
        <i @click.stop="tradingView.show = !tradingView.show" class="fa fa-chart-line"/>
      </div>
      <div class="functions">
        <i
          @click.stop="toggleFavorite"
          class="fa-star c-bitcoin"
          :class="$store.getters.settings.favorites[ticker.$$symbol] ? 'fa' : 'fal'"
        />
        <div v-html="ticker.$$symbol" class="symbol"/>
        <img
          v-if="$store.getters.settings.baseExchange === 'upbit'"
          class="exchange-logo"
          @click.stop="openModalOrderbook('upbit', `KRW-${ticker.$$symbol}`)"
          src="@/assets/images/upbit.svg"
          :alt="ticker.$$symbol"
        >
        <img
          v-if="bybitMarket(ticker.$$symbol)"
          class="exchange-logo bybit"
          @click.stop="openModalOrderbook('bybit', bybitMarket(ticker.$$symbol))"
          src="@/assets/images/bybit.svg"
          :alt="ticker.$$symbol"
        >
      </div>
    </td>
    <td>
      <div
        class="ticker-current-price-base"
        :class="[$helpers.template.priceColor(ticker.$$changeRate1D), ticker.$$tradePriceBase ? '' : 'o-0']"
        v-html="$helpers.number.pretty.price({ price: ticker.$$tradePriceBase, baseCurrency: 'krw' })"
      />
      <div
        :class="ticker.$$tradePriceTarget ? '' : 'o-0'"
        class="ticker-current-price-target"
        v-html="$helpers.number.pretty.price({ price: ticker.$$tradePriceTarget, baseCurrency: 'krw' })" 
      />
    </td>
    <td class="ticker-premium">
      <div
        v-if="typeof ticker.$$premiumRate === 'number'"
        :class="$helpers.template.priceColor(ticker.$$premiumRate)"
        v-html="`${autoFrac(ticker.$$premiumRate)}%`"
      />
      <div
        v-if="ticker.$$premiumPrice"
        v-html="$helpers.number.pretty.price({ price: ticker.$$premiumPrice, baseCurrency: 'krw' })"
      />
    </td>
    <td class="ticker-changes-24h" :class="$helpers.template.priceColor(ticker.$$changeRate1D)">
      <div v-html="`${autoFrac(ticker.$$changeRate1D)}%`"/>
      <div v-html="$helpers.number.pretty.price({ price: ticker.$$changePrice24H, baseCurrency: 'krw' })" :class="ticker.$$changePrice24H ? '' : 'o-0'"/>
    </td>
    <td v-if="!$store.getters.isMobile && $store.getters.settings.baseExchange === 'upbit'" class="ticker-changes-52w-high">
      <div
        :class="$helpers.template.priceColor(ticker.$$changeRate52WH)"
        v-html="`${autoFrac(ticker.$$changeRate52WH)}%`"
      />
      <div v-html="$helpers.number.pretty.price({ price: ticker.$$highest52WeekPrice, baseCurrency: 'krw' })" :class="ticker.$$highest52WeekPrice ? '' : 'o-0'"/>
    </td>
    <td v-if="!$store.getters.isMobile && $store.getters.settings.baseExchange === 'upbit'" class="ticker-changes-52w-high">
      <div
        :class="$helpers.template.priceColor(ticker.$$changeRate52WL)"
        v-html="`${autoFrac(ticker.$$changeRate52WL, 2)}%`"
      />
      <div v-html="$helpers.number.pretty.price({ price: ticker.$$lowest52WeekPrice, baseCurrency: 'krw' })" :class="ticker.$$lowest52WeekPrice ? '' : 'o-0'"/>
    </td>
    <td class="ticker-vol-24h">
      <div v-html="$helpers.number.pretty.cap({ cap: ticker.$$vol24HBase, baseCurrency: 'krw', numKorUnits: (ticker.$$vol24HBase >= Math.pow(10, 8) && !$store.getters.isMobile) ? 2 : 1 })"/>
      <div v-html="$helpers.number.pretty.cap({ cap: ticker.$$vol24HTarget, baseCurrency: 'usd', numKorUnits: (ticker.$$vol24HTarget >= Math.pow(10, 8) && !$store.getters.isMobile) ? 2 : 1 })"/>
    </td>
  </tr>
  <tr v-if="tradingView.show">
    <td colspan="100%">
      <TradingView :symbol="tradingView.symbol"/>
    </td>
  </tr>
</template>

<script>
import { getCurrentInstance, computed, ref } from 'vue'
import { useStore } from 'vuex'
import useUpbit from '@/hooks/websockets/upbit'

export default {
  props: ['ticker'],
  setup(props) {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const symbol = computed(() => store.getters.symbols[props.ticker.$$symbol] || {})

    const tradingView = ref({
      show: null,
      symbol: `${store.getters.settings.baseExchange.toUpperCase()}:${props.ticker.$$symbol}KRW`,
    })

    const { setDocumentTitle } = useUpbit()

    const bybitMarket = symbol => {
      const supportedMarkets = store.getters.markets.bybit.filter(o => o.endsWith('USDT'))
      return supportedMarkets.find(supported => supported.startsWith(symbol))
    }

    const openModalOrderbook = (exchange, market) => {
      plugins.$modal.custom({
        component: 'ModalOrderbook',
        options: {
          market,
          exchange: exchange,
          resizable: !store.getters.isMobile,
          noBackdrop: true,
        },
      })
    }

    const autoFrac = (price, numFrac) => (price || 0).toLocaleString(undefined, {
      maximumFractionDigits: numFrac || (Math.abs(price) >= 100 ? 0 : 2),
      minimumFractionDigits: numFrac || (Math.abs(price) >= 100 ? 0 : 2),
    })

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
      tradingView,
      symbol,
      autoFrac,
      openModalOrderbook,
      setDocumentTitleTicker,
      toggleFavorite,
      bybitMarket,
    }
  },
}
</script>

<style lang="scss" scoped>
.real-time-price-row {
  cursor: pointer;

  .ticker-symbol {
    padding: 8px 0;

    .image-name {
      display: flex;
      align-items: center;

      img {
        width: 16px;
      }

      .fa-chart-line {
        margin-left: 8px;
      }
    }

    .functions {
      display: flex;
      align-items: center;

      .symbol {
        font-weight: 300;
        margin: 0 8px;
      }

      .exchange-logo {
        width: 16px;
        height: 16px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 50%;

        &:not(:last-child) {
          margin-right: 8px;
        }

        &.bybit {
          background: var(--gs-14);
        }
      }
    }

    .name {
      color: var(--text-stress);
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

  td {
    > div:not(:last-child) {
      margin-bottom: 4px;
    }

    &:not(:first-child) {
      font-family: Arial, Helvetica, sans-serif;
    }
  }
}
</style>