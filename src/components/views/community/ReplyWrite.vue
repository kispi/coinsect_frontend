<template>
  <div class="reply-write">
    <form>
      <div class="writer-and-password">
        <input v-model="payload.nickname" placeholder="닉네임" class="nickname" autocomplete="reply-nickname">
        <input v-model="payload.password" placeholder="비밀번호" class="password" type="password" autocomplete="reply-password">
      </div>
      <textarea v-model="payload.content" placeholder="내용을 입력해주세요"/>
    </form>
    <div class="reply-functions">
      <button
        @click="onClickCreateReply"
        class="btn btn-primary display-table m-l-a"
        v-html="$translate('등록')"
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
    post: {
      type: Object,
      required: true,
    },
    user: Object,
    parent: Object,
  },
  setup(props) {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const router = useRouter()

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
      if (!payload.value.nickname) {
        plugins.$toast.error('닉네임을 입력하세요')
        return
      }

      if (!payload.value.password) {
        plugins.$toast.error('비밀번호를 입력하세요')
        return
      }

      if (!payload.value.content) {
        plugins.$toast.error('내용을 입력하세요')
        return
      }

      try {
        await crudService.reply.create(payload.value)
        store.dispatch('loadPost', router.currentRoute.value.params.id)
        store.dispatch('loadPosts')
      } catch (e) {
        plugins.$error.toast(e.data.message)
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
  border: 1px solid var(--brand-primary);

  input,
  textarea {
    border: 0;
    padding: 8px;
    border-radius: 0;
  }

  .nickname,
  .password {
    border-bottom: 1px solid var(--border-base);
  }

  .password {
    border-left: 1px solid var(--border-base);
  }

  .writer-and-password {
    display: flex;
  }

  textarea {
    height: 80px;
  }

  .reply-functions {
    border-top: 1px solid var(--border-base);
    padding: 8px;
  }
}
</style>