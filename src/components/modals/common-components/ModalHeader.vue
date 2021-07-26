<template>
  <div class="modal-header">
    <i
      v-if="useBackButton"
      class="far fa-chevron-left"
      @click="$emit('back')"/>
    <div class="title" v-html="$translate(title)" :class="titleClass"/>
    <i @click="$emit('close')" class="far fa-times"/>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    titleClass: String,
    useBackButton: {
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
.modal-header {
  position: relative;
  border-bottom: 1px solid var(--border-base);
  padding: 8px 0;
  user-select: none;

  .title {
    font-weight: 700;
    text-align: center;
    color: var(--text-stress);
    pointer-events: none;
  }

  .fa-chevron-left,
  .fa-times {
    position: absolute;
    font-size: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--gray-light);
    cursor: pointer;
  }

  .fa-chevron-left {
    left: 16px;
  }

  .fa-times {
    right: 16px;
  }
}
</style>