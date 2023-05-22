<template>
  <div class="real-time-price-cards">
    <RealTimePriceCard
      :ticker="ticker"
      :key="ticker"
      v-for="ticker in symbols.map(s => $store.getters.rawWebsocketInfo.binance[`${s}USDT`.toUpperCase()])"
    />
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref } from 'vue'
import useBinance from '@/hooks/websockets/binance'
import RealTimePriceCard from './RealTimePriceCard'

export default {
  components: { RealTimePriceCard },
  props: {
    symbols: Array,
  },
  setup(props) {
    const { subscribe } = useBinance()

    const connection = ref(null)

    const init = async () => {
      try {
        connection.value = await subscribe({
          codes: props.symbols.map(symbol => `${symbol.toLowerCase()}usdt@miniTicker`),
          $$raw: true,
        })
      } catch (e) {}
    }

    onMounted(init)

    onUnmounted(() => {
      if (connection.value) connection.value.close()
    })
  },
}
</script>

<style lang="scss" scoped>
.real-time-price-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;

  .real-time-price-card {
    &:first-child {
      grid-column: 1 / span 3;
    }
  }
}
</style>