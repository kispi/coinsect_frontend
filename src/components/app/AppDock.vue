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
          class="icon-leaderboard"
          @click="$router.push('/indicators/leaderboard')"
          :active="$route.path === '/indicators/leaderboard'"
          :images="[$helpers.withCdn('images/exchanges/BITMEX.png')]"
          :tooltip="'LEADERBOARD'">
          <div class="overlay center">워뇨띠</div>
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
          :active="!$store.getters.settings.chatFolded">
          <AppChatToggler class="overlay"/>
        </AppDockIcon>
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
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px;
  z-index: 1;
  overflow-x: auto;
  transition: all 0.25s ease-in-out;

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
    width: 80px;
    margin-bottom: 8px;
    cursor: pointer;

    i {
      transition: all 0.25s ease;
      position: relative;
      color: var(--black);
    }
  }

  .icon-leaderboard {
    font-weight: 700;
    font-size: 12px;

    .overlay {
      background: rgba(0, 0, 0, 0.5);
      color: var(--white);
    }
  }

  &.folded {
    bottom: -68px;

    .dock-handle {
      animation: shakeY 2s ease-in-out infinite;

      i {
        transform: rotate(180deg);
      }
    }
  }
}
</style>