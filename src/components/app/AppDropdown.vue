<template>
  <div
    ref="dropdownButton"
    class="app-dropdown"
    :class="{'transparent': transparent}">
    <div
      @click="dropdownOpened = true"
      class="clickable-area">
      <div class="info">
        <i class="item-icon" v-if="(selectedItem || {}).icon" :class="(selectedItem || {}).icon"/>
        <img class="item-image" v-if="(selectedItem || {}).img" :src="(selectedItem || {}).img"/>
        <div class="key" v-html="$translate((selectedItem || {}).name || (selectedItem || {}).key || 'SELECT')"/>
      </div>
      <div class="chevrons">
        <i class="fa fa-chevron-down"/>
      </div>
    </div>
    <WrapperDropdownOverlay
      v-if="dropdownOpened"
      @close="dropdownOpened = false"
      :mountBelow="dropdownButton"
      :align="align">
      <div class="list-container">
        <div
          v-if="useSearch"          
          class="search-box input-wrapper">
          <i class="fal fa-search"/>
          <input
            v-model="keyword"
            ref="refInput"
            placeholder="btc, eth..."
            @keydown="onKeydown"
          >
          <i v-if="keyword" class="fal fa-times" @click="initKeyword"/>
        </div>
        <ul
          v-if="filteredList.length > 0"
          class="pretty-scrollbar">
          <li
            @click="onClickDropdownItem(item)"
            :key="item.key"
            v-for="item in filteredList"
            :class="{'selected': (selectedItem || {}).key === item.key}">
            <i class="item-icon" v-if="item.icon" :class="item.icon"/>
            <img class="item-image" v-if="item.img" :src="item.img" :alt="$translate(item.name || item.key)"/>
            <div class="key" v-html="$translate(item.name || item.key)"/>
          </li>
        </ul>
        <div v-else class="empty" @click="initKeyword">
          <i class="fa fa-ban"/>
        </div>
      </div>
    </WrapperDropdownOverlay>
  </div>
</template>

<script>
import { computed, ref, onMounted, watch } from 'vue'
import WrapperDropdownOverlay from './WrapperDropdownOverlay'

export default {
  name: 'AppDropdown',
  props: ['dropdownItems', 'align', 'useSearch', 'transparent'],
  components: { WrapperDropdownOverlay },
  setup(props, { emit }) {
    const refInput = ref(null)

    const keyword = ref(null)

    const selectedItem = computed(() => props.dropdownItems.find(item => item.$$selected))

    const dropdownOpened = ref(null)

    const dropdownButton = ref(null)

    const filteredList = computed(() => props.dropdownItems.filter(o => keyword.value ? o.key.toLowerCase().includes(keyword.value.toLowerCase()) : true))

    const initKeyword = () => {
      keyword.value = null
      refInput.value.focus()
    }

    const onKeydown = e => {
      setTimeout(() => keyword.value = e.target.value)
    }

    const onClickDropdownItem = clickedItem => {
      props.dropdownItems.forEach(item => item.$$selected = clickedItem.key === item.key)
      dropdownOpened.value = false
      emit('select-dropdown-item', clickedItem)
    }

    onMounted(() => {
      if (selectedItem.value) onClickDropdownItem(selectedItem.value)
    })

    watch(
      () => props.dropdownItems,
      newVal => {
        if (!newVal || selectedItem.value) return // 이미 선택된 아이템이 있으면 첫째 항목을 선택하지 말고 그 아이템을 유지

        onClickDropdownItem(newVal[0])
      },
    )

    watch(
      () => dropdownOpened.value,
      newVal => {
        if (newVal && props.useSearch) {
          setTimeout(() => refInput.value ? refInput.value.focus() : null, 200)
        }
      },
    )

    return {
      refInput,
      keyword,
      selectedItem,
      filteredList,
      dropdownOpened,
      dropdownButton,
      initKeyword,
      onClickDropdownItem,
      onKeydown,
    }
  },
}
</script>

<style lang="scss" scoped>
.app-dropdown {
  color: var(--text-stress);

  .clickable-area {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    cursor: pointer;

    .info {
      display: flex;
      align-items: center;
    }

    & > * {
      pointer-events: none;
    }
  }

  .item-icon,
  .item-image {
    width: 16px;
  }

  .key {
    margin: 0 4px;
    white-space: nowrap;
  }

  .chevrons {
    i {
      font-size: 10px;
    }
  }

  .list-container {
    background: var(--background-base);
    border: 1px solid var(--gs-bb);
    padding: 8px 0;
    border-radius: 4px;
    width: 176px;
  }

  .search-box {
    padding: 0 8px 8px;
    border: 0;
    border-bottom: 1px solid var(--border-base);
    display: flex;
    align-items: center;
    width: 100%;

    i {
      flex: 0 0 auto;

      &.fa-search {
        margin-right: 8px;
      }

      &.fa-times {
        margin-left: 8px;
        cursor: pointer;
      }
    }

    input {
      font-size: 16px;
      flex: 1;
    }
  }

  ul {
    max-height: 400px;
    overflow-y: auto;

    li {
      padding: 8px;
      display: flex;
      align-items: center;
      padding-right: 24px;
      user-select: none;
      cursor: pointer;

      &:hover {
        background: var(--brand-primary-hover-bg);
      }

      &:active,
      &.selected {
        color: var(--brand-primary);
      }
    }
  }

  .empty {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 0;
    cursor: pointer;

    i {
      color: var(--danger);
      font-size: 24px;
    }
  }

  &:not(.transparent) {
    background: var(--background-base);
    padding: 0 8px;
    border-radius: 8px;
    border: 1px solid var(--border-base);

    &:hover {
      background: var(--border-base);
    }
  }

  @media (max-width: 767px) {
    font-size: 12px;
  }
}

#app.dark {
  .app-dropdown {
    &:not(.transparent) {
      background: var(--background-light);
      padding: 0 8px;
      border-radius: 8px;
      border: 1px solid var(--border-base);

      &:hover {
        background: var(--border-base);
      }
    }
  }
}
</style>