<template>
  <div
    @click="$helpers.dom.scrollToTop"
    class="go-to-top"
    :class="{'no-show': $store.getters.scrollTop <= 120}">
    <i class="fa fa-arrow-up"/>
  </div>
</template>

<style lang="scss" scoped>
.go-to-top {
  width: 32px;
  height: 32px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.25);
  color: var(--text-stress);
  border-radius: 50%;
  bottom: 16px;
  left: 16px;
  transition: all 0.5s ease;
  position: fixed;
  z-index: 1;
  cursor: pointer;

  &.no-show {
    opacity: 0;
    pointer-events: none;
  }
}

#app.dark {
  .go-to-top {
    background: rgba(255, 255, 255, 0.25);
  }
}
</style>