<template>
  <div class="powered-by">
    <template v-if="by === 'coinmarketcap'">
      Powered by <a :href="link || 'https://coinmarketcap.com'" target="_blank" rel="noopener">Coinmarketcap<img src="@/assets/images/coinmarketcap.png" alt="Coinmarketcap"></a>
    </template>
    <template v-if="by === 'coingecko'">
      Powered by <a :href="link || 'https://coingecko.com'" target="_blank" rel="noopener">Coingecko<img src="@/assets/images/coingecko.png" alt="Coingecko"></a>
    </template>
    <template v-if="by === 'upbit'">
      Powered by <a :href="link || 'https://upbit.com'" target="_blank" rel="noopener">Upbit<img src="@/assets/images/upbit.svg" alt="Upbit"></a>
    </template>
    <template v-if="by === 'bitcointreasuries'">
      Powered by <a :href="link || 'https://bitcointreasuries.net/'" target="_blank" rel="noopener">Bitcointreasuries<img src="@/assets/images/bitcointreasuries.png" alt="Bitcointreasuries"></a>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    by: {
      type: String,
      validator: val => ['coinmarketcap', 'coingecko', 'upbit', 'bitcointreasuries'].includes(val),
    },
    link: String,
  },
}
</script>

<style lang="scss" scoped>
.powered-by {
  display: flex;

  a {
    text-decoration: underline;
    color: var(--brand-primary);
    display: flex;
    align-items: center;
    margin-left: 8px;

    &:hover {
      font-weight: 700;
    }

    img {
      width: 16px;
      border-radius: 50%;
      margin-left: 4px;
    }
  }
}
</style>