<template>
  <div
    v-if="link && (meta.image || meta.title || meta.description)"
    class="app-chat-message-meta-tags"
    :class="{'mine': message.isMine}">
    <MetaCard :meta="meta" :small="true" :link="link"/>
  </div>
</template>

<script>
import { onMounted, computed } from 'vue'
import useSeo from '@/hooks/seo'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  emits: ['scroll-to-bottom'],
  props: {
    message: null,
  },
  setup(props, { emit }) {
    const { plugins, store } = useGlobalHooks()

    const { meta, tryMetaTags } = useSeo()

    const link = computed(() => plugins.$helpers.logic.retrieveUrlFromString(props.message.text))

    const init = async () => {
      try {
        await tryMetaTags(link.value)
        setTimeout(() => store.getters.chat.autoScrollable ? emit('scroll-to-bottom') : null)
      } catch (e) {}
    }

    onMounted(init)

    return {
      meta,
      link,
    }
  },
}
</script>

<style lang="scss" scoped>
.app-chat-message-meta-tags {
  width: 200px;

  &.mine {
    margin-left: auto;
  }
}
</style>