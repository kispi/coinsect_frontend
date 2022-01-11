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
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()

    const prepared = ref(null)

    const options = computed(() => ({
      symbols: [{
        proName: 'FOREXCOM:SPXUSD',
        title: 'S&P 500'
      }, {
        proName: 'FOREXCOM:NSXUSD',
        title: 'US 100'
      }, {
        description: 'KOSPI',
        proName: 'KRX:KOSPI'
      }, {
        description: 'KOSDAQ',
        proName: 'KRX:KOSDAQ'
      }],
      colorTheme: store.getters.settings.theme,
      isTransparent: false,
      showSymbolLogo: true,
      locale: store.getters.translation.locale
    }))

    watch([
      () => store.getters.settings.theme,
      () => store.getters.translation.locale,
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
