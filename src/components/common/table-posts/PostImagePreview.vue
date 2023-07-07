<template>
  <div
    v-if="(post.$$images || []).length > 0 || post.$$thumbnail"
    class="post-image-preview"
    @click.stop.prevent="$modal.images({
      images: post.$$images.length > 0 ? post.$$images : [post.$$thumbnail],
    })">
    <AppImg
      :src="post.$$images[0] || post.$$thumbnail"
      draggable="false"
      class="overlay"
    />
    <div v-if="post.$$images.length > 1" class="num-preview-images">{{ post.$$images.length }}</div>
  </div>
</template>

<script>
export default {
  props: ['post'],
}
</script>

<style lang="scss" scoped>
.post-image-preview {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.25);
  transition: none;
  position: relative;

  &:hover {
    border: 1px solid rgba(255, 255, 255, 1);
  }

  .num-preview-images {
    position: absolute;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 4px;
    font-size: 10px;
    font-weight: 300;
  }
}
</style>