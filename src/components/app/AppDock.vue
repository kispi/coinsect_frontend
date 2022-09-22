<template>
  <div class="app-dock">
    <div class="dock-container">
      <div class="app-icons">
        <AppDockIcon
          @click="$router.push('/')"
          :tooltip="'KIMP'">
          <AppImg :src="'https://auseinet.com/wp-content/uploads/2022/07/%EC%97%85%EB%B9%84%ED%8A%B8-%EB%A1%9C%EA%B3%A0-3.png'"/>
        </AppDockIcon>
        <AppDockIcon
          @click="$router.push('/indicators/real-time-positions')"
          :tooltip="'REAL_TIME_POSITIONS'">
          <AppImg :src="'https://file.mk.co.kr/meet/neds/2019/12/image_readtop_2019_1090982_15774420584030248.jpg'"/>
        </AppDockIcon>
        <AppDockIcon
          @click="$router.push('/onchain/whale-alert')"
          :tooltip="'WHALE_ALERT'">
          <AppImg :src="'https://whale-alert.io/assets/images/logo-small-35.png'"/>
        </AppDockIcon>        
        <AppDockIcon
          @click="$router.push('/contents/economic-calendar')"
          :tooltip="'ECONOMIC_CALENDAR'">
          <AppImg :src="'https://cloudfront-eu-central-1.images.arcpublishing.com/irishtimes/6OD6I2HARW7GETZUYOLYMEVMBE.jpg'"/>
        </AppDockIcon>        
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

  .dock-container {
    backdrop-filter: blur(2px);
    border-radius: 24px;
    margin: auto;
    background: rgba(255, 255, 255, 0.5);
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

  @keyframes hover-icon {
    0% {
      transform: scale(1) rotate(5deg);
    }

    50% {
      transform: scale(1) rotate(-5deg);
    }

    100% {
      transform: scale(1) rotate(5deg);
    }
  }
}
</style>