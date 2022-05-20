<template>
  <div
    v-show="!$store.getters.isMobile && !$store.getters.settings.hideSearchFaker"
    @click="$store.commit('setSettings', {
      hideSearchFaker: true,
    })"
    class="search-faker"
    :class="{'show': showFaker}">
    <div class="common naver">
      <div class="wrapper">코인충</div>
      <div class="button-search center"><i class="fa fa-search"/></div>
    </div>
    <div class="favorite"><i class="fa fa-star"/><div class="m-l-4">즐찾 (Ctrl + D)</div></div>
    <div class="common google">
      <AppImg :src="'https://cdn-icons-png.flaticon.com/512/2875/2875404.png'"/>
      <div class="wrapper">코인충</div>
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref } from 'vue'

export default {
  setup() {
    const showFaker = ref(null)

    const interv = ref(null)

    onMounted(() => {
      interv.value = setInterval(() => showFaker.value = !showFaker.value, 2000)
    })

    onUnmounted(() => {
      clearInterval(interv.value)
    })

    return {
      showFaker,
    }
  },
}
</script>

<style lang="scss" scoped>
.search-faker {
  display: flex;
  align-items: center;
  transition: all 2s ease;
  position: fixed;
  top: 56px;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;

  > div:not(:first-child) {
    margin-left: 16px;
  }

  &:not(.show) {
    opacity: 0;
  }

  .wrapper {
    padding: 0 4px;
  }

  .common {
    display: flex;
    align-items: center;
    font-size: 12px;
    background: var(--white);
    color: var(--black);
    height: 24px;
  }

  .naver {
    border: 2px solid #19ce60;
    border-radius: 2px;

    .button-search {
      width: 24px;
      height: 24px;
      background: #19ce60;
      color: var(--white);
    }
  }

  .google {
    display: flex;
    align-items: center;
    border-radius: 16px;
    padding: 0 8px;
    box-shadow: 0 2px 5px 1px rgb(64 60 67 / 16%);

    img {
      width: 16px;
      height: 16px;
    }
  }

  .favorite {
    display: flex;
    align-items: center;
    font-size: 12px;

    .fa-star {
      color: var(--bitcoin);
    }
  }
}
</style>