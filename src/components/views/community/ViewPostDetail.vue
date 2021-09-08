<template>
  <div class="view-post-detail view-layout-default">
    <CPost :post="post"/>
    <TablePosts/>
  </div>
</template>

<script>
import { computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import CPost from './CPost'
import TablePosts from './TablePosts'

export default {
  components: { CPost, TablePosts },
  setup() {
    const store = useStore()

    const router = useRouter()

    const post = computed(() => store.getters.post)

    const loadPost = () => store.dispatch('loadPost', router.currentRoute.value.params.id)

    watch(
      () => router.currentRoute.value.params.id,
      (newVal, oldVal) => {
        if (newVal === oldVal) return

        if (router.currentRoute.value.name !== 'ViewPostDetail') return

        loadPost()
      },
    )

    onMounted(loadPost)

    return {
      post,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-post-detail {
  
}
</style>