<template>
  <form class="post-editor" @submit.prevent>
    <div class="nickname-password">
      <input
        v-if="!$store.getters.me"
        v-model="payload.nickname"
        class="nickname bg-white c-black"
        :placeholder="$translate('PLACEHOLDER_NICKNAME')"
        :maxlength="(($store.getters.config || {}).maxlength || {}).nickname"
      >
      <div
        v-else
        @click="$modal.custom({ component: 'ModalUserStats', options: { user: $store.getters.me } })"
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
    </div>
    <div class="board-title">
      <AppDropdown v-if="boards" :dropdownItems="boards" @select-dropdown-item="onSelectBoard"/>
      <input
        v-model="payload.title"
        class="title bg-white c-black"
        :placeholder="$translate('PLACEHOLDER_TITLE')"
        :maxlength="(($store.getters.config || {}).maxlength || {}).title"
      >
    </div>
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
  </form>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import crudService from '@/services/crud'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  props: {
    post: Object,
  },
  setup(props) {
    const { plugins, store, router } = useGlobalHooks()

    const payload = ref({})

    const boards = computed(() => {
      const arr = store.getters.boards
      if (!arr) return

      return arr.map(o => ({
        key: o.id,
        name: o.description,
        $$selected: o.id === (payload.value.board || {}).id,
      }))
    })

    const onSelectBoard = e => {
      payload.value.board = { id: e.key }
    }

    const init = () => {
      if (props.post) payload.value = props.post
      else if (store.getters.me) payload.value.nickname = store.getters.me.profile.nickname
      else payload.value.nickname = ((plugins.$helpers.localStorage.getMeta('user') || {}).profile || {}).nickname

      if (!payload.value.board) payload.value.board = { id: 1 }
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

    onBeforeRouteLeave((to, from, next) => {
      plugins.$modal.confirm({
        body: plugins.$translate('MODAL_CONFIRM_QUIT_WRITING'),
      }).then(result => result === 1 ? next() : null)
    })

    return {
      payload,
      boards,
      onSelectBoard,
      createPost
    }
  },
}
</script>

<style lang="scss">
.post-editor {
  --editor-gap: 8px;
  padding-bottom: 32px;

  .nickname-password {
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
      cursor: pointer;
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

  .board-title {
    display: flex;
    align-items: center;
    margin-bottom: var(--editor-gap);

    .app-dropdown {
      background: var(--white) !important;
      border-radius: 4px !important;
      margin-right: var(--editor-gap);
      width: 160px;
      flex: 0 0 auto;

      .clickable-area,
      .list-container {
        background: var(--white);
        color: var(--black);
      }
    }
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