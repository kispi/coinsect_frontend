<template>
  <div>
    <a
      class="twitter-timeline"
      :height="height"
      :data-theme="store.getters.settings.theme"
      :href="`https://twitter.com/${account}?ref_src=twsrc%5Etfw`"
    />
    <!-- 살짝 걱정되어서 처음에 lazyload로 뺐다가 잘 안되서 다시 이리로 가져왔는데 다행히 계속 스크립트 임포트가 쌓이지는 않는듯? -->
    <component :is="'script'" :src="'https://platform.twitter.com/widgets.js'"/>
  </div>
</template>

<script setup>
import useGlobalHooks from '@/hooks/global-hooks'

defineProps({
  account: {
    type: String,
    required: true,
  },
  height: {
    type: Number,
    default: 600,
  },
})

const { store } = useGlobalHooks()
</script>