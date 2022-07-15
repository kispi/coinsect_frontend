<template>
  <div class="modal-image-uploader">
    <ModalHeader :title="'UPLOAD_IMAGE'" @close="$emit('close')"/>
    <div class="body pre-line">
      <ImageUploader
        @upload-file="e => $emit('close', e)"
        :path="(options || {}).path"
        :noupload="(options || {}).noupload"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: ['options'],
}
</script>