<template>
  <div class="modal-send-image scrollable-body">
    <ModalHeader :title="'SEND_IMAGE'" @close="$emit('close')"/>
    <div class="body pretty-scrollbar">
      <AppImg :src="options.url"/>
    </div>
    <div class="bottom">
      <button
        class="btn btn-primary"
        @click="onClickSendImage"
        v-html="$translate('SEND')"
      />
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue'
import s3Service from '@/services/s3'

export default {
  props: ['options'],
  setup(props, { emit }) {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const onClickSendImage = async () => {
      try {
        const uploadedUrl = await s3Service.upload(props.options.file, 'chat')
        emit('close', uploadedUrl)
      } catch (e) {
        plugins.$toast.error('이미지를 보내는 도중에 문제가 발생했습니다.')
      }
    }

    return {
      onClickSendImage,
    }
  },
}
</script>

<style lang="scss" scoped>
.modal-send-image {
  position: relative;
  width: 480px;

  .body,
  .bottom {
    padding: 16px;
  }

  .btn {
    width: 100%;
    padding: 12px;
  }
}
</style>