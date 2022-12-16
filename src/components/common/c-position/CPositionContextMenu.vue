<template>
  <div
    ref="refContextOverlay"
    @click="onContextmenu"
    @contextmenu.prevent="onContextmenu"
    class="c-position-context-overlay"
    :class="{'expanded': customMenu.show}">
    <div
      v-if="customMenu.show"
      class="custom-menu shadowed"
      :style="{
        top: `${customMenu.top}px`,
        left: `${customMenu.left}px`,
      }">
      <div
        @click="menuHandlers.goToPlatform"
        class="menu-item"
        :class="{'disabled': !position.link}">
        <i class="fal fa-home"/>{{ $translate('GO_TO_PLATFORM') }}
      </div>
      <div
        v-if="position.editable"
        @click="menuHandlers.requestEdit"
        class="menu-item">
        <i class="fal fa-pencil"/>{{ $translate('REQUEST_EDIT') }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  props: ['position'],
  setup(props) {
    const { plugins, router } = useGlobalHooks()

    const refContextOverlay = ref(null)

    const customMenu = ref({
      show: null,
      top: null,
      left: null,
      right: null,
    })

    const menuHandlers = {
      goToPlatform: () => {
        if (!props.position.link) return

        if (props.position.link.startsWith('http')) {
          window.open(props.position.link, '_blank')
          return
        }

        router.push(props.position.link)
      },
      requestEdit: () => {
        plugins.$modal.custom({
          component: 'ModalPositionRequestEdit',
          options: {
            position: props.position,
          },
        })
      },
    }

    const onContextmenu = e => {
      if (e.target.classList.contains('disabled')) return

      if (customMenu.value.show) {
        customMenu.value.show = false
        return
      }

      const remainWidth = window.innerWidth - e.clientX
      customMenu.value.top = e.clientY
      if (remainWidth > 120) {
        customMenu.value.left = e.clientX
      } else {
        customMenu.value.left = window.innerWidth - 120
      }
      customMenu.value.show = true
    }

    const prevent = e => {
      e.preventDefault()
    }

    watch(
      () => customMenu.value.show,
      newVal => {
        if (!refContextOverlay.value) return

        if (newVal) {
          refContextOverlay.value.addEventListener('mousewheel', prevent)
          refContextOverlay.value.addEventListener('touchmove', prevent)
          document.addEventListener('keydown', prevent)
        } else {
          refContextOverlay.value.removeEventListener('mousewheel', prevent)
          refContextOverlay.value.removeEventListener('touchmove', prevent)
          document.removeEventListener('keydown', prevent)
        }
      },
    )

    return {
      refContextOverlay,
      customMenu,
      menuHandlers,
      onContextmenu,
    }
  },
}
</script>

<style lang="scss" scoped>
.c-position-context-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  cursor: initial;

  &.expanded {
    position: fixed;
    z-index: 5;
  }

  &:not(.expanded) {
    cursor: pointer;
  }

  .custom-menu {
    width: 120px;
    position: absolute;
    border-radius: 4px;
    background: var(--white);
    overflow: hidden;
    cursor: pointer;

    .menu-item {
      color: var(--black);
      padding: 4px 8px;
      transition: none;

      i {
        margin-right: 8px;
      }

      &:not(.disabled):hover {
        background: var(--brand-primary-hover);
        color: var(--white);
      }

      &.disabled {
        opacity: 0.5;
      }
    }
  }
}
</style>