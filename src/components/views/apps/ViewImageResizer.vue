<template>
  <div class="view-image-resizer">
    <div class="description">
      이미지를 압축해서 용량을 줄여보세요.<br>
      WIDTH를 원본보다 크게 설정하면 이미지 용량이 오히려 커질 수 있습니다.
    </div>
    <div class="container">
      <AppImg
        v-if="payload.src"
        :src="payload.src"
        @click="onClickImage"
        class="cursor-pointer"
      />
      <ImageUploader
        v-else
        @upload-file="onUpload"
        :noupload="true"
        :resize="{ ...resizeOption, above: 1 }"
      />
      <div
        v-if="payload.src"
        class="image-remover center"
        @click="payload = {}">
        <i class="fal fa-times"/>
      </div>
    </div>
    <div class="options">
      <div class="form-control">
        <label>WIDTH</label>
        <input v-model="resizeOption.width"/>
      </div>
      <div class="form-control">
        <label>FORMAT</label>
        <AppDropdown
          :dropdownItems="formats"
          @select-dropdown-item="o => resizeOption.format = o.key"
        />
      </div>
      <div class="form-control">
        <label>QUALITY</label>
        <input v-model="resizeOption.quality" min="0" max="1" type="number"/>
      </div>
      <div class="form-control">
        <label>RESAMPLE</label>
        <input v-model="resizeOption.reSample" min="1" max="4" type="number"/>
      </div>
    </div>
    <div
      v-if="payload.originalFile && payload.file"
      class="m-t-40">
      <div>원본크기: {{ asMB(payload.originalFile.size) }}</div>
      <div>압축크기: {{ asMB(payload.file.size) }}</div>
      <div>압축률: {{ Math.floor((payload.originalFile.size - payload.file.size) / payload.originalFile.size * 10000) / 100 }}%</div>
    </div>
    <PoweredBy
      :by="'image-resize'"
      :link="'https://www.npmjs.com/package/image-resize'"
      :imgUrl="'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Npm-logo.svg/800px-Npm-logo.svg.png'"
      class="m-t-24"
    />
  </div>
</template>

<script>
import ImageUploader from '@/components/app/ImageUploader'
import { ref } from 'vue'

export default {
  components: { ImageUploader },
  setup() {
    const payload = ref({})

    const formats = ref(['jpg', 'png', 'webp'].map(key => ({ key, $$selected: key === 'jpg' })))

    const resizeOption = ref({
      width: 1920,
      format: 'jpg',
      quality: 0.75,
      reSample: 2,
    })

    const onUpload = e => {
      payload.value = e
      console.log(e)
    }

    const onClickImage = () => {
      window.open(payload.value.src, '_blank', 'noreferrer')
    }

    const asMB = byte => {
      if (!byte) return

      return `${(Math.ceil(byte / 1048576 * 100) / 100).toLocaleString()} MB`
    }

    return {
      payload,
      formats,
      resizeOption,
      asMB,
      onUpload,
      onClickImage,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-image-resizer {
  max-width: 720px;
  margin: auto;

  .description {
    margin-bottom: 16px;
    text-align: center;
    color: var(--text-stress);
  }

  .container {
    position: relative;
    border: 1px solid var(--border-base);
  }

  .options {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 16px;
    margin-top: 40px;

    label {
      font-size: 12px;
    }

    input,
    .app-dropdown {
      border-radius: 0 !important;
    }
  }
}
</style>