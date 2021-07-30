<template>
  <div class="game-flip-coin">
    <div
      v-if="showCountdown"
      class="count"
      :class="{'expired': !timer.ms}">
      {{ timer.ms > 0 ? Math.floor(timer.ms / 1000) : 'START!' }}
    </div>
    <div class="stats m-l-a m-b-16 display-table" :class="numTries ? '' : 'o-0'">
      시도: {{ numTries }}
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
import { getCurrentInstance, onMounted, onUnmounted, ref } from 'vue'

export default {
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const coins = ref(null)

    const playing = ref(null)

    const showCountdown = ref(null)

    const numTries = ref(null)

    const timer = ref({
      timeout: null,
      ms: 3000,
    })

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

    const shuffle = () => {
      const coinSet = plugins.$helpers.coin.pickCoins(16)
      coins.value = plugins.$helpers.shuffle([
        ...coinSet,
        ...coinSet,
      ]).map(symbol => ({
        symbol,
        $$flipped: true,
      }))
    }

    const startTimeout = () => {
      if (timer.value.ms <= 0) {
        coins.value.forEach(symbol => symbol.$$flipped = true)
        playing.value = true
        setTimeout(() => showCountdown.value = false, 1000)
        return
      }

      setTimeout(() => {
        timer.value.ms -= 1000
        startTimeout()
      }, 1000)
    }

    const play = () => {
      if (playing.value) return


      showCountdown.value = true
      coins.value.forEach(coin => coin.$$flipped = false)
      startTimeout()
    }

    onMounted(shuffle)

    onUnmounted(() => {
      if (timer.value.timeout) {
        clearTimeout(timer.value.timeout)
        timer.value.timeout = null
      }
    })

    return {
      showCountdown,
      coins,
      timer,
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

  .count {
    color: var(--white);
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.24);
    font-size: 120px;
    position: absolute;
    z-index: 1;
    top: calc(50% - 120px);
    left: 50%;
    transform: translateX(-50%);

    &.expired {
      font-size: 64px;
      top: calc(50% - 64px);
    }
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
          background: var(--gray);
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