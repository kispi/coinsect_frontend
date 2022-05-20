<template>
  <div class="app-banner">
    <div class="logo">
      <span>coinsect</span>.io
    </div>
    <div class="title">코인<span>忠</span></div>
    <div class="subtitle"><span>Loyal</span> Coiner</div>
    <div class="description">
      <div>실시간 시세 / 프리미엄 / 트레이딩뷰 / 호가창</div>
      <div class="m-t-8">뉴스 / 펀더멘털 / 커뮤니티 ...</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-banner {
  background: var(--background-base);
  color: var(--text-stress);
  font-size: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;;
  text-align: center;
  border: 1px solid var(--white);
  max-width: 1200px;
  height: 600px;
  margin: 40px;

  span {
    color: var(--brand-primary);
  }

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;

    img {
      max-width: 80px;
      margin-right: 16px;
    }
  }

  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 16px;

    span {
      font-family: Gungseo;
      font-weight: 700;
      margin-bottom: 16px;
    }
  }

  .subtitle {
    font-size: 28px;
  }

  .description {
    font-size: 32px;
    margin-top: 32px;
  }
}
</style>