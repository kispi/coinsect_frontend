<template>
  <div class="view-seo">
    <AppLoading :loading="loading"/>
    <div class="description">여러분이 좋아하는 사이트의 주소를 넣고, 메타 데이터를 확인해보세요!</div>
    <div class="btn btn-primary" @click="onClickRecommend" v-html="$translate('랜덤 URL 추천받기')"/>
    <div
      class="input-wrapper width-limiter"
      :class="{'error': error}">
      <i
        @click="onEnter"
        class="fal fa-search m-r-16"
      />
      <input
        ref="refInput"
        v-model="link"
        :placeholder="placeholder"
        @keydown.enter="onEnter"
        @paste="onPaste"
      >
      <i
        v-if="link"
        class="fal fa-times cursor-pointer m-l-16"
        @click="link = null"
      />
    </div>
    <div v-if="error" class="validation-error width-limiter" v-html="error"/>
    <div
      v-if="tried && !error && !loading"
      class="meta-card width-limiter m-t-40"
      @click.prevent="onClickMetaCard(link)">
      <div
        v-if="!meta.title && !meta.image && !meta.description"
        class="empty-meta center">
        <div>
          웹사이트 {{ submitted }}에는<br>
          유의미한 메타 정보(타이틀, 설명, 이미지)가 없네요 :)
        </div>
      </div>
      <i
        class="fal fa-times center"
        @click.stop="initParams"
      />
      <div class="meta-image" :class="{'has-image': meta.image}">
        <AppImg v-if="meta.image" :src="meta.image" class="overlay"/>
        <div v-else class="center p-t-24 p-b-24">웹사이트 {{ submitted }}에는 메타 이미지가 없네요 :)</div>
      </div>
      <div
        v-if="meta.title || meta.description"
        class="meta-info">
        <div v-if="meta.title" class="meta-title" v-html="meta.title"/>
        <div v-if="meta.description" class="meta-description" v-html="meta.description"/>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue'
import useSeo from '@/hooks/seo'

export default {
  setup() {
    const refInput = ref(null)

    const link = ref(null)

    const submitted = ref(null)

    const placeholder = ref(null)

    const loading = ref(null)

    const error = ref(null)

    const tried = ref(null)

    const sites = ref(null)

    const { meta, onClickMetaCard, reset, tryMetaTags, useExamples } = useSeo()

    const initParams = () => {
      link.value = null
      submitted.value = null
      error.value = null
      tried.value = null
      loading.value = null
    }

    const callApi = async () => {
      if (!link.value || loading.value) return

      // 아래 regex를 helpers.dom에서 export해서 쓰면 이상하게 작동함... 브라우저 버그인가?
      if (!link.value.includes('.')) {
        error.value = '입력하신 url이 유효하지 않습니다 :('
        return
      }

      reset()
      try {
        loading.value = true
        tried.value = true
        submitted.value = link.value
        await tryMetaTags(link.value)
      } catch (e) {
        error.value = `정보를 수집하지 못했습니다. 혹시 입력하신 URL(<a href="${link.value}" target="_blank" rel="noopener noreferrer" class="text-underline">${link.value}</a>)이 잘 열리시나요?`
      } finally {
        loading.value = false
      }
    }

    const onPaste = e => {
      setTimeout(() => {
        link.value = e.target.value
        callApi()
      })
    }

    const onEnter = e => {
      if (e) e.target.blur()

      if (!link.value) link.value = placeholder.value

      callApi()
    }

    const onClickRecommend = () => {
      recommend()
      link.value = placeholder.value
      callApi()
    }

    const recommend = () => {
      const newOne = sites.value[Math.floor(Math.random() * sites.value.length)]
      if (newOne === placeholder.value) return recommend()

      placeholder.value = newOne
    }

    const init = async () => {
      try {
        sites.value = await useExamples()
        recommend()
      } catch (e) {}
    }

    onMounted(init)

    watch(
      () => link.value,
      () => {
        error.value = null
      },
    )

    return {
      refInput,
      meta,
      link,
      submitted,
      tried,
      placeholder,
      error,
      loading,
      initParams,
      reset,
      recommend,
      onEnter,
      onPaste,
      onClickRecommend,
      onClickMetaCard,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-seo {
  .description {
    font-size: 14px;
    margin: 16px 0;
    text-align: center;
  }

  .btn-primary {
    display: table;
    margin: 16px auto;
    border-radius: 0;
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    border-radius: 16px;
    padding: 8px 16px;

    i,
    input {
      font-size: 14px;
    }

    i {
      cursor: pointer;

      &:hover {
        color: var(--text-stress);
      }
    }

    &.error {
      border: 1px solid var(--danger);
    }
  }

  .validation-error {
    font-size: 12px;
    line-height: 18px;
    color: var(--danger);
  }

  .meta-card {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.24);
    border: 1px solid var(--border-base);
    position: relative;
    min-height: 80px;
    cursor: pointer;

    .empty-meta {
      text-align: center;
      font-size: 20px;
      line-height: 28px;
      color: var(--text-stress);
      height: 120px;
    }

    .fa-times {
      position: absolute;
      right: 16px;
      top: 16px;
      z-index: 1;
      background: var(--white);
      color: var(--black);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      font-size: 20px;
      cursor: pointer;

      &:hover {
        background: var(--brand-primary-hover-bg);
      }
    }

    .app-loading {
      position: initial;
    }

    .meta-image {
      position: relative;

      &.has-image {
        padding-top: 56.25%;
      }
    }

    .meta-info {
      border-top: 1px solid var(--border-light);
      background: var(--white);
      padding: 8px 12px;
      color: var(--black);

      .meta-title {
        font-size: 12px;
        font-weight: 500;
      }

      .meta-description {
        font-size: 10px;
        line-height: 16px;
      }

      > div:not(:last-child) {
        margin-bottom: 8px;
      }
    }
  }

  .width-limiter {
    width: 100%;
    max-width: 720px;
    margin: auto;
  }

  @media (min-width: 480px) {
    .input-wrapper {
      border-radius: 32px;
      padding: 16px 32px;

      i,
      input {
        font-size: 20px;
      }
    }

    .meta-card {
      .meta-info {
        padding: 16px 24px;

        .meta-title {
          font-size: 20px;
        }

        .meta-description {
          font-size: 14px;
          line-height: 22px;
        }
      }
    }
  }
}
</style>