<template>
  <div class="modal-image-uploader">
    <ModalHeader :title="'이미지 업로드'" @close="$emit('close')"/>
    <div class="body pre-line">
      <ImageUploader @upload-file="e => $emit('close', e)"/>
    </div>
  </div>
</template>