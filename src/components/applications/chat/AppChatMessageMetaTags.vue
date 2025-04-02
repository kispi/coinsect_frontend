<template>
  <div
    v-if="link && (meta.image || meta.title || meta.description)"
    class="app-chat-message-meta-tags"
    :class="{'mine': message.isMine}">
    <MetaCard :meta="meta" :small="true" :link="link"/>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import useSeo from '@/hooks/seo'
import useGlobalHooks from '@/hooks/global-hooks'

const props = defineProps({
  message: null,
})

const emit = defineEmits(['scroll-to-bottom'])

const { helpers, store } = useGlobalHooks()

const { meta, tryMetaTags } = useSeo()

const link = computed(() => helpers.logic.retrieveUrlFromString(props.message.text))

const init = async () => {
  try {
    await tryMetaTags(link.value)
    setTimeout(() => (store.getters.chat.autoScrollable ? emit('scroll-to-bottom') : null))
  } catch (e) {}
}

onMounted(init)
</script>

<style lang="scss" scoped>
.app-chat-message-meta-tags {
  width: 200px;

  &.mine {
    margin-left: auto;
  }
}
</style>