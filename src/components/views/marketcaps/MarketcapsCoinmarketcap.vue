<template>
  <div 
    v-if="($store.getters.marketcaps || {}).coinmarketcap"
    class="marketcaps-coinmarketcap">
    <table class="list">
      <tr
        class="marketcap"
        :key="idx"
        v-for="(marketcap, idx) in $store.getters.marketcaps.coinmarketcap">
        <td class="rank">{{ idx + 1 }}</td>
        <td class="ticker"></td>
      </tr>
    </table>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()

    onMounted(() => {
      store.dispatch('loadMarketcaps', 'coinmarketcap')
    })
  },
}
</script>

<style lang="scss" scoped>
.marketcaps-coinmarketcap {

}
</style>