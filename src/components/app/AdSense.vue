<template
  v-if="useGoogleAdSense">
  <ins
    :style="localStyle"
    class="ad-sense adsbygoogle"
    data-ad-client="ca-pub-3069752836489386"
    v-bind="responsive ? {
      'data-ad-format': 'auto',
      'data-full-width-responsive': 'true',
    } : null"
    :data-ad-slot="dataAdSlot"
  />
</template>

<script>
import { onMounted, ref } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  props: {
    dataAdSlot: String,
    responsive: Boolean,
  },
  setup() {
    const { store } = useGlobalHooks()

    const useGoogleAdSense = ref(null)

    const localStyle = ref(null)

    const mustLoad = numTrial => {
      if (numTrial > 5) return

      if (typeof window.adsbygoogle === 'undefined') {
        setTimeout(() => mustLoad(numTrial + 1), 1000)
        return
      }

      try {
        window.adsbygoogle.push({})
      } catch (e) {
        console.error('adsense initialization failed:', e)
        setTimeout(() => mustLoad(numTrial + 1), 1000)
      }
    }

    const init = () => {
      if (store.getters.isSSR) return

      useGoogleAdSense.value = process.env.NODE_ENV === 'production'
      if (useGoogleAdSense.value) mustLoad(0)
      else localStyle.value = { background: 'var(--bitcoin)' }
    }

    onMounted(init)

    return {
      localStyle,
      useGoogleAdSense,
    }
  },
}
</script>

<style lang="scss" scoped>
.ad-sense {
  display: block;
  min-height: 80px;
}
</style>