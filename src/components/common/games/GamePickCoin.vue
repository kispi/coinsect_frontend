<template>
  <div class="game-pick-coin">
    <div
      v-if="level === 'setN'"
      class="level-set-n">
      <div class="title">총 몇 개 중에서 뽑을까요? (n, 최대 {{ symbols.length }}개)</div>
      <div class="flex-row items-center m-t-24">
        <input
          ref="refInput"
          v-model="n"
          type="number"
          min="2"
          :max="symbols.length"
          @keydown.enter="next"
          @input="e => {
            try {
              n = parseInt(e.target.value)
            } catch (e) {}
          }">
        <button class="btn btn-primary flex-wrap m-l-8" @click="next" v-html="$translate('확인')"/>
      </div>
    </div>
    <div
      v-if="level === 'setK'"
      class="level-set-k">
      <div class="grid-wrapper">
        <div class="grid">
          <div
            @click="coin.$$selected = !coin.$$selected"
            class="coin-wrapper"
            :class="{'selected': coin.$$selected}"
            :key="coin"
            v-for="coin in nCoins">
            <img :src="`https://static.upbit.com/logos/${coin.key}.png`" draggable="false" @load="$emit('next-level')">
          </div>
        </div>
      </div>
      <div class="pick-functions">
        <button
          @click="next"
          class="btn btn-primary"
          :disabled="numSelected === 0"
          v-html="btnPickCoinLabel"
        />
      </div>
    </div>
    <div
      v-if="level === 'pick'">
    </div>
  </div>
</template>

<script>
import { ref, computed, getCurrentInstance, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  setup(_, { emit }) {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()

    const refInput = ref(null)

    const symbols = computed(() => Object.keys(store.getters.symbols))

    const nCoins = ref(null)

    const n = ref(10)

    const level = ref('setN')

    const numSelected = computed(() => (nCoins.value || []).filter(o => o.$$selected).length)

    const btnPickCoinLabel = computed(() => {
      const nCr = plugins.$helpers.math.combination(n.value, numSelected.value)
      let label = `${plugins.$translate('GAME_PICK_COIN')}`
      if (nCr > 1) label += ` (${n.value}개 중 ${numSelected.value}개 선택 / 성공확률 => ${nCr}분의 1)`
      return label
    })

    const createNCoins = () => {
      const o = {}
      for (let i = 0; i < 1000; i++) {
        const randomCoin = symbols.value[Math.floor(Math.random() * symbols.value.length)]
        o[randomCoin] = true
        if (Object.keys(o).length >= n.value) break
      }

      nCoins.value = Object.keys(o).map(key => ({ key, $$selected: false }))
    }

    const pickCoins = () => {
      
    }

    const next = () => {
      if (level.value === 'setN') {
        if (n.value > symbols.value.length) {
          plugins.$toast.error('n은 전체 코인 개수보다 클 수 없습니다')
          return
        }

        createNCoins()
        level.value = 'setK'
        return
      }

      if (level.value === 'setK') {
        console.log(nCoins.value.filter(o => o.$$selected).length, n.value)
        if (nCoins.value.filter(o => o.$$selected).length === n.value) {
          plugins.$toast.error('그러면 무조건 당첨인데 뭔재미로함?')
          return
        }

        pickCoins()
        level.value = 'pick'
        emit('next-level')
      }
    }

    onMounted(() => {
      refInput.value.focus()
    })

    return {
      n,
      numSelected,
      btnPickCoinLabel,
      refInput,
      symbols,
      nCoins,
      level,
      next,
    }
  },
}
</script>

<style lang="scss" scoped>
.game-pick-coin {
  padding: 24px 8px;

  .title {
    font-size: 16px;
    font-weight: 700;
    text-align: center;
  }

  .level-set-n {
    
  }

  .level-set-k {
    .grid-wrapper {
      margin-bottom: 24px;
      background: var(--white);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(10, 1fr);

      .coin-wrapper {
        border: 1px solid transparent;
        padding: 8px;
        cursor: pointer;
        transition: none;

        img {
          width: 100%;
        }

        &.selected {
          border: 1px solid var(--border-base);
          background: var(--brand-primary-hover-bg);
        }
      }
    }

    .pick-functions {
      display: flex;
      align-items: center;

      .btn-primary {
        margin-left: 8px;
        flex: 1;
      }
    }
  }
}
</style>