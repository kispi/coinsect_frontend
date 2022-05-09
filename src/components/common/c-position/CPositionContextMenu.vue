<template>
  <div
    @click="onContextmenu"
    @contextmenu.prevent="onContextmenu"
    class="c-position-context-overlay"
    :class="{'expanded': customMenu.show}">
    <div
      v-if="customMenu.show"
      class="custom-menu"
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
        @click="menuHandlers.requestEdit"
        class="menu-item">
        <i class="fal fa-pencil"/>{{ $translate($store.getters.config.allowDirectPositionEdit ? 'EDIT' : 'REQUEST_EDIT') }}
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  props: ['position'],
  setup(props) {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const router = useRouter()

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
        customMenu.value.right = 0
      }
      customMenu.value.show = true
    }

    return {
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
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
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