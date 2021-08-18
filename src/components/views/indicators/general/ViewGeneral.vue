<template>
  <div class="view-general">
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()

    onMounted(() => {
      store.dispatch('loadLeaderboard')
    })
  },
}
</script>

<style lang="scss" scoped>
.view-general {

}
</style>