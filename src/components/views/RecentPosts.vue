<template>
  <div class="recent-posts">
    <div class="boards">
      <a
        :draggable="false"
        @click.prevent="onClickBoard(board)"
        class="board"
        :class="{'selected': board.id === (selectedBoard || {}).id}"
        :href="`/community?boardId=${board.id}`"
        :key="board.id"
        v-for="board in $store.getters.boards">
        {{ board.description }}
      </a>
    </div>
    <div
      v-if="posts.data.length > 0"
      class="posts-grid">
      <RouterLink
        class="row"
        :to="`/community/${post.sharingKey}`"
        :key="post.id"
        v-for="post in posts.data.slice(0, $store.getters.isMobile ? 5 : 10)">
        <div class="title flex-fill lines-1 m-r-32">
          <span class="title-text">
            <span class="elapsed-time f-mono">{{ $helpers.template.elapsedTime(post.createdAt) }}</span>
            <i v-if="(post.$$images || []).length > 0" class="fa fa-image c-price-up-bybit"/>
            <div class="lines-1">{{ post.title }}</div>
          </span>
          <span v-if="(post.replies || []).length > 0" class="num-replies"> [{{ (post.replies || []).length }}]</span>
        </div>
        <div class="additional-info f-mono">
          <div class="views m-r-16"><i class="fal fa-eye m-r-4"/>{{ post.views }}</div>
          <div class="reactions"><i class="fal fa-thumbs-up m-r-4"/>{{ ((post.summary.reactions || {}).thumbs_up || {}).count || 0 }}</div>
        </div>
      </RouterLink>
    </div>
    <div
      v-if="selectedBoard"
      class="buttons">
      <RouterLink
        class="btn btn-default btn-write"
        :to="`/community?boardId=${selectedBoard.id}`">
        {{ $translate('SEE_MORE') }}
      </RouterLink>
      <button
        @click="$modal.custom({
          component: 'ModalPostEditor',
          options: {
            boardId: selectedBoard.id,
            preventCloseOnClickBackdrop: true,
          },
        })"
        class="btn btn-brd btn-write">
        <i class="fal fa-pencil m-r-8"/>
        {{ $translate('WRITE') }}
      </button>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import communityService from '@/services/community'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  setup() {
    const { plugins, store } = useGlobalHooks()

    const selectedBoard = ref(null)

    const posts = ref({
      data: [],
      total: 0,
    })

    const onClickBoard = async board => {
      if (selectedBoard.value === board.id) return

      selectedBoard.value = board
      const o = plugins.$helpers.qb().base()
      o.limit(10).where(`post_type = "normal" AND board_id = ${board.id}`)

      try {
        posts.value = await communityService.post.all(o.build())
        await plugins.$helpers.post.populateRenderablePosts(posts.value.data)
      } catch (e) {
        plugins.$toast.error('문제가 발생했습니다 :)')
      }
    }

    onMounted(() => {
      onClickBoard(store.getters.boards[0])
    })

    return {
      selectedBoard,
      posts,
      onClickBoard,
    }
  },
}
</script>

<style lang="scss">
.recent-posts {
  .boards {
    display: flex;
    margin-bottom: 8px;

    .board {
      flex: 1;
      text-align: center;
      max-width: 80px;
      font-size: 12px;
      padding: 4px;
      color: var(--text-light);

      &.selected {
        color: var(--text-stress);
        font-weight: 700;
      }

      &:hover {
        background: var(--background-light);
      }
    }
  }

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
      color: var(--text-stress);
    }

    &:hover {
      .title-text {
        font-weight: 500;
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
