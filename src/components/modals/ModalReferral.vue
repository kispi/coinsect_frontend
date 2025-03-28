<template>
  <div class="modal-referral scrollable-body">
    <ModalHeader :title="helpers.translate('MODAL_REFERRAL')" @close="$emit('close')"/>
    <div class="body pre-line">
      <div class="banner m-b-24">
        <a :href="referral.link" target="_blank" draggable="false">
          <ExchangeBanner :exchange="exchange.key"/>
        </a>
      </div>
      <ul class="disclaimer">
        <li>트래블룰 거래소: {{ travelRuleString }}</li>
        <li v-html="referral.promotion"/>
        <li
          :key="benefit"
          v-for="benefit in referral.benefits"
          v-html="benefit"
        />
      </ul>
      <ul class="small-list m-t-32">
        <li>레퍼럴 시스템에 관해 더 궁금하다면 <a href="/contents/crypto-referral" target="_blank" class="text-underline">크립토 레퍼럴</a> 페이지를 참조하세요.</li>
        <li>선물거래는 대단히 위험합니다. 이게 어떤 금융상품인지 경험해보는 것은 큰 공부가 되지만, 순식간에 큰 돈을 잃을 수 있으니 가급적이면 비트코인을 셀프 커스터디하기 위해 경유하는 수단으로만 사용하십시오.</li>
      </ul>
      <a class="btn btn-primary m-t-24 p-16" :href="referral.link" target="_blank" draggable="false">{{ exchange.name }} 수수료 혜택 받기</a>
    </div>
  </div>
</template>

<script setup>
import useGlobalHooks from '@/hooks/global-hooks'
import exchanges from '@/assets/constants/exchanges'
import referrals from '@/assets/constants/referrals'

const props = defineProps({
  options: {
    type: Object,
    required: true,
  },
})

const { helpers } = useGlobalHooks()

const exchange = exchanges[(props.options.exchange || '').toLowerCase()]

const referral = referrals[exchange.key]

const travelRuleString = (exchange.travelRule || []).map(exchangeKey => exchanges[exchangeKey].name).join(', ')
</script>

<style lang="scss" scoped>
.modal-referral {
  border-radius: 4px;
  width: 480px;
  color: var(--text-stress);

  .body {
    padding: 16px;
  }

  ul {
    padding-left: 16px;

    a {
      color: var(--brand-primary);
      text-decoration: underline,
    }

    li {
      list-style-type: disc;
      white-space: initial;

      &:not(:last-child) {
        margin-bottom: 4px;
      }
    }

    &.small-list {
      font-size: 12px;
      padding-left: 24px;
    }
  }
}
</style>