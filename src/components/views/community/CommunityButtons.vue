<template>
  <div class="community-buttons">
    <div class="to-list">
      <button
        @click="$router.push('/community')"
        class="btn btn-default"
        v-html="$translate('TO_LIST')"
      />
    </div>
    <div class="c-u-d">
      <button
        @click="button.handler"
        class="btn btn-default"
        :class="button.class"
        v-html="$translate(button.text)"
        :key="button.text"
        v-for="button in buttons"
      />
    </div>
  </div>
</template>

<script>
import { computed, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import communityService from '@/services/community'

export default {
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const router = useRouter()

    const post = computed(() => store.getters.post)

    const handlers = {
      write: () => router.push('/community/write'),
      edit: () => router.push(`/community/edit/${post.value.sharingKey}`),
      delete: () => {
        plugins.$modal.input({ title: '게시글 비밀번호를 입력하세요', inputType: 'password', autocomplete: 'post-password' })
          .then(async password => {
            if (!password) return

            try {
              await communityService.remove.post({ sharingKey: post.value.sharingKey, password })
              await store.dispatch('loadPosts')
              router.push('/community')
            } catch (e) {
              plugins.$toast.error(e.data.message)
            }
          })
      },
    }

    const buttons = computed(() => {
      const arr = [{
        text: 'WRITE',
        handler: handlers.write,
      }]

      if (!post.value) return arr

      if (post.value.postType === 'normal' && plugins.$helpers.canModify(post.value)) {
        arr.push({
          text: 'EDIT',
          handler: handlers.edit,
        })
        arr.push({
          text: 'DELETE',
          handler: handlers.delete,
        })
      }

      return arr
    })

    return {
      buttons,
    }
  },
}
</script>

<style lang="scss" scoped>
.community-buttons {
  padding: 16px 0;
  border-bottom: 1px solid var(--border-base);
  display: flex;
  justify-content: space-between;

  .c-u-d {
    display: flex;

    button {
      width: 64px;

      &:not(:last-child) {
        margin-right: 8px;
      }
    }
  }
}
</style>