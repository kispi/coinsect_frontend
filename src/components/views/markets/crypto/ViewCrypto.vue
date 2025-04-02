<template>
  <div class="view-crypto">
    <CryptoCoinmarketcap/>
    <PoweredBy :by="'coinmarketcap'" class="m-t-24"/>
  </div>
</template>

<script setup lang="ts">
import CryptoCoinmarketcap from './CryptoCoinmarketcap.vue'
</script>

<style lang="scss">
.view-crypto {
  padding-bottom: 120px;

  .app-dropdown {
    text-transform: uppercase;
    white-space: nowrap;
  }
}
</style>