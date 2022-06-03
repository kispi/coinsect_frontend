<template>
  <div class="view-nasdaq">
    <AdaptiveLayout
      class="m-b-8"
      :gap="8">
      <TradingView
        :symbol="'FOREXCOM:NSXUSD'"
        :interval="1"
      />
      <TradingView
        :symbol="'BINANCE:BTCUSDT'"
        :interval="1"
      />
    </AdaptiveLayout>
    <NasdaqNaver/>
    <PoweredBy :by="'naver'" class="m-t-24"/>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import NasdaqNaver from './NasdaqNaver'

export default {
  components:{
    NasdaqNaver,
  },
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    onMounted(() => {
      store.commit('setSettings', { currency: 'usd' })
      plugins.$toast.success(`
        통화를 USD로 설정합니다. 페이지를 벗어나면 다시 원래 통화로 돌아갑니다.
        또는 상단 <i class='fa fa-cog'></i> 개인화 설정에서 언제든 변경하실 수 있습니다.
      `, 5000)
    })

    onUnmounted(() => {
      store.commit('setSettings', { currency: 'krw' })
    })
  },
}
</script>