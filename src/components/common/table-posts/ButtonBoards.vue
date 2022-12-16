<template>
  <div class="button-boards">
    <button
      @click="$router.push(`/community${board.id ? `?boardId=${board.id}` : ''}`)"
      class="btn btn-brd"
      :class="{'selected': selected(board)}"
      :key="board.id"
      v-for="board in boards"
      v-html="$translate(board.description)"
    />
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

  .btn-brd {
    &:not(.selected) {
      border: 1px solid var(--border-base);
    }
  }
}
</style>