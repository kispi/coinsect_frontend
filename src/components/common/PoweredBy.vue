<template>
  <div class="powered-by">
    <div class="powered-by-container">
      Powered by
      <a :href="link || rendered.link" target="_blank" rel="noreferrer">
        {{ rendered ? rendered.title : by }}
        <img
          :src="imgUrl || adaptiveSrc(rendered.src)"
          :alt="rendered ? rendered.title : by">
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  by: {
    type: String,
    default: '',
  },
  link: {
    type: String,
    default: '',
  },
  imgUrl: {
    type: String,
    default: '',
  },
})

const adaptiveSrc = src => {
  if (src.startsWith('http')) return src

  return require(`@/assets/images/${src}`)
}

const rendered = computed(() => {
  if (props.by === 'coinmarketcap') return { title: 'Coinmarketcap', src: 'coinmarketcap.png', link: 'https://coinmarketcap.com' }
  if (props.by === 'companiesmarketcap') return { title: 'Companiesmarketcap', src: 'companiesmarketcap.png', link: 'https://companiesmarketcap.com' }
  if (props.by === 'upbit') return { title: 'Upbit', src: 'upbit.svg', link: 'https://upbit.com' }
  if (props.by === 'bitcointreasuries') return { title: 'Bitcointreasuries', src: 'bitcointreasuries.png', link: 'https://bitcointreasuries.net' }
  if (props.by === 'coinglass') return { title: 'Coinglass', src: 'coinglass.png', link: 'https://coinglass.com' }
  if (props.by === 'naver') return { title: 'Naver', src: 'naver.png', link: 'https://finance.naver.com' }
  if (props.by === 'investing.com') return { title: 'Investing.com', link: 'https://investing.com' }
})
</script>

<style lang="scss" scoped>
.powered-by {
  .powered-by-container {
    display: flex;
  }

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