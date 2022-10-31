<template>
  <div class="view-post-edit">
    <template v-if="editable">
      <CommunityHeader/>
      <PostEditor :post="post"/>
      <TablePosts/>
    </template>
  </div>
</template>

<script>
import { computed, getCurrentInstance, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import communityService from '@/services/community'

export default {
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const router = useRouter()

    const post = computed(() => store.getters.post)

    const editable = ref(null)

    const sharingKey = router.currentRoute.value.params.sharingKey

    const init = async () => {
      await store.dispatch('loadPost', sharingKey)
      if (store.getters.me && post.value.userId === store.getters.me.id) {
        editable.value = true
        return
      }

      const value = await plugins.$modal.input({ title: '비밀번호를 입력하세요', inputType: 'password', autocomplete: 'post-password' })
      if (!value) {
        router.go(-1)
        return
      }

      try {
        await communityService.checkPassword.post({ sharingKey, password: value })
        post.value.$$originalPassword = value
        editable.value = true
      } catch (e) {
        plugins.$toast.error(plugins.$translate('INCORRECT_PASSWORD'))
        router.push(`/community/${sharingKey}`)
      }
    }

    onMounted(init)

    return {
      post,
      editable,
    }
  },
}
</script>