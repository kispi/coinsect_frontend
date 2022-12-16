<template>
  <div class="recent-posts">
    <div class="posts-grid">
      <RouterLink
        class="row"
        :to="`/community/${post.sharingKey}`"
        :key="post.id"
        v-for="post in $store.getters.posts.data.slice(0, $store.getters.isMobile ? 5 : 10)">
        <div class="title flex-fill lines-1 m-r-32">
          <span @click.prevent="$router.push(`/community?boardId=${post.board.id}`)" class="post-type m-r-8">{{ post.board.description }}</span>
          <span class="lines-1">{{ post.title }}</span>
          <span v-if="(post.replies || []).length > 0" class="num-replies"> [{{ (post.replies || []).length }}]</span>
        </div>
        <div class="additional-info">
          <div class="views m-r-16"><i class="fal fa-eye m-r-4"/>{{ post.views }}</div>
          <div class="reactions"><i class="fal fa-thumbs-up m-r-4"/>{{ ((post.$$reactions || {}).up || {}).count }}</div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script>
import useGlobalHooks from '@/hooks/global-hooks'
import { onMounted, ref } from 'vue'

export default {
  setup() {
    const { store } = useGlobalHooks()

    const prepared = ref(null)

    const loadRecentPosts = () => store.dispatch('loadPosts', { limit: 10 })

    onMounted(loadRecentPosts)

    return {
      prepared,
    }
  },
}
</script>

<style lang="scss">
.recent-posts {
  border: 1px solid var(--border-base);
  padding: 8px;

  .posts-grid {
    font-size: 12px;
    display: grid;
    grid-row-gap: 8px;
    grid-column-gap: 32px;
  }

  .title,
  .additional-info {
    display: flex;
    align-items: center;
  }

  .additional-info {
    flex: 0 0 auto;
  }

  .num-replies {
    margin-left: 4px;
    color: var(--brand-primary);
  }

  .post-type {
    white-space: nowrap;

    &:hover {
      background: var(--border-light);
    }
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: none;
    overflow: hidden;

    &:hover {
      color: var(--text-stress);
      font-weight: 500;
    }
  }

  @media (min-width: 768px) {
    .posts-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
}
</style>