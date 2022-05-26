<template>
  <div class="modal-sign-in">
    <ModalHeader
      :title="$translate('MODAL_SIGN_IN')"
      @close="$emit('close')"
    />
    <button @click="signIn">카카오</button>
  </div>
</template>

<script>
import useKakao from '@/hooks/oauth/kakao'

export default {
  setup() {
    const { signIn } = useKakao()

    return {
      signIn,
    }
  },
}
</script>