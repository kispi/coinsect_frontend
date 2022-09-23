<template>
  <div
    @click="toggleChatFolded"
    class="app-chat-toggler center"
    :class="{
      'chat-ding': $store.getters.settings.chatDing,
      'folded': !$store.getters.settings.chatFolded,
    }">
    <i class="fa fa-comment f-32"/>
    <div class="overlay center f-10">TALK</div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, nextTick } from 'vue'
import { useStore } from 'vuex'
import useChatHandler from '@/hooks/chat-handler'

export default {
  emits: ['scroll-to-bottom'],
  setup(_, { emit }) {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

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
  --kakao-yellow: #F7E436;
  background: var(--kakao-yellow);

  i {
    color: #3B2323;
  }

  .overlay {
    color: var(--kakao-yellow);
  }
}
</style>