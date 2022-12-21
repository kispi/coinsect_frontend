<template>
  <div class="app-background">
    <div
      class="snowflake"
      :style="flake"
      :key="flake"
      v-for="flake in flakes">
      <div class="leaf"/>
      <div class="leaf"/>
      <div class="leaf"/>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  props: {
    numFlakes: {
      type: Number,
      default: 20,
    },
  },
  setup(props) {
    const { plugins } = useGlobalHooks()

    const flakes = computed(() => plugins.$helpers.numArray(props.numFlakes).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animation: `snowing ${Math.random() * 10 + 10}s linear infinite`,
    })))

    return {
      flakes,
    }
  },
}
</script>

<style lang="scss" scoped>
.app-background {
  overflow: hidden;
  pointer-events: none;

  .snowflake {
    position: absolute;
    width: 100%;
    height: 100%;

    .leaf {
      position: absolute;
      width: 2px;
      height: 8px;
      background: rgba(255, 255, 255, 0.5);

      &:nth-child(2) {
        transform: rotate(60deg);
      }

      &:nth-child(3) {
        transform: rotate(120deg);
      }
    }
  }
}
</style>