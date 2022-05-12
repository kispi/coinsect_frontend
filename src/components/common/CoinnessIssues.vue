<template>
  <div class="coinness-issues">
    <div
      v-if="issues[currentIdx]"
      ref="refIssueContainer"
      @click="showAllIssues = true"
      class="current">
      <div class="badge-issue">이슈</div>
      <div class="num f-mono">{{ currentIdx + 1 }}</div>
      <div class="title lines-1">{{ issues[currentIdx].title }}</div>
    </div>
    <WrapperDropdownOverlay
      v-model="showAllIssues"
      :align="'left'"
      :mountBelow="refIssueContainer">
      <div class="all-issues">
        <a
          href="https://coinness.live"
          class="header"
          target="_blank"
          rel="noopener noreferrer">
          <div class="title"><img src="@/assets/images/coinness.svg">실시간 이슈</div>
          <div class="last-update">{{ lastUpdate }}</div>
        </a>
        <div
          @click="onClickIssue(issue)"
          class="issue"
          :key="issue.id"
          v-for="(issue, idx) in issues.slice(0, 6)">
          <div class="issue-num f-mono">{{ idx + 1 }}</div>
          <div class="issue-title">{{ issue.title }}</div>
        </div>
      </div>
    </WrapperDropdownOverlay>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, onUnmounted, ref } from 'vue'
import { useStore } from 'vuex'
import contentService from '@/services/content'

export default {
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const refIssueContainer = ref(null)

    const showAllIssues = ref(null)

    const issues = ref([])

    const currentIdx = ref(0)

    const interv = ref(null)

    const apiInterv = ref(null)

    const lastUpdate = ref(null)

    const onClickIssue = issue => {
      if (issue.url) {
        window.open(issue.url, '_blank', 'noopener')
        return
      }

      if (issue.targetType === 'news' && issue.targetId) {
        window.open(`https://coinness.live/news/${issue.targetId}`, '_blank', 'noopener')
      }
    }

    const callApi = async () => {
      try {
        issues.value = await contentService.news.issues()
        lastUpdate.value = plugins.$helpers.dayjs().format('오늘 HH:mm 기준')
      } catch (e) {}
    }

    onMounted(() => {
      if (store.getters.isSSR) return

      callApi()

      interv.value = setInterval(() => {
        if (currentIdx.value >= issues.value.length - 1) currentIdx.value = 0
        else currentIdx.value += 1
      }, 5000)

      apiInterv.value = setInterval(callApi, 1000 * 60)
    })

    onUnmounted(() => {
      if (store.getters.isSSR) return

      clearInterval(interv.value)
      clearInterval(apiInterv.value)
    })

    return {
      refIssueContainer,
      currentIdx,
      lastUpdate,
      showAllIssues,
      issues,
      onClickIssue,
    }
  },
}
</script>

<style lang="scss" scoped>
.coinness-issues {
  .current {
    display: flex;
    align-items: baseline;
    font-size: 12px;
    width: 160px;
    cursor: pointer;

    .badge-issue {
      background: var(--border-base);
      color: var(--text-stress);
      padding: 0 6px;
      font-size: 12px;
      border-radius: 8px;
      margin-right: 8px;
      white-space: nowrap;
    }

    .num {
      font-weight: 700;
      margin-right: 8px;
    }
  }

  .all-issues {
    width: 320px;
    margin-top: 12px;
    padding: 16px;
    background: var(--background-base);
    color: var(--text-stress);
    border: 1px solid var(--border-base);
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .title {
        font-size: 16px;
        font-weight: 700;
        display: flex;
        align-items: center;
        cursor: pointer;

        img {
          width: 16px;
          height: 16px;
          display: block;
          margin-right: 8px;
        }
      }

      .last-update {
        font-size: 12px;
      }
    }

    .issue {
      display: flex;
      align-items: baseline;
      // font-size: 12px;

      &:not(:last-child) {
        margin-bottom: 8px;
      }

      &:hover {
        .issue-title {
          text-decoration: underline;
          cursor: pointer;
        }
      }

      .issue-num {
        font-weight: 700;
        color: var(--brand-primary);
        margin-right: 8px;
      }
    }
  }

  @media (min-width: 768px) {
    .current {
      width: 240px;
    }
  }
}
</style>