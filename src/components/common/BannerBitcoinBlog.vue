<template>
  <div
    class="banner-bitcoin-blog"
    :class="$store.getters.settings.theme">
    <a
      v-if="post"
      :href="`https://btc.coinsect.io/posts/${post.sharingKey}`"
      target="_blank"
      rel="noreferrer"
      class="lines-1">
      <span class="post-title" v-html="$translate(post.title)"/>
    </a>
    <a
      class="f-ubuntu m-l-a"
      href="https://btc.coinsect.io"
      target="_blank"
      rel="noreferrer">
      <i class="fab fa-bitcoin c-bitcoin f-14 m-r-4"/>bitcoinsect
    </a>
  </div>
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
  overflow: hidden;
  display: flex;
  background: rgba(127, 127, 255, 0.1);
  padding: 8px;
  font-size: 12px;

  .post-title {
    margin-left: 4px;
    color: var(--text-stress);
    font-weight: 700;
  }

  a:hover {
    text-decoration: underline;
    text-decoration-color: var(--text-stress);
  }
}
</style>