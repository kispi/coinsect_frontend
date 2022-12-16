<template>
  <div class="community-header">
    <div class="top">
      <RouterLink to="/community" v-html="$translate('COMMUNITY')" class="button-community"/>
      <button
        v-if="withWriteButton"
        @click="$router.push('/community/write')"
        class="btn btn-primary"
        v-html="$translate('WRITE')"
      />
    </div>
    <div class="boards">
      <button
        @click="$router.push(`/community${board.id ? `?boardId=${board.id}` : ''}`)"
        class="btn btn-brd"
        :class="{'selected': selected(board)}"
        :key="board.id"
        v-for="board in boards"
        v-html="$translate(board.description)"
      />
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  props: {
    withWriteButton: Boolean,
  },
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
  }
}
</script>

<style lang="scss" scoped>
.community-header {
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    height: 40px;
  }

  .button-community {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-stress);
    display: block;
  }

  .boards {
    display: flex;
    margin-bottom: 16px;
    gap: 8px;

    .btn-brd {
      &:not(.selected) {
        border: 1px solid var(--border-base);
      }
    }
  }
}
</style>