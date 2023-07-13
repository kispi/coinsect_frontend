<template>
  <div class="banner-bingx exchange-banner">
    <div class="img-container">
      <img :src="$helpers.withCdn('images/exchanges/BINGX.png')"/>
    </div>
    <div class="promotion">
      <ul>
        <li>수수료 45% 페이백(= 할인)</li>
        <li>입금액 & 선물거래량에 따라 최대 $5,000 보너스 증정</li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.banner-bingx {
  background: rgba(52, 83, 246);
}
</style>