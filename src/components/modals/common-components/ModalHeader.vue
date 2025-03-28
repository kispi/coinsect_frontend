<template>
  <div class="modal-header">
    <i
      v-if="useBackButton"
      class="far fa-chevron-left"
      @click="$emit('back')"/>
    <div class="title" v-html="helpers.translate(title)" :class="titleClass"/>
    <div
      @click="$emit('close')"
      class="closer-container center">
      <i class="fal fa-times"/>
    </div>
  </div>
</template>

<script setup>
import useGlobalHooks from '@/hooks/global-hooks'

defineProps({
  title: {
    type: String,
    default: '',
  },
  titleClass: {
    type: String,
    default: '',
  },
  useBackButton: {
    type: Boolean,
    default: false,
  },
})

const { helpers } = useGlobalHooks()
</script>

<style lang="scss" scoped>
.modal-header {
  position: relative;
  border-bottom: 1px solid var(--border-base);
  padding: 8px 0;
  user-select: none;

  @media (max-width: 767px) {
    padding: 12px 0;
  }

  .title {
    text-align: center;
    color: var(--text-stress);
    pointer-events: none;
  }

  i {
    font-size: 20px;
    color: var(--white);
    cursor: pointer;
  }

  .fa-chevron-left {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);

    &:hover {
      color: var(--text-stress);
    }
  }

  .fa-chevron-left {
    left: 16px;
  }

  .closer-container {
    top: 0;
    right: 0;
    bottom: 0;
    width: 40px;
    background: var(--gs-44);
    position: absolute;
    cursor: pointer;

    &:hover {
      background: var(--gs-66);
    }
  }
}
</style>