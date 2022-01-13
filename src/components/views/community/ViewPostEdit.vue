<template>
  <div class="view-post-edit">
    <template v-if="post">
      <ButtonCommunity/>
      <PostEditor :post="post"/>
      <TablePosts/>
    </template>
  </div>
</template>

<script>
import { computed, getCurrentInstance, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import communityService from '@/services/community'

export default {
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const router = useRouter()

    const post = computed(() => store.getters.post)

    const sharingKey = router.currentRoute.value.params.sharingKey

    const init = () => {
      store.commit('setPost', null)
      plugins.$modal.input({ title: '비밀번호를 입력하세요', inputType: 'password', autocomplete: 'post-password' })
        .then(value => {
          if (!value) {
            router.go(-1)
            return
          }

          communityService.checkPassword.post({ sharingKey, password: value })
            .then(() => store.dispatch('loadPost', sharingKey))
            .catch(() => {
              plugins.$toast.error(plugins.$translate('INCORRECT_PASSWORD'))
              router.push(`/community/${sharingKey}`)
            })
        })
    }

    onMounted(init)

    return {
      post,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-post-edit {
  
}
</style>