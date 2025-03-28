<template>
  <span
    v-if="img || token || (user || {}).id"
    class="user-symbol">
    <AppImg
      v-if="img"
      :src="img"
      @click.stop.prevent="helpers.modal.images({ images: [img] })"
    />
    <template v-else>
      <i
        v-if="(user || {}).id"
        class="fa fa-shield-check"
        :class="{'c-price-up-bybit': !user.token}"
        :style="{ color: `#${(user.token || '').slice(0, 6)}` }"
      />
      <span
        v-else
        class="dot"
        :style="{ background: `#${token.slice(0, 6)}` }"
      />
    </template>
  </span>
</template>

<script setup>
import { computed } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

const props = defineProps({
  user: {
    type: Object,
    default: () => ({}),
  },
})

const { helpers } = useGlobalHooks()

const img = computed(() => ((props.user || {}).profile || {}).image)

const token = computed(() => (props.user || {}).token || '')
</script>

<style lang="scss" scoped>
.user-symbol {
  .app-img {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    vertical-align: middle;
    cursor: pointer;
  }
}
</style>