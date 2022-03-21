<template>
  <div class="view-salary">
    <SalaryAsCrypto :salary="result" @convert-as-crypto="o => resultAsCrypto = o"/>
    <div class="params">
      <div class="form-control">
        <label>연봉 (세전)</label>
        <input v-model="preTax" type="number">
      </div>
      <div class="form-control">
        <label>인적공제 (명)</label>
        <input v-model="numFamily" type="number">
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
        <input v-model="nonTax" type="number">
      </div>
    </div>
    <div class="reports" :class="{'show-detail': showDetail}">
      <div
        class="report-section"
        :key="idx"
        v-for="(report, idx) in reports">
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
import { computed, ref } from 'vue'
import salary from './salary'
import SalaryAsCrypto from './SalaryAsCrypto'

export default {
  components: {
    SalaryAsCrypto,
  },
  setup() {
    const refInfoNonTax = ref(null)

    const preTax = ref(22000000)

    const nonTax = ref(1200000)

    const numFamily = ref(1)

    const showDetail = ref(null)

    const resultAsCrypto = ref({})

    const withCrypto = ref(true)

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
      title: '공제',
      items: [
        { key: '인적공제', value: pretty({ field: 'familyDeduction', monthly: false }), tooltip: '본인포함 부양자수 * 150만원' },
        { key: '소득공제', value: pretty({ field: 'incomeDeduction', monthly: false }) },
        { key: '소득세액공제', value: pretty({ field: 'taxDeduction', monthly: false }) },
        { key: '과세표준', value: pretty({ field: 'taxOn', monthly: false }), tooltip: `소득세 계산의 기준이 되는 연소득으로, {과세금액} - {소득세를 제외한 공제항목들} 입니다.` },
      ],
    }, {
      title: '세금',
      items: [
        { key: '국민연금', value: pretty({ field: 'pension' }), tooltip: '과세금액의 4.5% (상한: 월 235,800)' },
        { key: '건강보험', value: pretty({ field: 'health' }), tooltip: '과세금액의 3.495%' },
        { key: '장기요양', value: pretty({ field: 'care' }), tooltip: '건강보험료의 12.27%' },
        { key: '고용보험', value: pretty({ field: 'hire' }), tooltip: '과세금액의 0.8%' },
        { key: '소득세', value: pretty({ field: 'incomeTax' }), tooltip: '과세표준 구간별로 상이.' },
        { key: '지방소득세', value: pretty({ field: 'incomeTaxLocal' }), tooltip: '소득세의 10%' },
      ],
    }])

    const result = computed(() => salary({
      preTax: preTax.value,
      nonTax: nonTax.value,
      numFamily: numFamily.value
    }))

    return {
      refInfoNonTax,
      preTax,
      nonTax,
      numFamily,
      showDetail,
      result,
      reports,
      resultAsCrypto,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-salary {
  .params {
    display: flex;

    .form-control {
      flex: 1;

      &:not(:last-child) {
        margin-right: 8px;
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
          height: 0;
          opacity: 0;
          transition: all 0.2s ease;
          pointer-events: none;
        }
      }
    }
  }

  .report-section {
    transition: all 0.2s ease;

    &:not(:last-child) {
      margin-bottom: 32px;
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
    cursor: pointer;

    i {
      font-size: 20px;
    }
  }
}
</style>