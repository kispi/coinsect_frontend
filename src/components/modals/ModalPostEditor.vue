<template>
  <div class="modal-post-write" :class="{'fullscreen': $store.getters.isMobile}">
    <ModalHeader :title="$translate('WRITE')" @close="$emit('close')"/>
    <PostEditor
      class="body"
      :post="options.post"
      :boardId="options.boardId"
      @close="$emit('close')"
    />
  </div>
</template>

<script>
export default {
  props: ['options'],
}
</script>

<style lang="scss" scoped>
.modal-post-write {
  border-radius: 4px;
  width: 720px;

  .body {
    padding: 16px;
  }
}
</style>