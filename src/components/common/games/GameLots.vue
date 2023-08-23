<template>
  <div class="game-lots">
    <AdaptiveLayout :gap="16">
      <div
        @click="() => {
          focus.a = true
          refInputA.focus()
          trigger++
        }"
        class="input-wrapper"
        :class="{'focus': focus.a}">
        <input
          ref="refInputA"
          v-model="lotName"
          placeholder="제비를 적고 엔터!"
          @keydown.enter="onEnter"
          @blur="focus.a = false"
          class="flex-fill"
        >
        <button
          class="btn flex-wrap"
          :disabled="!lotName"
          @click="onEnter"
          v-html="$translate('SUBMIT')"
        />
      </div>
      <div
        @click="() => {
          focus.b = true
          refInputB.focus()
        }"
        class="input-wrapper"
        :class="{'focus': focus.b}">
        <div class="flex-wrap c-gs-88">당첨칸 번호</div>
        <input
          ref="refInputB"
          v-model="slotNumber"
          placeholder="1"
          class="flex-fill m-l-16"
          type="number"
          min="1"
          :max="lots.length"
          @blur="focus.b = false"
        >
      </div>
    </AdaptiveLayout>
    <div
      v-if="lots.length > 0"
      class="board">
      <transition-group
        name="cell"
        class="grid"
        tag="div">
        <div
          @click="flip(lot)"
          class="lot-container"
          :class="{
            'flipped': lot.$$flipped,
            'selected': (slotNumber - 1 === idx) && !lot.$$flipped,
          }"
          :key="lot.id"
          v-for="(lot, idx) in lots">
          <div class="lot-container-inner">
            <div class="card-front overlay center">
              <i @click.stop="remove(idx)" class="fal fa-times center"/>
              {{ lot.name }}
            </div>
            <div class="card-back overlay"></div>
          </div>
        </div>
      </transition-group>
    </div>
    <div class="buttons">
      <button
        @click="shuffle(10)"
        class="btn btn-primary m-r-8"
        :disabled="lots.length === 0"
        v-html="$translate('SHUFFLE')"
      />
      <button
        @click="play"
        class="btn btn-primary"
        v-html="$translate('OPEN')"
      />
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  setup(_, { emit }) {
    const { plugins } = useGlobalHooks()

    const refInputA = ref(null)

    const refInputB = ref(null)

    const focus = ref({ a: null, b: null })

    const lots = ref([])

    const lotName = ref(null)

    const slotNumber = ref(1)

    const shuffled = ref(null)

    const trigger = ref(0)

    const remove = idx => {
      lots.value.splice(idx, 1)
      refInputA.value.focus()
    }
    
    const onEnter = e => {
      if (!lotName.value || e.isComposing) return

      setTimeout(() => {
        lots.value.push({
          id: lots.value.length + 1,
          name: lotName.value,
        })
        lotName.value = null
        emit('next-state')
      })
    }

    const play = () => {
      if (!shuffled.value) return shuffle()

      lots.value.forEach(lot => lot.$$flipped = false)
    }

    const flip = lot => {
      if (!shuffled.value) {
        plugins.$toast.error('먼저 적어도 1회 이상 덱을 섞어주세요')
        return
      }

      lot.$$flipped = !lot.$$flipped
    }

    const shuffle = num => {
      if (num <= 0) return

      const p = parseInt(slotNumber.value)
      if (isNaN(p) || p > lots.value.length || p < 1) return plugins.$toast.error(`${lots.value.length} 이하의 올바른 당첨칸 번호를 적어주세요 🤔`)

      lots.value.forEach(lot => lot.$$flipped = true)
      lots.value = plugins.$helpers.logic.shuffle(lots.value)
      shuffled.value = true

      setTimeout(() => shuffle(num - 1), 250)
    }

    onMounted(() => refInputA.value.focus())

    watch(
      () => trigger.value,
      newVal => {
        if (newVal >= 3) {
          trigger.value = 0
          lots.value = [
            'Chaeil',
            'Chris',
            'Eli',
            'Emily',
            'Gilbert',
            'Henry',
            'Ian',
            'Juan',
            'Ki',
            'Loody',
            'Lumi',
            'Marv',
            'MJ',
          ].map(name => ({ name, id: plugins.$helpers.logic.mustToken() }))
          emit('next-state')
        }
      },
    )

    return {
      refInputA,
      refInputB,
      focus,
      lotName,
      trigger,
      slotNumber,
      lots,
      shuffled,
      remove,
      flip,
      play,
      shuffle,
      onEnter,
    }
  },
}
</script>

<style lang="scss" scoped>
.game-lots {
  padding: 16px;
  width: 100%;
  position: relative;
  color: var(--text-stress);

  .input-wrapper {
    display: flex;
    align-items: center;
    padding: 16px 32px;
    border-radius: 48px;

    input {
      font-size: 16px;
      width: initial;
    }

    .btn {
      background: none;
      border: 0;
      padding: 0;

      &:hover {
        color: var(--text-stress);
      }
    }
  }

  .board {
    margin-top: 16px;
    display: flex;
    justify-content: center;

    .grid {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;

      .lot-container-inner {
        position: relative;
        padding-top: 50%;
        transform-style: preserve-3d;
        transition: transform 0.5s;
        width: 160px;

        .fa-times {
          width: 32px;
          height: 32px;
          border-radius: 16px;
          position: absolute;
          z-index: 1;
          right: 8px;
          top: 8px;
          background: rgba(255, 255, 255, 0.5);
          cursor: pointer;

          &:hover {
            background: var(--brand-primary-hover-bg);
          }
        }

        .card-front,
        .card-back {
          border-radius: 16px;
          position: absolute;
          backface-visibility: hidden;
        }

        .card-back {
          background: var(--brand-primary);
          transform: rotateY(180deg);
          border: 1px solid var(--white);
        }

        .card-front {
          background: var(--brand-primary-hover-bg);
        }
      }

      .lot-container {
        background: transparent;
        perspective: 480px;
        margin: 4px;
        cursor: pointer;

        &.selected .lot-container-inner {
          .card-back,
          .card-front {
            border: 4px solid var(--bitcoin);
          }
        }

        &.flipped {
          .lot-container-inner {
            transform: rotateY(180deg);
          }
        }
      }
    }
  }

  .cell-move {
    transition: transform 0.25s cubic-bezier(1, 0, 0, 1);
  }

  .buttons {
    margin-top: 16px;
    display: flex;
    align-items: center;

    button {
      flex: 1;
      padding: 16px;
    }
  }
}
</style>