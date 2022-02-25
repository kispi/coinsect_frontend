<template>
  <div class="app-row-ads">
    <AdSense :dataAdSlot="'1939754740'"/>
    <div class="blocker"/>
    <AdSense :dataAdSlot="'3927887162'"/>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.app-row-ads {
  position: fixed;
  top: var(--app-header-height);
  display: flex;
  justify-content: center;
  width: 100vw;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;

  .blocker {
    width: 100%;
    max-width: 992px;
    margin: 0 8px;
  }

  .ad-sense {
    min-width: 300px;
    height: 600px;
    pointer-events: auto;
    margin: 0;
    cursor: pointer;

    &.left {
      left: 0;
    }

    &.right {
      right: 0;
    }
  }

  @media (min-width: 992px) {
    .blocker {
      min-width: 992px;
    }
  }
}
</style>