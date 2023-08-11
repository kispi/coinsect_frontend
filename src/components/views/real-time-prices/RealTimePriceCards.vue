<template>
  <div class="real-time-price-cards">
    <RealTimePriceCard
      :tickerBinance="$store.getters.rawWebsocketInfo.binance[`${symbol}USDT`.toUpperCase()]"
      :tickerUpbit="$store.getters.rawWebsocketInfo.upbit[`KRW-${symbol}`]"
      :tickerBithumb="$store.getters.rawWebsocketInfo.bithumb[`${symbol}_KRW`.toUpperCase()]"
      :key="symbol"
      v-for="symbol in symbols"
    />
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref } from 'vue'
import useBinance from '@/hooks/websockets/binance'
import useUpbit from '@/hooks/websockets/upbit'
import RealTimePriceCard from './RealTimePriceCard'

export default {
  components: { RealTimePriceCard },
  props: {
    symbols: Array,
  },
  setup(props) {
    const { subscribe: subscribeBinance } = useBinance()

    const { subscribe: subscribeUpbit } = useUpbit()

    const connected = ref(null)

    const connection = ref({
      binance: null,
      upbit: null,
    })

    const init = async () => {
      try {
        connection.value.binance = await subscribeBinance({
          codes: props.symbols.map(symbol => `${symbol.toLowerCase()}usdt@miniTicker`),
          $$raw: true,
        })
        connection.value.upbit = await subscribeUpbit({
          type: 'ticker',
          codes: props.symbols.map(symbol => `KRW-${symbol}`),
          $$raw: true,
        })
        connected.value = true
      } catch (e) {}
    }

    onMounted(init)

    onUnmounted(() => {
      if (connection.value.binance) connection.value.binance.close()
      if (connection.value.upbit) connection.value.upbit.close()
    })

    return {
      connection,
    }
  },
}
</script>

<style lang="scss" scoped>
.real-time-price-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;

  .real-time-price-card {
    &:first-child {
      grid-column: 1 / span 2;
    }
  }
}
</style>