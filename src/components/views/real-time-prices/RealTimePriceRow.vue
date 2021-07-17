<template>
  <tr class="real-time-price-row">
    <td class="ticker-symbol">
      <div class="flex-row items-center">
        <img :src="`https://static.upbit.com/logos/${symbol}.png`" class="flex-wrap m-r-4">
        <div v-html="ticker.$$name[$store.getters.translation.locale]" class="name c-black-light lines-1"/>
      </div>
      <div v-html="symbol" class="symbol f-300"/>
    </td>
    <td class="ticker-current-price f-700" :class="priceColor">
      <div>{{ ticker.trade_price.toLocaleString() }}</div>
      <!-- <div>COMING SOON</div> -->
    </td>
    <!-- <td class="ticker-kimp"></td> -->
    <td class="ticker-changes-24h" :class="priceColor">
      <div v-html="`${$helpers.template.prettyPrice({ price: changeRate, numFrac: 2 })}%`"/>
      <div v-html="ticker.signed_change_price.toLocaleString()"/>
    </td>
    <td class="ticker-vol-24h">
      <div v-html="$helpers.template.koreanizedNumber({ number: ticker.acc_trade_price_24h, useBigPicture: true })"/>
    </td>
  </tr>
</template>

<script>
import { computed } from 'vue'

export default {
  props: ['ticker'],
  setup(props) {
    const symbol = computed(() => props.ticker.code.split('KRW-')[1])

    const changeRate = computed(() => Math.round(props.ticker.signed_change_rate * 10000) / 100)

    const priceColor = computed(() => {
      if (changeRate.value > 0) return 'c-price-up-upbit'
      if (changeRate.value === 0) return 'c-price-same-upbit'
      if (changeRate.value < 0) return 'c-price-down-upbit'
    })

    return {
      symbol,
      changeRate,
      priceColor,
    }
  },
}
</script>

<style lang="scss" scoped>
.real-time-price-row {
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
      max-width: 80px;
      font-weight: 700;
    }
  }

  &:nth-child(odd) {
    background: var(--almost-white);
  }

  &:hover {
    background: var(--brand-primary-bg-lv1);
  }
}
</style>