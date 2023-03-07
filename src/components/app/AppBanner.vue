<template>
  <div class="app-banner">
    <div class="sans-serif">coinsect</div>
    <div class="m-t-80">
      김프 / BJ 포지션 / 차트<br>
      고래 알림 / 경제 캘린더 / 관점 / 뉴스
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-banner {
  background: var(--background-base);
  color: var(--text-stress);
  font-size: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  border: 1px solid var(--white);
  width: 800px;
  height: 400px;
  margin: 40px;

  .sans-serif {
    font-family: 'Ubuntu', sans-serif;
    font-size: 120px;
    line-height: 80px;
  }
}
</style>