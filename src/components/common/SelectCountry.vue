<template>
  <div
    ref="refSelectCountry"
    class="select-country">
    <div
      ref="refSelectedCountry"
      @click="toggleOpened"
      class="selected-country-value"
      :class="{'required-but-empty': !modelValue}">
      <div class="inner-html">
        <img
          v-if="displayedCountry.code"
          :src="`https://raw.githubusercontent.com/lipis/flag-icon-css/d81077e4e9648ba32546fad3b77932b48feb344b/flags/4x3/${displayedCountry.code.toLowerCase()}.svg`">
        {{ displayedCountry.name }}
      </div>
      <i
        class="m-l-8"
        :class="opened ? 'far fa-chevron-up' : 'far fa-chevron-down'"
      />
    </div>
    <WrapperDropdownOverlay
      v-model="opened"
      :mountBelow="refSelectedCountry">
      <div class="select-country-list-container">
        <input
          ref="refSearchInput"
          :value="searchKeyword"
          @input="e => searchKeyword = e.target.value"
        >
        <ul
          ref="refList"
          :style="ulStyle">
          <li
            :class="{
              'focused': focusedCountry === country.code,
              'selected': selectedCountry === country.code,
            }"
            @click="onClickCountry(country.code)"
            :key="country.code"
            v-for="country in displayCountries">
            <img :src="`https://raw.githubusercontent.com/lipis/flag-icon-css/d81077e4e9648ba32546fad3b77932b48feb344b/flags/4x3/${country.code.toLowerCase()}.svg`">
            {{ country.name }}
          </li>
        </ul>
      </div>
    </WrapperDropdownOverlay>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref, watch, nextTick } from 'vue'

export default {
  emits: [
    'update:modelValue',
    'change-country-code',
    'focus',
  ],
  props: {
    countries: Array,
    modelValue: String,
    ulHeight: Number,
    useScrollIntoView: Boolean, // true일 시 이 항목으로 scrollIntoView를 한 뒤 목록을 연다.
  },
  setup(props, { emit }) {
    const refSearchInput = ref(null)

    const refList = ref(null)

    const refSelectCountry = ref(null)

    const refSelectedCountry = ref(null)

    const selectedCountry = ref(null)

    const focusedCountry = ref(null)

    const searchKeyword = ref('')

    const ulStyle = ref(null)

    const opened = ref(null)

    const displayedCountry = computed(() => ((props.countries || []).find(c => c.code === selectedCountry.value) || {}))

    const displayCountries = computed(() => props.countries.filter(c => (c.name || '').toLowerCase().startsWith(searchKeyword.value)))

    const toggleOpened = e => {
      if (!props.useScrollIntoView) {
        opened.value = true
        return
      }

      emit('focus', e)
      setTimeout(() => {
        opened.value = !opened.value
      }, 300)
    }

    const onKeydown = e => {
      if (!opened.value) return

      const len = (displayCountries.value || []).length
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        const cur = (displayCountries.value || []).findIndex(c => c.code === focusedCountry.value)
        focusedCountry.value = displayCountries.value[cur === 0 ? (len - 1) : cur - 1].code
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        const cur = (displayCountries.value || []).findIndex(c => c.code === focusedCountry.value)
        focusedCountry.value = displayCountries.value[cur === len - 1 ? 0 : cur + 1].code
      } else if (e.key === 'Enter' && focusedCountry.value) {
        onClickCountry(focusedCountry.value)
      }

      nextTick(() => {
        if (!refList.value) return

        const hoveredDOM = refList.value.querySelector('li.focused')
        if (hoveredDOM) hoveredDOM.scrollIntoView({ block: 'center' })
      })
    }

    const onClickCountry = countryCode => {
      selectedCountry.value = countryCode
      focusedCountry.value = props.countries.find(c => c.code === selectedCountry.value).code
      emit('update:modelValue', selectedCountry.value)
      const customEvent = { target: refSelectCountry.value }
      customEvent.target.value = selectedCountry.value
      emit('change-country-code', customEvent)
      opened.value = false
    }

    watch(
      () => searchKeyword.value,
      () => {
        const found = props.countries.find(c => (c.name || '').toLowerCase().startsWith(searchKeyword.value))
        if (found) focusedCountry.value = found.code
      },
    )

    watch(
      () => opened.value,
      newVal => {
        if (!newVal) return

        nextTick(() => {
          const rect = refSelectedCountry.value.getBoundingClientRect()
          ulStyle.value = {
            height: `${props.ulHeight || 320}px`,
            maxHeight: `calc(100vh - ${rect.top + rect.height + 64}px)`, // input박스 공간 확보
          }
          refSearchInput.value.select()
        })
      },
    )

    const init = () => {
      selectedCountry.value = props.modelValue
      focusedCountry.value = ((props.countries || []).find(c => c.code === props.modelValue) || {}).code
    }

    watch(
      () => props.modelValue,
      init,
    )

    onMounted(() => {
      init()
      document.addEventListener('keydown', onKeydown)
    })

    onUnmounted(() => {
      document.removeEventListener('keydown', onKeydown)
    })

    return {
      refSelectCountry,
      refSearchInput,
      refList,
      refSelectedCountry,
      toggleOpened,
      selectedCountry,
      focusedCountry,
      onClickCountry,
      displayedCountry,
      ulStyle,
      opened,
      onKeydown,
      displayCountries,
      searchKeyword,
    }
  },
}
</script>

<style lang="scss" scoped>
.select-country {
  img {
    width: 12px;
    margin-right: 8px;
  }

  .selected-country-value {
    border: 1px solid var(--gray-border);
    border-radius: 4px;
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 8px 16px;
    height: 100%;

    .inner-html {
      flex: 1;
    }
  }

  .select-country-list-container {
    background: var(--white);
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.25);
    border-radius: 4px;
    overflow: hidden;

    input {
      margin: 8px;
      width: calc(100% - 16px);
    }

    ul {
      overflow-y: auto;
    }

    li {
      padding: 4px 12px;
      cursor: pointer;
      font-size: 14px;
      font-weight: initial;

      &:hover {
        background: var(--brand-primary-bg-lv2);
      }

      &.focused {
        box-shadow: 0 0 0 1px var(--brand-primary) inset;
      }

      &:active,
      &.selected {
        color: var(--brand-primary);
      }
    }
  }
}
</style>