<template>
  <div class="view-influencers">
    <div class="grid">
      <RouterLink
        :to="`/contents/influencers/${item.$$key}`"
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
import { computed, getCurrentInstance, onMounted, onServerPrefetch } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const items = computed(() => (store.getters.influencers || {}).data || [])

    onMounted(() => {
      store.dispatch('loadInfluencers')
    })

    onServerPrefetch(async () => {
      await store.dispatch('loadInfluencers')
      const people = store.getters.influencers.data
      try {
        plugins.$helpers.meta.setDocumentTitle(`크립토 인플루언서`)
        plugins.$helpers.meta.renderDescription('유튜브나 트위터를 통해 활발하게 활동하는 크립토 인플루언서들')
        plugins.$helpers.meta.renderOgImage(plugins.$helpers.useS3(people[people.length - 1].images[0].key))
        plugins.$helpers.meta.renderCanonicalLink()
      } catch (e) {}
    })

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