<template>
  <div class="app-toast">
    <transition name="slide-up">
      <div
        v-if="toast.show"
        class="app-toast-container"
        :class="[
          toast.type || 'success',
          toast.handler ? 'cursor-pointer' : '',
        ]">
        <div class="html" v-html="$translate(html)"/>
        <div
          v-if="toast.action.label"
          @click="onClickToastHandler"
          class="action"
          v-html="$translate(toast.action.label)"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()

    const toastTimeout = ref(null)

    const toast = computed(() => store.getters.toast || {})

    const html = computed(() => toast.value.html)

    const onClickToastHandler = () => {
      if (!toast.value.action || !toast.value.action.handler) return

      toast.value.action.handler()
      store.commit('setToast', null)
    }

    const checkAndCloseToast = () => {
      if (toastTimeout.value) {
        clearTimeout(toastTimeout.value)
      }

      if (toast.value.duration < 0) return

      toastTimeout.value = setTimeout(() => store.commit('setToast', null), toast.value.duration || 3000)
    }

    watch(
      () => toast.value.show,
      checkAndCloseToast,
    )

    onMounted(checkAndCloseToast)

    return {
      toast,
      html,
      onClickToastHandler,
    }
  },
}
</script>

<style lang="scss">
.app-toast {
  position: fixed;
  z-index: 6;
  left: 50%;
  bottom: 64px;
  transform: translateX(-50%);
}

.app-toast-container {
  min-width: 280px;
  width: 480px;
  max-width: calc(100vw - 32px);
  padding: 16px;
  border-radius: 4px;
  margin-top: 16px;
  display: flex;
  align-items: center;

  .html {
    flex: 1;
    line-height: 20px;
    white-space: pre-line;
  }

  .action {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-weight: 700;
    border: 1px solid var(--white);
    border-radius: 4px;
    padding: 8px 12px;
  }

  &.success {
    background: var(--gs-66);
    color: var(--white);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.16);
  }

  &.error {
    background: var(--danger);
    color: var(--white);
  }
}
</style>