<template>
  <div class="real-time-price-card f-mono">
    <div class="symbol-name">
      <AppImg :src="$store.getters.symbols[ticker.$$symbol].thumb" class="flex-wrap m-r-8" :alt="ticker.$$symbol"/>
      {{ $store.getters.symbols[ticker.$$symbol][$store.getters.settings.locale] }}
    </div>
    <div class="symbol-price">
      <div class="attr">
        <div
          class="price"
          :class="{
            'c-price-up-bybit': ticker.$$tickDirection === 'up',
            'c-price-down-bybit': ticker.$$tickDirection === 'down',
          }">
          <i
            class="far"
            :class="{
              'fa-arrow-up': ticker.$$tickDirection === 'up',
              'fa-arrow-down': ticker.$$tickDirection === 'down'
            }"
          />
          $ {{ ticker.$$tradePriceTarget ? $helpers.number.pretty.price({ price: mustUSD(ticker.$$tradePriceTarget), baseCurrency: 'krw' }) : '-' }}</div>
      </div>
      <div class="attr" :class="upOrDown(ticker.$$changeRate1D)">
        <div class="key">{{ $translate('CHANGE_RATE_1D') }}</div>
        <div class="value">{{ ticker.$$changeRate1D > 0 ? `+${ticker.$$changeRate1D}` : ticker.$$changeRate1D }}%</div>
      </div>
      <div class="attr" :class="upOrDown(ticker.$$premiumRate)">
        <div class="key">{{ $translate('PREMIUM') }}</div>
        <div class="value">{{ ticker.$$premiumRate > 0 ? `+${ticker.$$premiumRate}` : ticker.$$premiumRate }}%</div>
      </div>
    </div>
  </div>
</template>

<script>
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  props: {
    ticker: Object,
  },
  setup() {
    const { store } = useGlobalHooks()

    const upOrDown = value => {
      if (value > 0) return 'up'
      if (value < 0) return 'down'
      return ''
    }

    const mustUSD = price => {
      if (store.getters.settings.currency === 'usd') return price

      return price / store.getters.usdKrw
    }

    return {
      upOrDown,
      mustUSD,
    }
  },
}
</script>

<style lang="scss" scoped>
.real-time-price-card {
  background: var(--background-light);
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .symbol-name {
    display: flex;
    align-items: center;

    .app-img {
      width: 24px;
      height: 24px;
    }
  }

  .price {
    margin: 8px auto;
    display: table;
    font-weight: 700;
    width: 120px;
    text-align: center;

    i {
      margin-right: 8px;
    }
  }

  .attr {
    display: flex;
    text-align: center;

    .key {
      width: 64px;
      text-align: right;
    }

    .value {
      margin-left: 8px;
      font-weight: 700;
    }

    &.up {
      .value {
        color: var(--price-up-bybit);
      }
    }

    &.down {
      .value {
        color: var(--price-down-bybit);
      }
    }
  }
}
</style>