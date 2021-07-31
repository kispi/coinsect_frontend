<template>
  <div class="game-pick-coin">
    <div v-if="nCoins.length === 0">
      <div class="title">총 몇 개 중에서 뽑을까요? (최대 {{ symbols.length }}개)</div>
      <div class="flex-row items-center m-t-24">
        <input
          ref="refInput"
          v-model="n"
          type="number"
          :min="1"
          :max="symbols.length"
          @keydown.enter="setN">
        <button class="btn btn-primary flex-wrap m-l-8" @click="setN" v-html="$translate('확인')"/>
      </div>
    </div>
    <div v-if="nCoins.length > 0">
      <div class="grid-wrapper m-b-16">
        <div class="grid">
          <div
            @click="selectCoin(coin)"
            class="coin-wrapper"
            :class="{'selected': coin.$$selected}"
            :key="coin"
            v-for="coin in nCoins">
            <img :src="`https://static.upbit.com/logos/${coin.key}.png`" draggable="false" @load="$emit('next-state')">
          </div>
        </div>
      </div>
      <div
        v-if="numCases > 1"
        class="explanation">
        다 맞출 확률: {{ numCases.toLocaleString() }}분의 1
      </div>
      <div class="flex-row">
        <button
          @click="backToFirst"
          class="btn btn-default flex-fill"
          v-html="$translate('BACK')"
        />
        <button
          @click="pick"
          class="btn btn-primary flex-fill m-l-8"
          :disabled="numSelected === 0"
          v-html="$translate('GAME_PICK_COIN')"
        />
      </div>
      <div
        v-if="picked.length > 0"
        class="result m-t-40">
        <div class="explanation" v-html="resultHtml"/>
        <div class="grid-wrapper">
          <div class="grid">
            <div
              class="coin-wrapper"
              :class="coin.$$selected ? 'selected' : 'wrong'"
              :key="coin.key"
              v-for="coin in picked">
              <img :src="`https://static.upbit.com/logos/${coin.key}.png`" draggable="false" @load="$emit('next-state')">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, getCurrentInstance, onMounted, nextTick, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  setup(_, { emit }) {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const refInput = ref(null)

    const symbols = computed(() => Object.keys(store.getters.symbols))

    const nCoins = ref([])

    const picked = ref([])

    const n = ref(5)

    const selectedCoins = computed(() => nCoins.value.filter(o => o.$$selected))

    const numSelected = computed(() => selectedCoins.value.length)

    const resultHtml = computed(() => {
      const numGotcha = picked.value.filter(o => o.$$selected).length
      if (numGotcha === 0) return '다틀림 ㅋㅋㅋㅋㅋㅋ'

      if (numGotcha === numSelected.value) return `와 ${numGotcha}개를 다 맞추셨습니다! ㄷㄷ`

      return `선택한 ${numSelected.value}개의 코인 중 ${numGotcha}개를 뽑았습니다`
    })

    const numCases = computed(() => {
      return Math.floor(plugins.$helpers.math.combination(n.value, numSelected.value))
    })

    const selectCoin = coin => {
      coin.$$selected = !coin.$$selected
      picked.value = []
    }

    const backToFirst = () => {
      nCoins.value = []
      picked.value = []
      nextTick(() => refInput.value.focus())
      emit('next-state')
    }

    const setN = () => {
      const num = parseInt(n.value)
      if (!num || typeof num !== 'number' || num < 1) {
        plugins.$toast.error('1 이상의 숫자를 입력해주세요')
        return
      }

      if (num > symbols.value.length) {
        plugins.$toast.error(`코인이 ${symbols.value.length}개 밖에 없는데 어케 ${num}개를 뽑냐?`)
        return
      }

      nCoins.value = plugins.$helpers.coin.pickCoins(num).map(key => ({ key, $$selected: false }))
      return
    }

    const pick = () => {
      if (nCoins.value.filter(o => o.$$selected).length === parseInt(n.value)) {
        plugins.$toast.error(`${n.value}개 중에 ${n.value}개 뽑으면 무조건 당첨인데 뭔 재미로 함?`)
        return
      }

      picked.value = plugins.$helpers.coin.pickCoins(numSelected.value, nCoins.value.map(coin => coin.key)).map(key => ({ key, $$selected: false }))
      picked.value.forEach(coin => coin.$$selected = selectedCoins.value.find(c => c.key === coin.key) ? true : false)
      emit('next-state')
    }

    onMounted(() => {
      refInput.value.focus()
    })

    watch(
      () => n.value,
      newVal => {
        if (parseInt(newVal) > symbols.value.length) n.value = symbols.value.length
        if (parseInt(newVal) < 0) n.value = 1
      },
    )

    return {
      n,
      numSelected,
      selectCoin,
      numCases,
      refInput,
      symbols,
      nCoins,
      setN,
      pick,
      resultHtml,
      picked,
      backToFirst,
    }
  },
}
</script>

<style lang="scss" scoped>
.game-pick-coin {
  padding: 24px 8px;
  color: var(--text-stress);

  input {
    font-size: 18px;
  }

  .title {
    font-size: 16px;
    text-align: center;
  }

  .explanation {
    font-weight: 700;
    margin-bottom: 16px;
    text-align: center;
  }

  .grid-wrapper {
    overflow-y: auto;
    max-height: 240px;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    background: var(--white);
    border-radius: 8px;

    .coin-wrapper {
      border: 2px dashed transparent;
      margin: 4px;
      padding: 2px;
      cursor: pointer;
      transition: none;

      img {
        width: 100%;
      }

      &.selected {
        border: 2px dashed var(--brand-primary);
        background: var(--brand-primary-hover-bg);
      }

      &.wrong {
        border: 2px dashed var(--danger);
        background: var(--danger-light);
      }
    }
  }
}
</style>