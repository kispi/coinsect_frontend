<template>
  <AppLoading
    v-if="!orderbook || !instrument"
    :loading="true"
  />
  <div
    v-else
    class="orderbook-bybit">
    <div
      class="order"
      :key="idx"
      v-for="(order, idx) in orderbook.$$asks.slice(-depth)">
      <div class="price c-price-down">
        <div class="value" v-html="order.price.toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        })"/>
      </div>
      <div class="size">
        {{ order.size.toLocaleString() }}
        <div
          class="overlay down"
          :style="{ width: relativeWidth(order.size) }"
        />
      </div>
    </div>
    <div class="instrument f-mono">
      <div class="last-price" :class="instrument.last_tick_direction.includes('Minus') ? 'c-price-down' : 'c-price-up'">
        <i class="fa" :class="instrument.last_tick_direction.includes('Minus') ? 'fa-arrow-down' : 'fa-arrow-up'"/>
        {{ instrument.last_price }}
      </div>
      <div class="other-prices">
        <div class="mark-price m-b-4">Mark {{ instrument.mark_price }}</div>
        <div class="index-price">Index {{ instrument.index_price }}</div>
      </div>
    </div>
    <div
      class="order"
      :key="idx"
      v-for="(order, idx) in orderbook.$$bids.slice(0, depth)">
      <div class="price c-price-up">
        <div class="value" v-html="order.price.toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        })"/>
      </div>
      <div class="size">
        {{ order.size.toLocaleString() }}
        <div
          class="overlay up"
          :style="{ width: relativeWidth(order.size) }"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useStore } from 'vuex'
import useBybit from '@/hooks/websockets/bybit'

export default {
  props: {
    market: String,
    depth: {
      type: Number,
      default: 5,
    }
  },
  setup(props, { emit }) {
    const store = useStore()

    const orderbook = computed(() => store.getters.orderbooks.bybit[props.market])

    const instrument = computed(() => store.getters.instruments.bybit[props.market])

    const emitted = ref(null)

    const relativeWidth = size => `${size * 100 / orderbook.value.$$biggestSize}%`

    const { subscribe } = useBybit()

    const connection = ref({
      orderbook: null,
      instrument: null,
    })

    const init = () => {
      subscribe({ type: 'orderBookL2_25', market: props.market }).then(conn => connection.value.orderbook = conn)
      subscribe({ type: 'instrument_info.100ms', market: props.market }).then(conn => connection.value.instrument = conn)
    }

    onMounted(init)

    onUnmounted(() => {
      store.commit('setOrderbook', {
        exchange: 'bybit',
        market: props.market,
        orderbook: null,
      })

      store.commit('setInstrument', {
        exchange: 'bybit',
        market: props.market,
        instrument: null,
      })

      connection.value.orderbook.close()
      connection.value.instrument.close()
    })

    watch(
      () => orderbook.value,
      newVal => {
        if (newVal && !emitted.value) {
          emit('load-orderbook')
          emitted.value = true
        }
      },
      { deep: true },
    )

    return {
      orderbook,
      instrument,
      relativeWidth,
    }
  },
}
</script>

<style lang="scss" scoped>
.orderbook-bybit {
  font-weight: 500;
  background: var(--background-base);

  .down {
    background: var(--price-down-bg);
  }

  .up {
    background: var(--price-up-bg);
  }

  .instrument {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--bitcoin);
    font-size: 12px;
    padding: 8px 16px;

    .other-prices {
      text-align: right;
    }
  }

  .order {
    display: flex;
    align-items: center;
    position: relative;
    font-size: 12px;
    padding: 4px 16px;

    .price {
      flex: 1;
      display: flex;
      justify-content: space-between;

      .value {
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
      text-align: right;

      .overlay {
        margin-left: auto;
        transition: all 0.5s ease;
      }
    }
  }
}
</style>