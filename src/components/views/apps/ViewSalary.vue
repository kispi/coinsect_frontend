<template>
  <div class="view-salary">
    <SalaryAsCrypto :salary="result" @convert-as-crypto="o => resultAsCrypto = o"/>
    <AppSlider @change="onSlide"/>
    <div class="percentage">내 연봉은 상위 <b>{{ percentage }}%</b> 입니다<small>(국세청, 2022)</small></div>
    <div class="params">
      <div class="form-control">
        <label>연봉 (세전)</label>
        <input v-model="payload.preTax" type="number" step="10000">
        <div class="pretty">{{ $helpers.number.pretty.korean(payload.preTax) }}원</div>
      </div>
      <div class="form-control">
        <label>인적공제 (명)</label>
        <input v-model="payload.numFamily" type="number" min="1">
      </div>
      <div class="form-control">
        <label>
          <span>비과세 (연)</span>
          <i
            ref="refInfoNonTax"
            class="far fa-question-circle m-l-8"
            @mouseover="$tooltip.show({
              id: 'tooltipNonTax',
              showAbove: refInfoNonTax,
              text: '월 식대 10만원이 대표적. 비과세 금액이 많을수록 과세표준이 적게 책정되지만, 인정받을 수 있는 한도가 있습니다.',
            })"
            @mouseleave="$tooltip.hide('tooltipNonTax')"
          />
        </label>
        <input v-model="payload.nonTax" type="number">
        <div class="pretty">{{ $helpers.number.pretty.korean(payload.nonTax) }}원</div>
      </div>
    </div>
    <div class="reports" :class="{'show-detail': showDetail}">
      <div
        class="report-section"
        :key="idx"
        v-for="(report, idx) in reports">
        <div v-if="showDetail" class="report-title" v-html="report.title"/>
        <div class="report-grid">
          <div
            class="report-box"
            :key="item.name"
            v-for="item in report.items">
            <div class="key">
              <span v-html="item.key"/>
              <i
                v-if="item.tooltip"
                :ref="el => item.$$ref = el"
                @mouseover="$tooltip.show({
                  id: `tooltip${item.name}`,
                  showAbove: item.$$ref,
                  text: item.tooltip,
                })"
                @mouseleave="$tooltip.hide(`tooltip${item.name}`)"
                class="far fa-question-circle m-l-8"
              />
            </div>
            <div class="value" v-html="item.value"/>
          </div>
        </div>
      </div>
    </div>
    <div
      @click="showDetail = !showDetail"
      class="btn-toggle-detail">
      <i class="fa" :class="showDetail ? 'fa-chevron-up' : 'fa-chevron-down'"/>
      <div>{{ showDetail ? '간략히' : '자세히' }}</div>
    </div>
    <ul class="caveats">
      <li class="disc">2022년 기준이며, 개인마다 세액공제의 차이로 인해 다른 과세표준이 적용될 수 있습니다.</li>
      <li class="disc">4대 보험료는 근로자 부담액 기준이며, 소득세는 실수령액과 차이가 있을 수 있습니다.</li>
    </ul>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import salaryReport from './salary-report'
import salary2022 from './salary-2022.json'
import SalaryAsCrypto from './SalaryAsCrypto'

export default {
  components: {
    SalaryAsCrypto,
  },
  setup() {
    const store = useStore()

    const refInfoNonTax = ref(null)

    const payload = ref({
      preTax: store.getters.settings.salary.preTax,
      numFamily: store.getters.settings.salary.numFamily,
      nonTax: store.getters.settings.salary.nonTax,
    })

    const showDetail = ref(null)

    const percentage = ref(null)

    const resultAsCrypto = ref({})

    const withCrypto = ref(true)

    const onSlide = ratio => {
      payload.value.preTax = Math.round((22000000 + 178000000 * ratio) / 100000) * 100000
    }

    const pretty = ({ field, monthly = true }) => {
      let fiat = result.value[field]
      let crypto = resultAsCrypto.value[`$$${field}`]

      if (monthly) {
        fiat /= 12
        crypto /= 12
      }

      if (withCrypto.value && crypto) return `
        <div>${(Math.floor(fiat) || 0).toLocaleString()}</div>
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            margin-top: 4px;
          ">
          <img src="${resultAsCrypto.value['$$img']}" style="width: 12px; flex: 0 0 auto; margin-right: 4px;">
          <div>${crypto.toLocaleString(undefined, {
            maximumFractionDigits: 4,
            minimumFractionDigits: 4,
          })}</div>
        </div>
      `

      return (Math.floor(fiat) || 0).toLocaleString()
    }

    const reports = computed(() => [{
      title: '요약',
      items: [
        { key: '연봉 (세전)', value: pretty({ field: 'preTax', monthly: false }) },
        { key: '월급 (세전)', value: pretty({ field: 'preTax' }) },
        { key: '연봉 (세후)', value: pretty({ field: 'afterTax', monthly: false }) },
        { key: '월급 (세후)', value: pretty({ field: 'afterTax' }) },
      ],
    }, {
      title: '공제 (단위: 연)',
      items: [
        { key: '인적공제', value: pretty({ field: 'familyDeduction', monthly: false }), tooltip: '본인포함 부양자수 * 150만원' },
        { key: '소득공제', value: pretty({ field: 'incomeDeduction', monthly: false }) },
        { key: '소득세액공제', value: pretty({ field: 'taxDeduction', monthly: false }) },
        { key: '과세표준', value: pretty({ field: 'taxOn', monthly: false }), tooltip: `소득세 계산의 기준이 되는 연소득으로, {과세금액} - {소득세를 제외한 공제항목들} 입니다.` },
      ],
    }, {
      title: '세금 (단위: 월)',
      items: [
        { key: '국민연금', value: pretty({ field: 'pension' }), tooltip: '과세금액의 4.5% (상한: 월 235,800)' },
        { key: '건강보험', value: pretty({ field: 'health' }), tooltip: '과세금액의 3.495%' },
        { key: '장기요양', value: pretty({ field: 'care' }), tooltip: '건강보험료의 12.27%' },
        { key: '고용보험', value: pretty({ field: 'hire' }), tooltip: '과세금액의 0.8%' },
        { key: '소득세', value: pretty({ field: 'incomeTax' }), tooltip: '과세표준 구간별로 상이.' },
        { key: '지방소득세', value: pretty({ field: 'incomeTaxLocal' }), tooltip: '소득세의 10%' },
      ],
    }])

    const result = computed(() => salaryReport(
      payload.value.preTax,
      payload.value.numFamily,
      payload.value.nonTax,
    ))

    const findMyPercentage = () => {
      if (!payload.value || !payload.value.preTax) return

      const s = payload.value.preTax
      const found = salary2022.find(row => s >= row[1])
      if (!found) return

      percentage.value = found[0]
    }

    watch(
      () => payload.value,
      newVal => {
        const o = store.getters.settings.salary || {}
        Object.assign(o, newVal)
        store.commit('setSettings', { salary: o })

        findMyPercentage()
      },
      { deep: true },
    )

    onMounted(findMyPercentage)

    return {
      refInfoNonTax,
      payload,
      percentage,
      showDetail,
      result,
      reports,
      resultAsCrypto,
      onSlide,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-salary {
  .app-slider {
    margin-bottom: 24px;
  }

  .percentage {
    font-size: 20px;
    margin-bottom: 24px;
    text-align: center;

    small {
      margin-left: 8px;
      font-size: 10px;
    }
  }

  .params {
    display: flex;

    .form-control {
      flex: 1;

      label {
        user-select: none;
      }

      &:not(:last-child) {
        margin-right: 8px;
      }

      .pretty {
        margin-top: 4px;
        font-size: 12px;
      }
    }
  }

  .caveats {
    padding-left: 16px;
    font-size: 12px;
    line-height: 18px;

    li {
      &:not(:last-child) {
        margin-bottom: 8px;
      }
    }
  }

  .reports {
    margin-top: 24px;

    &:not(.show-detail) {
      .report-section {
        margin: 0;

        &:not(:first-child) {
          display: none;
        }
      }
    }
  }

  .report-section {
    transition: all 0.2s ease;

    &:not(:last-child) {
      margin-bottom: 32px;
    }

    .report-title {
      text-align: right;
      margin-bottom: 8px;
      font-size: 12px;
    }
  }

  .report-grid {
    display: grid;
    grid-gap: 8px;
    grid-template-columns: repeat(2, 1fr);

    .report-box {
      background: var(--background-light);
      border: 1px solid transparent;
      padding: 12px;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .value {
        font-size: 20px;
        font-weight: 700;
        color: var(--text-stress);
        margin-top: 8px;
        text-align: center;
      }

      &:hover {
        border: 1px solid var(--border-base);
      }
    }
  }

  @keyframes y {
    50% {
      transform: translateY(-4px);
    }
  }

  .btn-toggle-detail {
    text-align: center;
    margin: 24px auto 40px;
    color: var(--text-stress);
    animation: y ease infinite 1s;
    border-radius: 4px;
    border: 1px solid var(--background-base);
    background: var(--background-light);
    display: table;
    padding: 8px;
    cursor: pointer;

    &:hover {
      border: 1px solid var(--text-stress);
    }

    i {
      font-size: 20px;
    }
  }

  @media (min-width: 767px) {
    .report-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }
}
</style>