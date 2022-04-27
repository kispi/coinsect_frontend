<template>
  <div class="news-coinness-articles">
  </div>
</template>

<script>
import { getCurrentInstance, onMounted } from 'vue'

export default {
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const init = async () => {
      try {
        await plugins.$http.get('contents/news/coinness/articles', { params: { section: 'popularity' }})
      } catch (e) {
        plugins.$toast.error(e.data.message)
      }
    }

    onMounted(init)
  },
}
</script>

<style lang="scss" scoped>
.news-coinness-articles {
  
}
</style>