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
          :class="ticker.$$symbol === $store.getters.settings.documentTitleTicker ? 'c-brand-primary' : 'c-text-dark'"
        />
      </div>
      <div v-html="ticker.$$symbol" class="symbol f-300"/>
    </td>
    <td class="ticker-current-price f-700" :class="priceColor(ticker.$$changeRate24H)">
      <div>{{ autoFrac(ticker.trade_price) }}</div>
      <!-- <div>COMING SOON</div> -->
    </td>
    <!-- <td class="ticker-kimp"></td> -->
    <td class="ticker-changes-24h" :class="priceColor(ticker.$$changeRate24H)">
      <div v-html="`${$helpers.template.prettyPrice({ price: ticker.$$changeRate24H, numFrac: 2 })}%`"/>
      <div v-html="autoFrac(ticker.signed_change_price)"/>
    </td>
    <td v-if="!$store.getters.isMobile" class="ticker-changes-52w-high">
      <div
        :class="priceColor(ticker.$$changeRate52WH)"
        v-html="`${$helpers.template.prettyPrice({ price: ticker.$$changeRate52WH, numFrac: 2 })}%`"
      />
      <div v-html="autoFrac(ticker.highest_52_week_price)"/>
    </td>
    <td v-if="!$store.getters.isMobile" class="ticker-changes-52w-high">
      <div
        :class="priceColor(ticker.$$changeRate52WL)"
        v-html="`${$helpers.template.prettyPrice({ price: ticker.$$changeRate52WL, numFrac: 2 })}%`"
      />
      <div v-html="autoFrac(ticker.lowest_52_week_price)"/>
    </td>
    <td class="ticker-vol-24h">
      <div v-html="$helpers.template.koreanizedNumber({ number: ticker.acc_trade_price_24h, useBigPicture: true })"/>
    </td>
  </tr>
</template>

<script>
import helpers from '@/helpers'

export default {
  props: ['ticker'],
  setup() {
    const autoFrac = price => helpers.template.prettyPrice({ price, numFrac: price >= 100 ? 0 : 2 })

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
    }
  }

  &:hover {
    background: var(--brand-primary-bg-lv1);
  }
}
</style>