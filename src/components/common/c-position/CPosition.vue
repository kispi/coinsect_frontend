<template>
  <div
    class="c-position"
    :class="{
      'short': position.size < 0,
      'long': position.size > 0,
      'on-air': !position.onAir,
    }">
    <div
      v-if="!position.onAir"
      class="streamer-off overlay center">
      {{ $translate('STREAMER_NOT_ON_AIR') }}
    </div>
    <div
      v-if="position.image"
      class="image-container"
      @click="$modal.images({
        images: [position.image],
      })">
      <div class="ratio-container">
        <AppImg :src="position.image" v-if="position.image" class="overlay"/>
      </div>
      <div class="dark overlay" v-html="position.name"/>
    </div>
    <div class="position-info">
      <div class="base">
        <div class="contract">
          <div class="key c-white" :class="{'f-16': $store.getters.windowInnerWidth >= 480}">{{ position.contract ? position.contract.toLocaleString() : '' }}</div>
          <div class="value">
            <div class="badge-summary" v-html="position.contract ? badgeSummary(position) : ''"/>
          </div>
        </div>
        <div class="size">
          <div class="key">{{ $translate('SIZE') }}</div>
          <div class="value f-mono">{{ display('size') }}</div>
        </div>
        <div class="unrealized">
          <div class="key">{{ $translate('UNREALIZED_PNL') }}</div>
          <div
            class="value f-mono"
            :class="{
              'long': position.unrealized > 0,
              'short': position.unrealized < 0,
            }"
            v-html="display('unrealized')"
          />
        </div>
      </div>
      <div class="prices">
        <div class="entry">
          <div class="key">{{ $translate('ENTRY_PRICE') }}</div>
          <div class="value f-mono">{{ display('entryPrice') }}</div>
        </div>
        <div class="mark">
          <div class="key">{{ $translate('MARK_PRICE') }}</div>
          <div class="value f-mono">{{ display('markPrice') }}</div>
        </div>
        <div class="liq">
          <div class="key">{{ $translate('LIQ_PRICE') }}</div>
          <div class="value f-mono">{{ display('liqPrice') }}</div>
        </div>
      </div>
    </div>
    <CPositionContextMenu :position="position"/>
  </div>
</template>

<script>
import CPositionContextMenu from './CPositionContextMenu'

export default {
  components: {
    CPositionContextMenu,
  },
  props: ['position'],
  setup(props) {
    const badgeSummary = position => {
      if (position.size > 0) return 'Long'
      if (position.size < 0) return 'Short'

      return '-'
    }

    const display = key => {
      const v = props.position[key]
      if (!v) return '-'

      const frac = Math.abs(v) >= 1 ? 2 : 4
      return v.toLocaleString(undefined, {
        maximumFractionDigits: frac,
        minimumFractionDigits: frac,
      })
    }

    return {
      badgeSummary,
      display,
    }
  },
}
</script>

<style lang="scss" scoped>
.c-position {
  background: var(--gs-14);
  border: 1px solid var(--border-base);
  font-size: 12px;
  line-height: 18px;
  display: flex;
  align-items: center;
  overflow: hidden;
  user-select: none;
  position: relative;

  > * {
    flex: 1 1 0;
    min-width: 0;
  }

  &:not(.on-air):hover {
    border: 1px solid var(--border-light);
  }

  .streamer-off {
    color: var(--text-stress);
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
    pointer-events: none;
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
      transform: scale(1.05);
      opacity: 0.5;
    }

    .ratio-container {
      padding-top: 100%;
    }

    .app-img {
      object-position: top;
    }

    .dark.overlay {
      top: initial;
      height: 24px;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
      display: flex;
      align-items: flex-end;
      color: var(--white);
      padding: 4px;
    }
  }

  .position-info {
    padding: 0 16px;

    .base {
      margin-bottom: 8px;
    }

    .base,
    .prices {
      display: flex;

      > div {
        flex: 1;

        &:last-child {
          text-align: right;
          white-space: nowrap;
        }
      }
    }

    .key {
      font-size: 11px;
      margin-bottom: 4px;
      color: var(--gs-bb);
      white-space: nowrap;
    }

    .value {
      font-size: 14px;
      font-weight: 500;
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
