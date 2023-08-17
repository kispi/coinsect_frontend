<template>
  <div
    v-if="shouldShowCharts"
    class="multi-charts">
    <div
      v-if="$store.getters.charts.length > 0 && $store.getters.settings.tradingview"
      class="grid m-b-8"
      :style="dynamicGrid">
      <div
        :key="chart"
        v-for="(chart, idx) in $store.getters.charts">
        <div class="chart-header m-b-8">
          <TradingViewSymbols :chartIndex="idx"/>
          <i @click="onClickRemoveChart(idx)" class="fa fa-times center"/>
        </div>
        <TradingView
          :symbol="chart.symbol"
          :interval="chart.interval"
        />
      </div>
    </div>
    <div class="buttons">
      <button
        v-if="$store.getters.charts.length < 6"
        class="btn btn-light"
        @click="onClickAddChart">
        <i class="fal fa-plus m-r-8"/>
        {{ $translate('ADD_CHART') }}
      </button>
      <button
        @click="$store.commit('setSettings', { tradingview: !$store.getters.settings.tradingview })"
        class="btn btn-light">
        <i class="fal m-r-8" :class="$store.getters.settings.tradingview ? 'fa-chevron-up' : 'fa-chevron-down'"/>
        {{ $translate($store.getters.settings.tradingview ? 'CHART_HIDE' : 'CHART_SHOW') }}
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'
import TradingViewSymbols from './TradingViewSymbols'

export default {
  components: { TradingViewSymbols },
  setup() {
    const { plugins, store, router } = useGlobalHooks()

    const shouldShowCharts = computed(() => {
      const p = router.currentRoute.value.path
      const allowed = ['/contents/economic-calendar']
      if (allowed.includes(p)) return true

      return !['/community', '/apps', '/contents'].some(path => p.startsWith(path)) && !['/about'].includes(p)
    })

    const dynamicGrid = computed(() => {
      if (store.getters.settings.chartFullWidth) return {
        'grid-template-columns': 'repeat(1, 1fr)',
      }

      const l = store.getters.charts.length
      const w = store.getters.windowInnerWidth
      if (w < 768 || l === 1) return

      if (w >= 992 && l >= 3) return {
        'grid-template-columns': 'repeat(3, 1fr)',
      }

      return {
        'grid-template-columns': 'repeat(2, 1fr)',
      }
    })

    const onClickAddChart = () => {
      if (store.getters.charts.length >= 6) return

      const preset = ['BINANCE:BTCUSDT', 'FOREXCOM:NSXUSD', 'USDX', 'CRYPTOCAP:BTC.D', 'USOIL', 'UPBIT:BTCKRW/(BINANCE:BTCUSDT*FX_IDC:USDKRW) * 100']
      preset.some(symbol => {
        if (store.getters.charts.every(chart => chart.symbol !== symbol)) {
          store.getters.charts.push({
            symbol,
            interval: 15,
          })
          store.commit('setCharts', store.getters.charts)
          plugins.$helpers.toast.success('차트가 너무 많으면 페이지가 현저히 느려질 수 있습니다.')
          return true
        }
      })
      // 유저가 차트 추가를 눌렀다는 것은 차트를 보고 싶어한다는 것이므로 차트를 보여준다.
      store.commit('setSettings', { tradingview: true })
    }

    const onClickRemoveChart = idx => {
      store.getters.charts.splice(idx, 1)
      store.commit('setCharts', store.getters.charts)
    }

    return {
      dynamicGrid,
      shouldShowCharts,
      onClickAddChart,
      onClickRemoveChart,
    }
  },
}
</script>

<style lang="scss" scoped>
.multi-charts {
  .grid {
    display: grid;
    grid-column-gap: 8px;
    grid-row-gap: 24px;
  }

  .buttons {
    display: flex;
    gap: 8px;
    width: 100%;

    button {
      flex: 1;
      padding: 8px;
    }
  }

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .fa-times {
    width: 24px;
    height: 24px;
    background: var(--border-base);
    border-radius: 50%;
    cursor: pointer;

    &:hover {
      background: var(--border-light);
    }
  }
}
</style>