<template>
  <div class="view-post-edit view-layout-default">
    <ButtonCommunity/>
    <PostEditor :post="post"/>
    <TablePosts/>
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

    const id = router.currentRoute.value.params.id

    const init = () => {
      plugins.$modal.input({ title: '비밀번호를 입력하세요', inputType: 'password', autocomplete: 'post-password' })
        .then(value => {
          if (!value) {
            router.push('/community')
            return
          }

          communityService.checkPassword.post({ id, password: value })
            .then(() => store.dispatch('loadPost', id))
            .catch(() => {
              plugins.$toast.error(plugins.$translate('INCORRECT_PASSWORD'))
              router.push(`/community/${id}`)
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