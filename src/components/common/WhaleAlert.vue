<template>
  <div class="whale-alert">
    <div
      v-if="resp"
      class="alert-items">
      <div
        class="alert-item f-mono"
        :key="t.hash"
        v-for="t in resp.data">
        <div class="alert-item-header">
          <div class="alert-item-symbol">
            <AppImg :src="($store.getters.symbols[t.symbol.toUpperCase()] || {}).thumb"/>
            <div class="name">{{ (t.amount || 0).toLocaleString() }} {{ t.symbol }}</div>
            <div class="amount m-l-4">({{ $helpers.currency() }} {{ $helpers.number.pretty.price({ price: t.amountUsd, baseCurrency: 'usd' }) }})</div>
          </div>
          <div class="timestamp">{{ $helpers.elapsedTime($helpers.dayjs.unix(t.timestamp)) }}</div>
        </div>
        <div class="alert-item-from-to">
          <div class="from address">
            <AppImg
              v-if="t.fromOwnerType !== 'unknown'"
              :src="$helpers.withCdn(`images/exchanges/${(t.fromOwner || '').toUpperCase()}.png`)"
            />
            {{ displayAddressName(t, 'from') }}</div>
          <i class="fal fa-chevron-right flex-wrap"/>
          <div class="to address">
            <AppImg
              v-if="t.toOwnerType !== 'unknown'"
              :src="$helpers.withCdn(`images/exchanges/${(t.toOwner || '').toUpperCase()}.png`)"
            />
            {{ displayAddressName(t, 'to') }}
          </div>
        </div>
        <div
          @click="onClickHash(t)"
          class="alert-item-hash">
          {{ t.hash }}
        </div>
      </div>
    </div>
    <div class="display-table m-t-24 m-l-a">
      <PoweredBy
        :by="'WhaleAlert'"
        :imgUrl="'https://whale-alert.io/assets/images/logo-small-35.png'"
        :link="'https://whale-alert.io'"
      />
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, onUnmounted, ref } from 'vue'
import { useStore } from 'vuex'
import onchainService from '@/services/onchain'

export default {
  setup() {
    const store = useStore()

    const plugins = getCurrentInstance().appContext.config.globalProperties

    const resp = ref(null)

    const timeout = ref(null)

    const getUrl = ({ hash, blockchain }) => {
      const urls = {
        bitcoin: 'https://www.blockchain.com/btc/tx/',
        ethereum: 'https://etherscan.io/tx/0x',
        tron: 'https://tronscan.org/#/transaction/',
      }
      return urls[blockchain] + hash
    }

    const onClickHash = t => {
      const url = getUrl({ hash: t.hash, blockchain: t.blockchain })
      if (!url) return

      window.open(url, '_blank')
    }

    const displayAddressName = (transaction, target) => {
      return transaction[target + 'Owner'] || (transaction[target + 'OwnerType'] === 'unknown' ? '?' : transaction[target + 'OwnerType'])
    }

    const init = async () => {
      try {
        resp.value = await onchainService.whaleAlert({ limit: 100 })
      } catch (e) {
        plugins.$toast.error(e.data.message)
      }
      timeout.value = setTimeout(init, 1000 * 60)
    }

    onMounted(init)

    onUnmounted(() => {
      if (store.getters.isSSR) return

      clearTimeout(timeout.value)
    })

    return {
      resp,
      onClickHash,
      displayAddressName,
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
    .alert-item {
      padding: 8px;
      font-size: 12px;
      border-radius: 4px;
      background: var(--brand-primary-hover-bg);
      color: var(--text-stress);

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
          width: 120px;
          flex: 0 0 auto;
          border: 1px solid var(--brand-primary);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          text-transform: uppercase;
        }

        .fa-chevron-right {
          margin: 0 8px;
        }
      }

      .alert-item-hash {
        text-decoration: underline;
        margin-top: 8px;
        display: table;
        cursor: pointer;
      }

      &:not(:last-child) {
        margin-bottom: 8px;
      }
    }
  }
}
</style>