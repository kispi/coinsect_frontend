<template>
  <div v-if="!$store.getters.loading.global" class="view-bitcoin-halving">
    <div class="title" v-html="$translate('BITCOIN_HALVING_TITLE')"/>
    <div class="description" v-html="$translate('BITCOIN_HALVING_DESCRIPTION')"/>
    <div v-if="nextHalving" class="estimated-next-halving">
      {{ $translate('ESTIMATED_NEXT_HALVING') }}<br><b>{{ nextHalving.format('YYYY-MM-DD') }}</b>
    </div>
    <div class="countdown">
      <div
        class="box"
        :key="unit"
        v-for="unit in ['days', 'hours', 'minutes', 'seconds']"><b>{{ t[unit] }}</b><br>{{ $translate(unit) }}
      </div>
    </div>
    <div class="gauge-section">
      <div class="gauge overlay">
        <div
          class="progress overlay"
          :style="{
            width: left,
          }"/>
      </div>
      <div class="badge start">셋째 반감기<br>12.5 > 6.25<br>630,000 블록<div class="triangle"/></div>
      <div class="badge end">넷째 반감기<br>6.25 > 3.125<br>840,000 블록<div class="triangle"/></div>
      <div ref="refCurrentBadge" class="badge current" :style="currentBlockBadgeStyle">최근 블록<br>{{ currentBlock.toLocaleString() }}<div class="triangle"/></div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, onServerPrefetch, onUnmounted, ref } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  setup() {
    const { plugins, store } = useGlobalHooks()

    const refCurrentBadge = ref(null)

    const currentBlock = ref(0)

    const interv = ref(null)

    const timeout = ref(null)

    const left = computed(() => `${(currentBlock.value - 630000) / (840000 - 630000) * 100}%`)

    const secondsUntilNextHalving = ref(0)

    const currentBlockBadgeStyle = computed(() => {
      if (!refCurrentBadge.value) return

      const { width } = refCurrentBadge.value.getBoundingClientRect()

      return {
        left: `calc(${left.value} - ${width / 2 - 1}px)`,
      }
    })

    const t = computed(() => {
      let seconds = secondsUntilNextHalving.value
      const days = Math.floor(seconds / 86400)
      seconds -= 86400 * days
      const hours = Math.floor(seconds / 3600)
      seconds -= 3600 * hours
      const minutes = Math.floor(seconds / 60)
      seconds -= 60 * minutes
      return { days, hours, minutes, seconds }
    })

    const nextHalving = ref(null)

    const init = async () => {
      try {
        store.commit('setLoading', { global: true })
        currentBlock.value = await plugins.$httpNoAuth.get('https://blockchain.info/q/getblockcount')
        secondsUntilNextHalving.value = (840000 - currentBlock.value) * 10 * 60
        nextHalving.value = plugins.$helpers.dayjs().add(secondsUntilNextHalving.value, 'seconds')
      } catch (e) {}
      store.commit('setLoading', { global: false })

      if (!store.getters.isSSR) timeout.value = setTimeout(init, 1000 * 60 * 10)
    }

    onMounted(() => {
      init()

      if (store.getters.isSSR) return

      interv.value = setInterval(() => {
        secondsUntilNextHalving.value -= 1
      }, 1000)
    })

    onUnmounted(() => {
      if (store.getters.isSSR) return

      clearInterval(interv.value)
      clearTimeout(timeout.value)
    })

    onServerPrefetch(init)

    return {
      refCurrentBadge,
      currentBlock,
      currentBlockBadgeStyle,
      t,
      left,
      nextHalving,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-bitcoin-halving {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-bottom: 120px !important;

  .title {
    display: flex;
    align-items: center;
    font-size: 20px;
    line-height: 28px;
    font-weight: 700;
    margin-top: 40px;
    color: var(--text-stress);
  }

  .description {
    margin: 24px 0 0;
    line-height: 24px;
  }

  .title,
  .description {
    white-space: pre-line;
  }

  .estimated-next-halving {
    margin: 40px 0;
    font-size: 24px;
    color: var(--text-stress);

    b {
      font-size: 32px;
    }
  }

  .countdown {
    display: flex;
    margin-bottom: 120px;

    .box {
      background: var(--white);
      color: var(--black);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.24);
      border: 1px solid var(--border-base);
      padding: 24px 0;
      white-space: nowrap;
      border-radius: 16px;
      width: 80px;
      text-align: center;

      b {
        font-size: 24px;
      }

      &:not(:last-child) {
        margin-right: 24px;
      }
    }
  }

  .gauge-section {
    width: 100%;
    position: relative;

    .gauge {
      background: rgba(255, 187, 17, 0.5);
      width: calc(100% - 24px);
      // border-radius: 12px;
      height: 24px;
      overflow: hidden;
      margin: 0 auto;
    }

    .progress {
      background: var(--bitcoin);
    }

    .badge {
      position: absolute;
      bottom: 8px;
      background: var(--gs-22);
      color: var(--white);
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 12px;
      line-height: 18px;

      .triangle {
        background: var(--gs-22);
        transform: rotate(45deg);
        position: absolute;
        width: 16px;
        height: 16px;
        bottom: -4px;
      }

      &.start {
        left: 0;

        .triangle {
          left: 4px;
        }
      }

      &.end {
        right: 0;

        .triangle {
          right: 4px;
        }
      }

      &.current {
        bottom: -84px;

        .triangle {
          top: -4px;
          left: 50%;
          transform: translateX(-50%) rotate(45deg);
        }
      }
    }
  }

  @media (max-width: 767px) {
    .countdown {
      .box {
        width: 64px;

        b {
          font-size: 16px;
        }

        &:not(:last-child) {
          margin-right: 8px;
        }
      }
    }
  }
}
</style>