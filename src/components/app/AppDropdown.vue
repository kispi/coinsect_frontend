<template>
  <div class="app-dropdown">
    <div
      ref="dropdownButton"
      @click="dropdownOpened = true"
      v-if="selectedItem"
      class="clickable-area">
      <i class="item-icon" v-if="selectedItem.icon" :class="selectedItem.icon"/>
      <img class="item-image" v-if="selectedItem.img" :src="selectedItem.img" :alt="$translate(selectedItem.key)"/>
      <div class="key" v-html="$translate(selectedItem.key)"/>
      <div class="chevrons">
        <i class="fa fa-chevron-down"/>
      </div>
    </div>
    <WrapperDropdownOverlay
      v-model="dropdownOpened"
      :mountBelow="dropdownButton">
      <ul>
        <li
          @click="onClickDropdownItem(item)"
          :key="item.key"
          v-for="item in dropdownItems"
          :class="{'selected': (selectedItem || {}).key === item.key}">
          <i class="item-icon" v-if="item.icon" :class="item.icon"/>
          <img class="item-image" v-if="item.img" :src="item.img" :alt="$translate(item.key)"/>
          <div class="key" v-html="$translate(item.key)"/>
        </li>
      </ul>
    </WrapperDropdownOverlay>
  </div>
</template>

<script>
import { computed, ref, onMounted, watch } from 'vue'
import WrapperDropdownOverlay from './WrapperDropdownOverlay'

export default {
  name: 'AppDropdown',
  props: ['dropdownItems'],
  components: { WrapperDropdownOverlay },
  setup(props, { emit }) {
    const onClickDropdownItem = clickedItem => {
      props.dropdownItems.forEach(item => item.$$selected = clickedItem.key === item.key)
      dropdownOpened.value = false
      emit('select-dropdown-item', clickedItem)
    }

    const selectedItem = computed(() => props.dropdownItems.find(item => item.$$selected))

    const dropdownOpened = ref(null)

    const dropdownButton = ref(null)

    onMounted(() => {
      if (selectedItem.value) onClickDropdownItem(selectedItem.value)
    })

    watch(
      () => props.dropdownItems,
      newVal => {
        if (!newVal) return

        onClickDropdownItem(newVal[0])
        console.log('dlrp dufjqjs?')
      },
    )

    return {
      selectedItem,
      dropdownOpened,
      dropdownButton,
      onClickDropdownItem,
    }
  },
}
</script>

<style lang="scss" scoped>
.app-dropdown {
  .clickable-area {
    display: flex;
    align-items: center;
    padding: 8px 0;
    cursor: pointer;

    & > * {
      pointer-events: none;
    }
  }

  .item-icon,
  .item-image {
    font-size: 14px;
    width: 16px;
  }

  .key {
    margin: 0 4px;
    font-weight: 500;
  }

  .chevrons {
    i {
      font-size: 10px;
    }
  }

  ul {
    background: var(--background-base);
    border: 1px solid var(--gs-bb);
    padding: 8px 0;
    border-radius: 4px;
    max-height: 240px;
    overflow-y: auto;

    li {
      padding: 8px;
      display: flex;
      align-items: center;
      padding-right: 24px;
      cursor: pointer;
      user-select: none;

      &:hover {
        background: var(--brand-primary-hover-bg);
      }

      &:active,
      &.selected {
        color: var(--brand-primary);
      }
    }
  }
}
</style>