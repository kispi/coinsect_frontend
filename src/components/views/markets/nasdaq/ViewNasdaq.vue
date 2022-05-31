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
import NasdaqNaver from './NasdaqNaver'

export default {
  components:{
    NasdaqNaver,
  },
}
</script>