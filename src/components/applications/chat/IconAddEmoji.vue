<template>
  <AppImg :src="require(`@/assets/images/${icon}`)" class="icon-add-emoji"/>
</template>

<script>
import { computed } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  setup() {
    const { store } = useGlobalHooks()

    const icon = computed(() => {
      if (store.getters.settings.chatSkin === 'kakao') return 'ic-emoji-black.svg'

      return store.getters.settings.theme === 'dark' ? 'ic-emoji.svg' : 'ic-emoji-black.svg'
    })

    return {
      icon,
    }
  },
}
</script>