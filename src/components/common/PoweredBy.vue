<template>
  <div class="powered-by">
    Powered by <a :href="link || rendered.link" target="_blank" rel="noopener">{{ rendered ? rendered.title : by }}<img :src="imgUrl || require(`@/assets/images/${rendered.src}`)" :alt="rendered ? rendered.title : by"></a>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  props: {
    by: String,
    link: String,
    imgUrl: String,
  },
  setup(props) {
    const rendered = computed(() => {
      if (props.by === 'coinmarketcap') return { title: 'Coinmarketcap', src: 'coinmarketcap.png', link: 'https://coinmarketcap.com' }
      if (props.by === 'companiesmarketcap') return { title: 'Companiesmarketcap', src: 'companiesmarketcap.png', link: 'https://companiesmarketcap.com' }
      if (props.by === 'upbit') return { title: 'Upbit', src: 'upbit.svg', link: 'https://upbit.com' }
      if (props.by === 'bitcointreasuries') return { title: 'Bitcointreasuries', src: 'bitcointreasuries.png', link: 'https://bitcointreasuries.net' }
      if (props.by === 'coinglass') return { title: 'Coinglass', src: 'coinglass.png', link: 'https://coinglass.com' }
      if (props.by === 'naver') return { title: 'Naver', src: 'naver.png', link: 'https://finance.naver.com' }
      if (props.by === 'cobak') return { title: 'Cobak', src: 'cobak.png', link: 'https://cobak.co.kr' }
    })

    return {
      rendered,
    }
  },
}
</script>

<style lang="scss" scoped>
.powered-by {
  display: flex;

  a {
    text-decoration: underline;
    display: flex;
    align-items: center;
    margin-left: 8px;

    img {
      width: 16px;
      border-radius: 50%;
      margin-left: 4px;
    }
  }
}
</style>