<template>
  <ins class="ad-sense adsbygoogle"
    data-ad-client="ca-pub-3069752836489386"
    data-ad-format="auto"
    :data-ad-slot="dataAdSlot"
    data-full-width-responsive="true"
  />
</template>

<script>
import { onMounted } from 'vue'

export default {
  props: {
    dataAdSlot: String,
  },
  setup() {
    const init = () => {
      setTimeout(() => {
        try {
          (adsbygoogle = window.adsbygoogle || []).push({})
        } catch (e) {
          console.error(e)
        }
      }, 3000)
    }

    onMounted(init)
  },
}
</script>