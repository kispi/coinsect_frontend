<template>
  <div class="recent-posts">
    <div
      v-if="postItems.length > 0"
      class="posts-grid">
      <RouterLink
        class="row"
        :to="`/community/${post.sharingKey}`"
        :key="post.id"
        v-for="post in postItems.slice(0, $store.getters.isMobile ? 5 : 10)">
        <div class="title flex-fill lines-1 m-r-32">
          <span class="title-text">
            <span class="elapsed-time f-mono">{{ $helpers.template.elapsedTime(post.createdAt) }}</span>
            <span
              class="badge-board"
              :style="{ background: $helpers.logic.hexToRgba(post.board.$$color, 0.25) }">
              {{ post.board.description }}
            </span>
            <i v-if="(post.$$images || []).length > 0" class="fa fa-image"/>
            <IconYoutube v-if="post.$$thumbnail"/>
            <div class="post-title lines-1">{{ post.title }}</div>
          </span>
          <span v-if="(post.replies || []).length > 0" class="num-replies"> [{{ (post.replies || []).length }}]</span>
        </div>
        <div class="additional-info f-mono">
          <div class="views m-r-16"><i class="fal fa-eye m-r-4"/>{{ post.views }}</div>
          <div class="reactions"><i class="fal fa-thumbs-up m-r-4"/>{{ ((post.summary.reactions || {}).thumbs_up || {}).count || 0 }}</div>
        </div>
      </RouterLink>
    </div>
    <div class="buttons">
      <RouterLink
        class="btn btn-light"
        to="/community">
        <i class="fal fa-chevron-right m-r-8"/>
        {{ $translate('SEE_MORE') }}
      </RouterLink>
      <button
        @click="$modal.custom({
          component: 'ModalPostEditor',
          options: {
            board,
            preventCloseOnClickBackdrop: true,
          },
        })"
        class="btn btn-light">
        <i class="fal fa-pencil m-r-8"/>
        {{ $translate('WRITE') }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['postItems', 'board'],
}
</script>

<style lang="scss">
.recent-posts {
  .posts-grid {
    font-size: 13px;
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

    .badge-board {
      padding: 0 4px;
    }

    .title-text {
      overflow: hidden;
      text-overflow: ellipsis;
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--text-stress);

      .post-title {
        padding-right: 1px; // 윈도우 돋움체에선 끝글자가 ? 등일 때 글씨가 살짝 잘림
      }
    }

    &:hover {
      .post-title {
        text-decoration: underline;
      }
    }
  }

  .buttons {
    display: flex;
    gap: 8px;
    margin-top: 16px;

    > * {
      flex: 1;
    }
  }
}
</style>
