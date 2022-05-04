<template>
  <div
    v-if="$store.getters.realTimePositions"
    class="view-real-time-positions">
    <AdaptiveLayout
      v-if="$store.getters.settings.tradingview.realTimePositions"
      class="m-b-24"
      :gap="8">
      <TradingView :symbol="'BITSTAMP:BTCUSD'" :interval="1"/>
      <TradingView :symbol="'FOREXCOM:NSXUSD'" :interval="1"/>
    </AdaptiveLayout>
    <div class="header">
      <div class="timestamp">
        업데이트:
        <span v-if="$store.getters.realTimePositions.lastUpdate">
          {{
            $store.getters.realTimePositions.lastUpdate ?
            $helpers.dayjs($store.getters.realTimePositions.lastUpdate).format('YY-MM-DD HH:mm:ss') :
            ''
          }}
          <span class="diff" :class="diff.class" v-if="diff.string">({{ diff.string }})</span>
        </span>
      </div>
      <div
        @click="toggleTradingview"
        class="toggle-tradingview">
        <AppCheckbox :modelValue="$store.getters.settings.tradingview.realTimePositions" class="no-touch"/>
        BTC / NASDAQ
      </div>
    </div>
    <div class="positions">
      <CPosition
        :position="position"
        :key="position.name"
        v-for="position in $store.getters.realTimePositions.data"
      />
    </div>
    <div class="description">
      * 운영자가 각 방송을 모니터링하며 입력하므로 대부분 실시간이지만, 미처 업데이트하지 못하고 잠들었을 수 있으므로 최신 포지션임을 보장할 수 없습니다. 업데이트된지 오래된 경우 신뢰하지 마십시오. 어떤 경우이든 재미로만 보시고, 호반꿀이든 호반반꿀이든 <b class="c-danger">절대로 타인의 매매를 참고하여 매매하지 마십시오</b>.
    </div>
    <RouterLink
      to="/"
      class="btn btn-dark">
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

    const toggleTradingview = () => {
      const o = store.getters.settings.tradingview
      o.realTimePositions = !o.realTimePositions
      store.commit('setSettings', { tradingview: o })
    }

    onMounted(() => {
      callApi()

      if (store.getters.isSSR) return

      apiInterv.value = setInterval(callApi, 1000 * 60 * 5)
    })

    onUnmounted(() => {
      if (store.getters.isSSR) return

      clearInterval(apiInterv.value)

      if (connection.value) connection.value.close()
    })

    watch(
      () => store.getters.instruments.bybit,
      newVal => {
        if (!newVal) return

        store.getters.realTimePositions.data.forEach(position => {
          position.markPrice = parseFloat((newVal[position.contract] || {}).mark_price || 0)
          if (!position.entryPrice) return

          if (position.size > 0) {
            position.unrealized = Math.floor(100 * position.size * (position.markPrice - position.entryPrice)) / 100
          }

          if (position.size < 0) {
            position.unrealized = Math.floor(100 * position.size * (position.markPrice - position.entryPrice)) / 100
          }
        })
      },
      { deep: true },
    )

    return {
      diff,
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
    align-items: baseline;
    justify-content: space-between;

    .toggle-tradingview {
      flex: 0 0 auto;
      display: flex;
      align-items: center;
      color: var(--text-stress);
      cursor: pointer;

      .app-checkbox {
        margin-right: 8px;
      }
    }
  }

  .timestamp {
    color: var(--text-stress);
  }

  .description {
    font-size: 12px;
    line-height: 20px;
    margin-top: 16px;
  }

  .btn-dark {
    border-radius: 0;
    padding: 20px;
    margin-top: 120px;
  }

  .trading-view {
    height: 240px;
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