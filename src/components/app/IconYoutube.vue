<template>
  <div
    class="icon-youtube bg-white center"
    :style="{
      width: `${size}px`,
      height: `${size / 2}px`,
    }">
    <i class="fab fa-youtube c-danger" :style="{ 'font-size': `${size}px` }"/>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: number
}>(), {
  size: 12,
})
</script>

<style lang="scss" scoped>
.icon-youtube {
  width: 12px;
  height: 4px;
  border-radius: 50%;

  i {
    margin-bottom: 2px;
  }
}
</style>