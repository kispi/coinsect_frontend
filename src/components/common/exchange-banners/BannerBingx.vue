<template>
  <div class="banner-bingx exchange-banner">
    <div class="img-container">
      <img :src="$helpers.withCdn('images/exchanges/BINGX.png')"/>
    </div>
    <div class="promotion">
      <ul>
        <li>수수료 45% 페이백(= 할인)</li>
        <li>입금액 & 선물거래량에 따라 최대 5,000 USDT 보너스 (기본이벤트)</li>
        <li v-if="$helpers.dayjs().isBefore('2023-08-01')">신규가입 증정금 이벤트(600 USDT) + 입금 이벤트(500 USDT)</li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.banner-bingx {
  background: rgba(52, 83, 246);
}
</style>