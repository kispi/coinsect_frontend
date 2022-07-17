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
      <div class="timestamp">
        <button
          @click="callApi"
          class="btn btn-primary m-r-8">
          <i class="fal fa-sync"/>
        </button>
        최종:
        <span v-if="$store.getters.realTimePositions.lastUpdate" class="m-l-4">
          {{
            $store.getters.realTimePositions.lastUpdate ?
            $helpers.dayjs($store.getters.realTimePositions.lastUpdate).format('MM-DD HH:mm') :
            ''
          }}
          <span class="m-l-4 diff" :class="diff.class" v-if="diff.string">({{ diff.string }})</span>
        </span>
      </div>
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
      class="position-group"
      :key="idx"
      v-for="(positionGroup, idx) in [positions.tracked, positions.nonTracked]">
      <div v-if="idx === 1" class="group-title" @click="showUntracked = !showUntracked">모니터링하고 있지 않은 스트리머들<i class="fal m-l-4" :class="showUntracked ? 'fa-chevron-up' : 'fa-chevron-down'"/></div>
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
      유의미한 크기의 포지션을 갖고 있거나 포지션을 알 수 있는 관심 스트리머가 없는 것 같네요 ㅜ.ㅜ
    </div>
    <div class="description">
      <div>* 운영자가 각 방송을 모니터링하며 입력하므로 약간의 지연이 있을 수 있으며, 최신정보임을 보장할 수 없습니다. 업데이트된지 오래된 경우 신뢰하지 마십시오. 어떤 경우이든 재미로만 보시고, 호반꿀이든 짭반꿀이든 <b>절대로 타인의 매매를 참고하여 매매하지 마십시오</b>.</div>
      <div>* 포지션을 클릭하시면 해당 스트리머의 방송국으로 가거나, 포지션 업데이트를 요청하실 수 있습니다.</div>
      <div>* 가능하다면 해당 스트리머의 방송을 실제 시청하여 확인하시기 바랍니다.</div>
      <div>* 포지션 정보는 운영자가 업데이트하면 즉시 반영되고, 5분 간격으로 새로 가져옵니다. 만약 현재 방송으로 보고 있는 포지션과 다른 경우 새로고침을 해보십시오.</div>
      <div>* 포지션의 규모가 너무 작거나(정찰병같은) 거미줄이 체결되는 상황등 포지션 변동이 잦은 경우 모니터링 대상에서 제외될 수 있습니다.</div>
      <div>* 사용되는 시장평균가는 Bybit USDT 마켓 기준이며, Binance, Bitget 또는 MEXC등 타 거래소들에서 산정한 시장평균가와는 차이가 있을 수 있습니다.</div>
    </div>
    <div
      v-if="positions.nonEditable.length > 0"
      class="position-group m-t-40">
      <RouterLink
        to="/contents/public-treasury"
        class="text-underline c-brand-primary display-block m-b-8">
        기관들
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
      to="/"
      class="btn btn-primary bottom">
      김프 보러가기
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

    const apiInterv = ref(null)

    const connection = ref(null)

    const showUntracked = ref(null)

    const sorter = (a, b) => {
      if (a.onAir && b.onAir) return Math.abs(a.$$value) > Math.abs(b.$$value) ? -1 : 1

      if (a.onAir) return -1

      if (!a.onAir && !b.onAir) return a.entryPrice ? -1 : 1
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

    const diff = ref({
      string: null,
      class: null,
    })

    const markets = computed(() => {
      if (!store.getters.realTimePositions) return []

      const o = {}
      store.getters.realTimePositions.data.forEach(position => {
        if (position.contract) o[position.contract] = true
      })
      return Object.keys(o)
    })

    const callApi = async () => {
      try {
        if (connection.value) connection.value.close()
        await store.dispatch('loadRealTimePositions')
        diff.value.string = plugins.$helpers.passedTime(store.getters.realTimePositions.lastUpdate) || ''
        if (plugins.$helpers.dayjs().diff(store.getters.realTimePositions.lastUpdate, 'second') >= 3600) {
          diff.value.class = 'c-danger'
        }
        openWebsocket()
      } catch (e) {}
    }

    const openWebsocket = () => {
      if (markets.value.length === 0) return

      subscribe({ type: 'instrument_info.100ms', markets: markets.value }).then(conn => connection.value = conn)
    }

    const onPositionChange = message => {
      if (!message.meta) return

      const newPosition = message.meta
      const updateTarget = (store.getters.realTimePositions.data || []).find(p => p.id === newPosition.id)
      if (!updateTarget) return

      const keys = ['size', 'entryPrice', 'liqPrice', 'markPrice', 'contract', '$$value', '$$unrealized', 'onAir', 'tracking', 'editable']
      keys.forEach(key => updateTarget[key] = newPosition[key])
    }

    const toggleTradingview = () => {
      const o = store.getters.settings.tradingview
      o.realTimePositions = !o.realTimePositions
      store.commit('setSettings', { tradingview: o })
    }

    onMounted(() => {
      callApi()

      if (store.getters.isSSR) return

      apiInterv.value = setInterval(callApi, 1000 * 60 * 5)

      plugins.$bus.$on('call-api', callApi)
    })

    onUnmounted(() => {
      if (store.getters.isSSR) return

      clearInterval(apiInterv.value)

      if (connection.value) connection.value.close()

      plugins.$bus.$off('call-api', callApi)
    })

    watch(
      () => store.getters.chat.lastWebsocketMessage,
      onPositionChange,
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
      diff,
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

  .timestamp {
    color: var(--text-stress);
    display: flex;
    align-items: center;

    .btn-primary {
      padding: 8px;
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
      height: 280px;
    }

    .positions {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
</style>
