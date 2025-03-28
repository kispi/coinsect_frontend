<template>
  <form class="post-editor" @submit.prevent>
    <div class="nickname-password">
      <input
        v-if="!store.getters.me"
        v-model="payload.nickname"
        class="nickname bg-white c-black"
        :placeholder="helpers.translate('PLACEHOLDER_NICKNAME')"
        :maxlength="((store.getters.config || {}).maxlength || {}).nickname"
      >
      <div
        v-else
        @click="helpers.modal.custom({ component: 'ModalUserStats', options: { user: store.getters.me } })"
        class="authorized-user flex-wrap">
        <UserSymbol :user="store.getters.me" class="m-r-4"/><span class="lines-1">{{ (store.getters.me.profile || {}).nickname }}</span>
      </div>
      <input
        v-if="!store.getters.me"
        v-model="payload.password"
        class="password bg-white c-black"
        :placeholder="helpers.translate('PLACEHOLDER_PASSWORD')"
        type="password"
        maxlength="8"
        autocomplete="post-password"
      >
    </div>
    <div class="board-title">
      <AppDropdown v-if="boards && !boardId" :dropdownItems="boards" @select-dropdown-item="onSelectBoard"/>
      <input
        v-model="payload.title"
        class="title bg-white c-black"
        :placeholder="helpers.translate('PLACEHOLDER_TITLE')"
        :maxlength="((store.getters.config || {}).maxlength || {}).title"
      >
    </div>
    <ToastUIEditor v-model="payload.content"/>
    <div class="buttons">
      <button
        @click="$emit('close')"
        class="btn btn-default"
        v-html="helpers.translate('CANCEL')"
      />
      <button
        @click="createPost"
        class="btn btn-primary"
        v-html="helpers.translate('SUBMIT_PAYLOAD')"
      />
    </div>
  </form>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import crudService from '@/services/crud'
import useGlobalHooks from '@/hooks/global-hooks'

const props = defineProps({
  boardId: {
    required: false,
    type: Number,
  },
  post: {
    required: false,
    type: Object,
  },
})

const emit = defineEmits(['close'])

const { helpers, store, router } = useGlobalHooks()

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
  const boardId = props.boardId || parseInt(router.currentRoute.value.query.boardId)
  if (boardId) payload.value.board = { id: boardId }
  if (props.post) payload.value = {...props.post}
  else if (store.getters.me) payload.value.nickname = store.getters.me.profile.nickname
  else payload.value.nickname = ((helpers.localStorage.getMeta('user') || {}).profile || {}).nickname

  if (!payload.value.board) payload.value.board = { id: 1 }
}

const createPost = async () => {
  const required = ['nickname', 'title', 'content']
  if (!store.getters.me) required.push('password')

  if (required.some(key => {
    if (!(payload.value[key] || '').trim()) {
      const dom = document.querySelector(`input.${key}`) || document.querySelector('.ql-container')
      if (dom) {
        dom.scrollIntoView({ behavior: 'smooth' })
        dom.focus()
        helpers.animate.shake(dom)
      }

      helpers.toast.error(`PLACEHOLDER_${key.toUpperCase()}`)
      return true
    }
    return !payload.value[key]
  })) return

  try {
    await crudService.post[payload.value.id ? 'update' : 'create'](payload.value)
    emit('close')
    if (payload.value.sharingKey) {
      store.dispatch('loadPost', payload.value.sharingKey)
      helpers.dom.scrollToTop()
    } else {
      helpers.bus.$emit('write-post', payload.value.board.id)
    }
  } catch (e) {
    if (helpers.errorHandlers.bannedUser(e)) return

    helpers.toast.error(e.data.message)
  }
}

watch(
  () => props.post,
  init,
)

onMounted(init)
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
      width: 144px;
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
      width: 144px;
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