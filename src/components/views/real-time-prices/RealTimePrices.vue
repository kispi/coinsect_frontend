<template>
  <div
    v-if="$store.getters.realTimeTickers"
    class="real-time-prices">
    <div class="settings">
      <div class="total-and-search">
        <div>검색결과: {{ displayedList.length }}</div>
        <div class="input-wrapper">
          <i class="fal fa-search"/>
          <input
            ref="refInput"
            v-model="keyword"
            @keydown="onKeydown"
            placeholder="ㅂㅌ, 비트, btc, bit"
          >
          <i
            v-if="keyword"
            class="fal fa-times"
            @click="keyword = null"
          />
        </div>
      </div>
    </div>
    <div
      v-if="!connected"
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
    <table v-if="calculating">
      <tbody>
        <AppSkeleton
          :key="card"
          v-for="card in 16"
        />
      </tbody>
    </table>
    <div
      v-if="displayedList.length === 0 && !calculating && connected"
      class="empty">
      <div class="m-b-8">검색된 코인이 없네요 🤔</div>
      <div>혹시 즐겨찾기한 코인이 없는 상태인데 설정에서 필터를 '즐겨찾기'로 하신건 아닌지, 혹은 검색되지 않는 코인을 검색어로 입력하신 건 아닌지 확인해보세요!</div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch, onUnmounted, computed } from 'vue'
import RealTimePriceRow from './RealTimePriceRow'
import useUpbit from '@/hooks/websockets/upbit'
import useBithumb from '@/hooks/websockets/bithumb'
import useBinance from '@/hooks/websockets/binance'
import useChatHandler from '@/hooks/chat-handler'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  components: {
    RealTimePriceRow,
  },
  setup() {
    const { plugins, store } = useGlobalHooks()

    const refNotConnected = ref(null)

    const refInput = ref(null)

    const { subscribe: subscribeUpbit, setAsBasePrice } = useUpbit()

    const { subscribe: subscribeBithumb, setAsBasePriceFromRestAPI } = useBithumb()

    const { subscribe: subscribeBinance } = useBinance()

    const { loadMessages } = useChatHandler()

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

    const calculating = ref(true)

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
      }, 10)
    }

    const sorter = (a, b) => {
      if (a[settings.value.sort.column] === undefined) return 1

      if (b[settings.value.sort.column] === undefined) return -1

      if (settings.value.sort.direction === 'asc') return a[settings.value.sort.column] < b[settings.value.sort.column] ? -1 : 1

      if (settings.value.sort.direction === 'desc') return a[settings.value.sort.column] < b[settings.value.sort.column] ? 1 : -1
    }

    const recalcDisplayedList = async () => {
      calculating.value = true
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
      calculating.value = false
    }

    const displayedList = ref([])

    /*
      이걸 사용하지 않고 그냥 init()을 실행하면, unmounted 이후에도 (다른 페이지로 이동 등) closure에 의해 계속 실행되므로,
      같은 페이지 내에서 끊긴 경우만 자동 재접속하기 위해 programmatically 버튼을 클릭해서 재접속하게 구현.
    */
    const initByClickingButton = () => {
      if (!refNotConnected.value) return

      refNotConnected.value.click()
      loadMessages()
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
        symbols: store.getters.markets.bithumb.map(o => `${o.$$symbol}_KRW`),
        tickTypes: ['24H', 'MID'],
      }).then(conn => onConnected(conn, 'bithumb')),
      binance: () => subscribeBinance({
        codes: store.getters.markets[baseExchange.value].map(o => `${(o.$$symbol || '').toLowerCase()}${store.getters.settings.baseExchangeMarket === 'krw' ? 'usdt' : 'btc'}@miniTicker`),
        // 원화마켓(krw)은 usdt와 비교하고, btc마켓은 그대로.
      }).then(conn => onConnected(conn, 'binance')),
    }

    const prepareUpbit = () => {
      if (!store.getters.markets.upbit) return

      store.getters.markets.upbit.forEach(o => setAsBasePrice({ symbol: o.$$symbol, json: {} }))
    }

    const prepareBithumb = () => {
      if (!store.getters.markets.bithumb) return

      store.getters.markets.bithumb.forEach(json => setAsBasePriceFromRestAPI({ symbol: json.$$symbol, json }))
    }

    const runRecalcInterv = () => {
      clearInterval(intervRecalc.value)
      intervRecalc.value = setInterval(recalcDisplayedList, store.getters.settings.sortInterval)
    }

    const init = async () => {
      store.commit('initRealTimeTickers')

      try {
        await store.dispatch('loadBaseMarkets')
        if (baseExchange.value === 'upbit') prepareUpbit()
        if (baseExchange.value === 'bithumb') prepareBithumb()

        if (!connections.value[baseExchange.value] || connections.value[baseExchange.value].readyState !== 1) await subscriber[baseExchange.value]()
        if (!connections.value[targetExchange.value] || connections.value[targetExchange.value].readyState !== 1) await subscriber[targetExchange.value]()

        // 웹소켓 구독을 먼저 해서 코인 실시간 시세들을 불러운 뒤에 recalc를 해야 현재 정렬상태가 반영됨.
        recalcDisplayedList()
        runRecalcInterv()
      } catch (e) {
        plugins.$toast.error(`거래소(${baseExchange.value})의 정보를 불러오는데 실패했습니다. 다시 시도해주세요.`)
      }
    }

    const onShortcut = e => {
      if (e.key === 'f' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        refInput.value.focus()
        return
      }

      if (e.key === 'Escape') {
        keyword.value = null
        refInput.value.blur()
        return
      }
    }

    onMounted(() => {
      init()

      document.addEventListener('keydown', onShortcut)
    })

    onUnmounted(() => {
      document.removeEventListener('keydown', onShortcut)
      Object.keys(connections.value).forEach(key => {
        if (connections.value[key]) connections.value[key].close()
      })

      clearInterval(intervRecalc.value)
    })

    watch([
      () => store.getters.settings,
      () => keyword.value,
    ],
      recalcDisplayedList,
      { deep: true },
    )

    watch(
      () => store.getters.settings.sortInterval,
      runRecalcInterv,
    )

    return {
      refNotConnected,
      refInput,
      init,
      calculating,
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
        width: 160px;
        position: relative;
        background: var(--background-light);

        .fa-search {
          margin-right: 8px;
        }

        .fa-times {
          right: 16px;
          position: absolute;
          cursor: pointer;
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

  .empty {
    font-size: 16px;
    color: var(--text-stress);
    margin: 40px;
    text-align: center;
  }

  .app-skeleton {
    width: 100%;
    height: 60px;
    margin: 2px 0;
  }

  @media (max-width: 399px) {
    th,
    td {
      font-size: 11px;
    }
  }
}
</style>