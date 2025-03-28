<template>
  <div class="view-kospi">
    <KospiNaver/>
    <PoweredBy :by="'naver'" class="m-t-24"/>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'
import KospiNaver from './KospiNaver'

const { store } = useGlobalHooks()

onMounted(() => {
  store.commit('setSettings', { currency: 'krw' })
})
</script>