<template>
  <div
    v-if="show"
    class="fools-day-prank overlay">
    <div class="body">
      <img src="./download.png">
      <h1>사이트에 연결하기 싫음</h1>
      <div class="content">coinsect.io의 운영자에게 치킨과 피자를 쏘세요</div>
      <div class="code">COINSECT_APRIL_FOOLS_DAY</div>
      <div class="close" @click="close">입장</div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  setup() {
    const { helpers } = useGlobalHooks()

    const show = ref(null)

    const timeout = ref(null)

    const close = () => {
      show.value = false
      clearTimeout(timeout.value)
    }

    const check = () => {
      const today = helpers.dayjs().format('MM-DD')
      show.value = today === '04-01'
      timeout.value = setTimeout(check, 5000)
    }

    onMounted(check)

    onUnmounted(() => {
      clearTimeout(timeout.value)
    })

    return {
      show,
      close,
    }
  },
}
</script>

<style lang="scss">
.fools-day-prank {
  background: var(--white);
  color: var(--black);
  position: fixed !important;
  z-index: 6;
  font-weight: 500;

  h1,
  div {
    font-family: system-ui,Apple SD Gothic Neo,AppleGothic,sans-serif;
  }

  .body {
    margin: 14vh auto 0;
    max-width: 600px;
    width: 100%;
    padding: 16px;
  }

  img {
    width: 72px;
    height: 72px;
    margin-bottom: 40px;
  }

  h1 {
    font-size: 24px;
    margin-bottom: 16px;
    color: #202124;
    font-weight: 700;
  }

  .content {
    font-size: 15px;
  }

  .code {
    font-size: 12px;
    margin-top: 12px;
  }

  .content,
  .code {
    color: #5F6368;
  }

  .close {
    color: var(--white);
    background: #1A73E8;
    font-size: 13px;
    margin: 48px 0 0 auto;
    padding: 8px 16px;
    border-radius: 4px;
    display: table;
    cursor: pointer;
  }
}
</style>