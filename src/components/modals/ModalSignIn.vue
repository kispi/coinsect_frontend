<template>
  <div class="modal-sign-in">
    <ModalHeader
      :title="$translate('MODAL_SIGN_IN')"
      @close="$emit('close')"
    />
    <div class="ways-to-login">
      <div
        @click="way.handler"
        class="way"
        :key="way.title"
        v-for="way in waysToLogin">
        <img :src="way.img"/>
        <div v-html="`${way.title} 로그인`"/>
      </div>
    </div>
  </div>
</template>

<script>
import useKakao from '@/hooks/oauth/kakao'

export default {
  setup() {
    const { signIn } = useKakao()

    const waysToLogin = [
      { title: '카카오', handler: signIn, img: 'https://play-lh.googleusercontent.com/Ob9Ys8yKMeyKzZvl3cB9JNSTui1lJwjSKD60IVYnlvU2DsahysGENJE-txiRIW9_72Vd=w240-h480-rw' },
      { title: '네이버', handler: signIn, img: require('@/assets/images/naver.png') },
    ]

    return {
      waysToLogin,
      signIn,
    }
  },
}
</script>

<style lang="scss" scoped>
.modal-sign-in {
  .ways-to-login {
    padding: 24px 16px;
    margin: auto;
    display: table;

    .way {
      display: flex;
      align-items: center;
      font-size: 18px;
      cursor: pointer;

      img {
        margin-right: 8px;
        width: 32px;
        height: 32px;
      }

      &:not(:last-child) {
        margin-bottom: 16px;
      }
    }
  }
}
</style>