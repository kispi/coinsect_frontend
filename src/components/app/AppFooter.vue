<template>
  <footer class="app-footer">
    <div class="layout-centered">
      <div>coinsect.io는 가상자산들의 실시간 가격, 호가창, 시가총액 등의 정보들을 제공합니다.</div>
      <div>이 사이트에서 제공하는 정보들은 투자에 대한 조언이 아니며, 투자에 대한 모든 책임은 본인에게 있습니다.</div>
      <div class="flex-row flex-between items-end m-t-16">
        <div class="first">
          <address class="flex-row items-center">
            <i class="fal fa-envelope"/><div><a href="mailto:admin@coinsect.io">coinsect.io@gmail.com</a></div>
          </address>
          <div class="flex-row items-center cursor-pointer">
            <i class="fal fa-coffee f-14"/><a class="cursor-pointer" @click="$modal.custom({ component: 'ModalDonation' })" v-html="$translate('MODAL_DONATION')"/>
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

}
</script>

<style lang="scss" scoped>
.app-footer {
  background: var(--background-light);
  font-size: 12px;
  line-height: 24px;
  color: var(--text-stress);
  padding-top: 32px;
  padding-bottom: 32px;

  .first {
    i {
      width: 24px;
      max-width: 24px;
      font-size: 16px;
    }
  }

  a {
    color: var(--text-stress);
  }
}
</style>