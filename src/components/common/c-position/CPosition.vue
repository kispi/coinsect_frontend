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
      v-if="!position.onAir"
      class="trader-off overlay center">
      {{ $translate('TRADER_NOT_ON_AIR') }}
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
      <div v-if="position.lastUpdate" class="dark overlay upper f-mono">
        <div class="flex-row items-center">
          <i class="fal fa-clock"/>
          <div>{{ $helpers.elapsedTime(position.lastUpdate) }}</div>
        </div>
      </div>
      <div class="dark overlay lower" v-html="position.name"/>
    </div>
    <div class="position-info">
      <div class="base">
        <div class="contract">
          <div class="key c-white">{{ position.contract ? position.contract.toLocaleString() : '' }}</div>
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
              'long': position.$$unrealized > 0,
              'short': position.$$unrealized < 0,
            }"
            v-html="display('$$unrealized')"
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

    const isDanger = position => {
      if (!position.liqPrice) return

      return position.$$unrealized < 0 && ((Math.abs(position.liqPrice - position.markPrice)  / position.markPrice) < 0.005)
    }

    const display = key => {
      const v = props.position[key]
      if (!props.position.entryPrice || v === null || v === undefined) return '-'

      const frac = (['size', '$$unrealized'].includes(key) || Math.abs(v) >= 100) ? 2 : 4
      return v.toLocaleString(undefined, {
        maximumFractionDigits: frac,
        minimumFractionDigits: frac,
      })
    }

    return {
      isDanger,
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

  &:hover {
    border: 1px solid var(--white);
  }

  &.danger {
    animation: position-flashing-border 0.5s linear infinite;

    .mark .value {
      animation: position-flashing-color 0.5s linear infinite;
    }
  }

  &.on-air {
    .image-container {
      z-index: 1;
    }
  }

  .trader-off {
    color: var(--white);
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
        justify-content: flex-end;

        .fa-clock {
          margin-right: 4px;
        }
      }

      &.lower {
        top: initial;
        align-items: flex-end;
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
      }
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
        }
      }
    }

    .key {
      font-size: 11px;
      margin-bottom: 4px;
      color: var(--gs-bb);
    }

    .value {
      font-size: 14px;
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

  @media (min-width: 480px) {
    .position-info {
      .contract .key {
        font-size: 16px;
      }
    }
  }
}
</style>
