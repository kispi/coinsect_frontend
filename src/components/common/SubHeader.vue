<template>
  <transition name="fade">
    <nav
      v-if="modelValue"
      class="sub-header shadowed">
      <RouterLink
        draggable="false"
        @click="$emit('update:modelValue', null)"
        :to="item.path"
        class="sub-header-item"
        :class="{'selected': $router.currentRoute.value.path.includes(item.path)}"
        :key="item.path"
        v-for="item in modelValue"
        v-html="$translate(item.title)"
      />
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
  top: var(--app-header-height);
  min-width: 160px;
  border: 1px solid var(--border-light);
  border-radius: 4px;
  z-index: 5;

  .sub-header-item {
    color: var(--text-stress);
    padding: 8px 12px;
    display: block;
    white-space: nowrap;
    transition: none;
    user-select: none;
    cursor: pointer;

    &.selected {
      font-weight: 700;
      background: var(--background-light);
    }

    &:hover {
      background: var(--background-light);
    }

    &:not(:last-child) {
      border-bottom: 1px solid var(--border-base);
    }
  }
}
</style>
