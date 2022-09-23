<template>
  <div class="app-sharer">
    <i
      ref="refSharer"
      class="fa-share-alt icon-sharer"
      :class="showDropdown ? 'fa' : 'fal'"
      :style="{ fontSize: `${iconSize}px` }"
      @click.stop="toggleShowDropdown"
    />
    <transition name="slide-down">
      <div
        v-if="showDropdown"
        class="app-sharer-container vertical shadowed">
        <div
          @click="brand.handler"
          class="brand-wrapper"
          :style="brand.style"
          :key="brand.icon"
          v-for="brand in brands().filter(o => !o.$$hide)">
          <i v-if="brand.icon" :class="brand.icon"/>
          <img v-if="brand.img" :src="brand.img">
        </div>
        <div class="triangle"/>
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
    socialOnly: Boolean,
    iconSize: Number,
  },
  setup(props) {
    const store = useStore()

    const refSharer = ref(null)

    const showDropdown = ref(null)

    const brands = () => {
      const s = helpers.social.share(window.location.origin + window.location.pathname)

      const items = [{
        img: require('@/assets/images/naver.png'),
        handler: () => s.naver(),
      }, {
        icon: 'fab fa-facebook-f',
        style: {
          background: '#5167a7',
          alignItems: 'flex-end',
        },
        handler: () => s.facebook(),
      }, {
        icon: 'fab fa-twitter',
        style: {
          background: '#7baae4',
        },
        handler: () => s.twitter(),
      }, {
        icon: 'fab fa-pinterest-p',
        style: {
          background: '#a83e35',
          alignItems: 'flex-end',
        },
        handler: () => s.pinterest(),
        $$hide: true,
      }, {
        icon: 'fab fa-whatsapp',
        style: {
          background: '#65c358',
        },
        handler: () => s.whatsapp(),
        $$hide: true,
      }, {
        icon: 'fa fa-share-alt',
        style: {
          background: 'var(--gs-66)',
        },
        handler: () => s.custom(),
        $$hide: props.socialOnly,
      }]

      return items
    }

    const toggleShowDropdown = e => {
      if (e.target.classList.contains('icon-sharer') || e.target.classList.contains('label')) showDropdown.value = !showDropdown.value
      else showDropdown.value = false
    }

    onMounted(() => {
      if (store.getters.isSSR) return

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

      img {
        width: 100%;
      }
    }

    &.vertical {
      position: absolute;
      z-index: 1;
      border-radius: 4px;
      background: var(--white);
      border: 1px solid var(--border-base);
      padding: 8px;
      top: 40px;
      left: 50%;
      transform: translateX(-50%);

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