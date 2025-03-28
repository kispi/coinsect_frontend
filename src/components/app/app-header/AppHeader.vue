<template>
  <header class="app-header">
    <div class="top">
      <BannerMarketIndices/>
      <div
        @click="helpers.modal.custom({ component: 'ModalChatUsers' })"
        class="num-users f-mono f-12 cursor-pointer"
        :class="numConnectionsColorClass">
        <i class="fa fa-user-group m-r-4"/>
        {{ ((store.getters.chatStats || {}).numConnections || 0).toLocaleString() }}
      </div>
    </div>
    <div class="logo-and-settings">
      <div class="flex-row flex-between items-center flex-fill">
        <div class="flex-row items-center no-select">
          <div
            v-if="store.getters.windowInnerWidth < 1600"
            @click="store.commit('setShowNavigation', !store.getters.showNavigation)"
            class="clickable-icon-wrapper m-r-4">
            <i
              class="fal menu-icon"
              :class="store.getters.showNavigation ? 'fa-times' : 'fa-bars'"
            />
          </div>
          <AppLogo/>
        </div>
        <div class="icons">
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
            <i v-if="store.getters.me" class="fal fa-circle-user"/>
            <div v-else class="f-10">{{ helpers.translate('MODAL_SIGN_IN') }}</div>
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
            <li @click="handleClickMyActivity(() => helpers.modal.custom({ component: 'ModalUserStats', options: { user: store.getters.me } }))">내 활동</li>
            <li @click="handleClickMyActivity(() => helpers.modal.custom({ component: store.getters.me ? 'ModalChatSettings' : 'ModalSignIn' }))">계정 설정</li>
            <li @click="handleClickMyActivity(() => store.dispatch('signOut'))">{{ helpers.translate('LOGOUT') }}</li>
          </ul>
        </WrapperDropdownOverlay>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'
import AppNotifications from './AppNotifications'
import BannerMarketIndices from './BannerMarketIndices'

const { helpers, store } = useGlobalHooks()

const refIconSettings = ref(null)

const refIconNotifications = ref(null)

const refIconMenuAccount = ref(null)

const showSettings = ref(false)

const showNotifications = ref(false)

const showMenuAccount = ref(false)

const numConnectionsColorClass = ref(null)

const numNewNotifications = computed(() => {
  const list = (store.getters.notifications || {}).data || []
  if (list.length === 0) return

  const d = helpers.dayjs

  const lastId = helpers.localStorage.getMeta('lastNotificationId')
  if (lastId) return list.filter(o => o.id > lastId).length

  return list.filter(o => d().diff(o.createdAt, 'hour') < 24).length
})

const onClickShare = () => {
  const url = window.location.origin + window.location.pathname
  helpers.dom.copyToClipboard(encodeURI(url))
  helpers.toast.success('현재 페이지 주소가 복사되었습니다. 카카오톡 등의 SNS로 붙여넣기해서 공유해보세요 🥰')
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

  helpers.modal.custom({ component: ModalSignIn })
}

watch(
  () => store.getters.chatStats.numConnections,
  (newVal, oldVal) => {
    if (newVal > oldVal) numConnectionsColorClass.value = 'c-price-up'
    if (newVal < oldVal) numConnectionsColorClass.value = 'c-price-down'
  },
)
</script>

<style lang="scss">
.app-header {
  width: 100%;
  padding: 0 var(--app-default-page-padding);
  background: var(--background-base);

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
    padding: 8px 0;
    border-top: 1px solid var(--border-base);
    border-bottom: 1px solid var(--border-base);

    .section-logo {
      display: flex;
      align-items: baseline;
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
