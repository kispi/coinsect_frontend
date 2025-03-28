<template>
  <div class="modal-images">
    <div class="flex-row" @click="$emit('close')">
      <div class="flex-wrap center">
        <i
          @click.stop="onClickLeft"
          class="fa fa-chevron-left"
          :class="chevronLeft"/>
      </div>
      <div
        ref="refCurrentImage"
        @click="$emit('close')"
        class="image">
        <AppImg :src="images[currentIndex]"/>
      </div>
      <div class="flex-wrap center">
        <i
          @click.stop="onClickRight"
          class="fa fa-chevron-right"
          :class="chevronRight"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import useModalMedia from '@/hooks/modal-media'

const props = defineProps({
  options: {
    type: Object,
    default: () => ({
      images: [],
      selectedIndex: 0,
    }),
  },
})

const images = computed(() => props.options.images || [])

const {
  currentIndex,
  chevronLeft,
  chevronRight,
  onClickLeft,
  onClickRight,
} = useModalMedia(images.value, props.options.selectedIndex)
</script>

<style lang="scss" scoped>
.modal-images {
  padding: 0;
  background: none;
  box-shadow: none;
  width: 640px;
  overflow: hidden;
  border: 0;

  .image {
    min-height: 480px;
    max-width: calc(100% - 32px);
    display: flex;
    align-items: center;

    img {
      width: 100%;
    }

    @media (min-width: 480px) {
      max-height: calc(100vh - 80px);
    }
  }

  .fa-chevron-left,
  .fa-chevron-right {
    color: var(--white);
    font-size: 32px;
    width: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>