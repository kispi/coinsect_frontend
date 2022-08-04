<template>
  <div
    ref="refModalDonation"
    class="modal-donation scrollable-body">
    <AppLoading :loading="drawing"/>
    <ModalHeader :title="$translate('MODAL_DONATION')" @close="$emit('close')"/>
    <div class="body pre-line">
      <div class="description m-b-16">
        <div class="m-b-8">혹시 커피한잔 사주시고 싶으신 형님들이 계시다면 아래 지갑으로 송금해주시면 잘 사용하겠습니다 🥰</div>
        <div>하단 QRCode는 각 코인별 지갑주소이며, QRCode 하단 지갑주소를 클릭하시면 해당 지갑의 트랜잭션 내역을 블록체인 익스플로어에서 보실 수 있습니다.</div>
      </div>
      <div
        v-if="wallets"
        class="sendable-tickers pretty-scrollbar">
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
        <div class="qr-code-container">
          <div id="modal-donation-qr-code"/>
        </div>
        <div
          class="address"
          :class="{'o-0': !selectedWallet}">
          <i class="fal fa-copy f-16 m-r-8" @click="copyToClipboard"/>
          <div class="value" @click="openBlockExplore">{{ (selectedWallet || {}).address || 'PLACEHOLDER' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, ref } from 'vue'

export default {
  props: ['options'],
  setup(_, { emit }) {
    const refModalDonation = ref(null)

    const plugins = getCurrentInstance().appContext.config.globalProperties

    const drawing = ref(null)

    const wallets = ref(null)

    const selectedWallet = ref(null)

    const qrcode = ref(null)

    const copyToClipboard = () => {
      plugins.$helpers.dom.copyToClipboard(selectedWallet.value.address)
      plugins.$toast.success(`코인충 운영자의 ${selectedWallet.value.blockchain.symbol}주소를 클립보드로 복사했습니다`)
    }

    const openBlockExplore = () => {
      if (!selectedWallet.value.blockchain.exploreUrl) return

      window.open(`${selectedWallet.value.blockchain.exploreUrl}${selectedWallet.value.address}`, '_blank', 'noopener')      
    }

    const callApi = async () => {
      try {
        wallets.value = await plugins.$http.get('wallets')
      } catch (e) {}
    }

    const selectWallet = async wallet => {
      drawing.value = true
      await plugins.$helpers.sleep(100)
      drawing.value = false
      selectedWallet.value = wallet
      if (typeof QRCode === 'undefined') return

      if (qrcode.value) {
        qrcode.value.clear()
        qrcode.value.makeCode(selectedWallet.value.address)
        return
      }

      if (!refModalDonation.value) {
        emit('close')
        return
      }

      const size = refModalDonation.value.getBoundingClientRect().width - 16 * 4 // 양쪽 패딩만큼 뺌
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
          plugins.$helpers.dom.loadScript({ url: '/scripts/qrcode.min.js' }),
          callApi(),
        ])

        // 왜인지는 모르겠으나 이 찌꺼기가 남아있는 경우가 있음
        const dom = document.getElementById('modal-donation-qr-code')
        const canvas = dom.getElementsByTagName('canvas')[0]
        if (canvas) canvas.remove()

        const img = dom.getElementsByTagName('img')[0]
        if (img) img.remove()

        selectWallet(wallets.value.data[0])
      } catch (e) {}
    }

    onMounted(init)

    return {
      refModalDonation,
      drawing,
      wallets,
      selectedWallet,
      copyToClipboard,
      openBlockExplore,
      selectWallet,
    }
  },
}
</script>

<style lang="scss" scoped>
.modal-donation {
  border-radius: 4px;
  width: 400px;
  min-height: 520px;
  position: relative;

  .body {
    padding: 16px;
  }

  .description {
    font-size: 12px;
    line-height: 18px;
    color: var(--text-stress);
  }

  .sendable-tickers {
    background: var(--white);
    border: 1px solid var(--gs-22);
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.24);
    display: flex;
    overflow: auto;

    .sendable-ticker {
      padding: 4px 8px;
      flex: 1 1 0;
      user-select: none;

      img {
        width: 24px;
        height: 24px;
      }

      .symbol {
        white-space: nowrap;
        color: var(--black);
        text-align: center;
        font-size: 12px;
      }

      &:hover {
        text-decoration: underline;
        cursor: pointer;
      }

      &.selected {
        background: var(--brand-primary);

        .symbol {
          color: var(--white);
        }
      }
    }
  }

  .selected-wallet {
    margin: 16px 0;
    font-size: 12px;
    color: var(--text-stress);

    .qr-code-container {
      background: var(--white);
      padding: 16px;
      position: relative;
      box-shadow: 0 0 1px var(--gs-22);
    }

    .address {
      margin-top: 16px;
      display: flex;
      color: var(--text-stress);
    }

    i,
    .value {
      cursor: pointer;
    }

    .value:hover {
      text-decoration: underline;
    }
  }
}
</style>