<template>
  <div
    @click="openBinance"
    class="real-time-price-card f-mono">
    <div class="symbol-name">
      <AppSkeleton v-if="!ticker"/>
      <AppImg v-else :src="`https://static.upbit.com/logos/${symbol}.png`" class="flex-wrap m-r-8" :alt="symbol"/>
      {{ symbol }}
    </div>
    <div class="symbol-price">$ {{ mustUSD((ticker || {}).c) }}</div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  props: {
    ticker: Object,
  },
  setup(props) {
    const symbol = computed(() => ((props.ticker || {}).s || '').split('USDT')[0])

    const openBinance = () => {
      window.open(`https://www.binance.com/en/futures/${props.ticker.s}`, '_blank')
    }

    const upOrDown = value => {
      if (value > 0) return 'up'
      if (value < 0) return 'down'
      return ''
    }

    const mustUSD = price => {
      if (!price) return '-'

      return parseFloat(price).toLocaleString(undefined, {
        minimumFractionDigits: price < 1 ? 4 : 2,
        maximumFractionDigits: 4,
      })
    }

    return {
      symbol,
      upOrDown,
      mustUSD,
      openBinance,
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
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: var(--text-light);
  }

  .symbol-name {
    display: flex;
    align-items: center;

    .app-img {
      width: 16px;
      height: 16px;
    }
  }

  .symbol-price {
    font-weight: 500;
    font-size: 12px;
  }
}
</style>