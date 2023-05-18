<template>
  <div
    ref="refModalUploadImage"
    class="modal-upload-image scrollable-body">
    <ModalHeader :title="'UPLOAD_IMAGE'" @close="$emit('close')"/>
    <div class="body pretty-scrollbar">
      <AppImg v-if="payload.src" :src="payload.src"/>
      <ImageUploader
        v-else
        @upload-file="e => payload = e"
        :path="(options || {}).path"
        :noupload="(options || {}).noupload"
        :resize="{ width: 1920, above: 1048576 }"
      />
      <div
        v-if="payload.src"
        class="image-remover center"
        @click="onClickInitPayload">
        <i class="fal fa-times"/>
      </div>
    </div>
    <ul>
      <li>타인에게 불쾌감을 유발할만한 이미지의 업로드는 자제해주세요.</li>
    </ul>
    <div class="bottom">
      <button
        class="btn btn-primary"
        :disabled="!payload.file || uploading"
        @click="onClickSendImage">
        <AppLoader v-if="uploading"/>
        <span v-else v-html="$translate('UPLOAD')"/>
      </button>
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import s3Service from '@/services/s3'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  props: {
    options: {
      src: String,
      file: File,
      uploadDest: String,
    },
  },
  setup(props, { emit }) {
    const { plugins } = useGlobalHooks()

    const refModalUploadImage = ref(null)

    const uploading = ref(null)

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

      try {
        uploading.value = true
        const uploadedUrl = await s3Service.upload(payload.value.file, props.options.uploadDest || 'chat')
        emit('close', uploadedUrl)
      } catch (e) {
        showError()
      } finally {
        uploading.value = false
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
        setTimeout(() => plugins.$modal.center(refModalUploadImage.value), 50)
      },
      { deep: true },
    )

    return {
      refModalUploadImage,
      payload,
      uploading,
      onClickSendImage,
      onClickInitPayload,
    }
  },
}
</script>

<style lang="scss" scoped>
.modal-upload-image {
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

  ul {
    margin-top: 8px;
    padding: 0 32px;

    li {
      list-style-type: disc;
      font-size: 12px;

      &:not(:last-child) {
        margin-bottom: 4px;
      }
    }

    a {
      text-decoration: underline;
      color: var(--danger);
    }
  }
}
</style>