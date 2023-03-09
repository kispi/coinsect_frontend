<template>
  <div class="view-community">
    <CommunityHeader :withWriteButton="true"/>
    <template v-if="$store.getters.post">
      <CPost/>
      <CommunityButtons/>
    </template>
    <TablePosts/>
  </div>
</template>

<script>
import { computed, onMounted, onServerPrefetch, onUnmounted } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'
import CPost from './CPost'

export default {
  components: { CPost },
  setup() {
    const { plugins, store, router } = useGlobalHooks()

    const sharingKey = computed(() => router.currentRoute.value.params.sharingKey)

    const loadPost = async () => {
      store.commit('setPost', null) // <ViewCommunity/>는 단일 게시물 뿐만 아니라 리스트의 역할도 하기 때문에, 이 뷰가 최초 렌더링될 때는 기존에 로드된 게시물(state.post)을 리셋해준다.
      if (!sharingKey.value) return

      try {
        if ((store.getters.post || {}).sharingKey !== router.currentRoute.value.params.sharingKey) {
          await store.dispatch('loadPost', sharingKey.value)
        }
        plugins.$helpers.meta.setDocumentTitle(store.getters.post.title)
        plugins.$helpers.meta.renderDescription(store.getters.post.content)
        const firstImage = (plugins.$helpers.retrieveImagesFromHTML(store.getters.post.content) || [])[0]
        if (firstImage) plugins.$helpers.meta.renderOgImage(firstImage)
      } catch (e) {
        plugins.$toast.error('존재하지 않는 게시글입니다')
        router.push('/community')
      }
    }

    onServerPrefetch(loadPost)

    onMounted(loadPost)

    onUnmounted(() => store.commit('setPost', null))
  },
}
</script>