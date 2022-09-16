<template>
  <div class="table-pagination">
    <div class="flex-row items-center">
      <div
        @click="$emit('page', page)"
        :key="page"
        v-for="page in displayPages"
        class="page-icon center lines-1 flex-wrap"
        :class="{'selected': parseInt(currentIndex) === parseInt(page)}">
        {{ page + 1 }}
      </div>
    </div>
  </div>
</template>

<script>
import { computed, getCurrentInstance } from 'vue'

export default {
  props: ['limit', 'total', 'currentIndex'],
  setup(props) {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const pages = computed(() => plugins.$helpers.numArray(Math.ceil(props.total / props.limit)))

    const displayPages = computed(() => {
      if (pages.value.length < 20) return pages.value
      
      let newPages = []
      for (let i = props.currentIndex - 9; i < props.currentIndex + 10; i++) {
        if (i < pages.value[pages.value.length - 1] && i > 0) {
          newPages.push(i)
        }
      }
      return newPages
    })

    const isThereMore = computed(() =>`${props.currentIndex + 1} / ${pages.value.length}`)

    return {
      pages,
      displayPages,
      isThereMore,
    }
  },
}
</script>

<style lang="scss" scoped>
.table-pagination {
  $page-icon-size: 24px;
  overflow-x: auto;

  .page-icon {
    color: var(--white);
    padding: 4px;
    width: $page-icon-size;
    height: $page-icon-size;
    font-size: 12px;
    text-align: center;
    cursor: pointer;

    &:not(:last-child) {
      margin-right: 4px;
    }

    &:hover {
      background: var(--brand-primary-hover);
    }

    &.selected {
      background: var(--brand-primary);
    }
  }
}
</style>