<template>
  <div
    v-if="orderbook"
    class="real-time-orderbook">
    <div :key="type" v-for="type in ['$$asks', '$$bids']">
      <div
        class="order"
        :key="idx"
        v-for="(order, idx) in orderbook[type]">
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useStore } from 'vuex'
import useUpbit from '@/hooks/websockets/upbit'

export default {
  props: {
    exchange: String,
    market: String,
  },
  setup(props, { emit }) {
    const store = useStore()

    const orderbook = computed(() => store.getters.orderbooks[props.exchange][props.market])

    const emitted = ref(null)

    const realTimeTicker = computed(() => {
      if (!props.market) return

      return store.getters.realTimeTickers[props.market.split('KRW-')[1]] || {}
    })

    const prevClosingPrice = computed(() => realTimeTicker.value.$$prevClosingPrice)

    const lastTradedPrice = computed(() => realTimeTicker.value.$$tradePriceBase)

    const relativeWidth = size => `${size * 100 / orderbook.value.$$biggestSize}%`

    const priceColor = price => {
      if (!prevClosingPrice.value || price === prevClosingPrice.value) return 'c-price-same-upbit'

      return price > prevClosingPrice.value ? 'c-price-up-upbit' : 'c-price-down-upbit'
    }

    const { subscribe } = useUpbit()

    const connection = ref(null)

    const init = () => {
      if (props.exchange === 'upbit') connection.value = subscribe({ type: 'orderbook', codes: [props.market] })
    }

    onMounted(init)

    onUnmounted(() => connection.value.close())

    watch(
      () => orderbook.value,
      newVal => {
        if (newVal && !emitted.value) {
          emit('load-orderbook')
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