<template>
  <div class="view-richlist">
    <div class="richlist-symbols">
      <button
        @click="onClickSymbol(o)"
        class="btn"
        :class="o.$$selected ? 'btn-primary' : 'btn-default'"
        :key="o.symbol"
        v-for="o in symbols">
        <i class="fal fa-check m-r-8" :class="{'o-0': !o.$$selected}"/>{{ o.symbol }}
      </button>
    </div>
    <div
      v-if="(selected || {}).symbol === 'BTC'"
      class="legends">
      <div class="legends-title">비트코인 생태계</div>
      <a
        class="grid"
        href="https://insights.glassnode.com/bitcoin-supply-distribution"
        target="_blank"
        rel="noreferrer">
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
      </a>
    </div>
    <div class="p-relative">
      <TableRichlist
        v-if="(data || {}).link"
        :symbol="selected.symbol"
        :data="data.data">
        <PoweredBy
          class="m-t-24"
          :by="'BitInfoCharts'"
          :link="data.link"
          :imgUrl="'https://bitinfocharts.com/logo-1200.jpg'"
        />
      </TableRichlist>
      <AppLoading :loading="loading"/>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'
import TableRichlist from './TableRichlist'

export default {
  components: { TableRichlist },
  setup() {
    const { store } = useGlobalHooks()

    const loading = ref(null)

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

    const selected = computed(() => symbols.value.find(o => o.$$selected))

    const data = computed(() => store.getters.richlist[(selected.value || {}).name])

    const symbols = ref([
      { symbol: 'BTC', name: 'bitcoin' },
      { symbol: 'BCH', name: 'bitcoinCash' },
      { symbol: 'DOGE', name: 'dogecoin' },
      { symbol: 'LTC', name: 'litecoin' },
    ])

    const onClickSymbol = async symbol => {
      symbols.value.forEach(o => o.$$selected = o.symbol === symbol.symbol)
      try {
        loading.value = true
        await store.dispatch('loadRichlist', symbol.name)
      } catch (e) {}
      loading.value = false
    }

    onMounted(() => onClickSymbol(symbols.value[0]))

    return {
      loading,
      legends,
      symbols,
      data,
      selected,
      onClickSymbol,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-richlist {
  .powered-by {
    justify-content: flex-end;
  }

  .richlist-symbols {
    display: grid;
    margin-bottom: 40px;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;

    button {
      flex: 1;
      border-radius: 0;

      i {
        position: absolute;
        left: 24px;
      }
    }
  }

  .legends {
    .legends-title {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 8px;
      color: var(--text-stress);
    }

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

  .table-richlist {
    &:not(:last-child) {
      margin-bottom: 120px;
    }
  }

  @media (max-width: 767px) {
    .legends {
      font-size: 12px;

      .legend {
        padding: 2px 6px;

        .emoji {
          font-size: 16px;
        }
      }

      .grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .richlist-symbols {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
</style>