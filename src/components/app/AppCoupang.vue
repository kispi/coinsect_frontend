<template>
  <div class="app-coupang">
    <iframe
      :src="`https://ads-partners.coupang.com/widgets.html?id=874055&template=carousel&trackingCode=AF4111334&subId=&width=${width}&height=${height}&tsource=`"
      :width="width"
      :height="height"
      frameborder="0"
      scrolling="no"
      referrerpolicy="unsafe-url"
      browsingtopics
    />
    <div class="disclaimer">이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  width: number | string,
  height: number | string
}>(), {
  width: '100%',
  height: '100%',
})
</script>

<style lang="scss" scoped>
.app-coupang {
  .disclaimer {
    color: var(--text-stress);
    text-align: center;
    margin-top: 8px;
  }
}
</style>