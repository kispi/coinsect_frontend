<template>
  <div class="view-lottery">
    <div
      @click="useCustomPick = !useCustomPick"
      class="custom-pick-toggler">
      <i class="fa" :class="useCustomPick ? 'fa-chevron-up' : 'fa-chevron-down'"/>
      <div class="m-l-8">{{ $translate(useCustomPick ? 'CLOSE' : 'CUSTOM_PICK') }}</div>
    </div>
    <transition name="slide-down">
      <div
        v-if="useCustomPick"
        class="custom-pick m-t-24">
        <LotteryPick
          :numbers="payload"
          class="m-b-40"
          @click-remove="removeNumber"
        />
        <div class="picker">
          <div
            class="ball-container"
            :key="num"
            v-for="num in $helpers.numArray(45).map(v => v + 1)">
            <div
              @click="onClickBall(num)"
              class="ball center"
              :class="{'active': payload.indexOf(num) >= 0}"
              v-html="num"
            />
          </div>
        </div>
      </div>
    </transition>
    <button
      @click="() => picks.push(autopick())"
      class="btn btn-primary btn-autopick"
      v-html="$translate('GENERATE')"
    />
    <div
      v-if="picks.length > 0"
      class="picks m-t-40">
      <LotteryPick
        @click="() => picks.splice(idx, 1)"
        :ref="el => pick.$$ref = el"
        :numbers="[...pick.basic, pick.bonus]"
        :key="idx"
        v-for="(pick, idx) in picks"
        class="cursor-pointer"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import LotteryPick from './LotteryPick'

export default {
  components: {
    LotteryPick,
  },
  setup() {
    const picks = ref([])

    const payload = ref([])

    const useCustomPick = ref(null)

    const autopick = () => {
      const o = {}
      let bonus
      while (Object.keys(o).length < 7) {
        const num = Math.floor(Math.random() * 45) + 1
        o[num] = true
        bonus = num
      }
      delete o[bonus]

      return {
        basic: Object.keys(o),
        bonus,
      }
    }

    const onClickBall = num => {
      const idx = payload.value.indexOf(num)
      if (idx >= 0) {
        removeNumber(idx)
        return
      }

      payload.value.push(num)
      if (payload.value.length < 7) payload.value.sort((a, b) => a - b)
      else {
        picks.value.push({
          basic: payload.value.slice(0, 6),
          bonus: payload.value[6],
        })
        payload.value = []
        const component = picks.value[picks.value.length - 1]
        setTimeout(() => {
          if (component.$$ref) component.$$ref.focus()
          component.$$ref.$el.scrollIntoView({ behavior: 'smooth' })
        })
      }
    }

    const removeNumber = pos => {
      payload.value.splice(pos, 1)
      payload.value.sort((a, b) => a - b)
    }

    const onClickSubmitPayload = () => {

    }

    return {
      picks,
      payload,
      useCustomPick,
      autopick,
      removeNumber,
      onClickBall,
      onClickSubmitPayload,
    }
  },
}
</script>

<style lang="scss">
.view-lottery {
  .picks {
    display: grid;
    grid-gap: 16px;

    .lottery-pick {
      font-size: 16px;
    }
  }

  .picker {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-gap: 16px;

    .ball-container {
      padding-top: 100%;
      position: relative;
    }

    .ball {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      border: 1px solid transparent;
      border-radius: 50%;
      color: var(--text-stress);
      background: var(--border-base);
      user-select: none;
      transition: all 0.3s ease;
      font-size: 20px;
      cursor: pointer;

      &.active {
        border: 1px solid var(--brand-primary);
        background: var(--background-base);
      }
    }
  }

  .btn-autopick {
    width: 100%;
    padding: 24px;
    margin-top: 24px;
  }

  .custom-pick-toggler {
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    color: var(--black);
    background: var(--white);
    border-radius: 80px;
    padding: 4px 20px;
    border: 1px solid rgba(0, 0, 0, 0.24);
    cursor: pointer;
  }

  @media (max-width: 479px) {
    .picker {
      grid-template-columns: repeat(6, 1fr);
    }
  }

  @media (min-width: 768px) {
    .picks {
      grid-template-columns: repeat(2, 1fr);
      grid-column-gap: 40px;
    }

    .picker {
      grid-template-columns: repeat(12, 1fr);
    }
  }
}
</style>