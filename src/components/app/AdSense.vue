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

    const init = () => {
      if (store.getters.isSSR || typeof window.adsbygoogle === 'undefined') return

      setTimeout(() => {
        try {
          useGoogleAdSense.value = process.env.NODE_ENV === 'PRODUCTION' && !store.getters.isSSR
          window.adsbygoogle.push({})
        } catch (e) {
          console.error(e)
        }
      }, 4000)
    }

    onMounted(init)

    return {
      useGoogleAdSense,
    }
  },
}
</script>