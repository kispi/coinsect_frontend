<template>
  <div class="view-portfolio view-layout-default">
    <div class="description">
      나의 자산을 실시간으로 보여줍니다.<br>
      업비트는 KRW마켓, 바이낸스는 USDT마켓만 지원합니다.<br>
      바이낸스의 경우는 평단을 달러로 입력하시면 현재 환율로 자동 변환됩니다.<br>
      코인의 가격은 해당 거래소의 가격으로 계산되므로, 프리미엄을 반영하고 싶다면 대상 거래소로 코인의 위치를 변경하십시오.
    </div>
    <CPortfolio/>
  </div>
</template>

<style lang="scss" scoped>
.view-portfolio {
  .description {
    font-size: 12px;
    line-height: 20px;
    margin-bottom: 24px;
    color: var(--text-stress);
  }
}
</style>