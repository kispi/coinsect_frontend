<template>
  <div class="lottery-pick">
    <div
      @click="$emit('click-remove', pos)"
      class="square-container"
      :key="pos"
      v-for="pos in [0, 1, 2, 3, 4, 5]">
      <div class="ratio-container">
        <div class="square center overlay" v-html="numbers[pos]"/>
      </div>
    </div>
    <i class="fa fa-plus f-24"/>
    <div
      @click="$emit('click-remove', 6)"
      class="square-container">
      <div class="ratio-container">
        <div class="square center overlay" v-html="numbers[6]"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    numbers: Array,
  },
}
</script>

<style lang="scss" scoped>
.lottery-pick {
  display: flex;
  align-items: center;
  justify-content: space-between;
  grid-gap: 16px;

  .square-container {
    border-radius: 8px;
    background: var(--background-light);
    user-select: none;
    position: relative;
    flex: 1;
    cursor: pointer;
  }

  .ratio-container {
    padding-top: 100%;
  }
}
</style>