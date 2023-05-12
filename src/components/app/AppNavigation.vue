<template>
  <div
    class="app-navigation pretty-scrollbar"
    :class="{'folded': !$store.getters.showNavigation}">
    <BannerBitcoinBlog class="p-16 m-b-8"/>
    <nav class="menu-items pretty-scrollbar">
      <div
        class="menu-item"
        :key="menuItem.title"
        v-for="menuItem in menuItems">
        <a
          @click.prevent="onClickMenuItem(menuItem)"
          :href="menuItem.path"
          :class="{'selected': selected(menuItem)}">
          <div class="title">
            <AppImg v-if="menuItem.img" :src="menuItem.img"/>
            <span class="emoji" v-if="menuItem.emoji">{{ menuItem.emoji }}</span>
            {{ $translate(menuItem.title) }}
            <span v-if="menuItem.$$hot" class="badge-hot">H</span>
          </div>
          <i v-if="menuItem.subItems" class="far m-l-4 center f-10" :class="menuItem.$$expanded ? 'fa-chevron-up' : 'fa-chevron-down'"/>
        </a>
        <div
          v-if="menuItem.$$expanded"
          class="sub-pages">
          <a
            @click.prevent.stop="onClickMenuItem(subItem)"
            :href="subItem.path"
            :class="{'selected': selected(subItem)}"
            :key="subItem.title"
            v-for="subItem in menuItem.subItems">
            <div class="title">
              <AppImg v-if="subItem.img" :src="subItem.img"/>
              <span class="emoji" v-if="subItem.emoji">{{ subItem.emoji }}</span>
              {{ $translate(subItem.title) }}
              <span v-if="subItem.$$hot" class="badge-hot">H</span>
            </div>
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

    const selected = menuItem => {
      const { path } = router.currentRoute.value
      return menuItem.path === '/community' ? path.startsWith('/community') : path === menuItem.path
    }

    const onClickMenuItem = menuItem => {
      if (!menuItem.path) {
        menuItem.$$expanded = !menuItem.$$expanded
        return
      }

      router.push(menuItem.path)
      store.commit('setShowNavigation', false)
    }

    return {
      menuItems,
      selected,
      onClickMenuItem,
    }
  },
}
</script>

<style lang="scss" scoped>
.app-navigation {
  --navigation-width: 200px;
  position: fixed;
  background: var(--background-base);
  width: var(--navigation-width);
  overflow-y: auto;
  max-height: calc(100% - var(--app-header-height));
  z-index: 10;
  top: calc(var(--app-header-height));
  border-right: 1px solid var(--border-base);
  transform: translateX(-4px);
  transition: all 0.3s ease;
  padding: 4px;
  height: 100%;

  a {
    display: flex;
    justify-content: space-between;
    padding: 4px 8px;
    transition: all 0.3s ease;
    border-radius: 4px;
    user-select: none;
    font-size: 12px;
    cursor: pointer;

    .title {
      display: flex;
      align-items: center;

      .badge-hot {
        background: rgba(255, 31, 31, 0.5);
        font-size: 10px;
        color: var(--white);
        border-radius: 4px;
        padding: 0 4px;
        margin-left: 8px;
      }
    }

    &:hover {
      background: var(--brand-primary-hover-bg);
    }

    &.selected {
      color: var(--brand-primary);
    }

    img,
    .emoji {
      width: 24px;
      height: 24px;
      margin-right: 8px;
      font-size: 16px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .sub-pages {
    a {
      padding-left: 16px;
    }
  }

  .menu-items,
  .sub-pages {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .sub-pages {
    margin-top: 4px;
  }

  @media (max-width: 1399px) {
    &.folded {
      opacity: 0;
      pointer-events: none;
      transform: translateX(calc(-40px - var(--navigation-width)));
    }
  }

  @media (min-width: 1400px) {
    transform: translateX(calc(-8px - var(--navigation-width)));
    border-right: 0;

    &.folded {
      opacity: 1;
    }
  }
}
</style>