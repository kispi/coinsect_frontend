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
    <!-- <div class="boards">
      <button
        @click="onClickBoard(board)"
        class="btn btn-brd"
        :class="{'selected': selected(board)}"
        :key="board.id"
        v-for="board in boards"
        v-html="board.description"
      />
    </div> -->
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  props: {
    withWriteButton: Boolean,
  },
  setup() {
    const store = useStore()

    const router = useRouter()

    const boards = computed(() => store.getters.boards)

    const selected = board => {
      const bid = router.currentRoute.value.query.boardId
      if (!bid) return board.id === 1

      return board.id === parseInt(bid)
    }

    const onClickBoard = board => {
      // router.push(`/community?boardId=${board.id}`)
    }

    return {
      boards,
      selected,
      onClickBoard,
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