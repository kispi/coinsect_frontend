<template>
  <div class="c-portfolio">
    <button
      @click="openModalAddPortfolio"
      class="btn btn-primary w-100 m-b-24">
      <i class="fal fa-plus"/><div class="m-l-8" v-html="$translate('ADD_PORTFOLIO')"/>
    </button>
    <div
      @click="editStableMoney"
      class="form-control flex-row items-center stable-money">
      <label class="flex-wrap m-r-16 m-b-0">고정자산 (KRW, USDT 등)</label>
      <input v-model="stable" type="number" :readonly="true">
    </div>
    <div
      class="portfolio-exchange"
      :key="portfolioByExchange.exchange"
      v-for="portfolioByExchange in displayedPortfolio">
      <img :src="require(`@/assets/images/${portfolioByExchange.exchange}.svg`)" class="m-b-8">
      <div class="items">
        <CPortfolioItem
          :exchange="portfolioByExchange.exchange"
          :item="item"
          :key="item.market"
          v-for="item in portfolioByExchange.items"
        />
      </div>
    </div>
  </div>
</template>

<script>
// 있는거 사용하려 하지 말고 새로 웹소켓 연결해서 쓰는게 나을듯
import { ref, computed, getCurrentInstance, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import useBinance from '@/hooks/websockets/binance'
import useUpbit from '@/hooks/websockets/upbit'
import CPortfolioItem from './CPortfolioItem'

export default {
  components: { CPortfolioItem },
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const { subscribe: sUpbit } = useUpbit()

    const { subscribe: sBinance } = useBinance()

    const connections = ref({
      upbit: null,
      binance: null,
    })

    const stable = ref(0)

    const portfolio = computed(() => store.getters.settings.portfolio)

    const editStableMoney = () => {
      plugins.$modal.input({ title: 'KRW, USDT 등 고정자산을 입력하세요', inputValue: stable.value || 0 })
        .then(money => {
          if (!money || !parseFloat(money)) return

          stable.value = parseFloat(money)
          portfolio.value.stable = stable.value
          store.commit('setSettings', { portfolio: portfolio.value })
        })
        return
    }

    const unrealized = (exchange, item) => {
      const info = (store.getters.rawWebsocketInfo[exchange] || {})[item.market]
      if (!info) return 0

      if (exchange === 'upbit') return Math.round((info.tp - item.averagePurchasePrice) * item.amount)
      if (exchange === 'binance') return Math.round((info.c - item.averagePurchasePrice) * item.amount)
    }

    const worth = (exchange, item) => {
      const info = (store.getters.rawWebsocketInfo[exchange] || {})[item.market]
      if (!info) return 0

      if (exchange === 'upbit') return Math.round(info.tp * item.amount)
      if (exchange === 'binance') return Math.round(info.c * item.amount)
    }

    const displayedPortfolio = computed(() => {
      const arr = []
      const exchanges = ['upbit', 'binance']
      exchanges.forEach(exchange => {
        const items = portfolio.value[exchange]
        if (!items) return

        items.forEach((item, idx) => {
          items[idx].$$unrealized = unrealized(exchange, item)
          items[idx].$$worth = worth(exchange, item)
          items[idx].$$roi = Math.round(items[idx].$$unrealized / (item.averagePurchasePrice * item.amount) * 10000) / 100
        })
        arr.push({ exchange, items })
      })
      return arr
    })

    const connect = () => {
      if (portfolio.value.upbit) {
        sUpbit({
          type: 'ticker',
          codes: portfolio.value.upbit.map(o => o.market),
          $$raw: true,
        }).then(conn => connections.value.upbit = conn)
      }

      if (portfolio.value.binance) {
        sBinance({
          codes: portfolio.value.binance.map(o => `${o.market.toLowerCase()}@miniTicker`),
          $$raw: true,
        }).then(conn => connections.value.binance = conn)
      }
    }

    const openModalAddPortfolio = () => plugins.$modal.custom({ component: 'ModalAddPortfolio' }).then(() => {
      disconnect()
      setTimeout(connect, 1000)
    })

    const disconnect = () => {
      if (connections.value.upbit) connections.value.upbit.close()
      if (connections.value.binance) connections.value.binance.close()
    }

    onMounted(() => {
      if (portfolio.value) {
        stable.value = portfolio.value.stable
        connect()
      }
    })

    onUnmounted(disconnect)

    return {
      displayedPortfolio,
      stable,
      editStableMoney,
      openModalAddPortfolio,
    }
  },
}
</script>

<style lang="scss" scoped>
.c-portfolio {
  font-family: Arial, Helvetica, sans-serif;

  img {
    width: 16px;
  }

  .stable-money {
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  .portfolio-exchange {
    &:not(:last-child) {
      margin-bottom: 24px;
    }

    .items {
      display: grid;
      grid-gap: 8px;

      @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }
}
</style>