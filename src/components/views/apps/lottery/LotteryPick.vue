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

<script setup>
import { ref } from 'vue'

defineProps({
  numbers: {
    type: Array,
    default: () => [],
  },
})

const focused = ref(null)
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