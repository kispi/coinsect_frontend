<template>
  <div class="app-banner">
    <div class="logo">
      <span>coinsect</span>.io
    </div>
    <div class="title">코인<span>忠</span></div>
    <div class="subtitle"><span>Loyal</span> Coiner</div>
    <div class="description">
      <div>실시간 시세 / 프리미엄 / 트레이딩뷰 / 호가창</div>
      <div class="m-t-4">뉴스 / 펀더멘털 / 커뮤니티 ...</div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.app-banner {
  background: var(--background-base);
  color: var(--text-stress);
  font-size: 40px;
  padding: 24px;
  text-align: center;
  justify-content: center;
  border: 1px solid var(--white);
  max-width: 464px;
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
      max-width: 40px;
      margin-right: 8px;
    }
  }

  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 8px;

    span {
      font-family: Gungseo;
      font-weight: 700;
      margin-bottom: 8px;
    }
  }

  .subtitle {
    font-size: 14px;
  }

  .description {
    font-size: 16px;
    margin-top: 16px;
  }
}
</style>