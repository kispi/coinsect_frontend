<template>
  <div class="app-row-ads">
    <div class="relative">
      <!-- <AdSense :dataAdSlot="'1939754740'" class="left"/> -->
      <AdSense :dataAdSlot="'3927887162'" class="right"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-row-ads {
  position: fixed;
  top: calc(var(--app-header-height) + var(--app-default-page-padding));
  right: 0;
  left: 0;

  .relative {
    position: relative;
    margin: auto;
    width: 992px;
  }

  .ad-sense {
    width: 300px;
    height: 600px;
    position: absolute;

    &.left {
      right: calc(100% + 16px);
    }

    &.right {
      left: calc(100% + 16px);
    }
  }
}
</style>