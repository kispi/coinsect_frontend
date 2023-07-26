<template>
  <div class="view-image-moderation">
    <AppLoading :loading="testing"/>
    <div class="description">
      Amazon Rekognition을 사용하여 민감한 이미지(폭력, 선정성 등 대체로 청소년 유해물에 해당)를 분류합니다.<br>
      여기서 검사 결과가 빨간 박스로 뜨는 이미지는 채팅으로 업로드할 수 없습니다.
    </div>
    <div class="container">
      <AppImg
        v-if="url"
        :src="url"
        :fit="'contain'"
        @click="onClickImage"
        class="cursor-pointer overlay"
      />
      <ImageUploader
        v-else
        @upload-file="onUploadFile"
        :path="'rekognition'"
        :resize="{ above: 1, width: 1920 }"
        class="overlay"
      />
      <div
        v-if="url"
        class="image-remover center"
        @click="reset">
        <i class="fal fa-times"/>
      </div>
    </div>
    <div class="custom-url">
      <div class="input-wrapper">
        <i @click="onEnter" class="fal fa-search m-r-16"/>
        <input
          v-model="url"
          @keydown="onEnter"
          @paste="onPaste"
          placeholder="이미지 링크 또는 클립보드 이미지 붙여넣기"
        />
        <i v-if="url" @click="reset" class="fal fa-times m-l-16"/>
      </div>
    </div>
    <div
      v-if="data"
      class="problems"
      :class="{
        'warning': data.length > 0,
        'danger': data.some(isGraphic),
      }">
      <div
        class="problem"
        :key="idx"
        v-for="(row, idx) in data">
        <div v-if="row.Confidence" class="confidence">확률: {{ Math.round(100 * row.Confidence) / 100 }}%</div>
        <div v-if="row.Name" class="name">분류: {{ row.Name }}</div>
        <div v-if="row.ParentName" class="parent-name">대분류: {{ row.ParentName }}</div>
      </div>
      <div v-if="data.length === 0">문제 없는 이미지입니다.</div>
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
import { ref } from 'vue'
import ImageUploader from '@/components/app/ImageUploader'
import rekognitionService from '@/services/rekognition'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  components: { ImageUploader },
  setup() {
    const { plugins } = useGlobalHooks()

    const url = ref(null)

    const data = ref(null)

    const testing = ref(null)

    const reset = () => {
      url.value = null
      data.value = null
    }

    const isGraphic = row => {
      if (row.Confidence < 90) return

      return ['Nudity', 'Sexual', 'Gore', 'Bodies', 'Corpses'].some(word => (row.Name || row.ParentName || '').includes(word))
    }

    const testset = ref([
      { name: '찐반인가', src: 'https://coinpan.com/files/attach/images/181338187/476/174/249/14fd2ec990bafcac5bfacee54f22c956.jpeg' },
      { name: '톰 하디', src: 'https://pyxis.nymag.com/v1/imgs/bb3/b19/8af5aabd2330e035c03fa67633b0945fcd-18-tom-hardy.2x.rvertical.w330.jpg' },
      { name: '두아 리파', src: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Dua_Lipa_with_Warner_Music_3.png' },
      { name: '살색 의상', src: 'http://thumbnail.10x10.co.kr/webimage/image/add1/201/A002015710_01-12.jpg?cmd=thumb&w=400&h=400&fit=true&ws=false' },
      { name: '톰 하디 흡연', src: 'https://i.pinimg.com/564x/3e/1b/a2/3e1ba2b8f6ed61c4d1b4349390ecbd19.jpg' },
      { name: '음주', src: `${process.env.VUE_APP_CDN}/chat/8e246c16-d9de-48fb-a516-f2d92e1ed48f_20220827_223728.jpg` },
      { name: '포스트 말론 & 도자 캣', src: 'https://stack.com.au/wp-content/uploads/2022/07/postmalonedoja.jpg' },
    ])

    const onPaste = e => {
      plugins.$helpers.logic.onPasteClipboardImage(e, resultUrl => {
        url.value = resultUrl
        onUploadFile({
          src: resultUrl,
          url: resultUrl,
        })
      })

      setTimeout(() => {
        if (e.target.value) {
          url.value = e.target.value
          onUploadFile({ src: url.value, url: url.value })
        }
      })
    }

    const onEnter = e => {
      setTimeout(() => {
        url.value = e.target.value

        if (e.key === 'Enter') onUploadFile({ src: url.value, url: url.value })
      })
    }

    const onUploadFile = async e => {
      url.value = e.url
      plugins.$helpers.dom.scrollToTop()
      try {
        testing.value = true
        const { ModerationLabels } = await rekognitionService.imageModeration.create(url.value)
        data.value = ModerationLabels
      } catch (e) {
        plugins.$toast.error('jpeg, jpg, png 형식의 이미지만 지원됩니다')
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
      reset,
      onUploadFile,
      onClickImage,
      isGraphic,
      onEnter,
      onPaste,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-image-moderation {
  max-width: 720px;
  margin: auto;
  position: relative;

  .description {
    margin-bottom: 16px;
    text-align: center;
    color: var(--text-stress);
  }

  .container {
    position: relative;
    padding-top: 56.25%;

    .app-img {
      border: 1px solid var(--border-base);
    }
  }

  .problems {
    background: var(--success);
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
    margin-top: 40px;

    &.warning {
      background: rgb(255, 187, 17, 0.5);
    }

    &.danger {
      background: rgba(255, 32, 32, 0.5);
    }
  }

  .problem {
    color: var(--text-stress);

    &:not(:last-child) {
      margin-bottom: 24px;
    }
  }

  .testset {
    margin: 40px 0 24px;
    padding-bottom: 8px;
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

  .custom-url {
    margin-top: 16px;

    .input-wrapper {
      display: flex;
      align-items: center;
      padding: 8px 16px;
      border-radius: 24px;

      i {
        font-size: 16px;
        cursor: pointer;
      }
    }
  }
}
</style>