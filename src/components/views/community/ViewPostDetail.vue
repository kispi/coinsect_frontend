<template>
  <div
    v-if="$store.getters.post"
    class="view-post-detail view-layout-default">
    <ButtonCommunity/>
    <CPost/>
    <CommunityButtons/>
    <TablePosts/>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import CPost from './CPost'

export default {
  components: { CPost },
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const router = useRouter()

    const loadPost = async () => {
      try {
        await store.dispatch('loadPost', router.currentRoute.value.params.id)
      } catch (e) {
        plugins.$toast.error('존재하지 않는 게시글입니다')
        router.push('/community')
      }
    }

    watch(
      () => router.currentRoute.value.params.id,
      (newVal, oldVal) => {
        if (newVal === oldVal) return

        if (router.currentRoute.value.name !== 'ViewPostDetail') return

        loadPost()
      },
    )

    onMounted(loadPost)
  },
}
</script>