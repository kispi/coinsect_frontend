<template v-if="useGoogleAdSense">
  <ins class="ad-sense adsbygoogle"
    data-ad-client="ca-pub-3069752836489386"
    data-ad-format="auto"
    :data-ad-slot="dataAdSlot"
    data-full-width-responsive="true"
  />
</template>

<script>
import { onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  props: {
    dataAdSlot: String,
  },
  setup() {
    const store = useStore()

    const useGoogleAdSense = process.env.NODE_ENV === 'PRODUCTION' && !store.getters.isSSR

    const init = () => {
      if (typeof adsbygoogle === 'undefined') return

      setTimeout(() => {
        try {
          (adsbygoogle = window.adsbygoogle || []).push({})
        } catch (e) {
          console.error(e)
        }
      }, 1000)
    }

    onMounted(init)

    return {
      useGoogleAdSense,
    }
  },
}
</script>