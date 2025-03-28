<template>
  <div
    v-if="store.getters.realTimePositions"
    class="view-real-time-positions">
    <div
      v-if="(positions.editable || []).length === 0"
      class="empty">
      {{ helpers.translate('RTP_EMPTY') }}
    </div>
    <div
      v-else
      class="position-group">
      <div
        class="positions">
        <CPosition
          :position="position"
          :key="idx"
          v-for="(position, idx) in positions.editable"
        />
      </div>
    </div>
    <RouterLink
      to="/"
      class="btn btn-primary m-t-8 p-16 display-block">
      {{ helpers.translate('GO_TO_MAIN') }}
    </RouterLink>
    <div class="description">
      <div :key="num" v-for="num in helpers.numArray(6)">* {{ helpers.translate(`RTP_DISCLAIMER_${num + 1}`)}}</div>
    </div>
    <div
      v-if="positions.nonEditable.length > 0"
      class="position-group m-t-40">
      <RouterLink
        to="/contents/public-treasury"
        class="text-underline c-brand-primary display-block m-b-8">
        {{ helpers.translate('BIG_ENTITIES') }}
      </RouterLink>
      <div class="positions">
        <CPosition
          :position="position"
          :key="position.name"
          v-for="position in positions.nonEditable"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import useRealTimePosition from '@/hooks/real-time-position'
import useGlobalHooks from '@/hooks/global-hooks'

const { helpers, store } = useGlobalHooks()

const { positions, callApi } = useRealTimePosition()

onMounted(callApi)
</script>

<style lang="scss" scoped>
.view-real-time-positions {
  .btn-primary {
    border-radius: 0;
  }

  .not-monitoring {
    margin-top: 40px;
    text-align: center;
    font-size: 12px;

    .btn-primary {
      display: table;
      margin: 16px auto;
    }
  }

  .positions {
    display: grid;
    gap: 8px;
  }

  .header {
    margin-bottom: 8px;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .description {
    font-size: 12px;
    margin-top: 40px;

    div {
      &:not(:last-child) {
        margin-bottom: 8px;
      }
    }
  }

  .empty {
    text-align: center;
    margin: 40px 0;
    font-size: 16px;
    color: var(--text-stress);
  }

  @media (min-width: 768px) {
    .positions {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1200px) {
    .positions {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}
</style>
