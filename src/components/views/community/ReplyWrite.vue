<template>
  <div class="reply-write">
    <form>
      <div class="writer-and-password">
        <input
          v-if="!store.getters.me"
          v-model="payload.nickname"
          class="nickname"
          autocomplete="reply-nickname"
          :placeholder="helpers.translate('PLACEHOLDER_NICKNAME')"
          :maxlength="((store.getters.config || {}).maxlength || {}).nickname"
        >
        <div
          v-else
          @click="helpers.modal.custom({ component: 'ModalUserStats', options: { user: store.getters.me } })"
          class="authorized-clickable-nickname p-8">
          <UserSymbol :user="store.getters.me" class="m-r-4"/><span class="lines-1">{{ (store.getters.me.profile || {}).nickname }}</span>
        </div>
        <input
          v-if="!store.getters.me"
          v-model="payload.password"
          :placeholder="helpers.translate('PLACEHOLDER_PASSWORD')"
          class="password"
          type="password"
          autocomplete="reply-password"
          maxlength="8"
        >
      </div>
      <textarea
        @paste="onPaste"
        v-model="payload.content"
        :placeholder="helpers.translate('PLACEHOLDER_CONTENT')"
      />
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
            @click="helpers.modal.images({ images })"
            :src="image"
          />
        </div>
        <button
          v-if="images.length === 0"
          class="btn btn-primary btn-upload-image"
          @click="onClickAddImage"
          :disabled="processing">
          <i class="far fa-image m-r-8"/>{{ helpers.translate('ADD_IMAGE') }}
        </button>
      </div>
      <div class="buttons flex-row">
        <button
          v-if="parent"
          @click="$emit('cancel')"
          class="btn btn-default"
          v-html="helpers.translate('CANCEL')"
        />
        <button
          @click="onClickCreateReply"
          class="btn btn-primary"
          v-html="helpers.translate('SUBMIT_PAYLOAD')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import crudService from '@/services/crud'
import useGlobalHooks from '@/hooks/global-hooks'

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
  user: Object,
  parent: Object,
})

const { helpers, store, router } = useGlobalHooks()

const payload = ref({})

const processing = ref(null)

const images = ref([]) // payload와 별개로 관리

const initPayload = () => {
  images.value = []
  payload.value = {
    nickname: ((helpers.localStorage.getMeta('user') || {}).profile || {}).nickname,
    password: null,
    content: null,
    post: props.post,
    user: props.user,
    parent: props.parent,
  }
}

const onPaste = e => {
  helpers.logic.onPasteClipboardImage(
    e,
    url => {
      if (!url) return

      images.value[0] = url
    })
}

const onClickDeleteImage = idx => {
  helpers.modal.confirm({ body: helpers.translate('MODAL_CONFIRM_DELETE_REPLY_IMAGE') })
    .then(ok => ok ? images.value.splice(idx, 1) : null)
}

const onClickCreateReply = async () => {
  const required = ['nickname', 'content']
  if (!store.getters.me) required.push('password')

  // 굳이 복사하는 이유는 이미지를 content 앞에 붙여넣기 위해서인데, payload를 직접 수정하면 순간적으로 textarea에 업로드된 파일의 주소가 번쩍함.
  const o = {...payload.value}

  // 이미지가 있으면 content 앞에 붙여넣기
  if (images.value.length > 0) {
    const imgTag = `<img src="${images.value[0]}">`
    if (!o.content) o.content = imgTag
    else o.content = `${imgTag}\n\n${o.content}`
  }

  if (required.some(key => {
    if (!o[key]) {
      helpers.toast.error(`PLACEHOLDER_${key.toUpperCase()}`)
      return true
    }
    return !o[key]
  })) return

  try {
    await crudService.reply.create(o)
    store.dispatch('loadPost', router.currentRoute.value.params.sharingKey)
    store.dispatch('loadPosts')
  } catch (e) {
    if (helpers.errorHandlers.bannedUser(e)) return

    helpers.toast.error(e.data.message)
  }
}

const onClickAddImage = () => {
  helpers.modal.custom({
    component: 'ModalUploadImage',
    options: {
      noupload: true,
      uploadDest: 'boards/replies',
    },
  }).then(url => {
    if (!url) return

    images.value[0] = url
  })
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
</script>

<style lang="scss" scoped>
.reply-write {
  border: 1px solid var(--border-base);
  border-radius: 8px;
  overflow: hidden;
  margin: 8px 0;

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
    align-items: center;
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
        overflow: hidden;
        cursor: pointer;
      }
    }
  }
}
</style>