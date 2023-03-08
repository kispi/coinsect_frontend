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
            <span class="elapsed-time">{{ $helpers.elapsedTime(post.createdAt) }}</span>
            <i v-if="(post.$$images || []).length > 0" class="fa fa-image c-price-up-bybit"/>
            <div class="lines-1">{{ post.title }}</div>
          </span>
          <span v-if="(post.replies || []).length > 0" class="num-replies"> [{{ (post.replies || []).length }}]</span>
        </div>
        <div class="additional-info">
          <div class="views m-r-16"><i class="fal fa-eye m-r-4"/>{{ post.views }}</div>
          <div class="reactions"><i class="fal fa-thumbs-up m-r-4"/>{{ ((post.$$reactions || {}).up || {}).count }}</div>
        </div>
      </RouterLink>
    </div>
    <div class="flex-row flex-between items-center to-community">
      <RouterLink :to="'/community'" class="m-l-a">
        {{ $translate('SEE_MORE') }}<i class="fal fa-chevron-right"/>
      </RouterLink>
    </div>
  </div>
</template>

<script>
import { onMounted, onServerPrefetch } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  setup() {
    const { store } = useGlobalHooks()

    const loadRecentPosts = async () => {
      try {
        await store.dispatch('loadPosts')
      } catch (e) {}
    }

    onMounted(loadRecentPosts)

    onServerPrefetch(loadRecentPosts)
  },
}
</script>

<style lang="scss">
.recent-posts {
  .posts-grid {
    font-size: 12px;
    display: grid;
    row-gap: 4px;
    column-gap: 40px;
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

    .elapsed-time {
      font-size: 11px;
      opacity: 0.64;
      border-right: 1px solid var(--border-base);
      padding-right: 8px;
    }

    .title-text {
      overflow: hidden;
      text-overflow: ellipsis;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    &:hover {
      .title-text {
        color: var(--text-stress);
        font-weight: 500;
      }
    }
  }

  .to-community {
    font-size: 12px;
    margin-left: auto;
    margin-top: 12px;
    display: flex;
    border-top: 1px solid var(--border-base);
    padding-top: 8px;

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
      grid-auto-columns: 1fr;
      grid-template-rows: repeat(5, 1fr);
      grid-auto-flow: column;
    }
  }
}
</style>
