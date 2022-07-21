<template>
  <div
    v-if="link && (meta.image || meta.title || meta.description)"
    class="app-chat-message-meta-tags"
    :class="{'mine': message.isMine}"
    @click="onClickCard">
    <div
      v-if="meta.image"
      class="meta-image">
      <AppImg :src="meta.image" class="overlay"/>
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
import { getCurrentInstance, ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import helperService from '@/services/helper'

export default {
  props: {
    message: null,
    scrollToBottom: Function,
  },
  setup(props) {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const meta = ref({
      image: null,
      title: null,
      description: null,
    })

    const onClickCard = () => {
      if (!link.value) return

      window.open(link.value, '_blank', 'noreferrer noopener')
    }

    const link = computed(() => plugins.$helpers.retrieveUrlFromString(props.message.text))

    const tryMetaTags = async () => {
      if (!link.value) return

      if (['.jpg', '.jpeg', '.png', '.svg', '.gif'].some(ext => link.value.endsWith(ext))) {
        meta.value.image = link.value
        return
      }

      try {
        const data = await helperService.crawlMetaTags(link.value)
        data.forEach(t => {
          if ((t.property || '').endsWith(':image')) meta.value.image = t.content
          if ((t.property || '').endsWith(':title')) meta.value.title = t.content
          if ((t.property || '').endsWith(':description')) meta.value.description = t.content
        })
        if (store.getters.chat.autoScrollable) props.scrollToBottom()
      } catch (e) {}
    }

    onMounted(tryMetaTags)

    return {
      meta,
      link,
      onClickCard,
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