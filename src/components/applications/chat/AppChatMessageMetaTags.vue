<template>
  <div
    v-if="link && (meta.image || meta.title || meta.description)"
    class="app-chat-message-meta-tags"
    :class="{'mine': message.isMine}"
    @click="onClickMetaCard(link)">
    <div
      v-if="meta.image"
      class="meta-image">
      <div v-if="$store.getters.settings.chatHideImage" class="overlay center bg-danger p-16 f-12">이미지를 보지 않습니다.<br>(채팅 설정에서 변경 가능합니다)</div>
      <AppImg v-else :src="meta.image" class="overlay"/>
    </div>
    <div
      v-if="meta.title || meta.description"
      class="meta-info">
      <div v-if="meta.title" class="meta-title lines-1" v-html="meta.title"/>
      <div v-if="meta.description" class="meta-description lines-2" v-html="meta.description"/>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import useSeo from '@/hooks/seo'

export default {
  emits: ['scroll-to-bottom'],
  props: {
    message: null,
  },
  setup(props, { emit }) {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const { meta, tryMetaTags, onClickMetaCard } = useSeo()

    const link = computed(() => plugins.$helpers.retrieveUrlFromString(props.message.text))

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
      onClickMetaCard,
    }
  },
}
</script>

<style lang="scss" scoped>
.app-chat-message-meta-tags {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.24);
  width: 200px;
  border: 1px solid var(--border-base);
  cursor: pointer;

  .meta-image {
    padding-top: 56.25%;
    position: relative;
  }

  .meta-info {
    background: var(--white);
    padding: 8px 12px;
    color: var(--black);

    .meta-title {
      font-size: 12px;
      font-weight: 500;
    }

    .meta-description {
      font-size: 10px;
      line-height: 16px;
      margin-top: 8px;
    }
  }

  &.mine {
    margin-left: auto;
  }
}
</style>