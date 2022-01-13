<template>
  <div class="ad-sense">
    <component :is="'script'" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3069752836489386" crossorigin="anonymous"></component>
    <!-- desktop-left-vertical -->
    <ins class="adsbygoogle"
      data-ad-client="ca-pub-3069752836489386"
      :data-ad-slot="dataAdSlot"
      data-ad-format="auto"
      data-full-width-responsive="true"></ins>
    <component :is="'script'">
      (adsbygoogle = window.adsbygoogle || []).push({});
    </component>
  </div>
</template>

<script>
export default {
  props: {
    dataAdSlot: String,
  },
}
</script>