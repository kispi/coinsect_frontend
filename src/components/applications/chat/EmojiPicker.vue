<template>
  <div
    v-if="store.getters.config"
    class="emoji-picker">
    <div class="closer center" @click="$emit('close')"><i class="c-white fal fa-times"/></div>
    <input
      v-model="keyword"
      @keydown="onKeydown"
      @change="onKeydown"
      placeholder="이모지 검색"
      class="emoji-search"
    />
    <div class="emoji-list">
      <div
        @click="$emit('pick', emoji)"
        class="emoji center"
        :key="emoji"
        v-for="emoji in emojis">
        {{ (store.getters.config.emojis[emoji] || {}).emoji }}
      </div>
    </div>
    <div v-if="keyword && emojis.length === 0" class="c-white center p-24">
      {{ helpers.translate('NO_SEARCH_RESULT') }}
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

defineEmits(['pick', 'close'])

const { helpers, store } = useGlobalHooks()

const onKeydown = e => {
  setTimeout(() => {
    if (e.target.value) keyword.value = e.target.value
  })
}

const emojis = computed(() => {
  const arr = Object.keys(store.getters.config.emojis || [])
  return keyword.value ? arr.filter(emojiName => emojiName.includes(keyword.value.trim())) : arr
})

const keyword = ref(null)
</script>

<style lang="scss" scoped>
.emoji-picker {
  background: rgba(64, 64, 64, 0.9);
  border: 1px solid var(--border-light);
  padding: 8px;

  input {
    border-radius: 4px;
    font-size: 12px;
    margin-bottom: 16px;
  }

  .emoji-list {
    display: grid;
    grid-template-columns: repeat(8, 1fr);

    .emoji {
      padding: 2px;
      border-radius: 8px;
      user-select: none;
      cursor: pointer;

      &:hover {
        background: var(--background-light);
      }
    }
  }

  .closer {
    margin: 0 0 8px auto;
    width: 32px;
    height: 32px;
    font-size: 16px;
    border-radius: 8px;
    cursor: pointer;

    &:hover {
      background: var(--background-light);
    }
  }
}
</style>