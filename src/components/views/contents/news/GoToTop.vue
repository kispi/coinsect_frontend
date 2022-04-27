<template>
  <div @click="$helpers.dom.scrollToTop" class="go-to-top">
    <i class="fa fa-arrow-up"/>맨 위로
  </div>
</template>

<style lang="scss" scoped>
.go-to-top {
  width: 96px;
  padding: 8px;
  display: flex;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  color: var(--white);
  border-radius: 16px;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  transition: all 0.5s ease;
  position: fixed;
  z-index: 1;
  cursor: pointer;

  i {
    margin-right: 8px;
  }
}
</style>