<template>
  <div
    v-if="$store.getters.settings.chatFolded"
    @click="toggleChatFolded"
    class="app-chat-toggler center"
    :class="{
      'chat-ding': $store.getters.settings.chatDing,
      'folded': !$store.getters.settings.chatFolded,
    }">
    <i class="fa fa-comment c-black f-32"/>
    <div class="overlay center f-10 c-white">TALK</div>
  </div>
</template>

<script>
import { onMounted, nextTick } from 'vue'
import useChatHandler from '@/hooks/chat-handler'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  emits: ['scroll-to-bottom'],
  setup(_, { emit }) {
    const { plugins, store } = useGlobalHooks()

    const { filteredMessages: messages } = useChatHandler()

    const toggleChatFolded = () => {
      store.commit('setSettings', { chatFolded: !store.getters.settings.chatFolded })
      // 펼쳐진 경우, 현재 로드된 마지막 메시지가 lastReadMessage가 되어야한다.
      if (!store.getters.settings.chatFolded) store.commit('setChat', { lastReadMessage: messages.value[messages.value.length - 1] })

      nextTick(() => {
        if (!store.getters.settings.chatFolded) emit('scroll-to-bottom')
      })
    }

    onMounted(() => {
      store.commit('setChat', { lastReadMessage: plugins.$helpers.localStorage.getMeta('lastReadMessage') })
    })

    return {
      toggleChatFolded,
    }
  },
}
</script>

<style lang="scss" scoped>
.app-chat-toggler {
  background: linear-gradient(-45deg, var(--bitcoin), var(--brand-primary));
  right: 16px;
  bottom: 16px;
  border-radius: 8px;
  padding: 8px;
  position: fixed;
  cursor: pointer;

  &:not(:hover) {
    opacity: 0.75;
  }
}
</style>