<template>
  <div class="view-community">
    <CommunityHeader :withWriteButton="true"/>
    <template v-if="post">
      <CPost/>
      <CommunityButtons/>
    </template>
    <TablePosts/>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onServerPrefetch, onUnmounted } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'
import CPost from './CPost.vue'

const { helpers, store, router } = useGlobalHooks()

const sharingKey = computed(() => router.currentRoute.value.params.sharingKey)

const post = computed(() => store.getters.post)

const loadPost = async () => {
  if (!sharingKey.value) return

  try {
    if ((post.value || {}).sharingKey !== router.currentRoute.value.params.sharingKey) {
      await store.dispatch('loadPost', sharingKey.value)
    }
    helpers.meta.setDocumentTitle(post.value.title)
    helpers.meta.renderDescription(post.value.content)
    const firstImage = (post.value.$$images || [])[0] || post.value.$$thumbnail
    if (firstImage) helpers.meta.renderOgImage(firstImage)
  } catch (e) {
    helpers.toast.error('존재하지 않는 게시글입니다')
    router.push('/community')
  }
}

onServerPrefetch(loadPost)

onMounted(loadPost)

onUnmounted(() => store.commit('setPost', null))
</script>