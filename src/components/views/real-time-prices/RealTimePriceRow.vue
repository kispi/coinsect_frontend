<template>
  <tr
    @click="setSummaryOnDocumentTitle"
    class="real-time-price-row">
    <td class="ticker-symbol">
      <div class="image-name">
        <AppImg :src="symbol.thumb" class="flex-wrap m-r-8" :alt="ticker.$$symbol"/>
        <div
          class="name lines-1"
          :class="ticker.$$symbol === store.getters.settings.documentTitleTicker ? 'text-underline f-700' : ''">
          {{ symbol[store.getters.settings.locale] || symbol.en }}
        </div>
        <div v-if="ticker.$$caution === 'CAUTION'" class="badge-caution">유</div>
        <div
          :ref="el => w.$$el = el"
          @mouseover="helpers.tooltip.show({
            id: 'tooltipWallet',
            showAbove: w.$$el,
            text: `TOOLTIP_BLOCKED_${w.type}`,
          })"
          @mouseleave="helpers.tooltip.hide('tooltipWallet')"
          class="badge-caution no-wallet"
          :key="w"
          v-for="w in disabledWallets"
          v-html="w.text">
        </div>
        <i @click.stop="openModalTradingView" class="fal fa-chart-line"/>
      </div>
      <div class="functions">
        <i
          @click.stop="toggleFavorite"
          class="fa-star"
          :class="store.getters.settings.favorites[ticker.$$symbol] ? 'fa' : 'fal'"
        />
        <div v-html="ticker.$$symbol" class="symbol"/>
        <!-- 오더북 API가 왠지 안 됨... -->
        <img
          v-if="store.getters.settings.baseExchange === 'upbit'"
          class="exchange-logo"
          @click.stop="openModalOrderbook('upbit', `${store.getters.settings.baseExchangeMarket.toUpperCase()}-${ticker.$$symbol}`)"
          src="@/assets/images/upbit.svg"
          alt="upbit"
        >
        <img
          v-if="bybitMarketSymbol"
          class="exchange-logo bybit"
          @click.stop="openModalOrderbook('bybit', bybitMarketSymbol)"
          src="@/assets/images/bybit.svg"
          alt="bybit"
        >
      </div>
    </td>
    <td>
      <div
        class="ticker-current-price-base"
        :class="[
          helpers.template.priceColor(ticker.$$changeRate1D),
          ticker.$$tradePriceBase ? '' : 'o-0',
          ticker.$$tickDirection,
        ]"
        v-html="helpers.number.pretty.price({ price: ticker.$$tradePriceBase, baseCurrency: store.getters.settings.baseExchangeMarket })"
      />
      <div
        :class="ticker.$$tradePriceTarget ? '' : 'o-0'"
        class="ticker-current-price-target"
        v-html="helpers.number.pretty.price({ price: ticker.$$tradePriceTarget, baseCurrency: store.getters.settings.baseExchangeMarket })" 
      />
    </td>
    <td class="ticker-premium">
      <div
        v-if="typeof ticker.$$premiumRate === 'number'"
        :class="helpers.template.priceColor(ticker.$$premiumRate)"
        v-html="`${autoFrac(ticker.$$premiumRate)}%`"
      />
      <div
        v-if="!isNaN(ticker.$$premiumPrice)"
        v-html="helpers.number.pretty.price({ price: ticker.$$premiumPrice, baseCurrency: store.getters.settings.baseExchangeMarket })"
      />
    </td>
    <td class="ticker-changes-24h" :class="helpers.template.priceColor(ticker.$$changeRate1D)">
      <div v-html="`${autoFrac(ticker.$$changeRate1D)}%`"/>
      <div v-html="helpers.number.pretty.price({ price: ticker.$$changePrice24H, baseCurrency: store.getters.settings.baseExchangeMarket })" :class="isNaN(ticker.$$changePrice24H) ? 'o-0' : ''"/>
    </td>
    <td v-if="!store.getters.isMobile && store.getters.settings.baseExchange === 'upbit'" class="ticker-changes-52w-high">
      <div
        :class="helpers.template.priceColor(ticker.$$changeRate52WH)"
        v-html="`${autoFrac(ticker.$$changeRate52WH)}%`"
      />
      <div v-html="helpers.number.pretty.price({ price: ticker.$$highest52WeekPrice, baseCurrency: store.getters.settings.baseExchangeMarket })" :class="ticker.$$highest52WeekPrice ? '' : 'o-0'"/>
    </td>
    <td v-if="!store.getters.isMobile && store.getters.settings.baseExchange === 'upbit'" class="ticker-changes-52w-high">
      <div
        :class="helpers.template.priceColor(ticker.$$changeRate52WL)"
        v-html="`${autoFrac(ticker.$$changeRate52WL, 2)}%`"
      />
      <div v-html="helpers.number.pretty.price({ price: ticker.$$lowest52WeekPrice, baseCurrency: store.getters.settings.baseExchangeMarket })" :class="ticker.$$lowest52WeekPrice ? '' : 'o-0'"/>
    </td>
    <td class="ticker-vol-24h">
      <div v-html="helpers.number.pretty.cap({ cap: ticker.$$vol24HBase, baseCurrency: store.getters.settings.baseExchangeMarket, numKorUnits: (ticker.$$vol24HBase >= Math.pow(10, 8) && !store.getters.isMobile) ? 2 : 1 })"/>
      <div
        :class="ticker.$$vol24HTarget ? '' : 'o-0'"
        v-html="helpers.number.pretty.cap({ cap: ticker.$$vol24HTarget, baseCurrency: 'usd', numKorUnits: (ticker.$$vol24HTarget >= Math.pow(10, 8) && !store.getters.isMobile) ? 2 : 1 })"
      />
    </td>
  </tr>
</template>

<script setup>
import { computed } from 'vue'
import useWebsocketCommon from '@/hooks/websockets/websocket-common'
import useGlobalHooks from '@/hooks/global-hooks'

const props = defineProps({
  ticker: {
    type: Object,
    required: true,
  },
})

const { helpers, store } = useGlobalHooks()

const symbol = computed(() => store.getters.symbols[props.ticker.$$symbol] || {})

const { setTickerSummaryInTitle } = useWebsocketCommon()

const disabledWallets = computed(() => {
  const status = store.getters.walletStatus[store.getters.settings.baseExchange]?.[props.ticker.$$symbol] || {}
  return [
    { v: status.d, text: '입', type: 'DEPOSIT' },
    { v: status.w, text: '출', type: 'WITHDRAWL' },
  ].filter(w => w.v === false)
})

const bybitMarketSymbol = computed(() => {
  if (!store.getters.markets.bybit) return null
  const supportedMarkets = store.getters.markets.bybit.filter(o => o.endsWith('USDT')).map(market => market.split('USDT')[0])
  const found = supportedMarkets.find(supported => supported === props.ticker.$$symbol)
  return found ? found + 'USDT' : null
})

const openModalTradingView = () => {
  helpers.modal.custom({
    component: 'ModalTradingView',
    options: {
      symbol: `${store.getters.settings.baseExchange}:${props.ticker.$$symbol}${store.getters.settings.baseExchangeMarket}`.toUpperCase(),
      resizable: !store.getters.isMobile,
      noBackdrop: true,
      useMultiOpen: true,
    },
  })
}

const openModalOrderbook = (exchange, market) => {
  helpers.modal.custom({
    component: 'ModalOrderbook',
    options: {
      market,
      exchange: exchange,
      resizable: !store.getters.isMobile,
      noBackdrop: true,
      useMultiOpen: true,
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

const setSummaryOnDocumentTitle = () => {
  store.commit('setSettings', { documentTitleTicker: props.ticker.$$symbol })
  helpers.toast.success(helpers.translate('TOAST_REAL_TIME_TICKER_SELECTED').replace(/%s/, props.ticker.$$symbol))
  setTickerSummaryInTitle(props.ticker)
}
</script>

<style lang="scss" scoped>
.real-time-price-row {
  cursor: pointer;

  .ticker-symbol {
    padding: 8px 4px;

    .fa-star {
      color: var(--bitcoin);
    }

    .image-name {
      display: flex;
      align-items: center;

      img {
        width: 16px;
      }

      i {
        margin-left: 8px;
      }

      .fa-chart-line {
        &:hover {
          font-weight: 700;
        }
      }
    }

    .functions {
      display: flex;
      align-items: center;

      .symbol {
        font-weight: 300;
        margin: 0 8px;
        white-space: nowrap;
      }

      .exchange-logo {
        width: 16px;
        height: 16px;
        border: 1px solid var(--border-base);
        border-radius: 50%;

        &:not(:last-child) {
          margin-right: 8px;
        }

        &.bybit {
          background: var(--gs-14);
        }

        &:hover {
          border: 1px solid var(--border-light);
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

    .badge-caution {
      color: var(--white);
      background: orange;
      font-size: 10px;
      height: 12px;
      margin-left: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      padding: 2px;

      &.no-wallet {
        background: red;
      }
    }
  }

  &:hover {
    background: var(--background-light);
  }

  td {
    > div:not(:last-child) {
      margin-bottom: 4px;
      white-space: nowrap;
    }

    &:not(:first-child) {
      width: 120px; // 큰 화면에서 글리치를 없애기 위함
      font-family: var(--app-font-mono);
    }
  }

  .ticker-current-price-base {
    display: table;
    margin-left: auto;

    &.up {
      animation: price-flashing-up 1s;
    }

    &.down {
      animation: price-flashing-down 1s;
    }
  }

  @media (min-width: 768px) {
    .fa-star,
    .fa-chart-line,
    .exchange-logo {
      &:hover {
        transform: scale(1.2);
      }
    }
  }
}
</style>
