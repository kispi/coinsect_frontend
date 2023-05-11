<template>
  <div
    v-if="posts.data.length > 0"
    class="recent-posts">
    <div class="posts-grid">
      <RouterLink
        class="row"
        :to="`/community/${post.sharingKey}`"
        :key="post.id"
        v-for="post in posts.data.slice(0, $store.getters.isMobile ? 5 : 10)">
        <div class="title flex-fill lines-1 m-r-32">
          <span
            @click.prevent="$router.push(`/community?boardId=${post.board.id}`)"
            class="badge-post-type m-r-8"
            :style="{ background: $helpers.hexToRgba(post.board.$$color, 0.25) }">
            {{ post.board.description }}
          </span>
          <span class="title-text">
            <span class="elapsed-time f-mono">{{ $helpers.elapsedTime(post.createdAt) }}</span>
            <i v-if="(post.$$images || []).length > 0" class="fa fa-image c-price-up-bybit"/>
            <div class="lines-1">{{ post.title }}</div>
          </span>
          <span v-if="(post.replies || []).length > 0" class="num-replies"> [{{ (post.replies || []).length }}]</span>
        </div>
        <div class="additional-info f-mono">
          <div class="views m-r-16"><i class="fal fa-eye m-r-4"/>{{ post.views }}</div>
          <div class="reactions"><i class="fal fa-thumbs-up m-r-4"/>{{ post.summary.reactions.up.count || 0 }}</div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    posts: Object,
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
      background: var(--border-light) !important;
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
}
</style>
