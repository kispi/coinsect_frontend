<template>
  <div
    v-if="!hide"
    class="app-ad">
    <a class="ad-card" href="https://btc.coinsect.io" target="_blank">
      <div class="logo f-ubuntu"><i class="fab fa-bitcoin c-bitcoin m-r-8"/>bitcoinsect</div>
    </a>
    <a
      @click="onClickAd"
      class="ad-card"
      target="_blank">
      <div class="c-text-stress text-center">광고 문의: 페이지 하단 카톡/텔레그램</div>
    </a>
    <div
      @click.stop="hide = true"
      class="clickable-icon-wrapper">
      <i class="fal fa-times"/>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const hide = ref(null)

    const onClickAd = () => {
      const dom = document.querySelector('.contact-sns')
      if (dom) dom.scrollIntoView({ behavior: 'smooth' })
    }

    return {
      hide,
      onClickAd,
    }
  },
}
</script>

<style lang="scss" scoped>
.app-ad {
  position: relative;
  display: flex;
  gap: 8px;

  .ad-card {
    border: 1px solid var(--border-base);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 160px;
    padding: 16px;
    flex: 1;

    &:hover {
      background: var(--background-light);
      cursor: pointer;
    }

    &:nth-child(1) {
      background: #192039;
    }

    &:nth-child(2) {
      .logo {
        color: var(--bitcoin);
        font-weight: 700;
      }
    }
  }

  .clickable-icon-wrapper {
    width: 32px;
    height: 32px;
    top: 8px;
    right: 8px;
    position: absolute;
  }

  div.logo {
    font-size: 40px;
    color: var(--white);
  }

  @media (max-width: 767px) {
    flex-direction: column;

    div.logo {
      font-size: 32px;
    }
  }
}
</style>