<template>
  <div class="view-not-found">
    <AppImg :src="$helpers.useS3('og-images/og-image.png')"/>
    <div class="error-404">어떻게 여기 들어오셨어요?</div>
    <button @click="onClickBack" class="btn btn-primary m-a m-t-16">
      김프 보러가기
    </button>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'ViewNotFound',
  setup() {
    const router = useRouter()

    const onClickBack = () => {
      if (window.history.length > 2) router.go(-1)
      else router.pushWithFrom('/')
    }

    return {
      onClickBack,
    }
  },
}
</script>

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