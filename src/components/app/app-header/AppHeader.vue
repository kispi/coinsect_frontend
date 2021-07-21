<template>
  <div class="app-header">
    <div class="top width-limiter">
      <BannerMarketIndices/>
      <AdaptiveLayout
        :gap="$store.getters.isMobile ? 0 : 8"
        class="f-12">
        <div class="c-text-base text-nowrap" v-html="$translate('ACTIVE_USERS')"/>
        <div class="c-text-stress flex-wrap" v-html="($store.getters.numActiveUsers || 0).toLocaleString()"/>
      </AdaptiveLayout>
    </div>
    <div
      class="logo-and-settings"
      :class="{'border-top': $store.getters.indices}">
      <div class="width-limiter flex-row flex-between items-center flex-fill">
        <AppLogo/>
        <div class="settings">
          <AppDropdown
            @select-dropdown-item="item => $store.commit('setLocale', item.key)"
            :dropdownItems="supportedLocales"
          />
          <i  
            ref="refIconToggleDarkMode"
            @click="toggleTheme"
            class="fa-moon cursor-pointer m-l-12 m-r-12"
            :class="$store.getters.theme === 'dark' ? 'fa' : 'fal'"
            @mouseover="$tooltip.show({
              id: 'tooltipDarkMode',
              text: 'TOOLTIP_DARK_MODE',
              showAbove: refIconToggleDarkMode,
            })"
            @mouseleave="$tooltip.hide('tooltipDarkMode')"
          />
          <!-- <RouterLink :to="'/login'" v-html="$translate('LOGIN')" class="m-l-8"/> -->
        </div>
      </div>
    </div>
    <div class="menu-items width-limiter">
      <RouterLink
        class="menu-item"
        :class="{'selected': menuItem.path === $route.path}"
        :to="menuItem.path"
        :key="menuItem.title"
        v-for="menuItem in menuItems"
        v-html="$translate(menuItem.title)"
      />
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import BannerMarketIndices from './BannerMarketIndices'
import helpers from '@/helpers'

export default {
  components: { BannerMarketIndices },
  setup() {
    const refIconToggleDarkMode = ref(null)

    const store = useStore()

    const toggleTheme = () => {
      const nextTheme = store.getters.theme === 'dark' ? 'light' : 'dark'
      store.commit('setTheme', nextTheme)
      helpers.localStorage.setMeta('theme', nextTheme)
    }

    const menuItems = [{
      title: 'HOME',
      path: '/',
    // }, {
    //   title: 'COMMUNITY',
    //   path: '/boards',
    // }, {
    //   title: 'LONG_SHORT',
    //   path: '/long_short'
    }, {
      title: 'MARKETCAPS',
      path: '/marketcaps',
    // }, {
    //   title: 'NEWS',
    //   path: '/news',
    // }, {
    //   title: 'ABOUT',
    //   path: '/about',
    }]

    const supportedLocales = ref(['kr', 'en'].map(key => ({ key })))

    watch(
      () => store.getters.translation.locale,
      newVal => supportedLocales.value.forEach(o => o.$$selected = o.key === newVal)
    )

    return {
      refIconToggleDarkMode,
      menuItems,
      supportedLocales,
      toggleTheme,
    }
  },
}
</script>

<style lang="scss">
// Don't scope
.app-header {
  box-shadow: 0 -1px var(--border-base) inset;
  transition: all 0.2s ease;

  .top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 8px;
  }

  .width-limiter {
    max-width: 1200px;
    margin: auto;
  }

  .logo-and-settings {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px;

    &.border-top {
      border-top: 1px solid var(--border-base);
    }
  }

  .settings {
    display: flex;
    align-items: center;
    color: var(--text-stress);

    .app-dropdown {
      text-transform: uppercase;
    }

    .fa-moon {
      color: green;
    }
  }

  .menu-items {
    display: flex;
    overflow-x: auto;

    .menu-item {
      padding: 12px 8px;
      white-space: nowrap;
      border-bottom: 2px solid transparent;

      &.selected {
        color: var(--brand-primary);
        border-bottom: 2px solid var(--brand-primary);
        font-weight: 700;
      }

      &:hover {
        font-weight: 700;
      }
    }
  }
}
</style>