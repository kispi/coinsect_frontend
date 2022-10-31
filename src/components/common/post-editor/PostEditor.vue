<template>
  <div class="post-editor">
    <form class="nickname-and-password" @submit.prevent>
      <input
        v-if="!$store.getters.me"
        v-model="payload.nickname"
        class="nickname bg-white c-black"
        :placeholder="$translate('PLACEHOLDER_NICKNAME')"
        :maxlength="(($store.getters.config || {}).maxlength || {}).nickname"
      >
      <div
        v-else
        class="authorized-user flex-wrap">
        <UserSymbol :user="$store.getters.me" class="m-r-4"/><span class="lines-1">{{ ($store.getters.me.profile || {}).nickname }}</span>
      </div>
      <input
        v-model="payload.password"
        class="password bg-white c-black"
        :placeholder="$translate('PLACEHOLDER_PASSWORD')"
        type="password"
        maxlength="8"
        autocomplete="post-password"
      >
    </form>
    <input
      v-model="payload.title"
      class="title bg-white c-black"
      :placeholder="$translate('PLACEHOLDER_TITLE')"
      :maxlength="(($store.getters.config || {}).maxlength || {}).title"
    >
    <ToastUIEditor v-model="payload.content"/>
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
      else if (store.getters.me) payload.value.nickname = store.getters.me.profile.nickname
      else payload.value.nickname = ((plugins.$helpers.localStorage.getMeta('user') || {}).profile || {}).nickname
    }

    const createPost = async () => {
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

      try {
        await crudService.post[payload.value.id ? 'update' : 'create'](payload.value)
        store.dispatch('loadPosts')
        router.push(
          payload.value.sharingKey ?
          `/community/${payload.value.sharingKey}` :
          '/community',
        )
      } catch (e) {
        if (plugins.$helpers.errorHandlers.bannedUser(e)) return

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
    align-items: center;
    margin-bottom: var(--editor-gap);

    .nickname {
      margin-right: var(--editor-gap);
    }

    .authorized-user {
      display: flex;
      margin-right: var(--editor-gap);
      background: var(--white);
      color: var(--black);
      border-radius: 4px;
      border: 1px solid var(--brand-primary);
    }

    .nickname,
    .authorized-user,
    .password {
      width: 160px;
      height: 36px;
      line-height: 36px;
      padding: 0 8px;
    }
  }

  .title {
    margin-bottom: var(--editor-gap);
  }

  input {
    border-radius: 4px;
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