<template>
  <transition name="fade">
    <nav
      v-if="modelValue"
      class="sub-header">
      <RouterLink
        draggable="false"
        @click="$emit('update:modelValue', null)"
        :to="item.path"
        class="sub-header-item"
        :class="{'selected': $router.currentRoute.value.path.includes(item.path)}"
        :key="item.path"
        v-for="item in modelValue">
        {{ $translate(item.title) }}
      </RouterLink>
    </nav>
  </transition>
</template>

<script>
export default {
  props: {
    modelValue: Array,
  },
}
</script>

<style lang="scss" scoped>
.sub-header {
  position: fixed;
  background: var(--background-base);
  top: calc(var(--app-header-height) - 8px);
  min-width: 160px;
  border: 1px double var(--border-base);
  border-radius: 4px;
  box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.24);
  z-index: 5;

  .sub-header-item {
    color: var(--text-stress);
    padding: 12px;
    display: block;
    white-space: nowrap;
    transition: none;
    user-select: none;
    cursor: pointer;

    &.selected {
      color: var(--brand-primary);
    }

    &:hover {
      background: var(--brand-primary-hover-bg);
    }

    &:not(:last-child) {
      border-bottom: 1px solid var(--border-base);
    }
  }
}

#app.dark {
  .sub-header {
    box-shadow: 1px 2px 4px rgba(255, 255, 255, 0.24);
  }
}
</style>
