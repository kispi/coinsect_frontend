<template>
  <div
    v-if="$store.getters.realTimePositions"
    class="view-real-time-positions">
    <MultiCharts v-if="$store.getters.settings.tradingview.realTimePositions" class="m-b-24"/>
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
      <div
        v-if="idx === 1"
        class="group-title"
        @click="showUntracked = !showUntracked">
        <span>{{ $translate('TRADERS_NOT_MONITORED') }}</span>
        <i class="fal m-l-4" :class="showUntracked ? 'fa-chevron-up' : 'fa-chevron-down'"/>
      </div>
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
import { ref } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'
import useRealTimePosition from '@/hooks/real-time-position'

export default {
  setup() {
    const { store } = useGlobalHooks()

    const { positions, callApi } = useRealTimePosition()

    const showUntracked = ref(null)

    const toggleTradingview = () => {
      const o = store.getters.settings.tradingview
      o.realTimePositions = !o.realTimePositions
      store.commit('setSettings', { tradingview: o })
    }

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

    .btn-primary {
      display: table;
      margin: 16px auto;
    }
  }

  .positions {
    display: grid;
    gap: 8px;
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
