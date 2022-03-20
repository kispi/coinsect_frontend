<template>
  <div class="view-salary">
    <!-- <div class="title">
      내 월급은 몇 BTC?
    </div> -->
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
        <label>비과세 (연)</label>
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
            :ref="el => item.$$ref = el"
            class="report-box"
            @mouseover="() => item.tooltip ? $tooltip.show({
              id: `tooltip${item.name}`,
              showAbove: item.$$ref,
              text: item.tooltip,
            }) : null"
            @mouseleave="$tooltip.hide(`tooltip${item.name}`)"
            :key="item.name"
            v-for="item in report.items">
            <div class="key" v-html="item.key"/>
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

export default {
  setup() {
    const preTax = ref(22000000)

    const nonTax = ref(1200000)

    const numFamily = ref(1)

    const showDetail = ref(null)

    const pretty = (value, monthly = true) => (Math.floor(value / (monthly ? 12 : 1))).toLocaleString()

    const reports = computed(() => [{
      title: '요약',
      items: [
        { key: '월급 (세전)', value: pretty(preTax.value) },
        { key: '월급 (세후)', value: pretty(result.value.afterTax) },
      ],
    }, {
      title: '공제',
      items: [
        { key: '인적공제', value: pretty(result.value.familyDeduction, false), tooltip: '본인포함 부양자수 * 150만원' },
        { key: '소득공제', value: pretty(result.value.incomeDeduction, false) },
        { key: '소득세액공제', value: pretty(result.value.taxDeduction, false) },
        { key: '과세금액', value: pretty(preTax.value - nonTax.value, false), tooltip: '{연봉 (세전)} - {비과세 (연)}' },
        { key: '과세표준', value: pretty(result.value.taxOn, false), tooltip: `소득세 계산의 기준이 되는 연소득으로, {과세금액} - {소득세를 제외한 공제항목들} 입니다.` },
      ],
    }, {
      title: '세금',
      items: [
        { key: '국민연금', value: pretty(result.value.pension), tooltip: '과세금액의 4.5% (상한: 월 235,800)' },
        { key: '건강보험', value: pretty(result.value.health), tooltip: '과세금액의 3.495%' },
        { key: '장기요양', value: pretty(result.value.care), tooltip: '건강보험료의 12.27%' },
        { key: '고용보험', value: pretty(result.value.hire), tooltip: '과세금액의 0.8%' },
        { key: '소득세', value: pretty(result.value.incomeTax), tooltip: '과세표준 구간별로 상이.' },
        { key: '지방소득세', value: pretty(result.value.incomeTaxLocal), tooltip: '소득세의 10%' },
      ],
    }])

    const result = computed(() => salary({
      preTax: preTax.value,
      nonTax: nonTax.value,
      numFamily: numFamily.value
    }))

    return {
      preTax,
      nonTax,
      numFamily,
      showDetail,
      reports,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-salary {
  .title {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-stress);
    margin: 24px auto;
    display: table;
  }

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
      border: 1px solid var(--border-base);
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
    animation: y ease infinite 2s;
    cursor: pointer;

    i {
      font-size: 20px;
    }
  }
}
</style>