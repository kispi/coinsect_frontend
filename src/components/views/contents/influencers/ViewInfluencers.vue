<template>
  <div class="view-influencers">
    <div class="grid">
      <RouterLink
        :to="`/contents/influencers/${item.sharingKey}`"
        class="influencer"
        :key="item.id"
        v-for="item in items">
        <div class="image-container">
          <AppImg :src="$helpers.useS3(item.images[0].key)" class="overlay"/>
        </div>
        <div class="influencer-name">{{ item.name }}</div>
      </RouterLink>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, onServerPrefetch } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()

    const items = computed(() => (store.getters.influencers || {}).data || [])

    onMounted(() => {
      store.dispatch('loadInfluencers')
    })

    onServerPrefetch(() => store.dispatch('loadInfluencers'))

    return {
      items,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-influencers {
  .grid {
    display: grid;
    grid-gap: 24px;
    grid-template-columns: repeat(2, 1fr);

    .influencer {
      .image-container {
        transition: all 0.3s ease;
        padding-top: 100%;
        border-radius: 50%;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        border: 2px solid transparent;
      }

      &:hover {
        transition: all 0.3s ease;

        .image-container {
          opacity: 0.5;
          border: 2px solid var(--brand-primary);
        }
      }

      .influencer-name {
        color: var(--text-stress);
        font-weight: 700;
        text-align: center;
        margin-top: 16px;
      }
    }

    @media (min-width: 480px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (min-width: 768px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }
}
</style>