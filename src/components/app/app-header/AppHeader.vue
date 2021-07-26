<template>
  <div class="app-header">
    <div class="top">
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
      <div class="flex-row flex-between items-center flex-fill">
        <AppLogo/>
        <div
          @click="showSettings = !showSettings"
          class="settings clickable-icon-wrapper">
          <i
            ref="refIconSettings"
            class="fa fa-cog"
          />
        </div>
        <WrapperDropdownOverlay
          v-model="showSettings"
          :alignRight="true"
          :mountBelow="refIconSettings">
          <SettingsPanel/>
        </WrapperDropdownOverlay>
      </div>
    </div>
    <div class="menu-items">
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
import { ref } from 'vue'
import BannerMarketIndices from './BannerMarketIndices'
import SettingsPanel from './SettingsPanel'

export default {
  components: {
    BannerMarketIndices,
    SettingsPanel,
  },
  setup() {
    const refIconSettings = ref(null)

    const showSettings = ref(null)

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

    return {
      refIconSettings,
      showSettings,
      menuItems,
    }
  },
}
</script>

<style lang="scss" scoped>
.app-header {
  transition: all 0.2s ease;
  width: 100%;
  max-width: 992px;
  margin: auto;
  padding: var(--app-default-page-padding);
  padding-bottom: 0;

  .top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    .banner-market-indices {
      padding-bottom: var(--app-default-page-padding);
    }
  }

  .logo-and-settings {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 8px;

    &.border-top {
      border-top: 1px solid var(--border-base);
    }

    .settings {
      width: 40px;
      height: 40px;

      .fa-cog {
        font-size: 20px;
      }
    }
  }

  .menu-items {
    display: flex;
    overflow-x: auto;
    box-shadow: 0 -1px var(--border-base) inset;

    .menu-item {
      padding: 12px 8px;
      white-space: nowrap;
      border-bottom: 2px solid transparent;
      color: var(--text-stress);

      &.selected {
        color: var(--brand-primary);
        border-bottom: 2px solid var(--brand-primary);
        font-weight: 700;
      }

      &:hover {
        color: var(--brand-primary-hover);
      }
    }
  }
}
</style>