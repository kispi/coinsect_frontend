<template>
  <div class="view-crypto">
    <CryptoCoinmarketcap/>
    <PoweredBy :by="'coinmarketcap'" class="m-t-24"/>
  </div>
</template>

<script setup>
import CryptoCoinmarketcap from './CryptoCoinmarketcap'
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