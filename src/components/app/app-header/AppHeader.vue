<template>
  <header class="app-header layout-centered">
    <div class="top">
      <BannerMarketIndices/>
      <div
        @click="$modal.custom({ component: 'ModalChatUsers' })"
        class="num-users f-mono f-12 cursor-pointer"
        :class="numConnectionsColorClass">
        <i class="fa fa-user-group m-r-4"/>
        {{ (($store.getters.chatStats || {}).numConnections || 0).toLocaleString() }}
      </div>
    </div>
    <div
      class="logo-and-settings"
      :class="{'border-top': $store.getters.indices}">
      <div class="flex-row flex-between items-center flex-fill">
        <AppLogo/>
        <div class="icons">
          <div
            @click="$helpers.openSite('https://btc.coinsect.io')"
            class="clickable-icon-wrapper">
            <a @click.prevent href="https://btc.coinsect.io" class="center"><i class="fab fa-bitcoin c-bitcoin"/></a>
          </div>
          <div
            @click="onClickShare"
            class="clickable-icon-wrapper">
            <i class="fal fa-share-alt icon-sharer"/>
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
            <BadgeUnreads :numUnreads="numNewNotifications" :small="true"/>
          </div>
          <div
            ref="refIconMenuAccount"
            @click="onClickMenuAccount"
            class="clickable-icon-wrapper">
            <i v-if="$store.getters.me" class="fal fa-circle-user"/>
            <div v-else class="f-10">로그인</div>
          </div>
        </div>
        <WrapperDropdownOverlay
          v-if="showNotifications"
          @close="showNotifications = null"
          :align="'right'"
          :mountBelow="refIconNotifications">
          <AppNotifications @close="showNotifications = false"/>
        </WrapperDropdownOverlay>
        <WrapperDropdownOverlay
          v-if="showSettings"
          @close="showSettings = null"
          :align="'right'"
          :mountBelow="refIconSettings">
          <SettingsPanel :indices="[0, 1, 2, 3, 4]" class="shadowed"/>
        </WrapperDropdownOverlay>
        <WrapperDropdownOverlay
          v-if="showMenuAccount"
          @close="showMenuAccount = null"
          :align="'right'"
          :mountBelow="refIconMenuAccount">
          <ul class="my-activity">
            <li @click="handleClickMyActivity(() => $modal.custom({ component: 'ModalUserStats', options: { user: $store.getters.me } }))">내 활동</li>
            <li @click="handleClickMyActivity(() => $modal.custom({ component: $store.getters.me ? 'ModalChatSettings' : 'ModalSignIn' }))">계정 설정</li>
            <li @click="handleClickMyActivity(() => $store.dispatch('signOut'))">{{ $translate('LOGOUT') }}</li>
          </ul>
        </WrapperDropdownOverlay>
      </div>
    </div>
    <nav class="ah-menu-items pretty-scrollbar">
      <a
        draggable="false"
        @click.prevent="e => onClickMenuItem(e, menuItem)"
        :href="menuItem.path"
        class="ah-menu-item"
        :class="{
          'selected': menuItem.$$selected,
          'hover': (subPages || []).some(subPage => subPage.path.includes(menuItem.pathPrefix)),
        }"
        :key="menuItem.title"
        v-for="menuItem in menuItems">
        {{ $translate(menuItem.title) }}<i v-if="menuItem.subPages" class="fal fa-chevron-down no-touch"/>
      </a>
    </nav>
    <SubHeader v-model="subPages"/>
  </header>
</template>

<script>
import { computed, ref, watch } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'
import useMenuItems from './menu-items'
import AppNotifications from './AppNotifications'
import BannerMarketIndices from './BannerMarketIndices'

export default {
  components: {
    AppNotifications,
    BannerMarketIndices,
  },
  setup() {
    const { plugins, store } = useGlobalHooks()

    const refIconSettings = ref(null)

    const refIconNotifications = ref(null)

    const refIconMenuAccount = ref(null)

    const showSettings = ref(null)

    const showNotifications = ref(null)

    const showMenuAccount = ref(null)

    const numConnectionsColorClass = ref(null)

    const { menuItems, subPages, onClickMenuItem } = useMenuItems()

    const numNewNotifications = computed(() => {
      const list = (store.getters.notifications || {}).data || []
      if (list.length === 0) return

      const d = plugins.$helpers.dayjs

      const lastId = plugins.$helpers.localStorage.getMeta('lastNotificationId')
      if (lastId) return list.filter(o => o.id > lastId).length

      return list.filter(o => d().diff(o.createdAt, 'hour') < 24).length
    })

    const onClickShare = () => {
      const url = window.location.origin + window.location.pathname
      plugins.$helpers.dom.copyToClipboard(encodeURI(url))
      plugins.$toast.success('현재 페이지 주소가 복사되었습니다. 카카오톡 등의 SNS로 붙여넣기해서 공유해보세요 🥰')
    }

    const handleClickMyActivity = handler => {
      handler()
      showMenuAccount.value = false
    }

    const onClickMenuAccount = () => {
      if (store.getters.me) {
        showMenuAccount.value = !showMenuAccount.value
        return
      }

      plugins.$modal.custom({ component: 'ModalSignIn' })
    }

    watch(
      () => store.getters.chatStats.numConnections,
      (newVal, oldVal) => {
        if (newVal > oldVal) numConnectionsColorClass.value = 'c-price-up'
        if (newVal < oldVal) numConnectionsColorClass.value = 'c-price-down'
      },
    )

    return {
      refIconNotifications,
      refIconSettings,
      refIconMenuAccount,
      showNotifications,
      showSettings,
      showMenuAccount,
      numConnectionsColorClass,
      numNewNotifications,
      menuItems,
      subPages,
      onClickMenuItem,
      onClickMenuAccount,
      onClickShare,
      handleClickMyActivity,
    }
  },
}
</script>

<style lang="scss">
.app-header {
  width: 100%;
  padding: 0 var(--app-default-page-padding);

  .top {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
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
      gap: 4px;
    }

    .clickable-icon-wrapper {
      width: 32px;
      height: 32px;
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
      user-select: none;
      cursor: pointer;

      &.selected {
        color: var(--brand-primary);
        border-bottom: 2px solid var(--brand-primary);
        font-weight: 700;
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

  .settings-panel {
    width: 320px;
  }

  .badge-unreads {
    position: absolute;
    top: 4px;
    right: 4px;
  }

  ul.my-activity {
    background: var(--background-base);
    border: 1px solid var(--border-light);
    border-radius: 4px;

    li {
      color: var(--text-stress);
      padding: 8px 12px;
      cursor: pointer;

      &:hover {
        background: var(--background-light);
      }

      &:not(:last-child) {
        border-bottom: 1px solid var(--border-base);
      }
    }
  }
}
</style>
