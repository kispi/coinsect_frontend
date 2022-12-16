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
      <div>{{ parent ? `${$helpers.writing.nickname(parent)}님의 댓글에 대한 답글` : '' }}</div>
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

    const payload = ref({})

    const initPayload = () => {
      payload.value = {
        nickname: ((plugins.$helpers.localStorage.getMeta('user') || {}).profile || {}).nickname,
        password: null,
        content: null,
        post: props.post,
        user: props.user,
        parent: props.parent,
      }
    }

    const onClickCreateReply = async () => {
      if (['nickname', 'password', 'content'].some(key => {
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
      payload,
      onClickCreateReply,
    }
  }
}
</script>

<style lang="scss" scoped>
.reply-write {
  border: 1px solid var(--border-base);

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
  }
}
</style>