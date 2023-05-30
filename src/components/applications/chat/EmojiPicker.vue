<template>
  <div class="emoji-picker">
    <div class="closer center" @click="$emit('close')"><i class="fal fa-times"/></div>
    <input v-model="keyword" placeholder="이모지 검색" class="emoji-search"/>
    <div class="emoji-list">
      <div
        @click="$emit('pick', emoji)"
        class="emoji center"
        :key="emoji"
        v-for="emoji in emojis.filter(emoji => keyword ? emoji.name.includes(keyword) : true)">
        {{ emoji.emoji }}
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  emits: ['pick', 'close'],
  setup() {
    const { store } = useGlobalHooks()

    const emojis = computed(() => store.getters.config.emojis || [])

    const keyword = ref(null)

    return {
      keyword,
      emojis,
    }
  },
}
</script>

<style lang="scss" scoped>
.emoji-picker {
  background: var(--background-base);
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
      padding: 4px;
      border-radius: 4px;
      font-size: 16px;
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