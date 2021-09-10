<template>
  <div class="post-editor">
    <CPost :post="post"/>
  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue'

export default {
  props: {
    post: Object,
  },
  setup(props) {
    const payload = ref({})

    const init = () => {
      if (props.post) payload.value = props.post
    }

    watch(
      () => props.post,
      init,
    )

    onMounted(init)

    return {
      payload,
    }
  },
}
</script>

<style lang="scss" scoped>
.post-editor {

}
</style>