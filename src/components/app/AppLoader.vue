<template>
  <div class="app-loader">
    <div class="app-loader-dot-wrapper"><div class="app-loader-dot"/></div>
    <div class="app-loader-dot-wrapper"><div class="app-loader-dot"/></div>
    <div class="app-loader-dot-wrapper"><div class="app-loader-dot"/></div>
    <div class="app-loader-dot-wrapper"><div class="app-loader-dot"/></div>
    <div class="app-loader-dot-wrapper"><div class="app-loader-dot"/></div>
  </div>
</template>

<style lang="scss" scoped>
.app-loader {
  position: relative;
  width: 88px;
  height: 88px;
  transform: translate(-44px, -44px) scale(0.44) translate(44px, 44px);

  @keyframes lds-ellipsis3 {
    0%, 25% { left: 32px; transform: scale(0); }
    50% { left: 32px; transform: scale(1); }
    75% { left: 100px; }
    100% { left: 168px; transform: scale(1); }
  }

  @keyframes lds-ellipsis2 {
    0% { transform: scale(1); }
    25%, 100% { transform: scale(0); }
  }

  @keyframes lds-ellipsis {
    0% { left: 32px; transform: scale(0); }
    25% { left: 32px; transform: scale(1); }
    50% { left: 100px; }
    75% { left: 168px; transform: scale(1); }
    100% { left: 168px; transform: scale(0); }
  }

  .app-loader-dot-wrapper {
    position: absolute;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;

    .app-loader-dot {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      position: absolute;
      top: 100px;
      left: 32px;
      animation: lds-ellipsis 1s cubic-bezier(0, 0.5, 0.5, 1) infinite forwards;
    }

    &:nth-child(1) .app-loader-dot {
      animation: lds-ellipsis2 1s cubic-bezier(0, 0.5, 0.5, 1) infinite forwards;
      background: rgba(36, 175, 100, 0.34);
    }

    &:nth-child(2) .app-loader-dot {
      animation-delay: -0.5s;
      background: rgba(36, 175, 100, 0.66);
    }

    &:nth-child(3) .app-loader-dot {
      animation-delay: -0.25s;
      background: rgba(36, 175, 100, 0.78);
    }

    &:nth-child(4) .app-loader-dot {
      animation-delay: 0s;
      background: rgba(36, 175, 100, 1);
    }

    &:nth-child(5) .app-loader-dot {
      animation: lds-ellipsis3 1s cubic-bezier(0, 0.5, 0.5, 1) infinite forwards;
      background: rgba(36, 175, 100, 0.34);
    }
  }

  &.small {
    width: 44px;
    height: 44px;
    transform: translate(-22px, -22px) scale(0.22) translate(22px, 22px);
  }
}
</style>