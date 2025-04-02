<template>
  <div class="main-section">
    <div
      @click.prevent="link ? router.push(link) : null"
      class="section-header">
      <AppImg
        v-if="image"
        :src="image"
      />
      <a
        @click.prevent
        class="section-title"
        :href="link">
        <span v-html="helpers.translate(title)"/>
        <i
          ref="refTooltip"
          v-if="tooltip"
          class="fal fa-question-circle cursor-pointer m-l-4"
          @mouseover="helpers.tooltip.show({
            id: tooltipId,
            showAbove: refTooltip,
            text: tooltip,
          })"
          @mouseleave="helpers.tooltip.hide(tooltipId)"
        />
        <div class="m-l-a">
          {{ helpers.translate('SEE_MORE') }}<i class="fal fa-chevron-right m-l-4 f-10"/>
        </div>
      </a>
    </div>
    <div class="section-content">
      <div class="scrollable pretty-scrollbar">
        <slot/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

const props = defineProps<{
  title: string
  link?: string
  image: string
  tooltip?: string
}>()

const { helpers, router } = useGlobalHooks()

const refTooltip = ref<HTMLElement | null>(null)

const tooltipId = computed(() => {
  if (!props.tooltip) return ''

  return helpers.logic.mustToken()
})
</script>

<style lang="scss" scoped>
.main-section {
  border-radius: 8px;
  background: var(--background-light);
  display: flex;
  flex-direction: column;

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
      height: 16px;
      margin-right: 4px;
      border-radius: 50%;
    }

    .section-title {
      font-weight: 700;
      flex: 1;
      display: flex;
      align-items: center;
    }

    &:hover {
      text-decoration: underline;
      background: var(--background-light);
    }
  }

  .section-content {
    position: relative;
    padding: 0 8px 8px;
    flex: 1;
    display: flex;
    flex-direction: column;

    .scrollable {
      max-height: 336px;
      overflow-y: auto;
      flex: 1;
    }

    &.whale-alerts {
      display: grid;
      gap: 8px;
    }
  }
}
</style>
