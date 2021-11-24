<template>
  <div class="powered-by">
    Powered by <a href="https://coingecko.com" target="_blank" rel="noopener">Coingecko<img src="@/assets/images/coingecko.png" alt="Coingecko"></a>
  </div>
</template>

<script>
export default {
  props: {
    by: String,
    validator: val => ['coingecko'].includes(val),
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