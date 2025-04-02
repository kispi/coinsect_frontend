<template>
  <div
    @click="onClickHash(whaleAlert)"
    class="whale-alert-item f-mono"
    :class="[
      bullOrBear(whaleAlert),
      getUrl(whaleAlert) ? 'cursor-pointer' : ''
    ]">
    <div class="alert-item-header">
      <div class="alert-item-symbol">
        <AppImg :src="(store.getters.symbols[whaleAlert.symbol.toUpperCase()] || {}).thumb" :alt="whaleAlert.symbol"/>
        <div class="name">{{ displayAmount(whaleAlert) }} {{ whaleAlert.symbol }}</div>
        <div class="amount m-l-4">({{ helpers.currency() }} {{ helpers.number.pretty.price({
          price: parseFloat(whaleAlert.amountUsd),
          baseCurrency: 'usd',
          fracs: 0,
        }) }})</div>
        <div class="m-l-8 m-r-8 c-border-base">|</div>
        <div class="timestamp">{{ helpers.template.elapsedTime(helpers.dayjs.unix(whaleAlert.timestamp)) }}</div>
      </div>
    </div>
    <div class="alert-item-from-to">
      <div class="from address">
        <AppImg
          v-if="whaleAlert.fromOwnerType !== 'unknown'"
          :src="helpers.withCdn(`images/exchanges/${(whaleAlert.fromOwner || '').toUpperCase().replace(/[ .]/g, '_')}.png`)"
          :alt="whaleAlert.fromOwner"
        />
        {{ displayAddressName(whaleAlert, 'from') }}</div>
      <i class="fal fa-chevron-right flex-wrap"/>
      <div class="to address">
        <AppImg
          v-if="whaleAlert.toOwnerType !== 'unknown'"
          :src="helpers.withCdn(`images/exchanges/${(whaleAlert.toOwner || '').toUpperCase().replace(/[ .]/g, '_')}.png`)"
          :alt="whaleAlert.toOwner"
        />
        {{ displayAddressName(whaleAlert, 'to') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { WhaleAlert } from '@/types'
import constants from '@/assets/constants'
import useGlobalHooks from '@/hooks/global-hooks'

defineProps<{
  whaleAlert: WhaleAlert
}>()

const { helpers, store } = useGlobalHooks()

const getUrl = (transaction: WhaleAlert) => {
  const urls = {
    bitcoin: 'https://www.blockchain.com/btc/tx/',
    ethereum: 'https://etherscan.io/tx/0x',
    tron: 'https://tronscan.org/#/transaction/',
    ripple: 'https://xrpscan.com/tx/',
  }

  const exploreUrl = urls[transaction.blockchain as keyof typeof urls]
  if (!exploreUrl) return

  return exploreUrl + transaction.hash
}

const bullOrBear = (whaleAlert: WhaleAlert) => {
  const isStable = constants.stableCoins.includes(whaleAlert.symbol)
  if (whaleAlert.fromOwnerType === 'exchange' && whaleAlert.toOwnerType === 'unknown') return isStable ? 'bear' : 'bull'
  if (whaleAlert.fromOwnerType === 'unknown' && whaleAlert.toOwnerType === 'exchange') return isStable ? 'bull' : 'bear'
}

const onClickHash = (t: WhaleAlert) => {
  const url = getUrl(t)
  if (!url) return

  window.open(url, '_blank')
}

const displayAddressName = (transaction: WhaleAlert, target: 'from' | 'to') => {
  // @ts-ignore (귀찮음)
  return transaction[target + 'Owner'] || (transaction[target + 'OwnerType'] === 'unknown' ? '?' : transaction[target + 'OwnerType'])
}

const displayAmount = (transaction: WhaleAlert) => {
  const parsed = parseFloat(transaction.amount) || 0
  if (!parsed) return '?'

  const isStable = constants.stableCoins.includes(transaction.symbol)
  return isStable ? Math.round(parsed).toLocaleString() : parsed.toLocaleString(undefined, {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  })
}
</script>

<style lang="scss" scoped>
.whale-alert-item {
  padding: 8px;
  font-size: 12px;
  border-radius: 4px;
  background: var(--background-light);
  color: var(--text-stress);

  .app-img {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }

  &.bull {
    background: var(--price-up-bybit-bg);
  }

  &.bear {
    background: var(--price-down-bybit-bg);
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
</style>
