<template>
  <div class="modal-sign-in">
    <ModalHeader
      :title="helpers.translate('MODAL_SIGN_IN')"
      @close="$emit('close')"
    />
    <div class="body">
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
      <div class="description">
        로그인을 한 상태에서 닉네임을 설정하면, 유일한 고정 닉네임을 가질 수 있습니다.
        또한, 기기가 바뀌거나 브라우저 캐시가 삭제되어도 프로필 이미지와 닉네임이 유지됩니다.
      </div>
    </div>
  </div>
</template>

<script setup>
import useGlobalHooks from '@/hooks/global-hooks'
import useKakao from '@/hooks/oauth/kakao'

const emit = defineEmits(['close'])

const { helpers } = useGlobalHooks()

const { signIn } = useKakao()

const wrapper = signInFunction => async () => {
  try {
    await signInFunction()
    emit('close')
  } catch (e) {
    helpers.toast.error('소셜 로그인 과정에서 문제가 발생했습니다. 아마도 연동 계정에서 이메일 정보를 가져올 수 없는 것 같습니다 😢')
  }
}

const waysToLogin = [
  { title: '카카오', handler: wrapper(signIn), img: 'https://play-lh.googleusercontent.com/Ob9Ys8yKMeyKzZvl3cB9JNSTui1lJwjSKD60IVYnlvU2DsahysGENJE-txiRIW9_72Vd=w240-h480-rw' },
  // { title: '네이버', handler: signIn, img: require('@/assets/images/naver.png') },
]
</script>

<style lang="scss" scoped>
.modal-sign-in {
  .body {
    padding: 16px;
  }

  .description {
    margin-top: 24px;
    font-size: 12px;
  }

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

      &:hover {
        font-weight: 700;
      }
    }
  }
}
</style>