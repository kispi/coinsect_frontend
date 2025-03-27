<template>
  <div
    class="app-navigation"
    :class="{'folded': !$store.getters.showNavigation}"
    :style="{
      height: $store.getters.stickyAppBodyHeight,
    }">
    <div class="left-panel pretty-scrollbar">
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
              </div>
            </a>
          </div>
        </div>
      </nav>
    </div>
    <div class="dimmed-overlay" @click="$store.commit('setShowNavigation', false)"/>
  </div>
</template>

<script>
import useGlobalHooks from '@/hooks/global-hooks'
import useMenuItems from './app-header/menu-items'

export default {
  setup() {
    const { helpers, store, router } = useGlobalHooks()

    const { menuItems } = useMenuItems()

    const selected = menuItem => {
      const { path } = router.currentRoute.value
      return menuItem.path === '/community' ? path.startsWith('/community') : path === menuItem.path
    }

    const onClickMenuItem = menuItem => {
      if (menuItem.link) {
        helpers.openLink(menuItem.link)
        return
      }

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
  position: absolute;
  min-height: 960px;

  .left-panel {
    position: fixed;
    background: var(--background-base);
    width: var(--navigation-width);
    overflow-y: auto;
    max-height: calc(100% - var(--app-header-height));
    z-index: 5;
    top: calc(var(--app-header-height) - 1px);
    border-right: 1px solid var(--border-base);
    transition: all 0.3s ease;
    padding: 4px;
  }

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

  .dimmed-overlay {
    position: fixed;
    z-index: 2;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    opacity: 0;
    margin: auto;
    pointer-events: none;
    background: var(--background-base);
    transition: all 0.3s ease;
  }

  @media (max-width: 1599px) {

    &.folded {
      .left-panel {
        opacity: 0;
        pointer-events: none;
      }
    }

    &:not(.folded) {
      .left-panel {
        height: 100vh;
      }

      .dimmed-overlay {
        opacity: 0.5;
        pointer-events: all;
      }
    }
  }

  @media (min-width: 1600px) {
    top: var(--app-header-height);
    left: calc(50% - 700px - var(--navigation-width) / 2);

    .left-panel {
      top: var(--app-header-height);
      position: sticky;
      border-right: 0;
    }
  }
}
</style>