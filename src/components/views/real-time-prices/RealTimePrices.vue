<template>
  <div
    v-if="$store.getters.realTimeTickers[baseExchange]"
    class="real-time-prices default-page-padding">
    <div class="settings">
      <BaseAndTarget
        @change-base-exchange="e => baseExchange = e"
        @change-target-exchange="e => targetExchange = e"
      />
      <div class="total-and-search">
        <div>총 {{ $store.getters.realTimeTickers[baseExchange].length }} 암호자산</div>
        <div class="input-wrapper">
          <i class="fal fa-search"/>
          <input
            v-model="keyword"
            @keydown="onKeydown"
            placeholder="EX:) BIT, CASH, ADA, 토큰"
          >
        </div>
      </div>
    </div>
    <table>
      <thead>
        <th
          @click="setSort(th.column)"
          :class="sort.column === th.column ? sort.direction : ''"
          :key="th.title"
          v-for="th in [
            { column: '$$symbol', title: 'COIN' },
            { column: 'trade_price', title: 'CURRENT_PRICE' },
            { column: 'signed_change_rate', title: 'CHANGE_RATE_24' },
            { column: '$$changeRate52WH', title: 'CHANGE_RATE_52W_HIGHEST', $$hide: $store.getters.isMobile },
            { column: '$$changeRate52WL', title: 'CHANGE_RATE_52W_LOWEST', $$hide: $store.getters.isMobile },
            { column: 'acc_trade_price_24h', title: 'VOL_24' },
          ].filter(o => !o.$$hide)">
          {{ $translate(th.title) }}
          <span class="sort-icons">
            <i class="fas fa-sort-up"/>
            <i class="fas fa-sort-down"/>
          </span>
        </th>
      </thead>
      <tbody>
        <RealTimePriceRow
          :ticker="ticker"
          :key="idx"
          v-for="(ticker, idx) in displayedList"
        />
      </tbody>
    </table>
  </div>
</template>

<script>
import { onMounted, ref, computed, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import RealTimePriceRow from './RealTimePriceRow'
import BaseAndTarget from './BaseAndTarget'
import useWebsocket from '@/hooks/websocket'

export default {
  components: {
    RealTimePriceRow,
    BaseAndTarget,
  },
  setup() {
    const store = useStore()

    const baseExchange = ref('upbit')

    const targetExchange = ref('binance')

    const { subscribe } = useWebsocket()

    const sort = ref({
      column: 'acc_trade_price_24h', // 'acc_trade_price_24h', 'signed_change_rate', '$$symbol', 'trade_price'
      direction: 'desc',
    })

    const setSort = column => {
      if (sort.value.column === column) {
        sort.value.direction = sort.value.direction === 'desc' ? 'asc' : 'desc'
      } else {
        sort.value.column = column
        sort.value.direction = 'desc'
      }

      window.localStorage.setItem('settings', JSON.stringify({
        sort: sort.value,
      }))
    }

    const keyword = ref('')

    const onKeydown = e => {
      setTimeout(() => {
        keyword.value = e.target.value
      })
    }

    const displayedList = computed(() => {
      return store.getters.realTimeTickers[baseExchange.value].filter(t => {
        if (!keyword.value || !t.$$name) return t

        const lowered = keyword.value.toLowerCase()

        return t.$$name.en.toLowerCase().includes(lowered) ||
          t.$$name.kr.includes(lowered) ||
          t.$$symbol.toLowerCase().includes(lowered)
      }).sort((a, b) => {
        const former = sort.value.direction === 'asc' ? a : b
        const latter = sort.value.direction === 'asc' ? b : a
        if (sort.value.column === '$$symbol') return former.$$symbol > latter.$$symbol ? 1 : -1

        return former[sort.value.column] - latter[sort.value.column]
      })
    })

    const useStoredSettings = () => {
      try {
        const settings = JSON.parse(window.localStorage.getItem('settings') || '{}')
        if (settings.sort) sort.value = settings.sort
      } catch (e) {}
    }

    onMounted(() => {
      useStoredSettings()

      store.dispatch('loadMarkets', baseExchange.value).then(() => {
        store.commit('setWebsocket', baseExchange.value)
        subscribe[baseExchange.value]()
      })
    })

    onUnmounted(() => {
      store.commit('disconnectWebsocket', baseExchange.value)
    })

    return {
      keyword,
      sort,
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
  max-width: 1200px;
  margin: auto;

  @media (max-width: 767px) {
    font-size: 12px;
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

        .fa-search {
          margin-right: 8px;
        }
      }
    }

    .base-and-target {
      padding-bottom: 8px;
      border-bottom: 1px solid var(--gray-border);
    }
  }

  table {
    border-collapse: collapse;
    width: 100%;

    th {
      cursor: pointer;
      white-space: nowrap;

      .sort-icons {
        position: relative;
        margin-left: 4px;
        padding-right: 8px;

        @media (max-width: 767px) {
          padding-right: 4px;
        }

        i {
          color: var(--gray-light);
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
        }
      }

      &.desc,
      &.asc {
        font-weight: 700;
        color: var(--black-light);
      }

      &.desc .fa-sort-down,
      &.asc .fa-sort-up {
        color: var(--gray-dark);
      }
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