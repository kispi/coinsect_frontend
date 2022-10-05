<template>
  <div class="view-home">
    <TradingViewTicker
      v-if="$store.getters.settings.tradingview.home"
      class="m-t-8 m-b-8"
    />
    <MultiCharts class="m-b-8"/>
    <div class="row p-b-8">
      <BaseAndTarget/>
      <div
        @click="showPersonalSettings = !showPersonalSettings"
        class="toggle-settings"
        :class="{'active': showPersonalSettings}">
        <i
          class="fa-cog"
          :class="showPersonalSettings ? 'fa' : 'fal'"
        />
        <div v-if="$store.getters.windowInnerWidth >= 480" class="m-l-4">{{ $translate('SETTINGS') }}</div>
      </div>
    </div>
    <SettingsPanel
      v-if="showPersonalSettings"
      :indices="[3, 4, 5, 6]"
    />
    <RealTimePrices v-if="prepared && !$store.getters.isSSR"/>
  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import BaseAndTarget from './real-time-prices//BaseAndTarget'
import RealTimePrices from './real-time-prices/RealTimePrices'

export default {
  components: {
    BaseAndTarget,
    RealTimePrices,
  },
  setup() {
    const store = useStore()

    const prepared = ref(null)

    const showPersonalSettings = ref(null)

    watch([
      () => store.getters.settings.baseExchange,
      () => store.getters.settings.baseExchangeMarket,
    ],
      () => {
        prepared.value = false
        setTimeout(() => prepared.value = true)
      },
    )

    onMounted(() => {
      prepared.value = true
    })

    return {
      showPersonalSettings,
      prepared,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-home {
  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--border-base);
  }

  .settings-panel {
    max-width: 480px;
    margin: 8px auto 0;
  }

  .toggle-settings {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    border: 1px solid var(--border-base);
    padding: 8px;
    border-radius: 4px;
    white-space: nowrap;
    color: var(--text-stress);
    cursor: pointer;

    &:hover {
      background: var(--background-light);
    }

    &.active {
      background: var(--brand-primary-hover-bg);
    }
  }

  .clickable-icon-wrapper {
    .fa-cog {
      font-size: 14px;
    }
  }
}
</style>