<template>
  <div
    class="c-position"
    :class="{
      'short': position.size < 0,
      'long': position.size > 0,
      'on-air': position.onAir,
      'danger': isDanger(position),
    }">
    <div
      class="image-container"
      @click="position.image ? helpers.modal.images({
        images: [position.image],
      }) : null">
      <div class="ratio-container">
        <AppImg :src="position.image" class="overlay"/>
      </div>
      <div v-if="position.lastUpdate" class="dark overlay upper f-mono">
        <div class="badge-air">
          <span class="dot" :class="position.onAir ? 'bg-success' : 'bg-danger'"/>{{ position.onAir ? 'ON' : 'OFF' }}
        </div>
        <div v-if="position.editable" class="last-update">{{ helpers.template.elapsedTime(position.lastUpdate) }}</div>
      </div>
      <div class="dark overlay lower" v-html="position.name"/>
    </div>
    <div class="position-info">
      <div class="base">
        <div class="contract">
          <div class="key c-white f-12">{{ position.contract ? position.contract.toLocaleString() : '' }}</div>
          <div class="value">
            <div class="badge-summary" v-html="position.contract ? badgeSummary(position) : ''"/>
          </div>
        </div>
        <div class="size">
          <div class="key">{{ helpers.translate('SIZE') }}</div>
          <div class="value f-mono">{{ display('size') }}</div>
        </div>
        <div class="unrealized">
          <div class="key">{{ helpers.translate('UNREALIZED_PNL') }}</div>
          <div
            class="value f-mono"
            :class="{
              'long': position.$$unrealized > 0,
              'short': position.$$unrealized < 0,
            }"
            v-html="display('$$unrealized')"
          />
        </div>
      </div>
      <div class="prices">
        <div class="entry">
          <div class="key">{{ helpers.translate('ENTRY_PRICE') }}</div>
          <div class="value f-mono">{{ display('entryPrice') }}</div>
        </div>
        <div class="mark">
          <div class="key">{{ helpers.translate('MARK_PRICE') }}</div>
          <div class="value f-mono">{{ display('markPrice') }}</div>
        </div>
        <div class="liq">
          <div class="key">{{ helpers.translate('LIQ_PRICE') }}</div>
          <div class="value f-mono">{{ display('liqPrice') }}</div>
        </div>
      </div>
    </div>
    <CPositionContextMenu :position="position"/>
  </div>
</template>

<script setup>
import CPositionContextMenu from './CPositionContextMenu'
import useGlobalHooks from '@/hooks/global-hooks'

const props = defineProps({
  position: {
    type: Object,
    required: true,
  },
})

const { helpers } = useGlobalHooks()

const badgeSummary = position => {
  if (position.size > 0) return 'Long'
  if (position.size < 0) return 'Short'

  return '-'
}

const isDanger = position => {
  if (!position.liqPrice) return

  return position.$$unrealized < 0 && ((Math.abs(position.liqPrice - position.markPrice)  / position.markPrice) < 0.005)
}

const display = key => {
  const v = props.position[key]
  if (isNaN(parseFloat(props.position.entryPrice)) || v === null || v === undefined || isNaN(v)) return '-'

  const frac = (['size', '$$unrealized'].includes(key) || Math.abs(v) >= 100) ? 2 : 4
  return v.toLocaleString(undefined, {
    maximumFractionDigits: frac,
    minimumFractionDigits: frac,
  })
}
</script>

<style lang="scss" scoped>
.c-position {
  background: var(--gs-14);
  border: 1px solid var(--border-base);
  font-size: 12px;
  display: flex;
  align-items: center;
  overflow: hidden;
  user-select: none;
  position: relative;

  > * {
    flex: 1 1 0;
    min-width: 0;
  }

  &:hover {
    border: 1px solid var(--text-stress);
  }

  &.danger {
    animation: position-flashing-border 0.5s linear infinite;

    .mark .value {
      animation: position-flashing-color 0.5s linear infinite;
    }
  }

  .badge-summary {
    border-radius: 4px;
    font-size: 11px;
    display: table;
    padding: 0 4px;
  }

  .image-container {
    max-width: 96px;
    position: relative;
    z-index: 1;
    cursor: pointer;

    &:hover {
      opacity: 0.5;
    }

    .ratio-container {
      padding-top: 100%;
    }

    .app-img {
      object-position: top;
    }

    .dark.overlay {
      display: flex;
      height: 32px;
      color: var(--white);
      padding: 4px;

      &.upper {
        bottom: initial;
        background: linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
        align-items: flex-start;
        font-size: 10px;
        justify-content: space-between;
      }

      &.lower {
        top: initial;
        align-items: flex-end;
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
      }
    }

    .badge-air {
      display: flex;
      align-items: center;
      border-radius: 8px;
      padding: 0 4px;
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.1);

      .dot {
        display: block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 4px;
      }
    }

    .last-update {
      line-height: 18px;
    }
  }

  .position-info {
    padding: 0 8px;

    .base {
      margin-bottom: 8px;
    }

    .base,
    .prices {
      display: flex;
      gap: 4px;

      > div {
        flex: 1;

        &:last-child {
          text-align: right;
        }
      }
    }

    .key {
      font-size: 11px;
      margin-bottom: 4px;
      color: var(--gs-bb);
    }

    .value {
      font-size: 13px;
      font-weight: 500;
      white-space: nowrap;
      color: var(--white);
    }
  }

  .liq .value {
    color: var(--bitcoin);
  }

  &.short {
    .badge-summary {
      background: var(--price-down-bybit-bg);
      color: var(--price-down-bybit);
    }

    .size {
      .value {
        color: var(--price-down-bybit);
      }
    }
  }

  &.long {
    .badge-summary {
      background: var(--price-up-bybit-bg);
      color: var(--price-up-bybit);
    }

    .size {
      .value {
        color: var(--price-up-bybit);
      }
    }
  }

  .value {
    &.short {
      color: var(--price-down-bybit);
    }

    &.long {
      color: var(--price-up-bybit);
    }
  }

  @media (max-width: 479px) {
    .image-container {
      max-width: 80px;
    }
  }
}
</style>
