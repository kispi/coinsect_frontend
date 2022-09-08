<template>
  <div
    class="image-uploader"
    @dragover.prevent
    @drop.prevent="onDrop"
    @dragover="dragging = true"
    @dragleave="dragging = false">
    <div class="container">
      <div
        v-if="processing"
        class="centered-overlay loader-container">
        <AppLoader/>
      </div>
      <div class="centered-overlay" :class="{'dragging-over': dragging && !processing}">
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
  props: {
    path: {
      type: String,
      default: 'boards/free_board',
    },
    noupload: {
      type: Boolean, // true일 시, 업로드는 하지 않고 파일의 objectURL과 file 객체만 리턴받는다.
    },
    resizeWidth: null,
  },
  setup(props, { emit }) {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const dragging = ref(null)

    const processing = ref(null)

    const doUpload = async originalFile => {
      let file = originalFile
      try {
        processing.value = true
        file = (props.resizeWidth && originalFile.size >= 1048576) ? await plugins.$helpers.resizeImage(originalFile, props.resizeWidth) : originalFile
      } finally {
        processing.value = false
      }

      try {
        processing.value = true
        let url
        if (!props.noupload) url = await s3Service.upload(file, props.path)
        const emittable = {
          src: URL.createObjectURL(file),
          file,
        }
        if (url) emittable['url'] = url
        emit('upload-file', emittable)
      } catch (e) {
        return Promise.reject(e)
      } finally {
        processing.value = false
      }
    }

    const onDrop = async e => {
      dragging.value = false
      if (!plugins.$helpers.acceptableFileSize(e.dataTransfer.files[0])) return

      try {
        await doUpload(e.dataTransfer.files[0])
      } finally {
        e.target.value = null
      }
    }

    const onChangeFile = e => {
      if (!plugins.$helpers.acceptableFileSize(e.target.files[0])) return

      doUpload(e.target.files[0])
    }

    return {
      onDrop,
      onChangeFile,
      dragging,
      processing,
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