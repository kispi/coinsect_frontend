<template>
  <div class="c-portfolio">
    <button
      @click="openModalAddPortfolio"
      class="btn btn-primary w-100 m-b-24">
      <i class="fal fa-plus"/><div class="m-l-8" v-html="$translate('ADD_PORTFOLIO')"/>
    </button>
    <div class="stats m-b-24">
      <div>
        {{ $translate('NET_PURCHASE') }}: {{ $helpers.number.pretty.price({ price: netStat.purchase, baseCurrency: 'krw' })}}
      </div>
      <div>
        {{ $translate('PURCHASEMENT_WORTH') }}: {{ $helpers.number.pretty.price({ price: netStat.worth, baseCurrency: 'krw' })}}
      </div>
      <div :class="{'c-price-up': netStat.unrealized > 0, 'c-price-down': netStat.unrealized < 0}">
        {{ $translate('UNREALIZED') }}: {{ $helpers.number.pretty.price({ price: netStat.unrealized, baseCurrency: 'krw' }) }}
      </div>
      <div :class="{'c-price-up': netStat.roi > 0, 'c-price-down': netStat.roi < 0}">
        {{ $translate('ROI') }}: {{ (netStat.roi || 0).toFixed(2) }}%
      </div>
      <AdaptiveLayout
        :gap="8"
        class="stable-money">
        <div class="flex-wrap">고정자산 (KRW, USDT...)</div>
        <div class="input-wrapper">
          <input v-model="stable" type="number" @click="e => e.target.select()">
          <div class="remover-wrapper center" @click="stable = 0">
            <i class="fal fa-times"/>
          </div>
        </div>
      </AdaptiveLayout>
      <div class="net-worth">
        {{ $translate('NET_WORTH') }}: {{ $helpers.number.pretty.price({ price: netStat.total, baseCurrency: 'krw' }) }}
      </div>
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
import { ref, computed, getCurrentInstance, onMounted, onUnmounted, watch } from 'vue'
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

    const supportedExchanges = ['upbit', 'binance']

    const connections = ref({
      upbit: null,
      binance: null,
    })

    const stable = ref(0)

    const portfolio = computed(() => store.getters.settings.portfolio)

    const netStat = computed(() => {
      const p = portfolio.value
      let sumWorth = 0
      let sumPurchase = 0
      supportedExchanges.forEach(x => {
        (p[x] || []).forEach(item => {
          sumWorth += item.$$worth
          sumPurchase += Math.round(item.averagePurchasePrice * item.amount)
        })
      })

      const worth = Math.round(sumWorth)
      const purchase = Math.round(sumPurchase)
      const total = worth + (p.stable || 0)
      const unrealized = (worth - purchase)

      return {
        worth,
        purchase,
        total,
        roi: Math.round(unrealized / purchase * 10000) / 100,
        unrealized,
      }
    })

    watch(
      () => stable.value,
      newVal => {
        stable.value = parseFloat(newVal)
        portfolio.value.stable = stable.value
        store.commit('setSettings', { portfolio: portfolio.value })
      },
    )

    const unrealized = (exchange, item) => {
      const info = (store.getters.rawWebsocketInfo[exchange] || {})[item.market]
      if (!info) return 0

      if (exchange === 'upbit') return Math.round((info.tp - item.averagePurchasePrice) * item.amount)
      if (exchange === 'binance') return Math.round((info.c * store.getters.usdKrw - item.averagePurchasePrice) * item.amount * 100) / 100
    }

    const worth = (exchange, item) => {
      const info = (store.getters.rawWebsocketInfo[exchange] || {})[item.market]
      if (!info) return 0

      if (exchange === 'upbit') return Math.round(info.tp * item.amount)
      if (exchange === 'binance') return Math.round(info.c * item.amount * store.getters.usdKrw * 100) / 100
    }

    const displayedPortfolio = computed(() => {
      const arr = []
      supportedExchanges.forEach(exchange => {
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
      netStat,
      connections,
      openModalAddPortfolio,
    }
  },
}
</script>

<style lang="scss" scoped>
.c-portfolio {
  font-family: Arial, Helvetica, sans-serif;

  .stats {
    font-size: 16px;
    display: grid;
    grid-gap: 24px;
    grid-row-gap: 8px;
    grid-template-columns: repeat(2, 1fr);
    color: var(--text-stress);

    @media (max-width: 767px) {
      font-size: 13px;
    }
  }

  img {
    width: 16px;
  }

  .stable-money {
    .input-wrapper {
      display: flex;
      align-items: center;
      border-radius: 4px;

      .remover-wrapper {
        color: var(--text-stress);
        background: var(--background-light);
        width: 24px;
        height: 24px;
        cursor: pointer;
      }

      input {
        padding: 0 8px;
      }
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