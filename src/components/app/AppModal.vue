<template>
  <div
    v-if="modal"
    ref="refModal"
    class="app-modal">
    <div
      class="modal-fixed-container"
      :class="{
        'no-backdrop': (modal.options || {}).noBackdrop,
      }">
      <div
        v-if="!(modal.options || {}).noBackdrop"
        class="modal-backdrop"
        :class="{
          'opened': show,
          'blurred': (modal.options || {}).useBlurredBackdrop,
          'darker': (modal.options || {}).useDarkerBackdrop,
        }"
        @mousedown="closeOnMousedownBackdrop">
      </div>
      <component
        ref="refTargetModal"
        class="modal-base-style"
        :class="{
          'fullscreen': (modal.options || {}).fullscreen,
          'resizable': (modal.options || {}).resizable,
        }"
        @close="onClose"
        @load-modal-component="makeDraggable(refModal, { toMove: 'modal-base-style', toGrab: 'modal-header' })"
        :options="modal.options"
        :is="modal.component"
      />
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent, onUnmounted, onMounted, ref, watch } from 'vue'
import useModalDraggable from '@/hooks/modal-draggable'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  name: 'AppModal',
  props: ['modal'],
  components: {
    ModalBasic: defineAsyncComponent(() => import('@/components/modals/ModalBasic')),
    ModalReferral: defineAsyncComponent(() => import('@/components/modals/ModalReferral')),
    ModalUserStats: defineAsyncComponent(() => import('@/components/modals/ModalUserStats')),
    ModalDonation: defineAsyncComponent(() => import('@/components/modals/ModalDonation')),
    ModalInput: defineAsyncComponent(() => import('@/components/modals/ModalInput')),
    ModalTradingView: defineAsyncComponent(() => import('@/components/modals/ModalTradingView')),
    ModalOrderbook: defineAsyncComponent(() => import('@/components/modals/ModalOrderbook')),
    ModalGame: defineAsyncComponent(() => import('@/components/modals/ModalGame')),
    ModalAddPortfolio: defineAsyncComponent(() => import('@/components/modals/ModalAddPortfolio')),
    ModalVideo: defineAsyncComponent(() => import('@/components/modals/ModalVideo')),
    ModalImages: defineAsyncComponent(() => import('@/components/modals/ModalImages')),
    ModalUploadImage: defineAsyncComponent(() => import('@/components/modals/ModalUploadImage')),
    ModalSignIn: defineAsyncComponent(() => import('@/components/modals/ModalSignIn')),
    ModalPositionRequestEdit: defineAsyncComponent(() => import('@/components/modals/ModalPositionRequestEdit')),
    ModalPostEditor: defineAsyncComponent(() => import('@/components/modals/ModalPostEditor')),
    ModalChatUsers: defineAsyncComponent(() => import('@/components/modals/ModalChatUsers')),
    ModalChatSettings: defineAsyncComponent(() => import('@/components/modals/ModalChatSettings')),
  },
  setup(props) {
    const { plugins, store } = useGlobalHooks()

    const { makeDraggable } = useModalDraggable()

    const show = ref(false)

    const refModal = ref(null)

    const refTargetModal = ref(null)

    const onClose = e => {
      if (!props.modal) return

      if (props.modal.resolve) props.modal.resolve(e)

      store.commit('removeModal', props.modal)
    }

    const closeOnMousedownBackdrop = () => {
      if ((props.modal.options || {}).preventCloseOnClickBackdrop) return

      onClose()
    }

    const onKeydown = e => (e.key === 'Escape') && onClose()

    onMounted(() => {
      document.addEventListener('keydown', onKeydown)

      setTimeout(() => show.value = true)

      if (!store.getters.isMobile) makeDraggable(refModal.value, { toMove: 'modal-base-style', toGrab: 'modal-header' })
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

    return {
      show,
      onClose,
      refModal,
      refTargetModal,
      closeOnMousedownBackdrop,
      onKeydown,
      makeDraggable,
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
    background: var(--background-base);
    border: 1px solid var(--border-light);
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

    &.fullscreen {
      top: 0 !important;
      left: 0 !important;
      width: 100%;
      height: 100%;
      max-width: initial;
      max-height: initial;
      border-radius: 0;
    }

    &.resizable {
      resize: auto;
    }
  }

  .modal-fixed-container.no-backdrop {
    pointer-events: none;

    .modal-base-style {
      pointer-events: auto;
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
</style>