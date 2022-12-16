<template>
  <div class="trading-view-ticker">
    <div
      v-if="prepared"
      class="tradingview-widget-container">
      <div class="tradingview-widget-container__widget"></div>
      <component :is="'script'" type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js" async>
        {{ JSON.stringify(options) }}
      </component>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  setup() {
    const { store } = useGlobalHooks()

    const prepared = ref(null)

    const options = computed(() => ({
      symbols: [{
        title: 'S&P 500',
        proName: 'FOREXCOM:SPXUSD',
      }, {
        title: 'NASDAQ 100',
        proName: 'FOREXCOM:NSXUSD',
      }, {
        title: 'KOSPI',
        proName: 'KRX:KOSPI'
      }, {
        title: 'KOSDAQ',
        proName: 'KRX:KOSDAQ'
      }, {
        title: 'GOLD',
        proName: 'GOLD',
      }, {
        title: 'SILVER',
        proName: 'SILVER',
      }],
      colorTheme: store.getters.settings.theme,
      isTransparent: false,
      showSymbolLogo: true,
      locale: store.getters.settings.locale
    }))

    watch([
      () => store.getters.settings.theme,
      () => store.getters.settings.locale,
    ], () => {
      prepared.value = false

      setTimeout(() => prepared.value = true)
    })

    onMounted(() => {
      prepared.value = true
    })

    return {
      prepared,
      options,
    }
  },
}
</script>