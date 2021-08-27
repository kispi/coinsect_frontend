<template>
  <div
    v-if="$store.getters.realTimeTickers"
    class="real-time-prices">
    <div class="settings">
      <BaseAndTarget
        @change-base-exchange="e => baseExchange = e"
        @change-target-exchange="e => targetExchange = e"
      />
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
      v-if="!connected"
      class="not-connected"
      @click="subscribeUpbit({
        type: 'ticker',
        codes: $store.getters.markets.upbit.map(o => o.market),
      })"><AppLoader :size="32"/><div class="m-l-8">{{ $translate('CONNECTING_TO_UPBIT') }}</div>
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
              { column: '$$changeRate52WH', title: 'CHANGE_RATE_52W_HIGHEST', $$hide: $store.getters.isMobile },
              { column: '$$changeRate52WL', title: 'CHANGE_RATE_52W_LOWEST', $$hide: $store.getters.isMobile },
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
import { onMounted, ref, getCurrentInstance, watch } from 'vue'
import { useStore } from 'vuex'
import RealTimePriceRow from './RealTimePriceRow'
import BaseAndTarget from './BaseAndTarget'
import useUpbit from '@/hooks/websockets/upbit'
import useBinance from '@/hooks/websockets/binance'

export default {
  components: {
    RealTimePriceRow,
    BaseAndTarget,
  },
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const { connected, subscribe: subscribeUpbit } = useUpbit()

    const { subscribe: subscribeBinance } = useBinance()

    const baseExchange = ref('upbit')

    const targetExchange = ref('binance')

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

        if (!keyword.value || !t.$$name) return t

        const lowered = keyword.value.toLowerCase()

        return t.$$name.en.toLowerCase().includes(lowered) ||
          t.$$symbol.toLowerCase().includes(lowered) ||
          t.$$name.kr.includes(lowered) ||
          plugins.$helpers.includesChosung(lowered, t.$$name.kr)
      }).sort((a, b) => {
        if (store.getters.settings.favorites[a.$$symbol] === store.getters.settings.favorites[b.$$symbol]) return sorter(a, b)

        if (!store.getters.settings.favorites[a.$$symbol]) return 1

        if (!store.getters.settings.favorites[b.$$symbol]) return -1

        return sorter(a, b)
      })
    }

    const displayedList = ref([])

    const init = async () => {
      await store.dispatch('loadMarkets', baseExchange.value)
      subscribeUpbit(({
        type: 'ticker',
        codes: store.getters.markets.upbit.map(o => o.market),
      }))
      subscribeBinance()
    }

    onMounted(init)

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
          store.getters.markets.upbit.filter(o => o.market.startsWith('KRW')).length)
        ) {
          recalcDisplayedList()
          unwatch()
        }
      },
      { deep: true },
    )

    return {
      connected,
      subscribeUpbit,
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