<template>
  <div
    v-if="influencer"
    class="view-influencer-detail">
    <div class="influencer-image">
      <AppImg v-if="(influencer.images || []).length > 0" :src="$helpers.withCdn(influencer.images[0].key)"/>
    </div>
    <div class="influencer-name">{{ influencer.name }}</div>
    <div
      v-if="influencer.$$description"
      class="influencer-description">
      {{ influencer.$$description.kr }}
    </div>
    <div
      v-if="influencer.$$bio"
      class="influencer-bio">
      <div
        v-if="influencer.$$bio.birth"
        class="bio-item">
        <div class="key">{{ $translate('BIRTH') }}</div>
        <div class="value">{{ influencer.$$bio.birth }}</div>
      </div>
      <div
        v-if="influencer.$$bio.nationality"
        class="bio-item">
        <div class="key">{{ $translate('NATIONALITY') }}</div>
        <div class="value">{{ influencer.$$bio.nationality }}</div>
      </div>
      <div
        v-if="influencer.$$bio.estimatedNetWorth"
        class="bio-item">
        <div class="key">{{ $translate('ESTIMATED_NET_WORTH') }}</div>
        <div class="value">{{ influencer.$$bio.estimatedNetWorth }}</div>
      </div>
      <div
        v-if="influencer.$$bio.career"
        class="bio-item">
        <div class="key">{{ $translate('CAREER') }}</div>
        <ul class="value">
          <li
            :key="career"
            v-for="career in influencer.$$bio.career">
            - {{ career }}
          </li>
        </ul>
      </div>
      <div
        v-if="influencer.$$bio.quotes"
        class="bio-item">
        <div class="key">{{ $translate('QUOTES') }}</div>
        <ul class="value">
          <li
            :key="quote"
            v-for="quote in influencer.$$bio.quotes">
            - {{ quote }}
          </li>
        </ul>
      </div>
      <div
        v-if="influencer.$$bio.sns"
        class="bio-item">
        <div
          v-if="influencer.$$bio.sns.websites"
          class="websites">
          <a
            :key="website"
            :href="website"
            target="_blank"
            v-for="website in influencer.$$bio.sns.websites"
            v-html="website"
          />
        </div>
        <div class="sns">
          <a
            v-if="influencer.$$bio.sns.youtube"
            :href="influencer.$$bio.sns.youtube"
            target="_blank"
            rel="noreferrer">
            <i class="fab fa-youtube"/>
          </a>
          <a
            v-if="influencer.$$bio.sns.twitter"
            :href="influencer.$$bio.sns.twitter"
            target="_blank"
            rel="noreferrer">
            <i class="fab fa-twitter"/>
          </a>
          <a
            v-if="influencer.$$bio.sns.instagram"
            :href="influencer.$$bio.sns.instagram"
            target="_blank"
            rel="noreferrer">
            <i class="fab fa-instagram"/>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, getCurrentInstance, onMounted, onServerPrefetch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const router = useRouter()

    const influencer = computed(() => {
      if (!store.getters.influencers) return

      const key = router.currentRoute.value.path.split('/contents/influencers/')[1]
      if (!key) {
        router.push('/contents/influencers')
        return
      }

      const target = store.getters.influencers.data.find(o => o.sharingKey === key)
      if (!target) {
        router.push('/contents/influencers')
        return
      }

      return target
    })

    const init = async () => {
      await store.dispatch('loadInfluencers')
      const p = influencer.value
      if (!p) return router.push('/contents/influencers')

      plugins.$helpers.meta.setDocumentTitle(`인물 - ${p.name} - 코인충`)
      plugins.$helpers.meta.renderDescription(JSON.parse(p.description).kr)
      plugins.$helpers.meta.renderOgImage(plugins.$helpers.withCdn(((p.images || [])[0] || {}).key))
      plugins.$helpers.meta.renderCanonicalLink()
    }

    onMounted(init)

    onServerPrefetch(init)

    return {
      influencer,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-influencer-detail {
  line-height: 24px;
  white-space: pre-line;

  .influencer-image {
    width: 160px;
    height: 160px;
    border-radius: 50%;
    overflow: hidden;
    margin: auto;
  }

  .influencer-name {
    display: table;
    font-size: 24px;
    font-weight: 700;
    margin: 16px auto 32px;
    color: var(--text-stress);
  }

  .influencer-description {
    font-size: 16px;
    line-height: 28px;
  }

  .influencer-bio {
    margin-top: 40px;

    .key {
      font-weight: 700;
      color: var(--text-stress);
    }

    .value {
      font-size: 16px;
    }

    .bio-item {
      &:not(:last-child) {
        margin-bottom: 16px;
      }

      ul {
        padding-left: 8px;
      }

      i {
        font-size: 40px;

        &:hover {
          color: var(--text-stress);
        }
      }
    }
  }

  .bio-item {
    padding: 40px 0 16px;

    .sns {
      display: flex;

      a:not(:last-child) {
        margin-right: 24px;
      }
    }

    .websites {
      margin-bottom: 24px;
    }

    a {
      color: var(--brand-primary);
      display: block;
    }
  }
}
</style>