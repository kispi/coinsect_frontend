<template>
  <div
    v-if="$store.getters.posts.data.length > 0"
    class="recent-posts">
    <div class="posts-grid">
      <RouterLink
        class="row"
        :to="`/community/${post.sharingKey}`"
        :key="post.id"
        v-for="post in $store.getters.posts.data.slice(0, $store.getters.isMobile ? 5 : 10)">
        <div class="title flex-fill lines-1 m-r-32">
          <span @click.prevent="$router.push(`/community?boardId=${post.board.id}`)" class="badge-post-type m-r-8">{{ post.board.description }}</span>
          <span class="title-text">
            <span v-if="$helpers.dayjs().diff(post.createdAt, 'hours') < 24" class="badge-new">N</span>
            {{ post.title }}
          </span>
          <span v-if="(post.replies || []).length > 0" class="num-replies"> [{{ (post.replies || []).length }}]</span>
        </div>
        <div class="additional-info">
          <div class="views m-r-16"><i class="fal fa-eye m-r-4"/>{{ post.views }}</div>
          <div class="reactions"><i class="fal fa-thumbs-up m-r-4"/>{{ ((post.$$reactions || {}).up || {}).count }}</div>
        </div>
      </RouterLink>
    </div>
    <RouterLink :to="'/community'" class="to-community">
      {{ $translate('SEE_MORE') }}<i class="fal fa-chevron-right"/>
    </RouterLink>
  </div>
</template>

<script>
import useGlobalHooks from '@/hooks/global-hooks'
import { onMounted } from 'vue'

export default {
  setup() {
    const { store } = useGlobalHooks()

    const loadRecentPosts = async () => {
      if (store.getters.posts.data.length > 0) return

      try {
        await store.dispatch('loadPosts', { limit: 10 })
      } catch (e) {}
    }

    onMounted(loadRecentPosts)
  },
}
</script>

<style lang="scss">
.recent-posts {
  font-family: Dotum, sans-serif, 'IBM Plex Sans KR';

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

  .badge-post-type {
    white-space: nowrap;
    padding: 0 4px;

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

    .title-text {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &:hover {
      .title-text {
        color: var(--text-stress);
        font-weight: 500;
      }
    }

    .badge-new {
      background: var(--danger);
      font-size: 10px;
      font-weight: 700;
      padding: 0 2px;
    }
  }

  .to-community {
    font-size: 12px;
    margin-left: auto;
    margin-top: 8px;
    display: table;

    i {
      font-size: 10px;
      margin-left: 4px;
    }

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