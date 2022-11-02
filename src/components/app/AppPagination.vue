<template>
  <div class="app-pagination">
    <div class="o-0 no-touch">PLACEHOLDER</div>
    <div class="page-numbers">
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
    </div>
    <div class="custom-page">
      <input
        v-model="pageValue"
        @change="e => $emit('update:modelValue', e.target.value)"
        type="number"
        min="1"
        :max="numTotalPages"
        @keydown.enter="e => {
          onPage(pageValue)
          e.target.blur()
        }"
      >
      <button
        @click="onPage(pageValue)"
        class="btn btn-primary"
        :disabled="!pageValue">
        <i class="fa fa-chevron-right c-white"/>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, getCurrentInstance, watch } from 'vue'

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

    const pageValue = ref(props.page)

    // 현재 페이지 양쪽으로 몇개까지나 보여줄지
    const wingLength = 3

    const numTotalPages = computed(() => Math.ceil(props.total / props.limit))

    const onPage = value => {
      if (value < 1 || value > numTotalPages.value) return

      pageValue.value = parseInt(value)
      emit('page', pageValue.value)
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

    watch(
      () => props.page,
      newVal => pageValue.value = newVal,
    )

    return {
      pageValue,
      pageNumbers,
      numTotalPages,
      lastItemIdx,
      shouldShowDots,
      onPage,
    }
  },
}
</script>

<style lang="scss" scoped>
.app-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .custom-page {
    font-weight: 500;
    color: var(--text-stress);
    display: flex;
    align-items: center;
    height: 32px;

    input {
      width: 48px;
      height: 100%;
      text-align: right;
    }

    .btn-primary {
      flex: 0 0 auto;
      height: 100%;
      margin-left: 4px;
      border-radius: 0;
    }
  }

  .page-number-container {
    display: flex;
  }

  .page-numbers {
    display: flex;
    align-items: center;
    flex: 0 0;

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
      color: var(--text-base);

      &:hover {
        background: rgba(0, 0, 0, 0.05);
        color: var(--text-stress);
      }
    }

    .page-number {
      &.active {
        color: var(--brand-primary);
        background: var(--brand-primary-hover-bg);
        font-weight: 700;
      }

      &:hover {
        background: var(--brand-primary-hover-bg);
      }
    }
  }
}
</style>