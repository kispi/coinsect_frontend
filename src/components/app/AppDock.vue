<template>
  <div
    class="app-dock"
    :class="{'folded': $store.getters.settings.dockFolded}">
    <div
      @click="$store.commit('setSettings', { dockFolded: !$store.getters.settings.dockFolded })"
      class="dock-handle shadowed">
      <div class="glass overlay"/>
      <i class="fa m-a display-table fa-chevron-down"/>
    </div>
    <div class="scrollable-wrapper">
      <div class="dock-container shadowed">
        <div class="glass overlay"/>
        <div class="app-icons">
          <AppDockIcon
            @click="$router.push('/')"
            :active="$route.path === '/'"
            :tooltip="'KIMP'"
            :images="[
              'https://theme.zdassets.com/theme_assets/9190474/3941022f7857ffa2b0ac3cb9165aec2c2e4a4e89.jpg',
            ]"
          />
          <AppDockIcon
            @click="$router.push('/indicators/real-time-positions')"
            :active="$route.path === '/indicators/real-time-positions'"
            :tooltip="'REAL_TIME_POSITIONS'"
            :images="[
              'https://d1085v6s0hknp1.cloudfront.net/images/influencers/hodu_park.jpg',
              'https://file.mk.co.kr/meet/neds/2019/12/image_readtop_2019_1090982_15774420584030248.jpg',
              'https://d1085v6s0hknp1.cloudfront.net/images/influencers/saddo.png',
            ]"
          />
          <AppDockIcon
            @click="$router.push('/indicators/leaderboard')"
            :active="$route.path === '/indicators/leaderboard'"
            :images="[$helpers.withCdn('images/exchanges/BITMEX.png')]"
            :tooltip="'LEADERBOARD'">
          </AppDockIcon>
          <AppDockIcon
            @click="$router.push('/onchain/whale-alert')"
            :active="$route.path === '/onchain/whale-alert'"
            :tooltip="'WHALE_ALERT'"
            :images="['https://whale-alert.io/assets/images/logo-small-35.png']"
          />
          <AppDockIcon
            @click="$router.push('/contents/economic-calendar')"
            :active="$route.path === '/contents/economic-calendar'"
            :tooltip="'ECONOMIC_CALENDAR'"
            :images="[
              'https://cloudfront-eu-central-1.images.arcpublishing.com/irishtimes/6OD6I2HARW7GETZUYOLYMEVMBE.jpg',
              'https://upload.wikimedia.org/wikipedia/commons/f/f4/Janet_Yellen_official_Federal_Reserve_portrait.jpg',
              'https://pbs.twimg.com/profile_images/1554729553758756864/o0L77J1V_400x400.jpg',
              'https://i.ytimg.com/vi/DUrlNHTxuJM/hqdefault.jpg',
            ]"
          />
          <AppDockIcon
            :numUnreads="numUnreads"
            :active="!$store.getters.settings.chatFolded"
            :tooltip="'채팅'">
            <AppChatToggler class="overlay"/>
          </AppDockIcon>
          <AppDockIcon
            @click="$router.push('/community')"
            :active="$route.path.startsWith('/community')"
            :tooltip="'COMMUNITY'">
            <div class="icon-community center overlay">
              <i class="fa f-30 fa-square-pen c-gs-22"/>
            </div>
          </AppDockIcon>
          <AppDockIcon
            @click="$modal.custom({ component: 'ModalChatSettings' })"
            :active="$modal.isOpened('ModalChatSettings')"
            :tooltip="'MODAL_CHAT_SETTINGS'">
            <div class="icon-settings center overlay">
              <i class="fa f-24 fa-cog c-gs-22"/>
            </div>
          </AppDockIcon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppChatToggler from '@/components/applications/chat/AppChatToggler'
import AppDockIcon from './AppDockIcon'
import useChatHandler from '@/hooks/chat-handler'

export default {
  components: {
    AppChatToggler,
    AppDockIcon,
  },
  setup() {
    const { numUnreads } = useChatHandler()

    return {
      numUnreads,
    }
  }
}
</script>

<style lang="scss" scoped>
.app-dock {
  .glass {
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(2px);
    border-radius: 24px;
  }

  .dock-container,
  .dock-handle {
    border-radius: 24px;
    margin: auto;
    border: 1px solid var(--border-light);
    display: table;
    position: relative;
    pointer-events: auto;
  }

  .scrollable-wrapper,
  .dock-handle {
    transition: all 0.25s ease-in-out;
    z-index: 1;
    position: fixed;
  }

  .scrollable-wrapper {
    overflow-x: auto;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 8px;
  }

  .dock-container {
    padding: 8px 8px 4px;

    .app-icons {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .dock-handle {
    left: calc(50% - 40px);
    bottom: 88px;
    width: 80px;
    cursor: pointer;

    i {
      transition: all 0.25s ease;
      position: relative;
      color: var(--black);
    }
  }

  .icon-community {
    background: linear-gradient(45deg, rgba(0, 0, 0, 0), rgba(2, 253, 94, 0.5));
  }

  .icon-settings {
    background: linear-gradient(45deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
  }

  .app-chat-toggler {
    background: linear-gradient(-45deg, var(--bitcoin), var(--brand-primary));
  }

  &.folded {
    .dock-handle {
      animation: shakeY 2s ease-in-out infinite;
      bottom: 8px;

      i {
        transform: rotate(180deg);
      }
    }

    .scrollable-wrapper {
      bottom: -84px;
    }
  }

  @media (min-width: 768px) {
    pointer-events: none;
  }
}
</style>