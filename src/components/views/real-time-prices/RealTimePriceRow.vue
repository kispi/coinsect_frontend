<template>
  <tr
    @click="$emit('click-ticker', ticker)"
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
      <div v-html="ticker.$$symbol" class="symbol f-300"/>
    </td>
    <td>
      <div
        class="ticker-current-price-base f-700"
        :class="priceColor(ticker.$$changeRate1D)"
        v-html="autoFrac(ticker.$$tradePriceBase)"
      />
      <div
        class="ticker-current-price-target"
        v-html="autoFrac(ticker.$$tradePriceTarget)"
      />
    </td>
    <td class="ticker-premium">
      <div :class="ticker.$$premiumRate ? '' : 'o-0'">
        <div
          :class="priceColor(ticker.$$premiumRate)"
          v-html="`${$helpers.template.prettyPrice({ price: ticker.$$premiumRate, numFrac: 2 })}%`"
        />
        <div
          v-html="autoFrac(ticker.$$premiumPrice)"
        />
      </div>
    </td>
    <td class="ticker-changes-24h" :class="priceColor(ticker.$$changeRate1D)">
      <div v-html="`${$helpers.template.prettyPrice({ price: ticker.$$changeRate1D, numFrac: 2 })}%`"/>
      <div v-html="autoFrac(ticker.$$changePrice24H)"/>
    </td>
    <td v-if="!$store.getters.isMobile" class="ticker-changes-52w-high">
      <div
        :class="priceColor(ticker.$$changeRate52WH)"
        v-html="`${$helpers.template.prettyPrice({ price: ticker.$$changeRate52WH, numFrac: 2 })}%`"
      />
      <div v-html="autoFrac(ticker.$$highest52WeekPrice)"/>
    </td>
    <td v-if="!$store.getters.isMobile" class="ticker-changes-52w-high">
      <div
        :class="priceColor(ticker.$$changeRate52WL)"
        v-html="`${$helpers.template.prettyPrice({ price: ticker.$$changeRate52WL, numFrac: 2 })}%`"
      />
      <div v-html="autoFrac(ticker.$$lowest52WeekPrice)"/>
    </td>
    <td class="ticker-vol-24h">
      <div v-html="$helpers.template.koreanizedNumber({ number: ticker.$$vol24H, numUnits: 1 })"/>
    </td>
  </tr>
</template>

<script>
import helpers from '@/helpers'

export default {
  props: ['ticker'],
  setup() {
    const autoFrac = price => helpers.template.prettyPrice({ price, numFrac: Math.abs(price) >= 100 ? 0 : 2 })

    const priceColor = rate => {
      if (rate > 0) return 'c-price-up-upbit'
      if (rate === 0) return 'c-price-same-upbit'
      if (rate < 0) return 'c-price-down-upbit'
    }

    return {
      autoFrac,
      priceColor,
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

    .symbol {
      margin-top: 4px;
      margin-left: 20px;
      font-weight: 500;
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