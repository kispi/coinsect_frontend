<template>
  <div class="app-header">
    <div class="top width-limiter">
      <BannerMarketIndices/>
    </div>
    <div class="logo-and-settings">
      <div class="width-limiter flex-row flex-between flex-fill">
        <AppLogo/>
        <div class="settings">
          <AppDropdown
            @select-dropdown-item="item => $store.commit('setLocale', item.key)"
            :dropdownItems="supportedLocales"
          />
          <RouterLink :to="'/login'" v-html="$translate('LOGIN')"/>
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

export default {
  components: { BannerMarketIndices },
  setup() {
    const store = useStore()

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
    max-width: 992px;
    margin: auto;
  }

  .top,
  .logo-and-settings {
    padding: 8px;
  }

  .logo-and-settings {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid var(--gray-border);
  }

  .settings {
    display: flex;
    align-items: center;

    .app-dropdown {
      text-transform: uppercase;
    }
  }

  .menu-items {
    display: flex;

    .menu-item {
      padding: 12px 8px;
      white-space: nowrap;

      &.selected {
        font-weight: 900;
        color: var(--brand-primary);
      }
    }
  }
}
</style>