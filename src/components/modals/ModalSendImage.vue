<template>
  <div
    ref="refModalSendImage"
    class="modal-send-image scrollable-body">
    <ModalHeader :title="'SEND_IMAGE'" @close="$emit('close')"/>
    <div class="body pretty-scrollbar">
      <AppImg v-if="payload.src" :src="payload.src"/>
      <ImageUploader
        v-else
        @upload-file="e => payload = e"
        :path="(options || {}).path"
        :noupload="(options || {}).noupload"
        :resizeWidth="1920"
      />
      <div
        v-if="payload.src"
        class="image-remover center"
        @click="onClickInitPayload">
        <i class="fal fa-times"/>
      </div>
    </div>
    <div class="bottom">
      <button
        class="btn btn-primary"
        :disabled="!payload.file"
        @click="onClickSendImage"
        v-html="$translate('SEND')"
      />
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, onUnmounted, ref, watch } from 'vue'
import s3Service from '@/services/s3'

export default {
  props: ['options'],
  setup(props, { emit }) {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const refModalSendImage = ref(null)

    const payload = ref({
      src: (props.options || {}).src,
      file: (props.options || {}).file,
    })

    const onClickInitPayload = () => {
      payload.value.src = null,
      payload.value.file = null
    }

    const showError = () => plugins.$toast.error('이미지를 보내는 도중에 문제가 발생했습니다. 다시 시도해주세요.')

    const onClickSendImage = async () => {
      if (!payload.value.file) {
        showError()
        emit('close')
        return
      }

      if (!plugins.$helpers.acceptableFileSize(payload.value.file)) return

      try {
        const uploadedUrl = await s3Service.upload(payload.value.file, 'chat')
        emit('close', uploadedUrl)
      } catch (e) {
        showError()
      }
    }

    const onEnter = e => {
      if (e.key !== 'Enter') return

      onClickSendImage()
    }

    onMounted(() => {
      document.addEventListener('keydown', onEnter)
    })

    onUnmounted(() => {
      document.removeEventListener('keydown', onEnter)
    })

    watch(
      () => payload.value,
      () => {
        setTimeout(() => plugins.$modal.center(refModalSendImage.value), 50)
      },
      { deep: true },
    )

    return {
      refModalSendImage,
      payload,
      onClickSendImage,
      onClickInitPayload,
    }
  },
}
</script>

<style lang="scss" scoped>
.modal-send-image {
  width: 480px;

  .body,
  .bottom {
    padding: 16px;
    position: relative;
  }

  .btn {
    width: 100%;
    padding: 12px;
  }

  .image-remover {
    position: absolute;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    top: 24px;
    right: 24px;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
    cursor: pointer;

    .fa-times {
      color: var(--text-stress);
    }

    &:hover {
      background: rgba(0, 0, 0, 0.75);
    }
  }
}
</style>