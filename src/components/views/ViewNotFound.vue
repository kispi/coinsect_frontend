<template>
  <div class="view-not-found">
    <AppImg :src="$helpers.withCdn('og-images/og-image.png')"/>
    <div class="error-404">어떻게 여기 들어오셨어요?</div>
    <button @click="$router.replace('/')" class="btn btn-primary m-a m-t-16">
      김프 보러가기
    </button>
  </div>
</template>

<style lang="scss" scoped>
.view-not-found {
  margin: 80px auto;
  max-width: 640px;
  text-align: center;

  img {
    max-width: 480px;
  }

  .error-404 {
    margin: 40px 0;
    font-size: 18px;
    color: var(--text-stress);
  }

  .btn-primary {
    border-radius: 0;
    padding: 12px 40px;
  }
}
</style>