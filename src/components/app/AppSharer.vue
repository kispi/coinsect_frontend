<template>
  <div class="app-sharer">
    <div
      ref="refSharer"
      @click.stop="toggleShowDropdown"
      v-if="label" class="label cursor-pointer"
      v-html="label"
    />
    <i
      v-if="!label && direction === 'vertical'"
      ref="refSharer"
      class="fa-share-alt icon-sharer"
      :class="showDropdown ? 'fa' : 'fal'"
      :style="{ fontSize: `${iconSize}px` }"
      @click.stop="toggleShowDropdown"
    />
    <transition name="slide-down">
      <div
        v-if="direction !== 'vertical' || showDropdown"
        class="app-sharer-container"
        :class="direction">
        <div
          @click="brand.handler"
          class="brand-wrapper"
          :style="brand.style"
          :key="brand.icon"
          v-for="brand in brands.filter(o => !o.$$hide)">
          <i :class="brand.icon"/>
        </div>
        <div class="triangle" v-if="direction === 'vertical'"/>
      </div>
    </transition>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref } from 'vue'
import { useStore } from 'vuex'
import helpers from '@/helpers'

export default {
  props: {
    direction: {
      type: String,
      default: 'vertical',
      validator: val => val === 'vertical' || val === 'horizontal',
    },
    socialOnly: Boolean,
    iconSize: Number,
    label: String,
  },
  setup(props) {
    const store = useStore()

    const refSharer = ref(null)

    const showDropdown = ref(null)

    const foo = ref(null)

    const brands = ref([])

    const s = [{
      icon: 'fab fa-facebook-f',
      style: {
        background: '#5167a7',
        alignItems: 'flex-end',
      },
      handler: () => foo.value.facebook(),
    }, {
      icon: 'fab fa-twitter',
      style: {
        background: '#7baae4',
      },
      handler: () => foo.value.twitter(),
    }, {
      icon: 'fab fa-pinterest-p',
      style: {
        background: '#a83e35',
        alignItems: 'flex-end',
      },
      handler: () => foo.value.pinterest(),
    }, {
      icon: 'fab fa-whatsapp',
      style: {
        background: '#65c358',
      },
      handler: () => foo.value.whatsapp()
    }, {
      icon: 'fa fa-share-alt',
      style: {
        background: 'var(--gs-66)',
      },
      handler: () => foo.value.custom(),
      $$hide: props.socialOnly,
    }]

    const toggleShowDropdown = e => {
      if (e.target.classList.contains('icon-sharer') || e.target.classList.contains('label')) showDropdown.value = !showDropdown.value
      else showDropdown.value = false
    }

    const initSharer = () => {
      foo.value = helpers.social.share(window.location.origin + window.location.pathname)
      brands.value = [s[0], s[1], s[4]]
    }

    onMounted(() => {
      if (store.getters.isSSR) return

      initSharer()

      document.addEventListener('click', toggleShowDropdown)
    })

    onUnmounted(() => {
      document.removeEventListener('click', toggleShowDropdown)
    })

    return {
      refSharer,
      brands,
      showDropdown,
      toggleShowDropdown,
    }
  },
}
</script>

<style lang="scss" scoped>
.app-sharer {
  position: relative;

  .icon-sharer {
    font-size: 24px;
    cursor: pointer;
  }

  .app-sharer-container {
    .brand-wrapper {
      border-radius: 4px;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      i {
        color: var(--white);
        font-size: 20px;

        &.fa-facebook-f,
        &.fa-pinterest-p {
          font-size: 24px;
        }
      }
    }

    &.vertical {
      position: absolute;
      z-index: 1;
      border-radius: 4px;
      background: var(--white);
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
      border: 1px solid var(--border-base);
      padding: 8px;
      top: 40px;
      left: -12px;

      .brand-wrapper {
        &:not(:first-child) {
          margin-top: 8px;
        }
      }
    }

    // 현재는 무드보드 상세에서만 사용됨 (다른 컨테이너의 일부로 자연스럽게 흡수되어 사용될 때)
    &.horizontal {
      display: flex;

      .brand-wrapper:not(:first-child) {
        margin-left: 8px;
      }
    }

    .triangle {
      position: absolute;
      background: var(--white);
      width: 12px;
      height: 12px;
      top: -6px;
      left: 50%;
      border-left: 1px solid var(--border-base);
      border-top: 1px solid var(--border-base);
      transform: translateX(-50%) rotate(45deg);
    }
  }
}
</style>