<template>
  <header class="app-header view-layout-default">
    <div class="top">
      <BannerMarketIndices/>
      <AdaptiveLayout
        :gap="$store.getters.isMobile ? 0 : 8"
        class="f-12 items-center">
        <i class="c-text-base far fa-user-friends"/>
        <div class="c-text-stress flex-wrap" v-html="($store.getters.numActiveUsers || 0).toLocaleString()"/>
      </AdaptiveLayout>
    </div>
    <div
      class="logo-and-settings"
      :class="{'border-top': $store.getters.indices}">
      <div class="flex-row flex-between items-center flex-fill">
        <AppLogo/>
        <div class="icons">
          <div
            ref="refIconSettings"
            @click="showSettings = !showSettings"
            class="clickable-icon-wrapper">
            <i
              class="fa-cog"
              :class="showSettings ? 'fa' : 'fal'"
            />
          </div>
          <div
            ref="refIconNotifications"
            @click="showNotifications = !showNotifications"
            class="clickable-icon-wrapper">
            <i
              class="fa-bell"
              :class="showNotifications ? 'fa' : 'fal'"
            />
            <div
              v-if="numNewNotifications"
              class="icon-badge"
              v-html="numNewNotifications"
            />
          </div>
        </div>
        <WrapperDropdownOverlay
          v-model="showNotifications"
          :align="'right'"
          :mountBelow="refIconNotifications">
          <AppNotifications v-if="showNotifications" @close="showNotifications = false"/>
        </WrapperDropdownOverlay>
        <WrapperDropdownOverlay
          v-model="showSettings"
          :align="'right'"
          :mountBelow="refIconSettings">
          <SettingsPanel/>
        </WrapperDropdownOverlay>
      </div>
    </div>
    <nav class="menu-items">
      <RouterLink
        class="menu-item"
        :class="{
          'selected': menuItem.$$selected,
        }"
        :to="menuItem.path"
        :key="menuItem.title"
        v-for="menuItem in menuItems">
        {{ $translate(menuItem.title) }}<span v-if="menuItem.$$new" class="new"/>
      </RouterLink>
    </nav>
  </header>
</template>

<script>
import { computed, getCurrentInstance, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import AppNotifications from './AppNotifications'
import BannerMarketIndices from './BannerMarketIndices'
import SettingsPanel from './SettingsPanel'

export default {
  components: {
    AppNotifications,
    BannerMarketIndices,
    SettingsPanel,
  },
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const router = useRouter()

    const refIconSettings = ref(null)

    const refIconNotifications = ref(null)

    const showSettings = ref(null)

    const showNotifications = ref(null)

    const numNewNotifications = computed(() => {
      const n = store.getters.notifications
      if (!n) return

      const d = plugins.$helpers.dayjs

      return (n.data || []).filter(o => d().diff(o.createdAt, 'hour') < 24).length
    })

    const menuItems = computed(() => [{
      title: 'HOME',
      path: '/',
    }, {
      title: 'INDICATORS',
      path: '/indicators/leaderboard',
      $$new: true,
    }, {
      title: 'CONTENTS',
      path: '/contents/influencers',
      $$new: true,
    }, {
      title: 'COMMUNITY',
      path: '/community',
    }, {
      title: 'PORTFOLIO',
      path: '/portfolio',
    }, {
      title: 'GAMES',
      path: '/games',
    }, {
      title: 'UPDATES',
      path: '/updates',
    // }, {
    //   title: 'NEWS',
    //   path: '/news',
    // }, {
    //   title: 'ABOUT',
    //   path: '/about',
    }].map(o => {
      const p = router.currentRoute.value.path

      return {
        ...o,
        $$selected: (() => {
          if (o.title === 'HOME') return p === '/'

          if (o.title === 'INDICATORS') return p.startsWith('/indicators/')

          if (o.title === 'CONTENTS') return p.startsWith('/contents/')

          else return p.startsWith(o.path)
        })()
      }
    }))

    return {
      refIconNotifications,
      refIconSettings,
      showNotifications,
      showSettings,
      menuItems,
      numNewNotifications,
    }
  },
}
</script>

<style lang="scss" scoped>
.app-header {
  transition: all 0.2s ease;
  width: 100%;
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

    .wrapper-dropdown-overlay {
      z-index: 6;
    }

    .icons {
      display: flex;
    }

    .clickable-icon-wrapper {
      width: 40px;
      height: 40px;
      position: relative;

      i {
        font-size: 20px;
      }
    }

    .icon-badge {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      color: var(--white);
      background: var(--brand-primary);
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 4px;
      right: 4px;
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
      position: relative;

      &.selected {
        color: var(--brand-primary);
        border-bottom: 2px solid var(--brand-primary);
        font-weight: 700;
      }

      &:hover {
        color: var(--brand-primary-hover);
      }

      .new {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        position: absolute;
        right: 0;
        top: calc(50% - 8px);
        background: var(--brand-primary);
      }
    }
  }
}
</style>