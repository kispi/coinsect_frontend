<template>
  <div class="view-not-found">
    <div class="something-went-wrong">
      페이지를 찾을 수 없습니다 ㅜ.ㅜ
    </div>
    <button @click="onClickBack" class="btn btn-primary">GO BACK</button>
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
    width: 184px;
    margin: 24px;
  }

  .something-went-wrong {
    font-size: 18px;
  }
}
</style>