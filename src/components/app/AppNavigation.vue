<template>
  <div
    class="app-navigation pretty-scrollbar"
    :class="{'folded': !$store.getters.showNavigation}">
    <nav class="menu-items pretty-scrollbar">
      <div
        class="menu-item"
        :key="menuItem.title"
        v-for="menuItem in menuItems">
        <a
          @click.prevent="onClickMenuItem(menuItem)"
          :href="menuItem.path"
          :class="{
            'selected': menuItem.$$selected,
            'has-path': menuItem.path,
          }">
          {{ $translate(menuItem.title) }}
        </a>
        <div
          v-if="menuItem.subPages"
          class="sub-pages">
          <a
            @click.prevent.stop="onClickMenuItem(menuItem)"
            :href="subPage.path"
            :class="{
              'selected': subPage.$$selected,
              'has-path': subPage.path,
            }"
            :key="subPage.title"
            v-for="subPage in menuItem.subPages">
            {{ $translate(subPage.title) }}
          </a>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import useGlobalHooks from '@/hooks/global-hooks'
import useMenuItems from './app-header/menu-items'

export default {
  setup() {
    const { store, router } = useGlobalHooks()

    const { menuItems } = useMenuItems()

    const onClickMenuItem = menuItem => {
      console.log(menuItem, 'sibal')
      if (!menuItem.path) return

      router.push(menuItem.path)
      store.commit('setShowNavigation', false)
    }

    return {
      menuItems,
      onClickMenuItem,
    }
  },
}
</script>

<style lang="scss" scoped>
.app-navigation {
  position: fixed;
  background: var(--background-base);
  width: 240px;
  overflow-y: auto;
  max-height: calc(100vh - var(--app-header-height) + var(--banner-bitcoin-blog) - 8px);
  z-index: 10;
  top: calc(var(--app-header-height) - var(--banner-bitcoin-blog) + 8px);
  border-right: 1px solid var(--border-base);
  box-shadow: 2px 4px 4px var(--background-light);
  transition: all 0.3s ease;
  transform: translateX(-4px);
  padding-left: 4px;

  &.folded {
    transform: translateX(-240px);
    opacity: 0;
  }

  a {
    display: block;
    padding: 8px;
    transition: all 0.3s ease;
    border-radius: 4px;
    user-select: none;

    &.has-path {
      &:hover {
        background: var(--brand-primary-hover-bg);
      }
    }

    &.selected {
      color: var(--brand-primary);
    }
  }

  .sub-pages {
    a {
      padding-left: 16px;
    }
  }
}
</style>