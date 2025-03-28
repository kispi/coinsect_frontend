<template>
  <div class="view-seo">
    <AppLoading :loading="loading"/>
    <div class="description">여러분이 좋아하는 사이트의 주소를 넣고, 메타 데이터를 확인해보세요!</div>
    <div class="btn btn-primary" @click="onClickRecommend" v-html="helpers.translate('랜덤 URL 추천받기')"/>
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
        @click="() => {
          link = null
          refInput.focus()
        }"
      />
    </div>
    <div v-if="error" class="validation-error width-limiter m-t-8" v-html="error"/>
    <div
      v-if="tried && !error && !loading"
      class="meta-card-container width-limiter m-t-40">
      <i
        class="fal fa-times center"
        @click.stop="initParams"
      />
      <MetaCard :meta="meta" :useBlankGuide="true" :link="submitted"/>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'
import useSeo from '@/hooks/seo'

const { helpers } = useGlobalHooks()

const refInput = ref(null)

const link = ref(null)

const submitted = ref(null)

const placeholder = ref(null)

const loading = ref(null)

const error = ref(null)

const tried = ref(null)

const sites = ref(null)

const { meta, reset, tryMetaTags, useExamples } = useSeo()

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
    error.value = '입력하신 url이 유효하지 않습니다 😥'
    return
  }

  reset()
  try {
    loading.value = true
    tried.value = true
    submitted.value = link.value
    await tryMetaTags(link.value)
  } catch (e) {
    error.value = `정보를 수집하지 못했습니다. 혹시 입력하신 URL(<a href="${link.value}" target="_blank" rel="noreferrer" class="text-underline">${link.value}</a>)이 잘 열리시나요?`
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
</script>

<style lang="scss">
.view-seo {
  .app-loading {
    position: fixed;
  }

  .description {
    font-size: 14px;
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
    color: var(--danger);
  }

  .meta-card-container {
    position: relative;
    min-height: 80px;
    cursor: pointer;

    .fa-times {
      position: absolute;
      right: 8px;
      top: 8px;
      z-index: 1;
      background: var(--white);
      color: var(--black);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      font-size: 24px;
      cursor: pointer;

      &:hover {
        background: var(--border-light);
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

    .meta-card-container {
      .meta-info {
        padding: 16px 24px;

        .meta-title {
          font-size: 20px;
        }

        .meta-description {
          font-size: 14px;
        }
      }
    }
  }
}
</style>