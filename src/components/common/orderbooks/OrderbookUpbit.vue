<template>
  <div
    v-if="orderbook"
    class="orderbook-upbit">
    <div :key="t" v-for="t in ['$$asks', '$$bids']">
      <div
        class="order"
        :key="idx"
        v-for="(order, idx) in orderbook[t]">
        <div
          class="price"
          :class="[
            t === '$$asks' ? 'down' : 'up',
            priceColor({ price: order.price, type: t }),
            lastTradedPrice === order.price ? 'bordered' : '',
          ]">
          <div class="value" v-html="$helpers.number.pretty.price({ price: order.price, baseCurrency: $store.getters.settings.baseExchangeMarket })"/>
          <div class="change" v-html="`${zeroOrPercent(order)}%`"/>
        </div>
        <div class="size">
          {{ order.size.toLocaleString(undefined, {
            maximumFractionDigits: 3,
            minimumFractionDigits: 3,
          }) }}
          <div
            class="wall overlay"
            :class="t === '$$asks' ? 'down' : 'up'"
            :style="{ width: relativeWidth(order.size) }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import useUpbit from '@/hooks/websockets/upbit'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  props: {
    market: String,
  },
  setup(props) {
    const { store } = useGlobalHooks()

    const orderbook = computed(() => store.getters.orderbooks.upbit[props.market])

    const emitted = ref(null)

    const realTimeTicker = computed(() => {
      if (!props.market) return

      return store.getters.realTimeTickers[props.market.split(`${store.getters.settings.baseExchangeMarket.toUpperCase()}-`)[1]] || {}
    })

    const prevClosingPrice = computed(() => realTimeTicker.value.$$prevClosingPrice)

    const lastTradedPrice = computed(() => realTimeTicker.value.$$tradePriceBase)

    const relativeWidth = size => `${size * 100 / orderbook.value.$$biggestSize}%`

    const priceColor = ({ price, type }) => {
      if (store.getters.settings.theme === 'light') {
        if (!prevClosingPrice.value || price === prevClosingPrice.value) return 'c-price-same-upbit'
        return price > prevClosingPrice.value ? 'c-price-up' : 'c-price-down'
      }

      return type === '$$asks' ? 'c-price-down' : 'c-price-up'
    }

    const { subscribe } = useUpbit()

    const connection = ref(null)

    const zeroOrPercent = order => {
      const value = helpers.number.pretty.percent(Math.round((order.price - prevClosingPrice.value) / prevClosingPrice.value * 10000) / 100)
      return isNaN(value) ? 0 : value
    }

    const init = () => {
      subscribe({ type: 'orderbook', codes: [props.market] }).then(conn => connection.value = conn)
    }

    onMounted(init)

    onUnmounted(() => {
      store.commit('setOrderbook', {
        exchange: 'upbit',
        market: props.market,
        orderbook: null,
      })

      connection.value.close()
    })

    watch(
      () => orderbook.value,
      newVal => {
        if (newVal && !emitted.value) {
          emitted.value = true
        }
      },
    )

    return {
      orderbook,
      prevClosingPrice,
      lastTradedPrice,
      relativeWidth,
      priceColor,
      zeroOrPercent,
    }
  },
}
</script>

<style lang="scss" scoped>
.orderbook-upbit {
  background: var(--background-base);

  .down {
    background: var(--price-down-bg);
  }

  .up {
    background: var(--price-up-bg);
  }

  .order {
    display: flex;
    align-items: center;
    font-size: 12px;

    &:not(:first-child) {
      border-top: 1px solid var(--border-base);
    }

    .price {
      flex: 1;
      padding: 8px 16px;
      display: flex;
      justify-content: space-between;

      .value {
        letter-spacing: 0.32px;
        font-weight: 700;
      }

      &.bordered {
        box-shadow: 0 0 0 1px var(--text-stress) inset;
      }
    }

    .size {
      font-size: 12px;
      flex: 1;
      color: var(--text-stress);
      padding: 2px 8px;
      font-weight: 300;
      position: relative;
    }
  }
}
</style>