<template>
  <div
    v-if="$store.getters.realTimePositions"
    class="view-real-time-positions">
    <AdaptiveLayout
      v-if="$store.getters.settings.tradingview.realTimePositions"
      class="m-b-24"
      :gap="8">
      <TradingView :symbol="'BINANCE:BTCUSDT'" :interval="1"/>
      <TradingView :symbol="'FOREXCOM:NSXUSD'" :interval="1"/>
    </AdaptiveLayout>
    <div class="header">
      <button
        @click="callApi"
        class="btn btn-primary f-12 p-8">
        <i class="fal fa-sync m-r-8"/>
        {{ $translate('REFRESH') }}
      </button>
      <div
        @click="toggleTradingview"
        class="toggle-tradingview">
        <AppToggler
          :modelValue="$store.getters.settings.tradingview.realTimePositions"
          class="no-touch m-r-8"
          :small="$store.getters.isMobile"
        />
        BTC / NASDAQ
      </div>
    </div>
    <div
      v-if="positions.tracked.length === 0"
      class="not-monitoring">
      <div v-html="$translate('RTP_OPERATION')"/>
      <RouterLink
        to="/"
        class="btn btn-primary">
        {{ $translate('GO_TO_KIMP') }}<i class="fal fa-arrow-right m-l-8"/>
      </RouterLink>
    </div>
    <div
      class="position-group"
      :key="idx"
      v-for="(positionGroup, idx) in [positions.tracked, positions.nonTracked]">
      <div v-if="idx === 1" class="group-title" @click="showUntracked = !showUntracked">{{ $translate('TRADERS_NOT_MONITORED') }}<i class="fal m-l-4" :class="showUntracked ? 'fa-chevron-up' : 'fa-chevron-down'"/></div>
      <transition name="slide-down">
        <div
          v-if="showUntracked || idx === 0"
          class="positions">

          <CPosition
            :position="position"
            :key="idx"
            v-for="(position, idx) in positionGroup.filter(p => p.editable)"
          />
        </div>
      </transition>
    </div>
    <div
      v-if="($store.getters.realTimePositions.data || []).filter(o => o.editable).length === 0"
      class="empty">
      {{ $translate('RTP_EMPTY') }}
    </div>
    <div class="description">
      <div :key="num" v-for="num in $helpers.numArray(6)">* {{ $translate(`RTP_DISCLAIMER_${num + 1}`)}}</div>
    </div>
    <div
      v-if="positions.nonEditable.length > 0"
      class="position-group m-t-40">
      <RouterLink
        to="/contents/public-treasury"
        class="text-underline c-brand-primary display-block m-b-8">
        {{ $translate('BIG_ENTITIES') }}
      </RouterLink>
      <div class="positions">
        <CPosition
          :position="position"
          :key="position.name"
          v-for="position in positions.nonEditable"
        />
      </div>
    </div>
    <RouterLink
      v-if="positions.tracked.length > 0"
      to="/"
      class="btn btn-primary bottom">
      {{ $translate('GO_TO_KIMP') }}
    </RouterLink>
  </div>
</template>

<script>
import { onMounted, ref, onUnmounted, watch, computed, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import useBybit from '@/hooks/websockets/bybit'

export default {
  setup() {
    const { subscribe } = useBybit()

    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const rtpTimeout = ref(null)

    const connection = ref(null)

    const showUntracked = ref(null)

    const sorter = (a, b) => {
      if (
        (a.onAir && b.onAir) ||
        (!a.onAir && !b.onAir)
      ) {
        if (a.entryPrice && !b.entryPrice) return -1

        return Math.abs(a.$$value) > Math.abs(b.$$value) ? -1 : 1
      }

      if (a.onAir) return -1
    }

    const positions = computed(() => {
      const editable = []
      const nonEditable = []
      const tracked = []
      const nonTracked = []
      store.getters.realTimePositions.data.forEach(o => {
        if (o.editable) editable.push(o)
        else nonEditable.push(o)

        if (o.tracking) tracked.push(o)
        else nonTracked.push(o)
      })

      const arrays = [editable, nonEditable, tracked, nonTracked]
      arrays.forEach(arr => arr.sort(sorter))

      return {
        editable,
        nonEditable,
        tracked,
        nonTracked
      }
    })

    const markets = ref([])

    const reloadMarkets = () => {
      if (!store.getters.realTimePositions) return []

      const o = {}
      store.getters.realTimePositions.data.forEach(position => {
        if (position.contract) o[position.contract] = true
      })
      markets.value = Object.keys(o)
    }

    const callApi = async () => {
      const chatCon = store.getters.chat.connection
      if (chatCon) chatCon.send(JSON.stringify({ type: 'rtp' }))
      rtpTimeout.value = setTimeout(callApi, 1000 * 5)
    }

    const openWebsocket = () => {
      reloadMarkets()
      if (markets.value.length === 0) return

      subscribe({ type: 'instrument_info.100ms', markets: markets.value }).then(conn => connection.value = conn)
    }

    const onPositionChange = message => {
      if (!message.meta) return

      const newPosition = message.meta
      const updateTarget = (store.getters.realTimePositions.data || []).find(p => p.id === newPosition.id)
      if (!updateTarget) return

      const keys = ['size', 'entryPrice', 'liqPrice', 'markPrice', 'contract', '$$value', '$$unrealized', 'onAir', 'tracking', 'editable', 'lastUpdate']
      keys.forEach(key => updateTarget[key] = newPosition[key])

      reloadMarkets()
      if (connection.value) connection.value.close()
      openWebsocket()
    }

    const toggleTradingview = () => {
      const o = store.getters.settings.tradingview
      o.realTimePositions = !o.realTimePositions
      store.commit('setSettings', { tradingview: o })
    }

    onMounted(() => {
      if (store.getters.isSSR) return

      plugins.$bus.$on('call-api', callApi)
    })

    onUnmounted(() => {
      if (store.getters.isSSR) return

      plugins.$bus.$off('call-api', callApi)

      clearTimeout(rtpTimeout.value)

      if (connection.value) connection.value.close()
    })

    watch(
      () => store.getters.chat.lastWebsocketMessage,
      onPositionChange,
    )

    watch(
      () => store.getters.chat.connected,
      newVal => {
        // timeout이 세팅되기 전에만 실행
        if (newVal && !rtpTimeout.value) callApi()
      },
    )

    watch(
      () => store.getters.realTimePositions,
      newVal => {
        if (!newVal) return

        if (connection.value) connection.value.close()
        openWebsocket()
      },
    )

    watch(
      () => store.getters.instruments.bybit,
      newVal => {
        if (!newVal) return

        store.getters.realTimePositions.data.forEach(position => {
          position.markPrice = parseFloat((newVal[position.contract] || {}).mark_price || 0)
          if (!position.entryPrice) return

          if (position.size > 0) {
            position.$$unrealized = Math.floor(100 * position.size * (position.markPrice - position.entryPrice)) / 100
          }

          if (position.size < 0) {
            position.$$unrealized = Math.floor(100 * position.size * (position.markPrice - position.entryPrice)) / 100
          }

          position.$$value = position.size * position.markPrice
        })
      },
      { deep: true },
    )

    return {
      positions,
      showUntracked,
      callApi,
      toggleTradingview,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-real-time-positions {
  .btn-primary {
    border-radius: 0;
  }

  .not-monitoring {
    margin-top: 40px;
    text-align: center;
    font-size: 12px;
    line-height: 18px;

    .btn-primary {
      display: table;
      margin: 16px auto;
    }
  }

  .positions {
    display: grid;
    grid-gap: 8px;
  }

  .header {
    margin-bottom: 8px;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .toggle-tradingview {
      flex: 0 0 auto;
      display: flex;
      align-items: center;
      color: var(--text-stress);
      cursor: pointer;
    }
  }

  .description {
    font-size: 12px;
    line-height: 20px;
    margin-top: 80px;

    div {
      &:not(:last-child) {
        margin-bottom: 8px;
      }
    }
  }

  .btn-primary.bottom {
    border-radius: 0;
    padding: 20px;
    margin-top: 120px;
  }

  .trading-view {
    height: 240px;
  }

  .position-group {
    .group-title {
      font-size: 14px;
      display: table;
      text-decoration: underline;
      user-select: none;
      margin: 0 auto 16px;
      color: var(--text-stress);
      cursor: pointer;
    }

    &:not(:last-child) {
      margin-bottom: 24px;
    }
  }

  .empty {
    text-align: center;
    margin: 40px 0;
    font-size: 16px;
    line-height: 24px;
    color: var(--text-stress);
  }

  @media (min-width: 768px) {
    .trading-view {
      height: 336px;
    }

    .positions {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
</style>
