<template>
  <footer class="app-footer">
    <div class="layout-centered">
      <div class="sitemap">
        <div
          class="section"
          :key="section"
          v-for="section in sections">
          <div class="section-title" v-html="$translate(section.title)"/>
          <a
            @click.prevent="$router.push(page.path)"
            :href="page.path"
            :key="page.path"
            v-for="page in section.subItems"
            v-html="$translate(page.title)"
          />
        </div>
      </div>
      <div class="bottom">
        <div>
          <div class="section">
            <div class="section-title" v-html="$translate('CONTACT')"/>
            <div class="contact-sns">
              <a
                :href="contact.link"
                :key="contact.key"
                v-for="contact in contacts"
                target="_blank"
                rel="noreferrer">
                <AppImg :src="contact.img" :alt="contact.key"/>
              </a>
            </div>
          </div>
          <div class="section m-t-24">
            <div class="section-title m-t-16 cursor-pointer text-underline" @click="$modal.custom({ component: 'ModalDonation' })" v-html="$translate('MODAL_DONATION')"/>
          </div>
        </div>
        <div class="info">
          <div class="section">
            <div class="section-title" v-html="$translate('DISCLAIMER')"/>
            <div v-html="info.disclaimer"/>
          </div>
          <a
            class="section display-block m-t-24"
            href="https://btc.coinsect.io/posts/commodity-vs-security"
            target="_blank">
            <div class="section-title">
              <i class="fa fa-external-link m-r-8 f-12"></i>{{ $translate('BITCOIN_VS_ALTCOIN') }}
            </div>
            <div v-html="info.bitcoinVsAltcoin"/>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { computed } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'
import useMenuItems from './app-header/menu-items'

export default {
  setup() {
    const { menuItems } = useMenuItems()

    const { store } = useGlobalHooks()

    const contacts = [{
      key: 'kakao',
      img: 'https://play-lh.googleusercontent.com/Ob9Ys8yKMeyKzZvl3cB9JNSTui1lJwjSKD60IVYnlvU2DsahysGENJE-txiRIW9_72Vd=w240-h480-rw',
      link: 'https://open.kakao.com/me/coinsect',
    }, {
      key: 'telegram',
      img: 'https://play-lh.googleusercontent.com/ZU9cSsyIJZo6Oy7HTHiEPwZg0m2Crep-d5ZrfajqtsH-qgUXSqKpNA2FpPDTn-7qA5Q=w240-h480-rw',
      link: 'https://t.me/coinsect',
    }, {
      key: 'email',
      img: 'https://cdn-icons-png.flaticon.com/512/331/331389.png',
      link: 'mailto:admin@coinsect.io',
    }]

    const sections = computed(() => [{
      title: 'MAIN',
      subItems: [
        { path: '/', title: 'HOME' },
        { path: '/prices', title: 'KIMP' },
        { path: '/community', title: 'COMMUNITY' },
        { path: '/about', title: 'ABOUT' },
      ],
    }].concat(menuItems.value.filter(o => o.subItems)))

    const info = computed(() => {
      const html = {
        kr: {
          disclaimer: `<div>코인충(coinsect.io)에서 제공되는 어떤 정보도 투자에 대한 조언이 아니며, 이용자들의 투자 결과에 대해 아무런 책임을 지지 않습니다. 암호자산은 극도의 변동성을 보이므로 투자에 유의하시기 바랍니다.</div>`,
          bitcoinVsAltcoin: `<div>오직 비트코인만 금과 같은 '상품'이며, 나머지 모든 알트코인(이더리움 포함)은 아직 불명확한 규제의 회색지대를 이용한 미등록 증권으로, 매우 큰 위험성을 지닌 벤처기업들로 볼 수 있습니다.</div>`,
        },
        en: {
          disclaimer: `<div>None of the information provided here(coinsect.io) should be considered as a financial advice, thus we are not responsble for loss of users. Cryptocurrency is notorious for it's volatility.</div>`,
          bitcoinVsAltcoin: `<div>Bitcoin is the only COMMODITY, whereas altcoins(ETH included) are in fact STARTUPS, UNREGISTERED SECURITIES taking advantage of gray area of regulation, involving extreme investment risk.</div>`,
        },
      }

      return html[store.getters.settings.locale]
    })

    return {
      info,
      sections,
      contacts,
    }
  },
}
</script>

<style lang="scss" scoped>
.app-footer {
  background: var(--background-light);
  font-size: 12px;
  padding: 16px;
  padding-top: 32px;
  padding-bottom: 120px;

  .contact-sns {
    display: flex;

    a {
      border-radius: 16px;
      width: 32px;
      height: 32px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease-in-out;

      &:not(:last-child) {
        margin-right: 8px;
      }

      &:hover {
        transform: scale(1.05);
      }
    }
  }

  .sitemap {
    display: grid;
    gap: 24px;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }

  .section {
    .section-title {
      font-weight: 700;
      margin-bottom: 8px;
      font-size: 14px;
    }

    a {
      display: block;

      &:hover {
        color: var(--brand-primary);
      }

      &:not(:last-child) {
        margin-bottom: 4px;
      }
    }
  }

  .bottom {
    border-top: 1px solid var(--border-base);
    padding-top: 24px;
    margin-top: 24px;
    display: grid;
    gap: 24px;
  }

  @media (max-width: 767px) {
    .sitemap {
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    }
  }

  @media (min-width: 768px) {
    .bottom {
      grid-template-columns: repeat(auto-fill, minmax(480px, 1fr));
    }
  }
}
</style>