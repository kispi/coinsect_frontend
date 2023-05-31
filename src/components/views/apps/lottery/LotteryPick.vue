<template>
  <div class="lottery-pick" :class="{'focus': focused}">
    <div
      @click="$emit('click-remove', pos)"
      class="square-container"
      :key="pos"
      v-for="pos in [0, 1, 2, 3, 4, 5]">
      <div class="ratio-container">
        <div class="square center overlay" v-html="numbers[pos]"/>
      </div>
    </div>
    <i class="fal fa-plus f-24"/>
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
import { ref } from 'vue'

export default {
  props: {
    numbers: Array,
  },
  setup() {
    const focused = ref(null)

    const focus = () => {
      for (let i = 1; i <= 10; i++) { // 짝수번 깜빡여야 최종 focused.value === false가 됨.
        setTimeout(() => focused.value = i % 2 === 1, i * 100)
      }
    }

    return {
      focus,
      focused,
    }
  },
}
</script>

<style lang="scss" scoped>
.lottery-pick {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  .square-container {
    border-radius: 8px;
    background: var(--background-light);
    user-select: none;
    position: relative;
    flex: 1;
    cursor: pointer;
  }

  .square {
    font-size: 20px;
  }

  .ratio-container {
    padding-top: 100%;
  }

  &.focus {
    .square-container {
      background: var(--brand-primary-hover-bg);
      border: 1px dashed var(--text-stress);
    }
  }

  @media (max-width: 479px) {
    .square {
      font-size: 16px;
    }
  }
}
</style>