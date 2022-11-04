<template>
  <div class="view-image-moderation">
    <AppLoading :loading="testing"/>
    <div class="description">
      Amazon Rekognition을 사용하여 민감한 이미지를 분류합니다.<br>
      여기서 높은 확률로 문제성이 검출되는 이미지는 채팅으로 업로드할 수 없습니다.
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
      <div v-if="(data || []).length > 0">
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
    <div class="testset pretty-scrollbar">
      <div
        class="image-container"
        :key="o.src"
        v-for="o in testset">
        <AppImg
          @click="onUploadFile({
            src: o.src,
            url: o.src,
          })"
          :src="o.src"
          class="overlay"
        />
      </div>
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

    const testing = ref(null)

    const testset = ref([
      { name: '찐반인가', src: 'https://coinpan.com/files/attach/images/181338187/476/174/249/14fd2ec990bafcac5bfacee54f22c956.jpeg' },
      { name: '톰 하디', src: 'https://pyxis.nymag.com/v1/imgs/bb3/b19/8af5aabd2330e035c03fa67633b0945fcd-18-tom-hardy.2x.rvertical.w330.jpg' },
      { name: '두아 리파', src: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Dua_Lipa_with_Warner_Music_3.png' },
      { name: '살색 의상', src: 'http://thumbnail.10x10.co.kr/webimage/image/add1/201/A002015710_01-12.jpg?cmd=thumb&w=400&h=400&fit=true&ws=false' },
      { name: '톰 하디 흡연', src: 'https://i.pinimg.com/564x/3e/1b/a2/3e1ba2b8f6ed61c4d1b4349390ecbd19.jpg' },
      { name: '음주', src: 'https://d1085v6s0hknp1.cloudfront.net/chat/8e246c16-d9de-48fb-a516-f2d92e1ed48f_20220827_223728.jpg' },
      { name: '포스트 말론 & 도자 캣', src: 'https://stack.com.au/wp-content/uploads/2022/07/postmalonedoja.jpg' },
    ])

    const onUploadFile = async e => {
      url.value = e.url
      try {
        testing.value = true
        const { ModerationLabels } = await rekognitionService.imageModeration.create(url.value)
        data.value = ModerationLabels
      } catch (e) {
        plugins.$toast.error(e.data.message)
      } finally {
        testing.value = false
      }
    }

    const onClickImage = () => {
      window.open(url.value, '_blank', 'noreferrer')
    }

    return {
      url,
      data,
      testing,
      testset,
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

  .testset {
    margin: 40px 0 24px;
    display: flex;
    overflow-x: auto;
    gap: 8px;

    .image-container {
      position: relative;
      min-width: 120px;
      height: 120px;
      border-radius: 16px;
      overflow: hidden;
      cursor: pointer;

      &:not(:hover) {
        .app-img {
          filter: blur(8px);
        }
      }
    }
  }
}
</style>