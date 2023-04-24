<template>
  <div class="whale-alert">
    <div class="flex-row flex-between items-center m-b-16">
      <div
        @click="oneColumn = !oneColumn"
        class="flex-row items-center cursor-pointer ul-on-hover">
        <AppCheckbox v-model="oneColumn" class="no-touch flex-wrap m-r-8"/>
        <div class="f-12">{{ $translate('ONE_COLUMN') }}</div>
      </div>
      <div
        @click="showFilters = !showFilters"
        class="btn btn-brd">
        <i class="far fa-chevron-down" :class="{'show-filters': showFilters}"/>
        {{ $translate('FILTER') }}
      </div>
    </div>
    <transition name="slide-down">
      <WhaleAlertFilters
        v-show="showFilters"
        @change-params="p => params = p"
        :listStable="listStable"
        class="m-b-16"
      />
    </transition>
    <transition-group
      v-if="resp"
      name="cell"
      class="alert-items"
      :class="{'one-column': oneColumn}"
      tag="div">
      <div
        @click="onClickHash(t)"
        class="alert-item f-mono"
        :class="[
          bullOrBear(t),
          getUrl(t) ? 'cursor-pointer' : ''
        ]"
        :key="t.hash"
        v-for="t in resp.data">
        <div class="alert-item-header">
          <div class="alert-item-symbol">
            <AppImg :src="($store.getters.symbols[t.symbol.toUpperCase()] || {}).thumb" :alt="t.symbol"/>
            <div class="name">{{ displayAmount(t) }} {{ t.symbol }}</div>
            <div class="amount m-l-4">({{ $helpers.currency() }} {{ $helpers.number.pretty.price({ price: t.amountUsd, baseCurrency: 'usd' }) }})</div>
            <div class="m-l-8 m-r-8 c-text-light">|</div>
            <div class="timestamp">{{ $helpers.elapsedTime($helpers.dayjs.unix(t.timestamp)) }}</div>
          </div>
        </div>
        <div class="alert-item-from-to">
          <div class="from address">
            <AppImg
              v-if="t.fromOwnerType !== 'unknown'"
              :src="$helpers.withCdn(`images/exchanges/${(t.fromOwner || '').toUpperCase().replace(/[ .]/g, '_')}.png`)"
              :alt="t.fromOwner"
            />
            {{ displayAddressName(t, 'from') }}</div>
          <i class="fal fa-chevron-right flex-wrap"/>
          <div class="to address">
            <AppImg
              v-if="t.toOwnerType !== 'unknown'"
              :src="$helpers.withCdn(`images/exchanges/${(t.toOwner || '').toUpperCase().replace(/[ .]/g, '_')}.png`)"
              :alt="t.toOwner"
            />
            {{ displayAddressName(t, 'to') }}
          </div>
        </div>
      </div>
    </transition-group>
    <div
      v-if="loading"
      class="alert-items">
      <AppSkeleton
        :key="card"
        v-for="card in 8"
      />
    </div>
    <div
      v-if="resp && (resp.data || []).length === 0"
      class="empty">
      {{ $translate('NO_SEARCH_RESULT') }}
    </div>
    <PoweredBy
      :by="'WhaleAlert'"
      :imgUrl="'https://whale-alert.io/assets/images/logo-small-35.png'"
      :link="'https://whale-alert.io'"
      class="m-t-24"
    />
  </div>
</template>

<script>
import { onUnmounted, ref, watch } from 'vue'
import onchainService from '@/services/onchain'
import WhaleAlertFilters from './WhaleAlertFilters'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  components: {
    WhaleAlertFilters,
  },
  setup() {
    const { plugins, store } = useGlobalHooks()

    const resp = ref(null)

    const oneColumn = ref(null)

    const timeout = ref(null)

    const loading = ref(null)

    const showFilters = ref(null)

    const params = ref()

    const listStable = ['usdt', 'usdc', 'busd', 'pax', 'gusd']

    const getUrl = transaction => {
      const urls = {
        bitcoin: 'https://www.blockchain.com/btc/tx/',
        ethereum: 'https://etherscan.io/tx/0x',
        tron: 'https://tronscan.org/#/transaction/',
        ripple: 'https://xrpscan.com/tx/'
      }

      const exploreUrl = urls[transaction.blockchain]
      if (!exploreUrl) return

      return exploreUrl + transaction.hash
    }

    const bullOrBear = t => {
      const isStable = listStable.includes(t.symbol)
      if (t.fromOwnerType === 'exchange' && t.toOwnerType === 'unknown') return isStable ? 'bear' : 'bull'
      if (t.fromOwnerType === 'unknown' && t.toOwnerType === 'exchange') return isStable ? 'bull' : 'bear'
    }

    const onClickHash = t => {
      const url = getUrl(t)
      if (!url) return

      window.open(url, '_blank')
    }

    const displayAddressName = (transaction, target) => {
      return transaction[target + 'Owner'] || (transaction[target + 'OwnerType'] === 'unknown' ? '?' : transaction[target + 'OwnerType'])
    }

    const displayAmount = transaction => {
      const parsed = parseFloat(transaction.amount) || 0
      if (!parsed) return '?'

      const isStable = listStable.includes(transaction.symbol)
      return isStable ? Math.round(parsed).toLocaleString() : parsed.toLocaleString(undefined, {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      })
    }

    const createQuery = () => {
      const o = plugins.$helpers.qb().limit(100)
      const conds = []
      if (params.value.amount) conds.push(`amount >= ${params.value.amount}`)
      if (params.value.amountUsd) conds.push(`amount_usd >= ${params.value.amountUsd}`)
      if ((params.value.symbols || []).filter(s => s.$$selected).length > 0) conds.push(`symbol in (${params.value.symbols.filter(s => s.$$selected).map(s => `"${s.symbol}"`).join(', ')})`)
      if (params.value.excludeBetweenSameExchange) conds.push('(from_owner_type != "unknown" XOR to_owner_type != "unknown")')
      if (conds.length > 0) o.where(conds.join(' AND '))
      return o
    }

    const search = async () => {
      try {
        loading.value = true
        resp.value = await onchainService.whaleAlert(createQuery().build())
      } catch (e) {
        plugins.$toast.error(e.data.message)
      } finally {
        loading.value = false
      }
      timeout.value = setTimeout(search, 1000 * 60)
    }

    onUnmounted(() => {
      if (store.getters.isSSR) return

      clearTimeout(timeout.value)
    })

    watch(
      () => params.value,
      plugins.$helpers.debounce(() => {
        clearTimeout(timeout.value) // 조건이 초기화되었으므로 timeout을 다시걸어야함.
        search()
      }, 500),
      { deep: true },
    )

    return {
      resp,
      listStable,
      oneColumn,
      showFilters,
      loading,
      params,
      getUrl,
      onClickHash,
      bullOrBear,
      displayAddressName,
      displayAmount,
    }
  },
}
</script>

<style lang="scss" scoped>
.whale-alert {
  .app-img {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }

  .alert-items {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 8px;

    &.one-column {
      grid-template-columns: repeat(1, 1fr);
    }

    .alert-item {
      padding: 8px;
      font-size: 12px;
      border-radius: 4px;
      border: 1px solid var(--border-base);
      color: var(--text-stress);

      &.bull {
        background: var(--price-up-bg);
        border: 1px solid var(--price-up);
      }

      &.bear {
        background: var(--price-down-bg);
        border: 1px solid var(--price-down);
      }

      .alert-item-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .alert-item-symbol {
          display: flex;
          align-items: center;

          .name {
            text-transform: uppercase;
          }
        }
      }

      .alert-item-from-to {
        display: flex;
        align-items: center;
        margin-top: 8px;

        .address {
          max-width: 144px;
          border: 1px solid var(--border-base);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          text-transform: uppercase;
          flex: 1;
        }

        .fa-chevron-right {
          margin: 0 8px;
        }
      }
    }
  }

  .btn-brd {
    user-select: none;
    cursor: pointer;

    i {
      margin-right: 8px;
      transition: all 0.25s ease;

      &.show-filters {
        transform: rotate(180deg);
      }
    }
  }

  .empty {
    text-align: center;
    color: var(--text-stress);
    padding: 120px 16px;
    font-size: 16px;
  }

  .cell-move {
    transition: transform 0.25s cubic-bezier(1, 0, 0, 1);
  }

  .app-skeleton {
    height: 72px;
  }
}
</style>
