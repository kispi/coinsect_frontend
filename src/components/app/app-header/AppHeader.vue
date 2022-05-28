<template>
  <header class="app-header layout-centered">
    <SearchFaker/>
    <div class="top">
      <!-- <CoinnessIssues v-show="$store.getters.windowInnerWidth >= 480"/> -->
      <BannerMarketIndices/>
    </div>
    <div
      class="logo-and-settings"
      :class="{'border-top': $store.getters.indices}">
      <div class="flex-row flex-between items-center flex-fill">
        <AppLogo/>
        <div class="icons">
          <div class="clickable-icon-wrapper">
            <AppSharer/>
          </div>
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
          <!-- <div
            @click="onClickAccount"
            class="clickable-icon-wrapper">
            <i v-if="$store.getters.me" class="fa fa-circle-user"/>
            <div v-else>로그인</div>
          </div> -->
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
    <nav class="ah-menu-items pretty-scrollbar">
      <a
        draggable="false"
        @click.prevent="onClickMenuItem(menuItem)"
        @mouseover="onMouseoverMenuItem(menuItem)"
        :href="menuItem.path"
        class="ah-menu-item"
        :class="{
          'selected': menuItem.$$selected,
          'hover': (subPages || []).some(subPage => subPage.path.includes(menuItem.pathPrefix)),
        }"
        :key="menuItem.title"
        v-for="menuItem in menuItems">
        {{ $translate(menuItem.title) }}<i v-if="menuItem.subPages" class="fal fa-chevron-down"/>
      </a>
    </nav>
    <SubHeader v-model="subPages"/>
  </header>
</template>

<script>
import { computed, getCurrentInstance, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import useMenuItems from './menu-items'
import AppNotifications from './AppNotifications'
import BannerMarketIndices from './BannerMarketIndices'
import SettingsPanel from './SettingsPanel'
import SearchFaker from './SearchFaker'

export default {
  components: {
    AppNotifications,
    BannerMarketIndices,
    SettingsPanel,
    SearchFaker,
  },
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const router = useRouter()

    const refIconSettings = ref(null)

    const refIconNotifications = ref(null)

    const showSettings = ref(null)

    const showNotifications = ref(null)

    const { menuItems, subPages, onClickMenuItem, onMouseoverMenuItem } = useMenuItems()

    const numNewNotifications = computed(() => {
      const n = store.getters.notifications
      if (!n) return

      const d = plugins.$helpers.dayjs

      return (n.data || []).filter(o => d().diff(o.createdAt, 'hour') < 24).length
    })

    const onClickAccount = () => {
      if (store.getters.me) router.push('/account')
      else plugins.$modal.custom({ component: 'ModalSignIn' })
    }

    return {
      refIconNotifications,
      refIconSettings,
      showNotifications,
      showSettings,
      numNewNotifications,
      menuItems,
      subPages,
      onClickMenuItem,
      onMouseoverMenuItem,
      onClickAccount,
    }
  },
}
</script>

<style lang="scss">
.app-header {
  transition: all 0.2s ease;
  width: 100%;
  padding: 0 var(--app-default-page-padding);

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .coinness-issues,
    .banner-market-indices {
      padding: var(--app-default-page-padding) 0;
    }
  }

  .logo-and-settings {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 8px;

    .section-logo {
      display: flex;
      align-items: baseline;
    }

    &.border-top {
      border-top: 1px solid var(--border-base);
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

      .app-sharer,
      .app-sharer i {
        width: 100%;
        height: 100%;
      }

      .app-sharer i {
        display: flex;
        align-items: center;
        justify-content: center;
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

  .ah-menu-items {
    display: flex;
    overflow-x: auto;
    box-shadow: 0 -1px var(--border-base) inset;

    .ah-menu-item {
      display: flex;
      align-items: center;
      padding: 12px 8px;
      white-space: nowrap;
      border-bottom: 2px solid transparent;
      color: var(--text-stress);
      position: relative;
      transition: none;
      cursor: pointer;

      &.selected {
        color: var(--brand-primary);
        border-bottom: 2px solid var(--brand-primary);
      }

      &.hover,
      &:hover {
        color: var(--brand-primary-hover);
      }

      i {
        font-size: 10px;
        margin-left: 4px;
      }
    }
  }
}
</style>