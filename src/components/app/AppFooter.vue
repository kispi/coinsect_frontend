<template>
  <footer class="app-footer">
    <div class="view-layout-default">
      <div><AppLogo/>는 가상자산들의 실시간 가격, 호가창, 시가총액 등의 정보들을 제공합니다.</div>
      <div>이 사이트에서 제공하는 정보들은 투자에 대한 조언이 아니며, 투자에 대한 모든 책임은 본인에게 있습니다.</div>
      <div><a href="https://9gag.com/gag/avLLq9W" target="_blank" rel="noopener">좋은 브라우저들에서만 사용가능합니다.</a></div>
      <div class="flex-row flex-between items-end m-t-16">
        <address class="flex-row items-center">
          <i class="fal fa-envelope flex-wrap m-r-4 f-16"/><div><a href="mailto:admin@coinsect.io">admin@coinsect.io</a></div>
        </address>
        <div v-if="($store.getters.config || {}).version">
          <div>Backend: {{ $store.getters.config.version.backend }}</div>
          <div>Frontend: {{ $store.getters.config.version.frontend }}</div>
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

  .app-logo {
    font-size: 12px;
    color: var(--brand-primary);
  }

  a {
    font-weight: 700;
    text-decoration: underline;
    color: var(--text-stress);
  }

  @media (min-width: 768px) {
    padding-top: 32px;
    padding-bottom: 32px;
  }
}
</style>