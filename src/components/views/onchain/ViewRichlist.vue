<template>
  <div class="view-richlist">
    <TableRichlist
       v-if="$store.getters.richlist.bitcoin"
      :symbol="'BTC'"
      :data="$store.getters.richlist.bitcoin">
      <PoweredBy
        :by="'BitInfoCharts'"
        :link="'https://bitinfocharts.com/top-100-richest-bitcoin-addresses.html'"
        :imgUrl="'https://bitinfocharts.com/logo-1200.jpg'"
      />
    </TableRichlist>
  </div>
</template>

<script>
import { onMounted, onServerPrefetch } from 'vue'
import { useStore } from 'vuex'
import TableRichlist from './TableRichlist'

export default {
  components: { TableRichlist },
  setup() {
    const store = useStore()

    onMounted(() => {
      store.dispatch('loadRichlist')
    })

    onServerPrefetch(() => store.dispatch('loadRichlist'))
  },
}
</script>

<style lang="scss" scoped>
.view-richlist {
  .powered-by {
    margin-top: 8px;
    justify-content: flex-end;
  }
}
</style>