<template>
  <div
    v-if="showCountdown"
    class="c-timer no-touch"
    :class="{'expired': !timer.ms}">
    {{ timer.ms > 0 ? Math.floor(timer.ms / 1000) : 'START!' }}
  </div>
</template>

<script>
import { ref, onUnmounted, watch } from 'vue'

export default {
  props: ['ms'],
  setup(props, { emit }) {
    const showCountdown = ref(null)

    const timer = ref({
      timeoutShowCountdown: null,
      timeout: null,
      ms: null,
    })

    const resetTimeouts = () => {
      if (timer.value.timeout) {
        clearTimeout(timer.value.timeout)
        timer.value.timeout = null
      }

      if (timer.value.timeoutShowCountdown) {
        clearTimeout(timer.value.timeoutShowCountdown)
        timer.value.timeoutShowCountdown = null
      }
    }

    const startTimeout = () => {
      resetTimeouts()

      if (typeof timer.value.ms === 'number' && timer.value.ms <= 0) {
        timer.value.timeoutShowCountdown = setTimeout(() => showCountdown.value = false, 1000)
        emit('expire')
        return
      }

      showCountdown.value = true
      timer.value.timeout = setTimeout(() => {
        timer.value.ms -= 1000
        startTimeout()
      }, 1000)
    }

    onUnmounted(resetTimeouts)

    watch(
      () => props.ms,
      newVal => {
        timer.value.ms = newVal
        startTimeout()
      },
    )

    return {
      showCountdown,
      timer,
    }
  },
}
</script>

<style lang="scss" scoped>
.c-timer {
  color: var(--white);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.24);
  font-size: 120px;
  position: absolute;
  z-index: 1;
  top: calc(50% - 120px);
  left: 50%;
  transform: translateX(-50%);

  &.expired {
    font-size: 48px;
    top: calc(50% - 48px);
  }
}
</style>