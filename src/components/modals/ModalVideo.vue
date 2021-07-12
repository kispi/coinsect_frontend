<template>
  <div
    class="modal-video"
    :style="options.style">
    <video
      @contextmenu.prevent
      :poster="options.video.poster"
      controls
      controlslist="nodownload"
      playsinline
      autoplay>
      <source :src="options.video.src" type="video/mp4">
    </video>
  </div>
</template>

<script>
export default {
  props: ['options'],
}
</script>

<style lang="scss" scoped>
.modal-video {
  border-radius: 0;
  max-width: 720px;
}
</style>