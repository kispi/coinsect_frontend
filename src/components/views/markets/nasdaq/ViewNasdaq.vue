<template>
  <div class="view-nasdaq">
    <NasdaqNaver/>
    <PoweredBy :by="'naver'" class="m-t-24"/>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'
import NasdaqNaver from './NasdaqNaver'

const { helpers, store } = useGlobalHooks()

onMounted(() => {
  store.commit('setSettings', { currency: 'usd' })
  helpers.toast.success(`
    통화를 USD로 설정합니다. 페이지를 벗어나면 다시 원래 통화로 돌아갑니다.
    또는 상단 <i class='fa fa-cog'></i> 개인화 설정에서 언제든 변경하실 수 있습니다.
  `, 5000)
})

onUnmounted(() => {
  store.commit('setSettings', { currency: 'krw' })
})
</script>