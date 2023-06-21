<template
  v-if="useGoogleAdSense">
  <ins
    :style="localStyle"
    class="ad-sense adsbygoogle"
    data-ad-client="ca-pub-3069752836489386"
    data-ad-format="auto"
    :data-ad-slot="dataAdSlot"
    :data-full-width-responsive="responsive"
  />
</template>

<script>
import useGlobalHooks from '@/hooks/global-hooks'
import { onMounted, ref } from 'vue'

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