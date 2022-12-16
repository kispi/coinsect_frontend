<template>
  <div class="view-kospi">
    <KospiNaver/>
    <PoweredBy :by="'naver'" class="m-t-24"/>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'
import KospiNaver from './KospiNaver'

export default {
  components:{
    KospiNaver,
  },
  setup() {
    const { store } = useGlobalHooks()

    onMounted(() => {
      store.commit('setSettings', { currency: 'krw' })
    })
  },
}
</script>