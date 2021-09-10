<template>
  <div class="post-editor p-t-40 p-b-40">
    에디터
    아직
    구현
    안됨
    복잡함
    주말에 해야지
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
.post-editor {}
</style>