<template>
  <div class="game-flip-coin">
    <CTimer
      @expire="onExpire"
      :ms="ms"
    />
    <div class="stats">
      <div>스테이지: {{ stage }}</div>
      <div :class="numTries ? '' : 'o-0'">시도: {{ numTries }}</div>
    </div>
    <div class="board">
      <div class="grid">
        <div
          @click="flip(coin)"
          class="coin-container"
          :class="{
            'flipped': coin.$$flipped,
            'shake': coin.$$shake,
            'confirmed': coin.$$confirmed,
          }"
          :key="idx"
          v-for="(coin, idx) in coins">
          <div class="coin-container-inner">
            <SCoin :symbol="coin.symbol" :fit="'contain'" class="card-front overlay"/>
            <div class="card-back overlay"></div>
          </div>
        </div>
      </div>
    </div>
    <button
      @click="play"
      class="btn btn-primary btn-block">
      PLAY
    </button>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, ref } from 'vue'
import CTimer from './CTimer'

export default {
  components: { CTimer },
  setup(_, { emit }) {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const coins = ref(null)

    const playing = ref(null)

    const numTries = ref(null)

    const stage = ref(1)

    const ms = ref(null)

    const flip = coin => {
      if (!playing.value || coin.$$confirmed || coin.$$testing) return

      coin.$$flipped = !coin.$$flipped
      coin.$$testing = true

      let testingCards = coins.value.filter(coin => coin.$$testing)
      if (testingCards.length % 2 !== 0) return

      if (testingCards[0].symbol === testingCards[1].symbol) {
        testingCards.forEach(c => {
          c.$$testing = false
          c.$$confirmed = true
        })

        if (coins.value.every(c => c.$$confirmed)) {
          stage.value += 1
          playing.value = null
          play()
          emit('next-state')
        }
      } else {
        numTries.value += 1
        testingCards.forEach(c => {
          c.$$shake = true
          c.$$testing = false
        })
        setTimeout(() => {
          testingCards.forEach(c => {
            c.$$flipped = true
            c.$$shake = false
          })
        }, 500)
      }
    }

    const shuffle = numCoins => {
      const coinSet = plugins.$helpers.coin.pickCoins(numCoins)
      coins.value = plugins.$helpers.shuffle([
        ...coinSet,
        ...coinSet,
      ]).map(symbol => ({
        symbol,
        $$flipped: true,
      }))
    }

    const onExpire = () => {
      coins.value.forEach(symbol => symbol.$$flipped = true)
      playing.value = true
    }

    const play = () => {
      if (playing.value && stage.value === 1) numTries.value = null

      coins.value = null
      playing.value = null
      ms.value = null
      setTimeout(() => ms.value = 3000)

      shuffle(stage.value * 4)
      coins.value.forEach(coin => coin.$$flipped = false)
    }

    onMounted(() => shuffle(stage.value * 4))

    return {
      stage,
      playing,
      onExpire,
      ms,
      coins,
      numTries,
      play,
      flip,
    }
  },
}
</script>

<style lang="scss" scoped>
.game-flip-coin {
  padding: 8px;
  width: 100%;
  position: relative;
  color: var(--text-stress);

  .stats {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    font-weight: 700;
  }

  .board {
    .grid {
      display: grid;
      grid-template-columns: repeat(8, 1fr);

      .coin-container-inner {
        position: relative;
        padding-top: 133%;
        transform-style: preserve-3d;
        transition: transform 0.5s;

        .card-front,
        .card-back {
          background: var(--gs-e0);
          position: absolute;
          backface-visibility: hidden;
        }

        .card-back {
          background: var(--brand-primary);
          transform: rotateY(180deg);
        }
      }

      .coin-container {
        background: transparent;
        perspective: 480px;
        cursor: pointer;
        margin: 2px;

        &.flipped .coin-container-inner {
          transform: rotateY(180deg);
        }

        &.shake {
          .overlay {
            background: var(--danger);
          }
        }
      }
    }
  }

  .btn-primary {
    margin-top: 40px;
    height: 48px;
  }
}
</style>