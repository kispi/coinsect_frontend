<template>
  <a
    v-if="post"
    class="banner-bitcoin-blog"
    :href="`https://btc.coinsect.io/posts/${post.sharingKey}`"
    target="_blank"
    rel="noreferrer">
    <i class="fab fa-bitcoin c-bitcoin f-14"/>
    <span class="post-title" v-html="$translate(post.title)"/>
  </a>
</template>

<script>
import { onMounted, onUnmounted, ref } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  setup() {
    const { plugins, store } = useGlobalHooks()

    const posts = ref(null)

    const post = ref(null)

    const interv = ref(null)

    const mustParse = async json => {
      try {
        return JSON.parse(json).ko
      } catch (e) {
        return json
      }
    }

    const populateNextPost = async () => {
      const next = posts.value[Math.floor(Math.random() * posts.value.length)]
      post.value = {
        title: await mustParse(next.title),
        content: await mustParse(next.content),
        sharingKey: next.sharingKey,
      }
    }

    const init = async () => {
      try {
        const resp = await plugins.$http.get('posts?where=board_id=3')
        posts.value = resp.data
        populateNextPost()

        if (!store.getters.isSSR) {
          interv.value = setInterval(populateNextPost, 5000)
        }
      } catch (e) {
        plugins.$toast.error(e.data.message)
      }
    }

    onMounted(init)

    onUnmounted(() => {
      if (store.getters.isSSR) return

      clearInterval(interv.value)
    })

    return {
      post,
      posts,
    }
  },
}
</script>

<style lang="scss" scoped>
.banner-bitcoin-blog {
  position: relative;
  overflow: hidden;
  display: block;
  color: var(--text-stress);

  .post-title {
    margin-left: 4px;
  }
}
</style>