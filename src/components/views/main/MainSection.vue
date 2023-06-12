<template>
  <div class="main-section">
    <div
      @click.prevent="link ? $router.push(link) : null"
      class="section-header">
      <AppImg
        v-if="image"
        :src="image"
      />
      <a
        @click.prevent
        class="section-title"
        :href="link">
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
        <i class="fal fa-chevron-right m-l-4 f-10"/>
      </a>
    </div>
    <div class="section-content">
      <div @scroll="e => showTopGrad = e.target.scrollTop > 0" class="scrollable pretty-scrollbar">
        <slot/>
      </div>
      <div class="overlay top" :class="{'o-0': !showTopGrad}"/>
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
    image: String,
    tooltip: String,
  },
  setup(props) {
    const { plugins } = useGlobalHooks()

    const refTooltip = ref(null)

    const showTopGrad = ref(null)

    const tooltipId = computed(() => {
      if (!props.tooltip) return

      return plugins.$helpers.logic.mustToken()
    })

    return {
      refTooltip,
      showTopGrad,
      tooltipId,
    }
  },
}
</script>

<style lang="scss" scoped>
.main-section {
  border-radius: 8px;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    margin-bottom: 8px;
    color: var(--text-stress);
    border-bottom: 1px solid var(--border-base);
    font-size: 12px;
    cursor: pointer;

    .app-img {
      width: 16px;
      margin-right: 4px;
      border-radius: 50%;
    }

    .section-title {
      font-weight: 700;
      flex: 1;
    }

    &:hover {
      text-decoration: underline;
      background: var(--border-base);
    }
  }

  .section-content {
    position: relative;

    .scrollable {
      max-height: 336px;
      overflow-y: auto;
      padding-bottom: 24px;
    }

    &.whale-alerts {
      display: grid;
      gap: 8px;
    }
  }

  .overlay {
    height: 24px;
    pointer-events: none;
    z-index: 1;

    &.top {
      bottom: initial;
      background: linear-gradient(to bottom, var(--background-base), rgba(255, 255, 255, 0));
      transition: all 0.3s ease;
    }

    &.bottom {
      top: initial;
      background: linear-gradient(to top, var(--background-base), rgba(255, 255, 255, 0));
    }
  }
}
</style>