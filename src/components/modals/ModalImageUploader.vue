<template>
  <div class="modal-image-uploader">
    <ModalHeader :title="'이미지 업로드'" @close="$emit('close')"/>
    <div class="body pre-line">
      <ImageUploader @upload-file="e => $emit('close', e)"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal-image-uploader {
  border-radius: 4px;
  width: 480px;
}
</style>