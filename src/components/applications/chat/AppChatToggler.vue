<template>
  <div
    v-if="store.getters.settings.chatFolded"
    @click="toggleChatFolded"
    class="app-chat-toggler center"
    :class="{
      'chat-ding': store.getters.settings.chatDing,
      'folded': !store.getters.settings.chatFolded,
    }">
    <i class="fa fa-comment c-black f-32"/>
    <div class="overlay center f-10 c-white">TALK</div>
    <BadgeUnreads :numUnreads="numUnreads"/>
  </div>
</template>

<script setup>
import { onMounted, nextTick } from 'vue'
import useChatHandler from '@/hooks/chat-handler'
import useGlobalHooks from '@/hooks/global-hooks'

const emit = defineEmits(['scroll-to-bottom'])

const { helpers, store } = useGlobalHooks()

const { filteredMessages: messages, numUnreads } = useChatHandler()

const toggleChatFolded = () => {
  store.commit('setSettings', { chatFolded: !store.getters.settings.chatFolded })
  // 펼쳐진 경우, 현재 로드된 마지막 메시지가 lastReadMessage가 되어야한다.
  if (!store.getters.settings.chatFolded) store.commit('setChat', { lastReadMessage: messages.value[messages.value.length - 1] })

  nextTick(() => {
    if (!store.getters.settings.chatFolded) emit('scroll-to-bottom')
  })

  if (store.getters.isMobile) store.commit('setShowNavigation', false)
}

onMounted(() => {
  store.commit('setChat', { lastReadMessage: helpers.localStorage.getMeta('lastReadMessage') })
})
</script>

<style lang="scss" scoped>
.app-chat-toggler {
  background: linear-gradient(-45deg, var(--bitcoin), var(--brand-primary));
  right: 16px;
  bottom: 16px;
  border-radius: 8px;
  padding: 8px;
  position: fixed;
  z-index: 1;
  cursor: pointer;

  &:not(:hover) {
    opacity: 0.9;
  }

  .badge-unreads {
    position: absolute;
    top: -4px;
    right: -4px;
  }
}
</style>