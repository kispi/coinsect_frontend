<template>
  <div
    @click="openBinance"
    class="real-time-price-card f-mono"
    :class="{
      'up': info && info.$$tickDirection === 'up',
      'down': info && info.$$tickDirection === 'down',
    }">
    <div class="name-and-price">
      <div class="symbol-name">
        <AppSkeleton v-if="!tickerBinance"/>
        <AppImg v-else :src="`https://static.upbit.com/logos/${symbol}.png`" class="flex-wrap m-r-8" :alt="symbol"/>
        {{ symbol }}
      </div>
      <div class="vr"/>
      <div class="symbol-price">$ {{ mustUSD((tickerBinance || {}).c) }}</div>
    </div>
    <div v-if="symbol === 'BTC'" class="premiums">
      <div v-if="info.premiumUpbit" class="attr">
        <div class="key m-r-4"><AppImg :src="require('@/assets/images/upbit.svg')" :fit="'contain'"/></div>
        <div class="value">{{ info.premiumUpbit || '-' }}%</div>
      </div>
      <div v-if="info.premiumUpbit && info.premiumBithumb" class="vr"/>
      <div v-if="info.premiumBithumb" class="attr">
        <div class="key m-r-4"><AppImg :src="require('@/assets/images/bithumb.svg')" :fit="'contain'"/></div>
        <div class="value">{{ info.premiumBithumb || '-' }}%</div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  props: {
    tickerBinance: Object,
    tickerBithumb: Object,
    tickerUpbit: Object,
  },
  setup(props) {
    const { store } = useGlobalHooks()

    const symbol = computed(() => ((props.tickerBinance || {}).s || '').split('USDT')[0])

    const prev = ref({
      price: null,
      direction: null,
    })

    const tickDirection = () => {
      const next = parseFloat(props.tickerBinance.c)
      if (!prev.value.price || prev.value.price === next) return prev.value.direction
      if (next > prev.value.price) return 'up'
      if (next < prev.value.price) return 'down'
    }

    const info = computed(() => {
      if (!props.tickerBinance) return

      const $$tickDirection = tickDirection()
      prev.value.price = parseFloat(props.tickerBinance.c)
      prev.value.direction = $$tickDirection
      return {
        premiumUpbit: props.tickerUpbit && props.tickerBinance ? (((props.tickerUpbit.tp / store.getters.usdKrw) / props.tickerBinance.c - 1) * 100).toFixed(2) : null,
        premiumBithumb: props.tickerBithumb && props.tickerBinance ? (((props.tickerBithumb.closePrice / store.getters.usdKrw) / props.tickerBinance.c - 1) * 100).toFixed(2) : null,
        $$tickDirection,
      }
    })

    const openBinance = () => window.open(`https://www.binance.com/en/futures/${props.tickerBinance.s}`, '_blank')

    const mustUSD = price => {
      if (!price) return '-'

      return parseFloat(price).toLocaleString(undefined, {
        minimumFractionDigits: price < 1 ? 4 : 2,
        maximumFractionDigits: 4,
      })
    }

    return {
      info,
      symbol,
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
  gap: 8px;
  align-items: center;
  transition: all 0.3s ease;
  font-size: 12px;
  cursor: pointer;

  .name-and-price {
    display: flex;
    align-items: center;
  }

  .app-img {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background: var(--text-light);
  }

  .symbol-name {
    display: flex;
    align-items: center;
    font-weight: 700;
  }

  .symbol-price {
    font-weight: 500;
    transition: all 0.1s ease;
    font-weight: 700;
  }

  .attr {
    display: flex;
    align-items: center;

    .key,
    .value {
      display: flex;
      align-items: center;
    }
  }

  .premiums {
    display: flex;
    align-items: center;
  }

  .vr {
    background: var(--background-light);
    width: 1px;
    height: 12px;
    margin: 0 8px;
  }

  &.up {
    background: var(--price-up-bybit-bg);

    .symbol-price {
      color: var(--price-up-bybit);
    }
  }

  &.down {
    background: var(--price-down-bybit-bg);

    .symbol-price {
      color: var(--price-down-bybit);
    }
  }

  @media (min-width: 480px) {
    .name-and-price {
      font-size: 14px;
    }
  }
}
</style>