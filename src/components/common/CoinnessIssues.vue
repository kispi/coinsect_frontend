<template>
  <div class="coinness-issues">
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'

export default {
  setup() {
    const issues = ref(null)

    const callApi = async () => {
      try {
        issues.value = plugins.$http.get('contents/news/coinness/issue')
        console.log(issues.value)
      } catch (e) {}
    }

    onMounted(() => {
      callApi()
    })
  },
}
</script>

<style lang="scss" scoped>
.coinness-issues {

}
</style>