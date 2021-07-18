<template>
  <div class="app-header">
    <BannerMarketIndices class="width-limiter"/>
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
            @click="toggleTheme"
            class="fal cursor-pointer"
            :class="$store.getters.theme === 'dark' ? 'fa-sun' : 'fa-moon'"
          />
          <RouterLink :to="'/login'" v-html="$translate('LOGIN')" class="m-l-8"/>
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
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import BannerMarketIndices from './BannerMarketIndices'
import helpers from '@/helpers'

export default {
  components: { BannerMarketIndices },
  setup() {
    const store = useStore()

    const toggleTheme = () => {
      const nextTheme = store.getters.theme === 'dark' ? 'light' : 'dark'
      store.commit('setTheme', nextTheme)
      helpers.localStorage.setMeta('theme', nextTheme)
    }

    const menuItems = [{
      title: 'HOME',
      path: '/',
    }, {
      title: 'COMMUNITY',
      path: '/boards',
    }, {
      title: 'LONG_SHORT',
      path: '/long_short'
    }, {
      title: 'MARKETCAPS',
      path: '/marketcaps',
    }, {
      title: 'NEWS',
      path: '/news',
    }, {
      title: 'ABOUT',
      path: '/about',
    }]

    const supportedLocales = ref(['kr', 'en'].map(key => ({ key })))

    watch(
      () => store.getters.translation.locale,
      newVal => supportedLocales.value.forEach(o => o.$$selected = o.key === newVal)
    )

    return {
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
  box-shadow: 0 -1px var(--gray-border) inset;
  transition: all 0.2s ease;

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
      border-top: 1px solid var(--gray-border);
    }
  }

  .settings {
    display: flex;
    align-items: center;
    color: var(--text-dark);

    .app-dropdown {
      text-transform: uppercase;
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