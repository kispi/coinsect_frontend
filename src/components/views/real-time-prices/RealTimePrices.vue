<template>
  <div
    v-if="$store.getters.realTimeTickers"
    class="real-time-prices">
    <div class="settings">
      <div class="total-and-search">
        <div>총 {{ displayedList.length }} 암호자산</div>
        <div class="input-wrapper">
          <i class="fal fa-search"/>
          <input
            v-model="keyword"
            @keydown="onKeydown"
            placeholder="EX:) btc, bit, 비트, ㅂㅌ"
          >
        </div>
      </div>
    </div>
    <div
      v-if="!connected || !$store.getters.symbols || !$store.getters.markets"
      ref="refNotConnected"
      class="not-connected"
      @click="init"><AppLoader :size="32"/><div class="m-l-8">{{ $translate('PREPARING_REAL_TIME_PRICES') }}</div>
    </div>
    <table v-else>
      <thead>
        <tr>
          <th
            class="p-t-8 p-b-8"
            @click="setSort(th.column)"
            :class="settings.sort.column === th.column ? settings.sort.direction : ''"
            :key="th.title"
            v-for="th in [
              { column: '$$symbol', title: 'COIN' },
              { column: '$$tradePriceBase', title: 'PRICE' },
              { column: '$$premiumRate', title: 'PREMIUM' },
              { column: '$$changeRate1D', title: 'CHANGE_RATE_1D' },
              { column: '$$changeRate52WH', title: 'CHANGE_RATE_52W_HIGHEST', $$hide: $store.getters.isMobile || $store.getters.settings.baseExchange !== 'upbit' },
              { column: '$$changeRate52WL', title: 'CHANGE_RATE_52W_LOWEST', $$hide: $store.getters.isMobile || $store.getters.settings.baseExchange !== 'upbit'},
              { column: '$$vol24HBase', title: 'VOL_24' },
            ].filter(o => !o.$$hide)">
            {{ $translate(th.title) }}
            <span class="sort-icons">
              <i class="fas fa-sort-up"/>
              <i class="fas fa-sort-down"/>
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <RealTimePriceRow
          :ticker="ticker"
          :key="ticker.$$symbol"
          v-for="ticker in displayedList"
        />
      </tbody>
    </table>
  </div>
</template>

<script>
import { onMounted, ref, getCurrentInstance, watch, onUnmounted, computed } from 'vue'
import { useStore } from 'vuex'
import RealTimePriceRow from './RealTimePriceRow'
import useUpbit from '@/hooks/websockets/upbit'
import useBithumb from '@/hooks/websockets/bithumb'
import useBinance from '@/hooks/websockets/binance'

export default {
  components: {
    RealTimePriceRow,
  },
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const refNotConnected = ref(null)

    const { subscribe: subscribeUpbit } = useUpbit()

    const { subscribe: subscribeBithumb, setAsBasePriceFromRestAPI } = useBithumb()

    const { subscribe: subscribeBinance } = useBinance()

    const connected = ref(null)

    const connections = ref({
      upbit: null,
      bithumb: null,
      binance: null,
    })

    const intervRecalc = ref(null)

    const baseExchange = computed(() => store.getters.settings.baseExchange)

    const targetExchange = computed(() => store.getters.settings.targetExchange)

    const settings = ref(store.getters.settings)

    const setSort = column => {
      if (settings.value.sort.column === column) {
        settings.value.sort.direction = settings.value.sort.direction === 'desc' ? 'asc' : 'desc'
      } else {
        settings.value.sort.column = column
        settings.value.sort.direction = 'desc'
      }

      store.commit('setSettings', settings.value)
    }

    const keyword = ref('')

    const onKeydown = e => {
      setTimeout(() => {
        keyword.value = e.target.value
      })
    }

    const sorter = (a, b) => {
      if (a[settings.value.sort.column] === undefined) return 1

      if (b[settings.value.sort.column] === undefined) return -1

      if (settings.value.sort.direction === 'asc') return a[settings.value.sort.column] < b[settings.value.sort.column] ? -1 : 1

      if (settings.value.sort.direction === 'desc') return a[settings.value.sort.column] < b[settings.value.sort.column] ? 1 : -1
    }

    const recalcDisplayedList = () => {
      displayedList.value = Object.values(store.getters.realTimeTickers).filter(t => {
        if (store.getters.settings.filter === 'favorites' && !store.getters.settings.favorites[t.$$symbol]) return

        const geckoName = store.getters.symbols[t.$$symbol] || {}
        if (!keyword.value || !geckoName) return t

        const lowered = keyword.value.toLowerCase()
        return (geckoName.en || '').toLowerCase().includes(lowered) ||
          (geckoName.kr || '').includes(lowered) ||
          plugins.$helpers.includesChosung(lowered, geckoName.kr) ||
          t.$$symbol.toLowerCase().includes(lowered)
      }).sort((a, b) => {
        if (store.getters.settings.favorites[a.$$symbol] === store.getters.settings.favorites[b.$$symbol]) return sorter(a, b)

        if (!store.getters.settings.favorites[a.$$symbol]) return 1

        if (!store.getters.settings.favorites[b.$$symbol]) return -1

        return sorter(a, b)
      })
    }

    const displayedList = ref([])

    /*
      이걸 사용하지 않고 그냥 init()을 실행하면, unmounted 이후에도 (다른 페이지로 이동 등) closure에 의해 계속 실행되므로,
      같은 페이지 내에서 끊긴 경우만 자동 재접속하기 위해 programmatically 버튼을 클릭해서 재접속하게 구현.
    */
    const initByClickingButton = () => {
      if (refNotConnected.value) refNotConnected.value.click()
    }

    const onConnected = (conn, exchange) => {
      connections.value[exchange] = conn
      connected.value = true

      connections.value[exchange].onclose = () => {
        connected.value = false
        setTimeout(initByClickingButton, 1000)
      }
    }

    const subscriber = {
      upbit: () => subscribeUpbit({
        type: 'ticker',
        codes: store.getters.markets.upbit.map(o => o.market),
      }).then(conn => onConnected(conn, 'upbit')),
      bithumb: () => subscribeBithumb({
        type: 'ticker',
        symbols: store.getters.markets.bithumb.map(o => `${o.symbol}_KRW`),
        tickTypes: ['24H', 'MID'],
      }).then(conn => onConnected(conn, 'bithumb')),
      binance: () => subscribeBinance({
        codes: store.getters.markets[baseExchange.value].map(o => `${(o.$$symbol || '').toLowerCase()}usdt@miniTicker`),
      }).then(conn => onConnected(conn, 'binance')),
    }

    const prepareBithumb = () => {
      if (!store.getters.markets.bithumb) return

      store.getters.markets.bithumb.forEach(json => {
        setAsBasePriceFromRestAPI({ symbol: json.symbol, json })
      })
    }

    const init = async () => {
      // 대충 정렬이 너무 오래 풀려있는걸 막기 위해 2초에 한번정도씩만 강제로 다시 그려준다
      intervRecalc.value = setInterval(recalcDisplayedList, 2000)

      store.commit('initRealTimeTickers')
      if (baseExchange.value === 'bithumb') prepareBithumb()
      await store.dispatch('loadMarkets', baseExchange.value)
      if (!connections.value[baseExchange.value] || connections.value[baseExchange.value].readyState !== 1) subscriber[baseExchange.value]()
      if (!connections.value[targetExchange.value] || connections.value[targetExchange.value].readyState !== 1) subscriber[targetExchange.value]()
    }

    onMounted(init)

    onUnmounted(() => {
      Object.keys(connections.value).forEach(key => {
        if (connections.value[key]) connections.value[key].close()
      })

      if (intervRecalc.value) clearInterval(intervRecalc.value)
    })

    watch([
      () => store.getters.settings,
      () => keyword.value,
    ],
      recalcDisplayedList,
      { deep: true },
    )

    const unwatch = watch(
      () => store.getters.realTimeTickers,
      () => {
        // realTimeTicker가 모든 원화 마켓 길이만큼 채워지기 전에는 리스트를 계산하지 않는다 (성능)
        if (
          (Object.values(store.getters.realTimeTickers).length ===
          store.getters.markets[baseExchange.value].filter(o => {
            if (baseExchange.value === 'upbit') return o.market.includes('KRW')
            if (baseExchange.value === 'bithumb') return true
          }).length)
        ) {
          recalcDisplayedList()
          unwatch()
        }
      },
      { deep: true },
    )

    return {
      refNotConnected,
      init,
      connected,
      keyword,
      settings,
      setSort,
      displayedList,
      baseExchange,
      targetExchange,
      onKeydown,
    }
  },
}
</script>

<style lang="scss">
.real-time-prices {
  @media (max-width: 767px) {
    font-size: 12px;
  }

  .not-connected {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px;
    background: var(--background-light);
    color: var(--text-stress);
    font-weight: 700;
    cursor: pointer;
  }

  .settings {
    .total-and-search {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 0;

      .input-wrapper {
        border-radius: 24px;
        display: flex;
        align-items: center;
        padding: 8px 12px;
        background: var(--background-light);

        .fa-search {
          margin-right: 8px;
        }
      }
    }

    .base-and-target {
      padding: 8px 0;
      border-top: 1px solid var(--border-base);
      border-bottom: 1px solid var(--border-base);
    }
  }

  table {
    width: 100%;

    th {
      cursor: pointer;
    }

    th,
    td {
      padding: 4px;

      &:first-child {
        text-align: initial;
      }

      &:not(:first-child) {
        text-align: right;
      }
    }
  }
}
</style>