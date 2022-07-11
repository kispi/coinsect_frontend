<template>
  <div class="view-richlist">
    <a
      class="legends"
      href="https://insights.glassnode.com/bitcoin-supply-distribution"
      target="_blank"
      rel="noreferrer noopener">
      <div class="grid">
        <div
          class="legend"
          :key="legend.type"
          v-for="legend in legends">
          <div class="emoji">{{ legend.icon }}</div>
          <div class="name">{{ $translate(legend.type) }}</div>
          <div class="holdings f-mono m-l-a">
            <span>{{ legend.min || '&lt;' }}</span>
            <span v-if="legend.min && legend.max">-</span>
            <span>{{ legend.max || '&gt;=' }}</span>
          </div>
        </div>
      </div>
    </a>
    <TableRichlist
       v-if="$store.getters.richlist.bitcoin"
      :symbol="'BTC'"
      :data="$store.getters.richlist.bitcoin">
      <PoweredBy
        :by="'BitInfoCharts'"
        :link="'https://bitinfocharts.com/top-100-richest-bitcoin-addresses.html'"
        :imgUrl="'https://bitinfocharts.com/logo-1200.jpg'"
      />
    </TableRichlist>
  </div>
</template>

<script>
import { onMounted, onServerPrefetch } from 'vue'
import { useStore } from 'vuex'
import TableRichlist from './TableRichlist'

export default {
  components: { TableRichlist },
  setup() {
    const store = useStore()

    const legends = [
      { type: 'Shrimp', max: 1, icon: '🦐' },
      { type: 'Crab', min: 1, max: 10, icon: '🦀' },
      { type: 'Octopus', min: 10, max: 50, icon: '🐙' },
      { type: 'Fish', min: 50, max: 100, icon: '🐟' },
      { type: 'Dolphin', min: 100, max: 500, icon: '🐬' },
      { type: 'Shark', min: 500, max: 1000, icon: '🦈' },
      { type: 'Whale', min: 1000, max: 5000, icon: '🐳'  },
      { type: 'Humpback', min: 5000, icon: '🐋' },
    ]

    onMounted(() => {
      store.dispatch('loadRichlist')
    })

    onServerPrefetch(() => store.dispatch('loadRichlist'))

    return {
      legends,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-richlist {
  .powered-by {
    margin-top: 8px;
    justify-content: flex-end;
  }

  .legends {
    display: block;

    .grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      margin-bottom: 16px;
      color: var(--black);
      background: var(--white);
      border-radius: 4px;
      box-shadow: 0 3px 6px rgba(255, 255, 255, 0.24);
    }

    .legend {
      display: flex;
      align-items: center;
      padding: 4px 12px;
      border: 1px solid rgba(0, 0, 0, 0.1);

      .emoji {
        font-size: 24px;
      }

      .name {
        margin: 0 8px;
      }

      .holdings {
        span {
          &:not(:last-child) {
            margin-right: 8px;
          }
        }
      }
    }
  }

  @media (max-width: 767px) {
    .legends {
      .grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }
}
</style>