<template>
  <div class="view-account">
    <div class="card">
      <div class="card-title">내 활동</div>
      <ul>
        <li>채팅: {{ data.stats.numMessages }}</li>
        <li>글: {{ data.stats.numPosts }}</li>
        <li>댓글: {{ data.stats.numReplies }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()

    const data = computed(() => store.getters.accountStats)

    onMounted(() => {
      store.dispatch('loadAccountStats')
    })

    return {
      data,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-account {
  .card {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.24);
    background: var(--white);
    border-radius: 8px;
    color: var(--black);
    padding: 8px 16px;
    width: 160px;

    .card-title {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 8px;
    }
  }  
}
</style>