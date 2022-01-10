<template>
  <div class="powered-by">
    <template v-if="by === 'coingecko'">
      Powered by <a :href="link || 'https://coingecko.com'" target="_blank" rel="noopener">Coingecko<img src="@/assets/images/coingecko.png" alt="Coingecko"></a>
    </template>
    <template v-if="by === 'upbit'">
      Powered by <a :href="link || 'https://upbit.com'" target="_blank" rel="noopener">Upbit<img src="@/assets/images/upbit.svg" alt="Upbit"></a>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    by: String,
    link: String,
    validator: val => ['coingecko', 'upbit'].includes(val),
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