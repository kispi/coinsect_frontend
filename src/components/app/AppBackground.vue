<template>
  <div
    class="app-background"
    :class="theme">
    <div
      class="falling-object"
      :style="o"
      :key="o"
      v-for="o in fallingObjects">
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
    numFallingObjects: {
      type: Number,
      default: 20,
    },
    theme: {
      type: String,
      default: 'snow',
    },
  },
  setup(props) {
    const { plugins } = useGlobalHooks()

    const fallingObjects = computed(() => plugins.$helpers.numArray(props.numFallingObjects).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animation: (() => {
        if (props.theme === 'snow') return `snowing ${Math.random() * 10 + 10}s linear infinite`

        if (props.theme === 'rain') return `raining ${Math.random() * 0.5 + 0.5}s linear infinite`
      })(),
    })))

    return {
      fallingObjects,
    }
  },
}
</script>

<style lang="scss" scoped>
.app-background {
  overflow: hidden;
  pointer-events: none;

  .falling-object {
    position: absolute;
    width: 100%;
    height: 100%;

    .leaf {
      position: absolute;
      width: 2px;
      height: 8px;
      background: rgba(255, 255, 255, 0.5);
    }
  }

  &.snow {
    .falling-object {
      .leaf {
        &:nth-child(2) {
          transform: rotate(60deg);
        }

        &:nth-child(3) {
          transform: rotate(120deg);
        }
      }
    }
  }

  &.rain {
    .falling-object {
      .leaf {
        &:nth-child(2),
        &:nth-child(3) {
          display: none;
        }
      }
    }
  }
}
</style>