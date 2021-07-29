<template>
  <div class="app-toast">
    <transition name="slide-down">
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
          v-html="$translate(toast.action.label)"/>
      </div>
    </transition>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue'
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
      store.dispatch('removeToast')
    }

    watch(
      () => toast.value.show,
      () => {
        if (toastTimeout.value) {
          clearTimeout(toastTimeout.value)
        }

        if (toast.value.duration < 0) return

        toastTimeout.value = setTimeout(() => store.dispatch('removeToast'), toast.value.duration || 3000)
      }
    )

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
  top: 64px;
  transform: translateX(-50%);
}

.app-toast-container {
  min-width: 280px;
  width: 480px;
  max-width: calc(100vw - 32px);
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
  display: flex;

  .html {
    flex: 1;
    line-height: 20px;
  }

  .action {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  &.success {
    background: var(--success);
    color: var(--white);
  }

  &.error {
    background: var(--danger);
    color: var(--white);
  }

  .action {
    padding-left: 16px;
    margin-left: 16px;
    border-left: 1px solid var(--brand-primary);
  }
}
</style>