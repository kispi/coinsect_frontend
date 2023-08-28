<template>
  <div class="button-boards">
    <button
      @click="$router.push(`/community${board.id ? `?boardId=${board.id}` : ''}`)"
      class="btn btn-light"
      :class="{'selected': selected(board)}"
      :style="{'background': $helpers.logic.hexToRgba(board.$$color, 0.25)}"
      :key="board.id"
      v-for="board in boards">
      <i v-if="selected(board)" class="fa fa-check m-r-4"/>
      {{ $translate(board.description) }}
    </button>
  </div>
</template>

<script>
import { computed } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  setup() {
    const { store, router } = useGlobalHooks()

    const boards = computed(() => [
      { description: 'ALL' },
      ...(store.getters.boards || []),
    ])

    const selected = board => {
      const bid = router.currentRoute.value.query.boardId
      if (!bid) return !board.id

      return board.id === parseInt(bid)
    }

    return {
      boards,
      selected,
    }
  },
}
</script>

<style lang="scss">
.button-boards {
  display: flex;
  margin-bottom: 16px;
  gap: 8px;

  .btn-light {
    border-radius: 0;
    min-width: 64px;
  }
}
</style>