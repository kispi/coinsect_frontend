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
import { computed, getCurrentInstance, onMounted, onServerPrefetch, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import CPost from './CPost'

export default {
  components: { CPost },
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const router = useRouter()

    const sharingKey = computed(() => router.currentRoute.value.params.sharingKey)

    const loadPost = async () => {
      if (!sharingKey.value) return

      try {
        await store.dispatch('loadPost', sharingKey.value)
        plugins.$helpers.meta.setDocumentTitle(store.getters.post.title)
        plugins.$helpers.meta.renderDescription(store.getters.post.content)
        const firstImage = (plugins.$helpers.retrieveImagesFromHTML(store.getters.post.content) || [])[0]
        if (firstImage) plugins.$helpers.meta.renderOgImage(firstImage)
      } catch (e) {
        plugins.$toast.error('존재하지 않는 게시글입니다')
        router.push('/community')
      }
    }

    watch(
      () => sharingKey.value,
      (newVal, oldVal) => {
        if (newVal === oldVal || !router.currentRoute.value.path.startsWith('/community')) return

        if (!newVal) store.commit('setPost', null)

        loadPost()
      },
    )

    onServerPrefetch(loadPost)

    onMounted(loadPost)
  },
}
</script>