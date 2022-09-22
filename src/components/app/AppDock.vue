<template>
  <div class="app-dock">
    <div class="dock-container">
      <div class="app-icons">
        <AppDockIcon
          @click="$router.push('/')"
          :tooltip="'KIMP'"
          :images="[
            'https://auseinet.com/wp-content/uploads/2022/07/%EC%97%85%EB%B9%84%ED%8A%B8-%EB%A1%9C%EA%B3%A0-3.png',
          ]"
        />
        <AppDockIcon
          @click="$router.push('/indicators/real-time-positions')"
          :tooltip="'REAL_TIME_POSITIONS'"
          :images="[
            'https://d1085v6s0hknp1.cloudfront.net/images/influencers/hodu_park.jpg',
            'https://file.mk.co.kr/meet/neds/2019/12/image_readtop_2019_1090982_15774420584030248.jpg',
            'https://d1085v6s0hknp1.cloudfront.net/images/influencers/saddo.png',
          ]"
        />
        <AppDockIcon
          class="bg-bitcoin f-12"
          @click="$router.push('/indicators/leaderboard')"
          :tooltip="'LEADERBOARD'">
          워뇨띠
        </AppDockIcon>
        <AppDockIcon
          @click="$router.push('/onchain/whale-alert')"
          :tooltip="'WHALE_ALERT'"
          :images="['https://whale-alert.io/assets/images/logo-small-35.png']"
        />
        <AppDockIcon
          @click="$router.push('/contents/economic-calendar')"
          :tooltip="'ECONOMIC_CALENDAR'"
          :images="[
            'https://cloudfront-eu-central-1.images.arcpublishing.com/irishtimes/6OD6I2HARW7GETZUYOLYMEVMBE.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/f/f4/Janet_Yellen_official_Federal_Reserve_portrait.jpg',
            'https://pbs.twimg.com/profile_images/1554729553758756864/o0L77J1V_400x400.jpg',
            'https://i.ytimg.com/vi/DUrlNHTxuJM/hqdefault.jpg',
          ]"
        />
        <AppIconChat class="app-dock-icon bg-brand-primary"/>
      </div>
    </div>
  </div>
</template>

<script>
import AppIconChat from '@/components/applications/chat/AppIconChat'
import AppDockIcon from './AppDockIcon'

export default {
  components: {
    AppIconChat,
    AppDockIcon,
  },
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

  .dock-container {
    backdrop-filter: blur(2px);
    border-radius: 24px;
    margin: auto;
    background: rgba(255, 255, 255, 0.5);
    box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.5);
    border: 1px solid var(--border-light);
    padding: 8px;
    display: table;

    .app-icons {
      display: flex;
      align-items: center;
      justify-content: center;

      .app-icon {
        width: 64px;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: center;

        i {
          font-size: 32px;
        }
      }
    }
  }
}
</style>