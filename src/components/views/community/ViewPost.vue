<template>
  <div class="view-post view-layout-default">
    <ButtonCommunity/>
    <CPost/>
    <CommunityButtons/>
    <TablePosts/>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, onServerPrefetch, watch } from 'vue'
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
        await store.dispatch('loadPost', router.currentRoute.value.params.sharingKey)
      } catch (e) {
        plugins.$toast.error('존재하지 않는 게시글입니다')
        router.push('/community')
      }
    }

    watch(
      () => router.currentRoute.value.params.sharingKey,
      (newVal, oldVal) => {
        if (newVal === oldVal) return

        if (router.currentRoute.value.name !== 'ViewPost') return

        loadPost()
      },
    )

    onServerPrefetch(async () => {
      await loadPost()
      try {
        plugins.$helpers.meta.setDocumentTitle(store.getters.post.title)
        plugins.$helpers.meta.renderDescription(store.getters.post.content)

        const firstImage = (plugins.$helpers.retrieveImagesFromHTML(store.getters.post.content) || [])[0]
        if (firstImage) plugins.$helpers.meta.renderOgImage(firstImage)
      } catch (e) {}
    })

    onMounted(loadPost)
  },
}
</script>