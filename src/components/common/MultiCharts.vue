<template>
  <div class="multi-charts">
    <div
      v-if="$store.getters.charts.length > 0"
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
    <button
      v-if="$store.getters.charts.length < 6"
      class="btn btn-primary btn-block"
      @click="onClickAddChart">
      + {{ $translate('ADD_CHART') }}
    </button>
  </div>
</template>

<script>
import { computed, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import TradingViewSymbols from './TradingViewSymbols'

export default {
  components: { TradingViewSymbols },
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const dynamicGrid = computed(() => {
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

      const preset = ['BINANCE:BTCUSDT', 'FOREXCOM:NSXUSD', 'DXY', 'CRYPTOCAP:BTC.D', 'USOIL', 'UPBIT:BTCKRW/(BINANCE:BTCUSDT*FX_IDC:USDKRW) * 100']
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
    }

    const onClickRemoveChart = idx => {
      store.getters.charts.splice(idx, 1)
      store.commit('setCharts', store.getters.charts)
    }

    return {
      dynamicGrid,
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