<template>
  <div
    v-if="$store.getters.realTimeTickers"
    class="real-time-prices default-page-padding">
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
            placeholder="EX:) BIT, CASH, ADA, 토큰"
          >
        </div>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th
            @click="setSort(th.column)"
            :class="settings.sort.column === th.column ? settings.sort.direction : ''"
            :key="th.title"
            v-for="th in [
              { column: '$$symbol', title: 'COIN' },
              { column: '$$tradePriceBase', title: 'CURRENT_PRICE' },
              { column: '$$premiumRate', title: 'PREMIUM' },
              { column: '$$changeRate24H', title: 'CHANGE_RATE_24' },
              { column: '$$changeRate52WH', title: 'CHANGE_RATE_52W_HIGHEST', $$hide: $store.getters.isMobile },
              { column: '$$changeRate52WL', title: 'CHANGE_RATE_52W_LOWEST', $$hide: $store.getters.isMobile },
              { column: '$$vol24H', title: 'VOL_24' },
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
          @click-ticker="setDocumentTitleTicker"
          :ticker="ticker"
          :key="idx"
          v-for="(ticker, idx) in displayedList"
        />
      </tbody>
    </table>
  </div>
</template>

<script>
import { onMounted, ref, computed, onUnmounted, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import RealTimePriceRow from './RealTimePriceRow'
import BaseAndTarget from './BaseAndTarget'
import websocket from '@/hooks/websockets/websocket'

export default {
  components: {
    RealTimePriceRow,
    BaseAndTarget,
  },
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const hooks = {
      upbit: websocket.useUpbit(),
      binance: websocket.useBinance()
    }

    const baseExchange = ref('upbit')

    const targetExchange = ref('binance')

    const setDocumentTitleTicker = ticker => {
      settings.value.documentTitleTicker = ticker.$$symbol
      store.commit('setSettings', settings.value)
      hooks.upbit.setDocumentTitle(ticker)
      plugins.$toast.success(plugins.$translate('TOAST_REAL_TIME_TICKER_SELECTED').replace(/%s/, ticker.$$symbol))
    }

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

    const displayedList = computed(() => {
      const arr = Object.values(store.getters.realTimeTickers)

      return arr.filter(t => {
        if (!keyword.value || !t.$$name) return t

        const lowered = keyword.value.toLowerCase()

        return t.$$name.en.toLowerCase().includes(lowered) ||
          t.$$name.kr.includes(lowered) ||
          t.$$symbol.toLowerCase().includes(lowered)
      }).sort((a, b) => {
        const former = settings.value.sort.direction === 'asc' ? a : b
        const latter = settings.value.sort.direction === 'asc' ? b : a
        if (settings.value.sort.column === '$$symbol') return former.$$symbol > latter.$$symbol ? 1 : -1

        return former[settings.value.sort.column] - latter[settings.value.sort.column]
      })
    })

    const loadSettings = () => {
      try {
        const stored = plugins.$helpers.localStorage.getMeta('settings')
        if (stored.sort) settings.value.sort = stored.sort
        if (stored.documentTitleTicker) settings.value.documentTitleTicker = stored.documentTitleTicker
        store.commit('setSettings', settings.value)
      } catch (e) {}
    }

    onMounted(() => {
      loadSettings()

      store.dispatch('loadMarkets', baseExchange.value).then(() => {
        store.commit('setWebsocket', baseExchange.value)
        hooks.upbit.subscribe()

        store.commit('setWebsocket', targetExchange.value)
        hooks.binance.subscribe()
      })
    })

    onUnmounted(() => {
      store.commit('disconnectWebsocket', baseExchange.value)
    })

    return {
      keyword,
      settings,
      setSort,
      setDocumentTitleTicker,
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
      border-bottom: 1px solid var(--border-base);
    }
  }

  table {
    width: 100%;

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