<template>
  <div class="view-test">
    <img :src="src">
    <ImageUploader @upload-file="onUploadFile"/>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const src = ref(null)

    const onUploadFile = e => {
      src.value = e.src
    }

    return {
      src,
      onUploadFile,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-test {
  padding: 64px;
}
</style>