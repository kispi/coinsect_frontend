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
import { onMounted } from 'vue'

export default {
  props: {
    dataAdSlot: String,
  },
  setup() {
    const { store } = useGlobalHooks()

    const useGoogleAdSense = process.env.NODE_ENV === 'PRODUCTION' && !store.getters.isSSR

    const init = () => {
      if (store.getters.isSSR || typeof window.adsbygoogle === 'undefined') return

      setTimeout(() => {
        try {
          window.adsbygoogle.push({})
        } catch (e) {}
      }, 1000 + (Math.random() * 1000))
    }

    onMounted(init)

    return {
      useGoogleAdSense,
    }
  },
}
</script>