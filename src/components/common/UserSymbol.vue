<template>
  <span
    v-if="img || token || (user || {}).id"
    class="user-symbol">
    <AppImg
      v-if="img"
      :src="img"
      @click="$modal.images({ images: [img] })"
    />
    <template v-else>
      <i v-if="(user || {}).id" class="fa fa-shield-check c-price-up-bybit"/>
      <span
        v-else
        class="dot"
        :style="{ background: `#${token.slice(0, 6)}` }"
      />
    </template>
  </span>
</template>

<script>
import { computed } from 'vue'

export default {
  props: {
    user: null,
  },
  setup(props) {
    const img = computed(() => ((props.user || {}).profile || {}).image)

    const token = computed(() => (props.user || {}).token || '')

    return {
      img,
      token,
    }
  },
}
</script>

<style lang="scss" scoped>
.user-symbol {
  .app-img {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    vertical-align: middle;
    cursor: pointer;
  }
}
</style>