<template>
  <div class="app-loader">
    <div class="app-loader-container">
      <img src="favicon/logo-light.svg" class="loader-app-logo-light"/>
    </div>
    <div class="app-loader-container main">
      <img src="favicon/logo.svg" class="loader-app-loader-main"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-loader {
  width: 64px;
  position: relative;

  @keyframes width {
    0% { width: 0; }
    50% { width: 50%; }
    100% { width: 100%; }
  }

  .app-loader-container {
    position: absolute;

    img {
      width: 64px;
    }

    &.main {
      animation: width 2s infinite forwards cubic-bezier(0.785, 0.135, 0.15, 0.86);
      overflow: hidden;
    }
  }
}
</style>