<template>
  <div class="view-kospi">
    <KospiNaver/>
    <PoweredBy :by="'naver'" class="m-t-24"/>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useStore } from 'vuex'
import KospiNaver from './KospiNaver'

export default {
  components:{
    KospiNaver,
  },
  setup() {
    const store = useStore()

    onMounted(() => {
      store.commit('setSettings', { currency: 'krw' })
    })
  },
}
</script>