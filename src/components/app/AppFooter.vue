<template>
  <footer class="app-footer">
    <div class="layout-centered">
      <div>coinsect.io는 가상자산들의 실시간 가격, 호가창, 시가총액 등의 정보들을 제공합니다.</div>
      <div>이 사이트에서 제공하는 정보들은 투자에 대한 조언이 아니며, 투자에 대한 모든 책임은 본인에게 있습니다.</div>
      <div class="flex-row flex-between items-end m-t-16">
        <div class="first">
          <div class="contact-sns">
            <a
              :href="contact.link"
              :key="contact.key"
              v-for="contact in contacts"
              target="_blank"
              rel="noreferrer noopener">
              <AppImg :src="contact.img" :alt="contact.key"/>
            </a>
          </div>
          <div class="flex-row items-center cursor-pointer m-t-24">
            <a class="cursor-pointer text-underline" @click="$modal.custom({ component: 'ModalDonation' })" v-html="$translate('MODAL_DONATION')"/>
          </div>
        </div>
        <div v-if="($store.getters.config || {}).version">
          <div v-if="$store.getters.config.version.backend">Backend: {{ $store.getters.config.version.backend }}</div>
          <div v-if="$store.getters.config.version.frontend">Frontend: {{ $store.getters.config.version.frontend }}</div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  setup() {
    const contacts = [{
      key: 'kakao',
      img: 'https://play-lh.googleusercontent.com/Ob9Ys8yKMeyKzZvl3cB9JNSTui1lJwjSKD60IVYnlvU2DsahysGENJE-txiRIW9_72Vd=w240-h480-rw',
      link: 'https://open.kakao.com/o/sFKflMte',
    }, {
      key: 'telegram',
      img: 'https://play-lh.googleusercontent.com/ZU9cSsyIJZo6Oy7HTHiEPwZg0m2Crep-d5ZrfajqtsH-qgUXSqKpNA2FpPDTn-7qA5Q=w240-h480-rw',
      link: 'https://t.me/coinsect',
    }, {
      key: 'email',
      img: 'https://cdn-icons-png.flaticon.com/512/331/331389.png',
      link: 'mailto:admin@coinsect.io',
    }]

    return {
      contacts,
    }
  },
}
</script>

<style lang="scss" scoped>
.app-footer {
  background: var(--background-light);
  font-size: 12px;
  line-height: 24px;
  padding-top: 32px;
  padding-bottom: 32px;

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
      opacity: 0.75;

      &:not(:last-child) {
        margin-right: 8px;
      }

      &:hover {
        opacity: 1;
      }
    }
  }
}
</style>