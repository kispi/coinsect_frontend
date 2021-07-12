<template>
  <div class="app-pagination">
    <div
      class="limit"
      v-html="`Showing ${(page - 1) * limit + 1}-${lastItemIdx} of ${total}`"
    />
    <div class="page-numbers">
      <i
        @click="onClickLeft"
        class="fa fa-chevron-left"/>
      <div
        @click="onPage(1)"
        class="page-number"
        :class="{'active': page === 1}">1</div>
      <div v-if="pageNumbers[0] > 2" class="dots">...</div>
      <div
        @click="onPage(pageNum)"
        class="page-number"
        :class="{'active': pageNum === page}"
        v-html="pageNum"
        :key="pageNum"
        v-for="pageNum in pageNumbers"/>
      <div v-if="pageNumbers[pageNumbers.length - 1] < numTotalPages - 1" class="dots">...</div>
      <div
        v-if="numTotalPages >= 2"
        @click="onPage(numTotalPages)"
        class="page-number"
        :class="{'active': page === numTotalPages}">{{ numTotalPages }}</div>
      <i
        @click="onClickRight"
        class="fa fa-chevron-right"/>
    </div>
  </div>
</template>

<script>
import { computed, getCurrentInstance } from 'vue'

export default {
  name: 'AppPagination',
  props: {
    limit: {
      type: Number, // 전체 페이지 개수
    },
    total: {
      type: Number, // API response data상의 total (해당 쿼리로 검색된 전체 개수)
    },
    page: {
      type: Number, // API response data상의 page (현재 페이지)
    },
  },
  setup(props, { emit }) {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    // 현재 페이지 양쪽으로 몇개까지나 보여줄지
    const wingLength = 3

    const numTotalPages = computed(() => Math.ceil(props.total / props.limit))

    const onPage = value => emit('page', parseInt(value))

    const onClickLeft = () => {
      if (props.page <= 1) return

      onPage(props.page - 1)
    }

    const onClickRight = () => {
      if (props.page >= numTotalPages.value) return

      onPage(props.page + 1)
    }

    const shouldShowDots = idx => {
      if (idx === 0 || idx === pageNumbers.value.length - 1) return

      return pageNumbers.value[idx] + 1 !== pageNumbers.value[idx + 1]
    }

    // 페이지 중략 (...) 처리를 위해 1번 페이지와 마지막 페이지는 배열에 포함하지 않음 (따로 처리)
    const pageNumbers = computed(() => {
      if (numTotalPages.value <= 9) {
        return plugins.$helpers.numArray(numTotalPages.value - 2)
          .map(num => num + 2)
      }

      const arr = []

      for (let i = -wingLength; i <= wingLength; i++) {
        const toAdd = props.page + i
        if (!arr.includes(toAdd) && toAdd > 1 && toAdd < numTotalPages.value) arr.push(toAdd)
      }

      return arr
    })

    const lastItemIdx = computed(() => {
      const candidate = props.page * props.limit
      return candidate < props.total ? candidate : props.total
    })

    return {
      pageNumbers,
      numTotalPages,
      onClickLeft,
      onClickRight,
      shouldShowDots,
      lastItemIdx,
      onPage,
    }
  },
}
</script>

<style lang="scss" scoped>
.app-pagination {
  @media (min-width: 768px) {
    display: flex;
    align-items: center;
  }

  .limit {
    font-size: 14px;
    font-weight: 500;
    color: var(--dark-gray-lv3);
    flex: 1 1 0;
  }

  .page-number-container {
    display: flex;
  }

  .page-numbers {
    display: flex;
    align-items: center;
    flex: 0 0;

    @media (max-width: 767px) {
      justify-content: flex-end;
    }

    i,
    .page-number,
    .dots {
      margin: 1px;
      font-size: 15px;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      user-select: none;
      cursor: pointer;
    }

    .fa {
      color: var(--border-dark-gray);

      &:hover {
        background: rgba(0, 0, 0, 0.05);
        color: var(--dark-gray-lv2);
      }
    }

    .page-number {
      &.active {
        color: var(--brand-primary);
        background: var(--brand-primary-bg-lv2);
      }

      &:hover {
        background: var(--brand-primary-bg-lv2);
      }
    }
  }

  @media (max-width: 767px) {
    .limit,
    .page-numbers {
      margin-bottom: 16px;
    }
  }
}
</style>