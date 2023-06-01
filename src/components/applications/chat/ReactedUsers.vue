<template>
  <div class="reacted-users">
    <div
      class="reaction-group"
      :key="key"
      v-for="key in Object.keys(summarizedReactions)">
      <div class="reaction center f-18 p-8">{{ ($store.getters.config.emojis[key] || {}).emoji }}</div>
      <div class="nicknames">
        <div class="c-white f-700">:{{ key }}:</div>
        {{ (summarizedReactions[key] || []).map(r => r.nickname).join(', ') }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    summarizedReactions: {
      type: Object,
    },
  },
}
</script>
<style lang="scss" scoped>
.reacted-users {
  background: rgba(64, 64, 64, 0.9);
  border: 1px solid var(--border-light);
  display: grid;
  padding: 8px;
  gap: 8px;

  .reaction-group {
    display: flex;
    gap: 8px;
    font-size: 12px;
  }

  .nicknames {
    color: var(--gs-bb);
  }
}
</style>