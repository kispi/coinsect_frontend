<template>
  <div
    ref="refModalDonation"
    class="modal-donation scrollable-body">
    <AppLoading :loading="drawing"/>
    <ModalHeader :title="helpers.translate('MODAL_DONATION')" @close="$emit('close')"/>
    <div class="body pre-line">
      <div class="description m-b-16">
        <div class="m-b-8">코인충의 서버 운영 및 개발에 큰 힘이 됩니다. 감사합니다 🙏</div>
      </div>
      <div class="sendable-tickers">
        <div
          @click="selectWallet(wallet)"
          class="sendable-ticker"
          :class="{'selected': selectedWallet?.id === wallet.id}"
          :key="wallet.id"
          v-for="wallet in wallets">
          <span v-if="wallet.emoji" class="wallet-emoji">{{ wallet.emoji }}</span>
          <i v-else :class="wallet.icon" class="wallet-icon"/>
          <div class="symbol" v-html="wallet.symbol"/>
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
          <div class="value" @click="copyToClipboard">{{ selectedWallet?.address || 'PLACEHOLDER' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

defineProps({
  options: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['close'])

const refModalDonation = ref(null)

const { helpers } = useGlobalHooks()

const drawing = ref(null)

const wallets = [
  {
    id: 'lightning',
    symbol: 'LIGHTNING',
    emoji: '⚡',
    address: process.env.VUE_APP_BTC_LIGHTNING || '',
  },
  {
    id: 'onchain',
    symbol: 'ONCHAIN',
    icon: 'fab fa-bitcoin c-bitcoin',
    address: process.env.VUE_APP_BTC_ONCHAIN || '',
  },
]

const selectedWallet = ref(null)

const qrcode = ref(null)

const copyToClipboard = () => {
  if (!selectedWallet.value) return
  helpers.dom.copyToClipboard(selectedWallet.value.address)
  helpers.toast.success(`비트코인 ${selectedWallet.value.symbol} 주소를 클립보드로 복사했습니다`)
}

const selectWallet = async wallet => {
  drawing.value = true
  await helpers.sleep(100)
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
    await helpers.dom.loadScript({ url: '/scripts/qrcode.min.js' })

    // 왜인지는 모르겠으나 이 찌꺼기가 남아있는 경우가 있음
    const dom = document.getElementById('modal-donation-qr-code')
    const canvas = dom.getElementsByTagName('canvas')[0]
    if (canvas) canvas.remove()

    const img = dom.getElementsByTagName('img')[0]
    if (img) img.remove()

    selectWallet(wallets[0])
  } catch (e) {}
}

onMounted(init)
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
      padding: 8px;
      flex: 1 1 0;
      user-select: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;

      .wallet-emoji {
        font-size: 24px;
        line-height: 1;
      }

      .wallet-icon {
        font-size: 24px;
        color: var(--text-stress);
      }

      .symbol {
        white-space: nowrap;
        color: var(--black);
        text-align: center;
        font-size: 12px;
      }

      &.selected {
        background: var(--brand-primary);

        .wallet-icon {
          color: var(--white);
        }

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