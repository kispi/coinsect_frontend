<template>
  <div class="modal-referral scrollable-body">
    <ModalHeader :title="$translate('MODAL_REFERRAL')" @close="$emit('close')"/>
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
        <li>코인충 레퍼럴 코드(<a :href="referral.link" target="_blank">COINSECT</a>)를 사용해주시면 사이트 운영에 큰 도움이 됩니다.</li>
      </ul>
      <a class="btn btn-primary m-t-24 p-16" :href="referral.link" target="_blank" draggable="false">{{ exchange.name }} 수수료 혜택 받기</a>
    </div>
  </div>
</template>

<script>
import exchanges from '@/assets/constants/exchanges'
import referrals from '@/assets/constants/referrals'

export default {
  props: ['options'],
  setup(props) {
    const exchange = exchanges[(props.options.exchange || '').toLowerCase()]

    const travelRuleString = (exchange.travelRule || []).map(exchangeKey => exchanges[exchangeKey].name).join(', ')

    return {
      referral: referrals[(props.options.exchange || '').toLowerCase()],
      exchange,
      travelRuleString,
    }
  },
}
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