<template>
  <div   class="modal-donation">
    <ModalHeader :title="$translate('MODAL_DONATION')" @close="$emit('close')"/>
    <div class="body pre-line">
      <div
        v-if="wallets"
        class="sendable-tickers">
        <div
          @click="selectWallet(wallet)"
          class="sendable-ticker"
          :class="{'selected': (selectedWallet || {}).id === (wallet || {}).id}"
          :key="wallet.id"
          v-for="wallet in wallets.data">
          <AppImg :src="wallet.blockchain.icon"/>
          <div class="symbol" v-html="wallet.blockchain.symbol"/>
        </div>
      </div>
      <div class="selected-wallet f-mono">
        <div
          class="text-center"
          :class="{'o-0': !selectedWallet}"
          v-html="((selectedWallet || {}).blockchain || {}).symbol || 'PLACEHOLDER'"
        />
        <div class="qr-code-container">
          <div v-if="selectedWallet" id="modal-donation-qr-code" class="overlay"/>
        </div>
        <div
          @click="copyToClipboard"
          class="address"
          :class="{'o-0': !selectedWallet}"
          v-html="(selectedWallet || {}).address || 'PLACEHOLDER'"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

export default {
  props: ['options'],
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const prepared = ref(null)

    const wallets = ref(null)

    const selectedWallet = ref(null)

    const qrcode = ref(null)

    const copyToClipboard = () => {
      plugins.$helpers.dom.copyToClipboard(selectedWallet.value.address)
      plugins.$toast.success(`코인충 운영자의 ${selectedWallet.value.blockchain.symbol}주소를 클립보드로 복사했습니다`)

      if (!selectedWallet.value.blockchain.exploreUrl) return

      setTimeout(() => {
        window.open(`${selectedWallet.value.blockchain.exploreUrl}${selectedWallet.value.address}`, '_blank', 'noopener')
      }, 1000)
    }

    const callApi = async () => {
      try {
        wallets.value = await plugins.$http.get('wallets')
      } catch (e) {}
    }

    const selectWallet = wallet => {
      selectedWallet.value = wallet

      if (typeof QRCode === 'undefined') return

      const dom = document.getElementById('modal-donation-qr-code')
      const canvas = dom.getElementsByTagName('canvas')[0]
      if (canvas) canvas.remove()

      if (qrcode.value) {
        qrcode.value.clear()
        qrcode.value.makeCode(selectedWallet.value.address)
        return
      }

      const size = store.getters.windowInnerWidth < 480 ? 200 : 320
      qrcode.value = new QRCode(document.getElementById('modal-donation-qr-code'), {
        text: selectedWallet.value.address,
        width: size,
        height: size,
        correctLevel: QRCode.CorrectLevel.H,
      })
    }

    const init = async () => {
      try {
        await Promise.all([
          plugins.$helpers.dom.loadScript({ url: '/scripts/qrcode.min.js' }).then(() => prepared.value),
          callApi(),
        ])
        selectWallet(wallets.value.data[0])
      } catch (e) {}
    }

    onMounted(init)

    return {
      wallets,
      selectedWallet,
      copyToClipboard,
      selectWallet,
    }
  },
}
</script>

<style lang="scss" scoped>
.modal-donation {
  border-radius: 4px;
  width: 480px;

  .body {
    padding: 16px;
    line-height: 20px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  .sendable-tickers {
    background: var(--white);
    padding: 8px;
    margin-top: 28px;
    border: 1px solid var(--gs-22);
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.24);

    .sendable-ticker {
      display: flex;
      align-items: center;

      .app-img {
        width: 16px;
        height: 16px;
        margin-right: 8px;
      }

      .symbol {
        white-space: nowrap;
        color: var(--black);
        text-align: center;
        font-size: 12px;
      }

      &:not(:last-child) {
        margin-bottom: 4px;
      }

      &:hover {
        text-decoration: underline;
        cursor: pointer;
      }

      &.selected {
        .symbol {
          color: var(--brand-primary);
        }
      }
    }
  }

  .selected-wallet {
    font-size: 12px;
    width: 200px;
    color: var(--text-stress);

    .qr-code-container {
      padding-top: 100%;
      position: relative;
      border: 1px solid var(--text-stress);
      margin: 8px 0;
    }

    .address {
      margin: auto;
      display: table;

      &:hover {
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }

  @media (min-width: 480px) {
    .selected-wallet {
      width: 320px;
    }
  }
}
</style>