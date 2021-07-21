<template>
  <div
    ref="refModal"
    class="app-modal">
    <div
      class="modal-fixed-container"
      :class="{'header-exposed': (modal.options || {}).headerExposed}">
      <div
        class="modal-backdrop"
        :class="{
          'opened': show,
          'o-0': !prepared,
          'blurred': (modal.options || {}).useBlurredBackdrop,
          'darker': (modal.options || {}).useDarkerBackdrop,
        }"
        :style="backdropStyle"
        @mousedown="closeOnMousedownBackdrop">
      </div>
      <component
        ref="refTargetModal"
        class="modal-base-style"
        :class="{
          'modal-slide-up': (modal.options || {}).slideUp,
          'before-prepared': !prepared,
        }"
        @close="onClose"
        :options="modal.options"
        :is="modal.component"
      />
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent, onUnmounted, onMounted, ref, watch, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import router from '@/router'
import useModalDraggable from '@/hooks/modal-draggable'

export default {
  name: 'AppModal',
  props: ['modal'],
  components: {
    ModalBasic: defineAsyncComponent(() => import('@/components/modals/ModalBasic')),
    ModalVideo: defineAsyncComponent(() => import('@/components/modals/ModalVideo')),
    ModalImages: defineAsyncComponent(() => import('@/components/modals/ModalImages')),
    ModalChatProfile: defineAsyncComponent(() => import('@/components/modals/ModalChatProfile')),
  },
  setup(props) {
    const show = ref(false)

    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const prepared = ref(null)

    const refModal = ref(null)

    const refTargetModal = ref(null)

    const backdropStyle = ref(null)

    const setBackdropStyle = () => {
      if ((props.modal.options || {}).headerExposed) {
        backdropStyle.value = {
          top: `${plugins.$helpers.dom.bannerConsideredHeaderHeight()}px`,
        }
      }
    }

    const { makeDraggable } = useModalDraggable()

    const onClose = e => {
      if (props.modal.resolve) {
        props.modal.resolve(e)
      }

      prepared.value = false
      // 0.2초의 애니메이션을 기다린 후 modal을 제거해야함.
      setTimeout(() => store.commit('popModal'), 200)
    }

    const closeOnMousedownBackdrop = e => {
      if ((props.modal.options || {}).preventCloseOnClickBackdrop) return

      onClose()
    }

    const onKeydown = e => (e.key === 'Escape') && onClose()

    onMounted(() => {
      document.addEventListener('keydown', onKeydown)

      setTimeout(() => show.value = true)

      // defineAsyncComponent를 통해 비동기로 모달을 로드하기때문에, 약간의 타임아웃을 주어 로드가 완료된 뒤 prepared.value = true로 하기 위함
      setTimeout(() => prepared.value = true, 100)

      makeDraggable(refModal.value)
    })

    onUnmounted(() => {
      document.removeEventListener('keydown', onKeydown)
    })

    watch([
      () => store.getters.windowInnerWidth,
      () => store.getters.windowInnerHeight,
    ],
      () => plugins.$helpers.modal.center(refTargetModal.value.$el),
    )

    watch(
      () => prepared.value,
      setBackdropStyle,
    )

    watch(
      () => router.currentRoute.value,
      (newVal, oldVal) => {
        // 다른 라우트로 이동하는 경우는 모달을 전부 끈다. (쿼리파라미터가 바뀌는 경우는 제외)
        if ((newVal || {}).path !== (oldVal || {}).path) {
          store.commit('removeAllModals')
        }
      },
    )

    return {
      show,
      prepared,
      backdropStyle,
      onClose,
      refModal,
      refTargetModal,
      closeOnMousedownBackdrop,
      onKeydown,
    }
  },
}
</script>

<style lang="scss">
.app-modal {
  .modal-fixed-container {
    position: fixed;
    z-index: 5;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;

    &.header-exposed {
      pointer-events: none;
    }

    .modal-backdrop,
    .modal-base-style {
      pointer-events: auto;
    }
  }

  .modal-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    background: rgba(0, 0, 0, 0.32);
    transition: opacity .2s ease;
    visibility: hidden;
    opacity: 0;

    &.opened {
      visibility: visible;
      opacity: 1;
    }

    &.darker {
      background: rgba(0, 0, 0, 0.8);
    }

    &.blurred {
      backdrop-filter: blur(4px);
    }
  }

  .modal-base-style {
    word-wrap: break-word;
    transition: all .2s ease;
    max-width: calc(100vw - 32px);
    background: var(--white);
    border-radius: 4px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.16);
    position: absolute;

    // overflow를 여기서 처리하기보단 backdrop에서 처리하는게 나을 듯 하나 일단 이렇게 해둠.
    max-height: calc(100vh - 48px);
    overflow: auto;

    @media (max-width: 767px) {
      max-height: calc(100vh - 120px);
    }

    // 적용시 몸통만 스크롤되도록 처리한다.
    &.scrollable-body {
      display: flex;
      flex-direction: column;

      .modal-header {
        flex: 0 0 auto;
      }

      .modal-header + * {
        flex: 1 1 auto;
        overflow-y: auto;
      }
    }
  }

  .before-prepared {
    opacity: 0;
  }

  .modal-slide-up {
    position: absolute !important;
    max-width: initial;
    top: calc(var(--app-header-height) + 80px);
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 0;
    transition: all .2s ease;

    &.before-prepared {
      margin-top: 240px;
    }
  }

  &.modal-draggable {
    .modal-base-style {
      transition: none;
    }

    .modal-header {
      cursor: grab;
    }
  }

  &:not(.modal-draggable) {
    .modal-fixed-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-base-style {
      position: initial;
    }
  }
}

#app.dark {
  .modal-base-style {
    background: var(--gray-dark);
  }
}
</style>