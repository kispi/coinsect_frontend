<template>
  <div
    ref="refModalDonation"
    class="modal-donation scrollable-body">
    <AppLoading :loading="drawing"/>
    <ModalHeader :title="$translate('MODAL_DONATION')" @close="$emit('close')"/>
    <div class="body pre-line">
      <div class="description m-b-16">
        <div class="m-b-8">- 리플은 데스티네이션 태그가 없어도 송금이 가능합니다.</div>
        <div>- 비트코인 출금 수수료는 사실 업비트에서나 비쌀 뿐, 개인지갑에서 보내는 경우 전혀 비싸지 않습니다. (심지어 불과 몇백원의 수수료만으로도 송금 가능)</div>
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
import { computed, onMounted, ref } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  props: ['options'],
  setup(_, { emit }) {
    const refModalDonation = ref(null)

    const { plugins, store } = useGlobalHooks()

    const drawing = ref(null)

    const wallets = computed(() => store.getters.wallets)

    const selectedWallet = ref(null)

    const qrcode = ref(null)

    const copyToClipboard = () => {
      plugins.$helpers.dom.copyToClipboard(selectedWallet.value.address)
      plugins.$toast.success(`코인충 운영자의 ${selectedWallet.value.blockchain.symbol}주소를 클립보드로 복사했습니다`)
    }

    const openBlockExplore = () => {
      if (!selectedWallet.value.blockchain.exploreUrl) return

      window.open(`${selectedWallet.value.blockchain.exploreUrl}${selectedWallet.value.address}`, '_blank', 'noreferrer')
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
          store.dispatch('loadWallets'),
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
.modal-donation.modal-base-style {
  border-radius: 4px;
  width: 400px;
  min-height: 520px;
  position: relative;

  .body {
    padding: 16px;
  }

  .description {
    font-size: 12px;
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
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

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