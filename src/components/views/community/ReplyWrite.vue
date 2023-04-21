<template>
  <div class="reply-write">
    <form>
      <div class="writer-and-password">
        <input
          v-if="!$store.getters.me"
          v-model="payload.nickname"
          class="nickname"
          autocomplete="reply-nickname"
          :placeholder="$translate('PLACEHOLDER_NICKNAME')"
          :maxlength="(($store.getters.config || {}).maxlength || {}).nickname"
        >
        <div
          v-else
          @click="$modal.custom({ component: 'ModalUserStats', options: { user: $store.getters.me } })"
          class="authorized-clickable-nickname p-8">
          <UserSymbol :user="$store.getters.me" class="m-r-4"/><span class="lines-1">{{ ($store.getters.me.profile || {}).nickname }}</span>
        </div>
        <input
          v-if="!$store.getters.me"
          v-model="payload.password"
          :placeholder="$translate('PLACEHOLDER_PASSWORD')"
          class="password"
          type="password"
          autocomplete="reply-password"
          maxlength="8"
        >
      </div>
      <textarea v-model="payload.content" :placeholder="$translate('PLACEHOLDER_CONTENT')"/>
    </form>
    <div class="reply-functions">
      <div class="reply-images">
        <div
          class="reply-image"
          :key="image"
          v-for="(image, idx) in images">
          <div
            @click="onClickDeleteImage(idx)"
            class="clickable-icon-wrapper center">
            <i class="fal fa-times"/>
          </div>
          <AppImg
            @click="$modal.images({ images })"
            :src="image"
          />
        </div>
        <button
          v-if="images.length === 0"
          class="btn btn-primary btn-upload-image"
          @click="refUploader.click"
          :disabled="processing">
          <i class="far fa-image m-r-8"/>{{ $translate('ADD_IMAGE') }}
          <input
            ref="refUploader"
            class="overlay"
            type="file"
            @change="onChangeFile"
            accept="image/*"
          >
        </button>
      </div>
      <div class="buttons flex-row">
        <button
          v-if="parent"
          @click="$emit('cancel')"
          class="btn btn-default"
          v-html="$translate('CANCEL')"
        />
        <button
          @click="onClickCreateReply"
          class="btn btn-primary"
          v-html="$translate('SUBMIT_PAYLOAD')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue'
import crudService from '@/services/crud'
import s3Service from '@/services/s3'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
    user: Object,
    parent: Object,
  },
  setup(props) {
    const { plugins, store, router } = useGlobalHooks()

    const refUploader = ref(null)

    const payload = ref({})

    const processing = ref(null)

    const images = ref([]) // payload와 별개로 관리

    const initPayload = () => {
      images.value = []
      payload.value = {
        nickname: ((plugins.$helpers.localStorage.getMeta('user') || {}).profile || {}).nickname,
        password: null,
        content: null,
        post: props.post,
        user: props.user,
        parent: props.parent,
      }
    }

    const onChangeFile = async e => {
      const file = e.target.files[0]
      const shouldResize = file > 1048576
      try {
        processing.value = true
        const resized = shouldResize ? await plugins.$helpers.resizeImage({ file, width: 400 }) : file
        // 이미지는 한장만 올릴 수 있도록 구현하되, 여러장 올리는 경우도 고려하기 위해 배열로 관리
        images.value[0] = await s3Service.upload(resized, 'boards/replies')
      } catch (e) {
        return Promise.reject(e)
      } finally {
        e.target.value = null
        processing.value = false
      }
    }

    const onClickDeleteImage = idx => {
      plugins.$modal.confirm({ body: plugins.$translate('MODAL_CONFIRM_DELETE_REPLY_IMAGE') })
        .then(ok => ok ? images.value.splice(idx, 1) : null)
    }

    const onClickCreateReply = async () => {
      const required = ['nickname', 'content']
      if (!store.getters.me) required.push('password')

      // 이미지가 있으면 content 앞에 붙여넣기
      if (images.value.length > 0) {
        const imgTag = `<img src="${images.value[0]}">`
        if (!payload.value.content) payload.value.content = imgTag
        else payload.value.content = `${imgTag}\n\n${payload.value.content}`
      }

      if (required.some(key => {
        if (!payload.value[key]) {
          plugins.$toast.error(`PLACEHOLDER_${key.toUpperCase()}`)
          return true
        }
        return !payload.value[key]
      })) return

      try {
        await crudService.reply.create(payload.value)
        store.dispatch('loadPost', router.currentRoute.value.params.sharingKey)
        store.dispatch('loadPosts')
      } catch (e) {
        if (plugins.$helpers.errorHandlers.bannedUser(e)) return

        plugins.$toast.error(e.data.message)
      }
    }

    watch([
      () => props.post,
      () => props.user,
      () => props.parent,
    ],
      initPayload,
      { deep: true },
    )

    onMounted(initPayload)

    return {
      refUploader,
      processing,
      payload,
      images,
      onChangeFile,
      onClickDeleteImage,
      onClickCreateReply,
    }
  }
}
</script>

<style lang="scss" scoped>
.reply-write {
  border: 1px solid var(--border-base);
  border-radius: 8px;

  .authorized-clickable-nickname,
  .nickname,
  .password {
    width: 160px;
  }

  input,
  textarea {
    border: 0;
    border-radius: 0;
  }

  .nickname,
  .password {
    border-bottom: 1px solid var(--border-base);
  }

  .password {
    border-left: 1px solid var(--border-base);
    border-right: 1px solid var(--border-base);
  }

  .writer-and-password {
    display: flex;
  }

  textarea {
    height: 80px;
    display: block;
  }

  .reply-functions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid var(--border-base);
    padding: 8px;

    button:not(:last-child) {
      margin-right: 8px;
    }

    .btn-upload-image {
      input[type=file] {
        opacity: 0;
        pointer-events: none;
      }
    }

    .reply-images {
      display: flex;
      align-items: center;
      position: relative;

      .clickable-icon-wrapper {
        position: absolute;
        top: 0;
        right: 0;
        width: 32px;
        height: 32px;
        border-radius: 50%;
      }

      .reply-image {
        width: 80px;
        height: 80px;
        border: 1px solid var(--border-base);
        border-radius: 4px;
        cursor: pointer;
      }
    }
  }
}
</style>