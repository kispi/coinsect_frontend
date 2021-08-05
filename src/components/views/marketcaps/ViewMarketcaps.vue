<template>
  <div class="view-marketcaps">
    <div class="settings">
      <div class="source">
        Powered by <a href="https://coingecko.com" target="_blank" rel="noopener">Coingecko<img src="@/assets/images/coingecko.png" alt="Coingecko"></a>
      </div>
    </div>
    <AppLoading :loading="$store.getters.loading.marketcaps"/>
    <MarketcapsCoingecko class="m-t-24"/>
  </div>
</template>

<script>
import MarketcapsCoingecko from './MarketcapsCoingecko'

export default {
  components: { MarketcapsCoingecko },
}
</script>

<style lang="scss">
.view-marketcaps {
  max-width: 992px;
  margin: auto;
  padding: var(--app-default-page-padding);
  padding-bottom: 120px;

  .settings {
    display: flex;
    justify-content: space-between;

    .source,
    .currency {
      display: flex;
      align-items: center;
    }

    .source {
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
          margin: 0 8px;
        }
      }
    }
  }

  .app-dropdown {
    text-transform: uppercase;
    white-space: nowrap;
  }
}
</style>