<template>
  <div
    class="image-uploader"
    :class="{'dragging-over': dragging}"
    @dragover.prevent
    @drop.prevent="onDrop"
    @dragover="dragging = true"
    @dragleave="dragging = false">
    <div v-if="uploading" class="loader-overlay overlay center"><AppLoader/></div>
    <div class="container overlay">
      <i class="fal fa-image"/>
      <div class="guide">
        <div>이미지를 여기 끌어다 놓거나<br>클릭해서 내 컴퓨터에서 찾기</div>
      </div>
      <input
        class="overlay"
        type="file"
        @change="onChangeFile"
        accept="image/*"
      >
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, ref } from 'vue'
import s3Service from '@/services/s3'

export default {
  setup(_, { emit }) {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const file = ref(null)

    const dragging = ref(null)

    const uploading = ref(null)

    const validate = givenFile => plugins.$helpers.acceptableFileSize(givenFile)

    const doUpload = async file => {
      try {
        uploading.value = true
        const url = await s3Service.upload(file)
        emit('upload-file', {
          url,
          src: URL.createObjectURL(file),
        })
      } catch (e) {
        return Promise.reject(e)
      } finally {
        uploading.value = false
      }
    }

    const onDrop = async e => {
      if (!validate(e.dataTransfer.files[0])) return

      file.value = e.dataTransfer.files[0]
      dragging.value = false

      try {
        const blob = await plugins.$helpers.resizeImage({ imageFile: file.value })
        const newFile = new File([blob], file.value.name, { type: 'image/jpeg' })
        await doUpload(newFile)
      } finally {
        e.target.value = null
        file.value = null
      }
    }

    const onChangeFile = e => {
      if (!validate(e.target.files[0])) return

      file.value = e.target.files[0]
      doUpload(e)
    }

    return {
      onDrop,
      onChangeFile,
      dragging,
      uploading,
      file,
    }
  },
}
</script>

<style lang="scss" scoped>
.image-uploader {
  padding-top: 56.25%;
  position: relative;
  background: var(--brand-primary-hover-bg);
  min-height: 240px;

  .container {
    margin: 16px;
    border: 1px dashed var(--border-base);
    color: var(--text-stress);
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    user-select: none;

    input[type=file] {
      opacity: 0;
      cursor: pointer;
    }
  }

  &.dragging-over,
  &:hover {
    background: var(--brand-primary-hover-bg);

    .container {
      color: var(--brand-primary);
      border: 1px dashed var(--brand-primary);
    }
  }

  .guide {
    margin: 16px;
    line-height: 20px;
  }

  i {
    font-size: 80px;
  }

  .loader-overlay {
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }
}
</style>