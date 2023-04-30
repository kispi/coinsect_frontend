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
            @click="icon.handler"
            :active="icon.active"
            :tooltip="icon.tooltip"
            :images="icon.images"
            :numUnreads="icon.numUnreads"
            :key="idx"
            v-for="(icon, idx) in icons">
            <component v-if="icon.component" :is="icon.component" class="overlay"/>
            <div v-if="icon.html" v-html="icon.html"/>
          </AppDockIcon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import AppChatToggler from '@/components/applications/chat/AppChatToggler'
import AppDockIcon from './AppDockIcon'
import useChatHandler from '@/hooks/chat-handler'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  components: {
    AppChatToggler,
    AppDockIcon,
  },
  setup() {
    const { plugins, store, router } = useGlobalHooks()

    const { numUnreads } = useChatHandler()

    const icons = computed(() => {
      const p = router.currentRoute.value.path
      return [{
        handler: () => router.push('/prices'),
        active: p === '/prices',
        tooltip: 'KIMP',
        images: ['https://theme.zdassets.com/theme_assets/9190474/3941022f7857ffa2b0ac3cb9165aec2c2e4a4e89.jpg'],
      }, {
        handler: () => router.push('/indicators/real-time-positions'),
        active: p === '/indicators/real-time-positions',
        tooltip: 'REAL_TIME_POSITIONS',
        images: ['icon-jg', 'icon-saddo'].map(f => plugins.$helpers.withCdn(`assets/${f}.jpg`)),
      }, {
        handler: () => router.push('/indicators/leaderboard'),
        active: p === '/indicators/leaderboard',
        tooltip: 'BITMEX_LEADERBOARD',
        images: [plugins.$helpers.withCdn('images/exchanges/BITMEX.png')]
      }, {
        handler: () => router.push('/indicators/whale-alert'),
        active: p === '/indicators/whale-alert',
        tooltip: 'WHALE_ALERT',
        images: [plugins.$helpers.withCdn('assets/icon-whalealert.jpg')],
      }, {
        handler: () => router.push('/contents/economic-calendar'),
        active: p === '/contents/economic-calendar',
        tooltip: 'ECONOMIC_CALENDAR',
        images: [plugins.$helpers.withCdn('assets/icon-investing.jpg')],
      }, {
        numUnreads: numUnreads.value,
        active: !store.getters.settings.chatFolded,
        component: 'AppChatToggler',
      }, {
        handler: () => plugins.$modal.custom({ component: 'ModalChatSettings' }),
        active: plugins.$modal.isOpened('ModalChatSettings'),
        tooltip: 'MODAL_CHAT_SETTINGS',
        html: `<div class="icon-settings center overlay">
          <i class="fa f-24 fa-cog c-gs-22"/>
        </div>`
      }]
    })

    return {
      numUnreads,
      icons,
    }
  },
}
</script>

<style lang="scss">
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

  .icon-settings {
    background: linear-gradient(45deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
  }

  .app-chat-toggler {
    background: linear-gradient(-45deg, var(--bitcoin), var(--brand-primary));
  }

  &.folded {
    .dock-handle {
      animation: shakeY 2s ease-in-out infinite;
      bottom: 4px;

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