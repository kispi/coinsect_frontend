<template>
  <div class="view-image-moderation">
    <div class="description">
      Amazon Rekognition을 사용하여 민감한 이미지를 분류합니다.
    </div>
    <div class="container">
      <AppImg
        v-if="url"
        :src="url"
        @click="onClickImage"
        class="cursor-pointer"
      />
      <ImageUploader
        v-else
        @upload-file="onUploadFile"
        :path="'rekognition'"
        :resize="{ above: 1 }"
        :accept="['jpg', 'jpeg', 'png']"
        :useURL="true"
      />
      <div
        v-if="url"
        class="image-remover center"
        @click="() => {
          data = null
          url = null
        }">
        <i class="fal fa-times"/>
      </div>
    </div>
    <div
      v-if="data"
      class="problems">
      <div v-if="data.length > 0">
        <div
          class="problem"
          :key="idx"
          v-for="(row, idx) in data">
          <div v-if="row.Confidence" class="confidence">확률: {{ Math.round(100 * row.Confidence) / 100 }}%</div>
          <div v-if="row.Name" class="name">분류: {{ row.Name }}</div>
          <div v-if="row.ParentName" class="parent-name">대분류: {{ row.ParentName }}</div>
        </div>
      </div>
      <div v-else>문제 없는 이미지입니다.</div>
    </div>
    <PoweredBy
      :by="'Amazon Rekognition'"
      :link="'https://us-east-1.console.aws.amazon.com/rekognition'"
      :imgUrl="'https://d1.awsstatic.com/logos/aws-logo-lockups/poweredbyaws/PB_AWS_logo_RGB_stacked_REV_SQ.91cd4af40773cbfbd15577a3c2b8a346fe3e8fa2.png'"
      class="m-t-24"
    />
  </div>
</template>

<script>
import { getCurrentInstance, ref } from 'vue'
import ImageUploader from '@/components/app/ImageUploader'
import rekognitionService from '@/services/rekognition'

export default {
  components: { ImageUploader },
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const url = ref(null)

    const data = ref(null)

    const onUploadFile = async e => {
      url.value = e.url
      try {
        const { ModerationLabels } = await rekognitionService.imageModeration.create(url.value)
        data.value = ModerationLabels
      } catch (e) {
        plugins.$toast.error(e.data.message)
      }
    }

    const onClickImage = () => {
      window.open(url.value, '_blank', 'noreferrer')
    }

    return {
      url,
      data,
      onUploadFile,
      onClickImage,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-image-moderation {
  max-width: 720px;
  margin: auto;

  .description {
    margin-bottom: 16px;
    text-align: center;
    color: var(--text-stress);
  }

  .container {
    position: relative;

    .app-img {
      border: 1px solid var(--border-base);
    }
  }

  .problems {
    background: var(--border-base);
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
    margin-top: 40px;
  }

  .problem {
    color: var(--text-stress);

    &:not(:last-child) {
      margin-bottom: 24px;
    }
  }
}
</style>