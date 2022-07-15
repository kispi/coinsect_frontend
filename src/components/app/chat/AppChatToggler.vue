<template>
  <div
    @click="toggleChatFolded"
    class="app-chat-toggler"
    :class="{
      'chat-ding': $store.getters.settings.chatDing,
      'o-0 no-touch': !$store.getters.settings.chatFolded,
    }">
    <i class="fal fa-comment-dots"/>
    <div
      v-if="numUnreads"
      class="badge-unreads center">
      {{ numUnreads > 999 ? '999+' : numUnreads }}
    </div>
  </div>
</template>

<script>
import { ref, computed, getCurrentInstance, watch, onMounted, nextTick } from 'vue'
import { useStore } from 'vuex'
import useChatHandler from '@/hooks/chat-handler'

export default {
  props: {
    scrollToBottom: Function,
  },
  setup(props) {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const { filteredMessages: messages } = useChatHandler()

    const storedUnreads = ref(null)

    const numUnreads = computed(() => {
      if (storedUnreads.value) return storedUnreads.value

      if ((messages.value || []).length === 0) return 0

      return messages.value.filter(message => {
        if (!store.getters.chat.lastReadMessage) return

        return message.timestamp > store.getters.chat.lastReadMessage.timestamp
      }).length
    })

    const toggleChatFolded = () => {
      store.commit('setSettings', { chatFolded: !store.getters.settings.chatFolded })
      if (!store.getters.settings.chatFolded) {
        storedUnreads.value = 0
        plugins.$helpers.localStorage.setMeta('numUnreads')
      }

      nextTick(() => {
        if (!store.getters.settings.chatFolded) props.scrollToBottom()
      })
    }

    onMounted(() => {
      storedUnreads.value = plugins.$helpers.localStorage.getMeta('numUnreads')
    })

    watch(
      () => numUnreads.value,
      newVal => {
        if (newVal > 0) {
          plugins.$helpers.localStorage.setMeta('numUnreads', newVal)
        }
      },
    )

    return {
      numUnreads,
      toggleChatFolded,
    }
  },
}
</script>

<style lang="scss" scoped>
.app-chat-toggler {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--brand-primary-50);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.24);
  border-radius: 50%;
  right: 8px;
  bottom: 8px;
  cursor: pointer;

  &.chat-ding {
    background: var(--brand-primary);
  }

  .fa-comment-dots {
    font-size: 24px;
    color: var(--white);
  }

  .badge-unreads {
    min-width: 24px;
    min-height: 24px;
    padding: 4px;
    border-radius: 12px;
    background: var(--danger);
    color: var(--white);
    position: absolute;
    top: 0;
    right: 0;
  }

  &:hover {
    background: var(--brand-primary-hover);
  }
}
</style>