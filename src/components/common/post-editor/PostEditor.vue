<template>
  <div class="post-editor">
    <form class="nickname-and-password" @submit.prevent>
      <input v-model="payload.nickname" class="nickname" :placeholder="$translate('PLACEHOLDER_NICKNAME')" :maxlength="(($store.getters.config || {}).maxlength || {}).nickname">
      <input v-model="payload.password" class="password" :placeholder="$translate('PLACEHOLDER_PASSWORD')" type="password" autocomplete="post-password">
    </form>
    <input v-model="payload.title" class="title" :placeholder="$translate('PLACEHOLDER_TITLE')" :maxlength="(($store.getters.config || {}).maxlength || {}).title">
    <Quill v-model="payload.content"/>
    <div class="buttons">
      <button
        @click="$router.push('/community')"
        class="btn btn-default"
        v-html="$translate('CANCEL')"
      />
      <button
        @click="createPost"
        class="btn btn-primary"
        v-html="$translate('SUBMIT_PAYLOAD')"
      />
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import crudService from '@/services/crud'

export default {
  props: {
    post: Object,
  },
  setup(props) {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const router = useRouter()

    const payload = ref({})

    const init = () => {
      if (props.post) payload.value = props.post
      else payload.value.nickname = ((plugins.$helpers.localStorage.getMeta('user') || {}).profile || {}).nickname
    }

    const createPost = async () => {
      if (!store.getters.me) {
        if (['nickname', 'password', 'title', 'content'].some(key => {
          if (!(payload.value[key] || '').trim()) {
            const dom = document.querySelector(`input.${key}`) || document.querySelector('.ql-container')
            if (dom) {
              dom.scrollIntoView({ behavior: 'smooth' })
              dom.focus()
              plugins.$animate.shake(dom)
            }

            plugins.$toast.error(`PLACEHOLDER_${key.toUpperCase()}`)
            return true
          }
          return !payload.value[key]
        })) return
      }

      try {
        await crudService.post[payload.value.id ? 'update' : 'create'](payload.value)
        store.dispatch('loadPosts')
        router.push(
          payload.value.id ?
          `/community/${payload.value.id}` :
          '/community',
        )
      } catch (e) {
        plugins.$toast.error(e.data.message)
      }
    }

    watch(
      () => props.post,
      init,
    )

    onMounted(init)

    return {
      payload,
      createPost
    }
  },
}
</script>

<style lang="scss" scoped>
.post-editor {
  --editor-gap: 8px;
  padding-bottom: 32px;

  .nickname-and-password {
    display: flex;
    margin-bottom: var(--editor-gap);

    .nickname {
      margin-right: var(--editor-gap);
    }
  }

  .title {
    margin-bottom: var(--editor-gap);
  }

  textarea {
    height: 320px;
    resize: vertical;
  }

  .buttons {
    display: flex;
    margin-left: auto;
    justify-content: flex-end;
    margin-top: 16px;

    button:not(:last-child) {
      margin-right: var(--editor-gap);
    }
  }
}
</style>