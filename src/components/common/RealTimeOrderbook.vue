<template>
  <div
    v-if="orderbooks"
    class="real-time-orderbook">
    <div :key="type" v-for="type in ['$$asks', '$$bids']">
      <div
        class="order"
        :key="idx"
        v-for="(order, idx) in orderbooks[type]">
        <div
          class="price"
          :class="[
            type === '$$asks' ? 'down' : 'up',
            priceColor(order.price),
            lastTradedPrice === order.price ? 'bordered' : '',
          ]">
          <div class="value" v-html="$helpers.number.pretty.price({ price: order.price, baseCurrency: 'krw' })"/>
          <div class="change" v-html="`${(Math.round((order.price - prevClosingPrice) / prevClosingPrice * 10000) / 100).toLocaleString(undefined, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}%`"/>
        </div>
        <div class="size">
          {{ order.size.toLocaleString(undefined, {
            maximumFractionDigits: 3,
            minimumFractionDigits: 3,
          }) }}
          <div
            class="wall overlay"
            :class="type === '$$asks' ? 'down' : 'up'"
            :style="{ width: relativeWidth(order.size) }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import useUpbit from '@/hooks/websockets/upbit'

export default {
  props: {
    exchange: String,
    market: String,
  },
  setup(props) {
    const store = useStore()

    const orderbooks = computed(() => store.getters.orderbooks[props.exchange][props.market])

    const prevClosingPrice = ref(null)

    const lastTradedPrice = ref(null)

    const biggestSize = computed(() => {
      const sizes = [...orderbooks.value.$$asks, ...orderbooks.value.$$bids].map(o => o.size).sort((a, b) => b - a)
      return sizes[0]
    })

    const relativeWidth = size => `${size * 100 / biggestSize.value}%`

    const priceColor = price => {
      if (price > prevClosingPrice.value) return 'c-price-up-upbit'
      if (price === prevClosingPrice.value) return 'c-price-same-upbit'
      if (price < prevClosingPrice.value) return 'c-price-down-upbit'
    }

    const { subscribe, eventAsJSON } = useUpbit()

    const connection = ref({
      orderbook: null,
      trade: null,
    })

    const init = () => {
      if (props.exchange === 'upbit') {
        connection.value.orderbook = subscribe({ type: 'orderbook', codes: [props.market] })
        connection.value.trade = subscribe({ type: 'trade', codes: [props.market] })

        connection.value.trade.onmessage = event => {
          const json = eventAsJSON(event)
          prevClosingPrice.value = json.prev_closing_price
          lastTradedPrice.value = json.trade_price
        }
      }
    }

    onMounted(init)

    onUnmounted(() => {
      connection.value.orderbook.close()
      connection.value.trade.close()
    })

    return {
      orderbooks,
      prevClosingPrice,
      lastTradedPrice,
      biggestSize,
      relativeWidth,
      priceColor,
    }
  },
}
</script>

<style lang="scss" scoped>
.real-time-orderbook {
  background: var(--background-base);

  .down {
    background: var(--price-down-upbit-bg);
  }

  .up {
    background: var(--price-up-upbit-bg);
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
        font-weight: 700;
        letter-spacing: 0.32px;
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