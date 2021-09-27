<template>
  <div class="view-portfolio view-layout-default">
    <div class="description">
      나의 자산을 실시간으로 보여줍니다.<br><br>
      마켓 입력 방식은 다음과 같습니다.<br><br>
      업비트: [거래페어]-[코인심볼], (EX: KRW-BTC, BTC-UNI...)<br>
      바이낸스: [코인심볼][거래페어], (EX: solusdt...)<br><br>
      바이낸스의 경우도 평균매수단가는 원화로 환산해서 입력해주세요.
    </div>
    <CPortfolio/>
  </div>
</template>

<style lang="scss" scoped>
.view-portfolio {
  .description {
    font-size: 12px;
    line-height: 18px;
    margin-bottom: 24px;
    color: var(--text-stress);
  }
}
</style>