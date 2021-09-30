<template>
  <div
    class="image-uploader"
    @dragover.prevent
    @drop.prevent="onDrop"
    @dragover="dragging = true"
    @dragleave="dragging = false">
    <div class="container">
      <div
        v-if="uploading"
        class="centered-overlay loader-container">
        <AppLoader/>
      </div>
      <div class="centered-overlay" :class="{'dragging-over': dragging && !uploading}">
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
      dragging.value = false
      if (!plugins.$helpers.acceptableFileSize(e.dataTransfer.files[0])) return

      file.value = e.dataTransfer.files[0]

      try {
        await doUpload(file.value)
      } finally {
        e.target.value = null
        file.value = null
      }
    }

    const onChangeFile = e => {
      if (!plugins.$helpers.acceptableFileSize(e.target.files[0])) return

      file.value = e.target.files[0]
      doUpload(file.value)
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
  background: var(--brand-primary-hover-bg);

  .container {
    position: relative;
    padding-top: 56.25%;

    .centered-overlay {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      color: var(--text-stress);
      margin: 16px;
      border: 1px dashed var(--border-base);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      user-select: none;

      &:not(.loader-container) {
        &.dragging-over,
        &:hover {
          color: var(--brand-primary);
          border: 1px dashed var(--brand-primary);
        }
      }
    }

    input[type=file] {
      opacity: 0;
      cursor: pointer;
    }
  }

  .guide {
    margin: 16px;
    line-height: 20px;
  }

  i {
    font-size: 80px;
  }

  .loader-container {
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }
}
</style>