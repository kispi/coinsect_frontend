<template
  v-if="useGoogleAdSense">
  <ins
    class="ad-sense adsbygoogle"
    data-ad-client="ca-pub-3069752836489386"
    data-ad-format="auto"
    :data-ad-slot="dataAdSlot"
    data-full-width-responsive="true"
  />
</template>

<script>
import useGlobalHooks from '@/hooks/global-hooks'
import { onMounted, ref } from 'vue'

export default {
  props: {
    dataAdSlot: String,
  },
  setup() {
    const { store } = useGlobalHooks()

    const useGoogleAdSense = ref(null)

    const mustLoad = numTrial => {
      if (numTrial > 5) return

      try {
        window.adsbygoogle.push({})
      } catch (e) {
        setTimeout(() => mustLoad(numTrial + 1), 1000)
      }
    }

    const init = () => {
      if (store.getters.isSSR || typeof window.adsbygoogle === 'undefined') return

      useGoogleAdSense.value = process.env.NODE_ENV === 'PRODUCTION' && !store.getters.isSSR
      mustLoad(0)
    }

    onMounted(init)

    return {
      useGoogleAdSense,
    }
  },
}
</script>