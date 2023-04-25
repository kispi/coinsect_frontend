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
        <AppImg :src="($store.getters.symbols[whaleAlert.symbol.toUpperCase()] || {}).thumb" :alt="whaleAlert.symbol"/>
        <div class="name">{{ displayAmount(whaleAlert) }} {{ whaleAlert.symbol }}</div>
        <div class="amount m-l-4">({{ $helpers.currency() }} {{ $helpers.number.pretty.price({ price: whaleAlert.amountUsd, baseCurrency: 'usd' }) }})</div>
        <div class="m-l-8 m-r-8 c-text-light">|</div>
        <div class="timestamp">{{ $helpers.elapsedTime($helpers.dayjs.unix(whaleAlert.timestamp)) }}</div>
      </div>
    </div>
    <div class="alert-item-from-to">
      <div class="from address">
        <AppImg
          v-if="whaleAlert.fromOwnerType !== 'unknown'"
          :src="$helpers.withCdn(`images/exchanges/${(whaleAlert.fromOwner || '').toUpperCase().replace(/[ .]/g, '_')}.png`)"
          :alt="whaleAlert.fromOwner"
        />
        {{ displayAddressName(whaleAlert, 'from') }}</div>
      <i class="fal fa-chevron-right flex-wrap"/>
      <div class="to address">
        <AppImg
          v-if="whaleAlert.toOwnerType !== 'unknown'"
          :src="$helpers.withCdn(`images/exchanges/${(whaleAlert.toOwner || '').toUpperCase().replace(/[ .]/g, '_')}.png`)"
          :alt="whaleAlert.toOwner"
        />
        {{ displayAddressName(whaleAlert, 'to') }}
      </div>
    </div>
  </div>
</template>

<script>
import constants from '@/assets/constants'

export default {
  props: {
    whaleAlert: Object,
  },
  setup() {
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

    const bullOrBear = whaleAlert => {
      const isStable = constants.stableCoins.includes(whaleAlert.symbol)
      if (whaleAlert.fromOwnerType === 'exchange' && whaleAlert.toOwnerType === 'unknown') return isStable ? 'bear' : 'bull'
      if (whaleAlert.fromOwnerType === 'unknown' && whaleAlert.toOwnerType === 'exchange') return isStable ? 'bull' : 'bear'
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

      const isStable = constants.stableCoins.includes(transaction.symbol)
      return isStable ? Math.round(parsed).toLocaleString() : parsed.toLocaleString(undefined, {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      })
    }

    return {
      getUrl,
      bullOrBear,
      displayAddressName,
      displayAmount,
      onClickHash,
    }
  },
}
</script>

<style lang="scss" scoped>
.whale-alert-item {
  padding: 8px;
  font-size: 12px;
  border-radius: 4px;
  border: 1px solid var(--border-base);
  color: var(--text-stress);

  .app-img {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }

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
</style>