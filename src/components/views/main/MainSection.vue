<template>
  <div class="main-section">
    <div class="section-header">
      <div class="section-title">
        <span v-html="$translate(title)"/>
        <i
          ref="refTooltip"
          v-if="tooltip"
          class="fal fa-question-circle cursor-pointer m-l-4"
          @mouseover="$tooltip.show({
            id: tooltipId,
            showAbove: refTooltip,
            text: tooltip,
          })"
          @mouseleave="$tooltip.hide(tooltipId)"
        />
      </div>
      <a :href="link" @click.prevent="$router.push(link)">
        <span>{{ $translate('SEE_MORE') }}</span>
        <i class="fal fa-chevron-right m-l-4 f-10"/>
      </a>
    </div>
    <div class="section-content">
      <div class="scrollable pretty-scrollbar">
        <slot/>
      </div>
      <div class="overlay bottom"/>
    </div>
  </div>
</template>

<script>
import useGlobalHooks from '@/hooks/global-hooks'
import { computed, ref } from 'vue'

export default {
  props: {
    title: String,
    link: String,
    tooltip: String,
  },
  setup(props) {
    const { plugins } = useGlobalHooks()

    const refTooltip = ref(null)

    const tooltipId = computed(() => {
      if (!props.tooltip) return

      return plugins.$helpers.mustToken()
    })

    return {
      refTooltip,
      tooltipId,
    }
  },
}
</script>

<style lang="scss" scoped>
.main-section {
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 8px;
    margin-bottom: 8px;
    color: var(--text-stress);
    border-bottom: 1px solid var(--border-base);
    font-size: 12px;

    .section-title {
      font-weight: 700;
    }

    a {
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .section-content {
    position: relative;

    .scrollable {
      max-height: 336px;
      overflow-y: auto;
      padding-bottom: 16px;
    }

    &.whale-alerts {
      display: grid;
      gap: 8px;
    }
  }

  .overlay {
    height: 24px;
    pointer-events: none;

    &.bottom {
      top: initial;
      background: linear-gradient(to top, var(--background-base), rgba(255, 255, 255, 0));
    }
  }
}
</style>