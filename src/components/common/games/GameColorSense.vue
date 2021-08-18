<template>
  <div class="game-color-sense">
    <div class="stats">
      <div>스테이지: {{ stage }}</div>
      <div class="timer" v-html="(timer.ms / 1000).toLocaleString(undefined, { minimumFractionDigits: 2 })"/>
    </div>
    <div v-if="playing" class="colorchips">
      <div class="grid" :style="{ gridTemplateColumns: `repeat(${numColumns}, 1fr)`}">
        <div
          @click="onClickColorchip(color)"
          :key="idx"
          v-for="(color, idx) in colors"
          :style="{ background: `rgba(${color.r}, ${color.g}, ${color.b}, 1)`}"
          class="colorchip"
        />
      </div>
    </div>
    <template v-if="!playing">
      <div class="description text-center">
        다른 색 컬러칩 1개를 고르는 게임입니다.<br>
        총 50 스테이지로 이루어져 있습니다.<br>
        60초가 주어지며, 틀릴 시 게임이 종료됩니다.<br>
      </div>
      <button
        class="btn btn-primary"
        @click="play"
        v-html="$translate('PLAY')"
      />
    </template>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref } from 'vue'

export default {
  setup(_, { emit }) {
    const colors = ref([])

    const numColumns = computed(() => {
      if (stage.value <= 2) return 2
      if (stage.value <= 4) return 4
      if (stage.value <= 8) return 8
      return 12
    })

    const playing = ref(null)

    const timer = ref({
      interv: null,
      ms: 15 * 1000,
    })

    const stage = ref(1)

    const randRGB = (o = {}) => {
      const v = () => Math.floor(Math.random() * 256)
      return { r: o.r || v(), g: o.g || v(), b: o.b || v() }
    }

    const colorDiff = (rgb1, rgb2) => {
      return Math.sqrt(
        Math.pow((rgb2.r - rgb1.r), 2) +
        Math.pow((rgb2.g - rgb1.g), 2) + 
        Math.pow((rgb2.b - rgb1.b), 2),
      )
    }

    const onClickColorchip = color => {
      const numSameColors = colors.value.filter(c =>
        c.r === color.r &&
        c.g === color.g &&
        c.b === color.b
      ).length

      if (numSameColors === 1) {
        stage.value += 1
        timer.value.ms = 15000
        populateColors()
        return
      }

      timer.value.ms -= 3000
    }

    const populateColors = () => {
      const color1 = (() => {
        let base = { r: 127, g: 127, b: 127 }
        let candidate = randRGB()
        let diff = colorDiff(base, candidate)

        while (diff < 100) {
          candidate = randRGB()
          diff = colorDiff(base, candidate)
        }

        return candidate
      })()

      const color2 = (() => {
        const difficulty = (100 - stage.value * 2)
        const color1AsArray = [color1.r, color1.g, color1.b]
        const primeIdx = color1AsArray.indexOf(Math.max(...color1AsArray))
        const colorArg = {}
        if (primeIdx === 0) colorArg.r = color1AsArray[0]
        if (primeIdx === 1) colorArg.g = color1AsArray[1]
        if (primeIdx === 2) colorArg.b = color1AsArray[2]

        let candidate = randRGB(colorArg)
        let diff = colorDiff(color1, candidate)

        while (Math.abs(diff - difficulty) > 1) {
          candidate = randRGB(colorArg)
          diff = colorDiff(color1, candidate)
        }

        return candidate
      })()

      colors.value = []
      for (let i = 0; i < numColumns.value * numColumns.value; i++) colors.value.push(color1)
      colors.value[Math.floor(Math.random() * colors.value.length)] = color2
    }

    const clearTimer = () => {
      if (timer.value.interv) {
        clearInterval(timer.value.interv)
        timer.value.interv = null
      }
    }

    const play = () => {
      populateColors()
      playing.value = true
      timer.value.interv = setInterval(() => {
        timer.value.ms -= 10

        if (timer.value.ms <= 0) {
          playing.value = false
          emit('next-state')
          clearTimer()
          timer.value.ms = 15000
        }
      }, 10)
      emit('next-state')
    }

    onUnmounted(clearTimer)

    return {
      playing,
      colors,
      numColumns,
      timer,
      stage,
      onClickColorchip,
      play,
    }
  },
}
</script>

<style lang="scss" scoped>
.game-color-sense {
  padding: 8px;

  .stats {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    font-weight: 700;

    .timer {
      font-family: Arial, Helvetica, sans-serif;
    }
  }

  .colorchips {
    .grid {
      display: grid;
      grid-gap: 4px;
    }

    .colorchip {
      border-radius: 4px;
      padding-top: 100%;
      cursor: pointer;
    }
  }

  .btn-primary {
    margin-top: 40px;
    height: 48px;
    width: 100%;
  }
}
</style>