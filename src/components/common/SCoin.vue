<template>
  <AppImg
    class="s-coin"
    :src="`https://static.upbit.com/logos/${symbol}.png`"
    draggable="false"
  />
</template>

<script>
export default {
  props: ['symbol'],
}
</script>