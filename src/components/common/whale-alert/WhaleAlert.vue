<template>
  <div class="whale-alert">
    <div class="flex-row flex-between items-center m-b-16">
      <div
        @click="oneColumn = !oneColumn"
        class="flex-row items-center cursor-pointer ul-on-hover">
        <AppCheckbox v-model="oneColumn" class="no-touch flex-wrap m-r-8"/>
        <div class="f-12">{{ helpers.translate('ONE_COLUMN') }}</div>
      </div>
      <div
        @click="showFilters = !showFilters"
        class="btn btn-brd">
        <i class="far fa-chevron-down" :class="{'show-filters': showFilters}"/>
        {{ helpers.translate('FILTER') }}
      </div>
    </div>
    <transition name="slide-down">
      <WhaleAlertFilters
        v-show="showFilters"
        @change-params="p => params = p"
        class="m-b-16"
      />
    </transition>
    <transition-group
      v-if="resp"
      name="cell"
      class="alert-items"
      :class="{'one-column': oneColumn}"
      tag="div">
      <WhaleAlertItem
        :whaleAlert="t"
        :key="t.hash"
        v-for="t in resp.data"
      />
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
      {{ helpers.translate('NO_SEARCH_RESULT') }}
    </div>
    <PoweredBy
      :by="'WhaleAlert'"
      :imgUrl="'https://meta-q.cdn.bubble.io/cdn-cgi/image/w=,h=,f=auto,dpr=1,fit=contain/f1621886305903x830371573730669400/whalealert.png'"
      :link="'https://whale-alert.io'"
      class="m-t-24"
    />
  </div>
</template>

<script setup>
import { onUnmounted, ref, watch } from 'vue'
import onchainService from '@/services/onchain'
import WhaleAlertFilters from './WhaleAlertFilters'
import useGlobalHooks from '@/hooks/global-hooks'

const { helpers, store } = useGlobalHooks()

const resp = ref(null)

const oneColumn = ref(null)

const timeout = ref(null)

const loading = ref(null)

const showFilters = ref(null)

const params = ref()

const createQuery = () => {
  const o = helpers.qb().limit(20)
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
    resp.value = await helpers.logic.crypto.decryptAPIResponse(await onchainService.whaleAlert(createQuery().build()))
  } catch (e) {
    helpers.toast.error(e.data.message)
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
  helpers.debounce(() => {
    clearTimeout(timeout.value) // 조건이 초기화되었으므로 timeout을 다시걸어야함.
    search()
  }, 500),
  { deep: true },
)
</script>

<style lang="scss" scoped>
.whale-alert {
  .alert-items {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 8px;

    &.one-column {
      grid-template-columns: repeat(1, 1fr);
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
