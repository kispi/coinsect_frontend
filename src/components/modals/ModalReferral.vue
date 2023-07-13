<template>
  <div class="modal-referral scrollable-body">
    <ModalHeader :title="$translate('MODAL_REFERRAL')" @close="$emit('close')"/>
    <div class="body pre-line">
      <div class="banner m-b-24">
        <a :href="exchange.link" target="_blank" draggable="false">
          <component :is="exchange.component"/>
        </a>
        <ul
          v-if="hasEvent"
          class="event">
          <li><a href="https://bingx.com/en-us/act/task/6726462354/?ch=act_newuserjuly&ref=coinsect" target="_blank">7월 신규가입 이벤트($600)</a></li>
          <li><a href="https://bingx.com/en-sa/act/template/4639?ref=OYEUJ6XS&randomId=1270977198" target="_blank">7월 입금 이벤트($500)</a></li>
          <li>coinsect 레퍼럴 코드로 가입하시면 위 두 이벤트는 자동 적용되며, 각 페이지를 보시면 보너스를 받기 위한 조건을 알 수 있습니다.</li>
        </ul>
      </div>
      <ul class="disclaimer">
        <li class="c-danger">레버리지 선물 거래는 매우 위험합니다. 경험많은 트레이더가 아니라면 <b>절대 하지 마십시오</b>. 박호두가 못하는게 아닙니다.</li>
        <li><a href="https://n.news.naver.com/article/001/0013570873" target="_blank">FTX의 사례</a>처럼, <span class="c-danger">거래소에 돈을 장기간 두는 것은 매우 위험합니다.</span> 항상 매매를 위해 사용할 소액만 예치하고, 코인은 항상 내 개인지갑이나 최소한 국내거래소(ex: 업비트)에 보관하십시오.</li>
        <li>국내 거래소에서 직접 내 개인지갑으로 100만원을 초과하는 금액의 암호화폐를 옮길 수 없으므로, 경유하기 위한 목적으로 최소 해외거래소 한군데는 KYC를 해두시면 편리합니다.</li>
        <li>트래블룰이 통과된 거래소만 광고합니다.</li>
        <li>레퍼럴 시스템에 관해 더 궁금하다면 <a href="/contents/crypto-referral" target="_blank">크립토 레퍼럴</a> 페이지를 참조하세요.</li>
        <li>기타 궁금한 점은 홈페이지 하단의 카톡/텔레그램으로 문의주세요.</li>
      </ul>
      <a class="btn btn-primary m-t-24 p-16" :href="exchange.link" target="_blank" draggable="false">{{ options.exchange }} 수수료 혜택 받기</a>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  props: ['options'],
  setup(props) {
    const { plugins } = useGlobalHooks()

    const hasEvent = computed(() => props.options.exchange === 'BINGX' && plugins.$helpers.dayjs().isBefore('2023-08-01'))

    const exchange = computed(() => {
      const exchange = (props.options.exchange || '').toLowerCase()
      return {
        component: `Banner${plugins.$helpers.template.case.toCapital(exchange)}`,
        link: (() => {
          let link = ''
          if (exchange === 'bybit') link = 'https://partner.bybit.com/b/coinsect'
          if (exchange === 'bingx') link = 'https://bingx.com/en-us/partner/coinsect'
          return link
        })(),
      }
    })

    return {
      hasEvent,
      exchange,
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
    font-size: 13px;
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

    &.event {
      margin-top: 24px;
      padding: 8px;
      border: 1px solid var(--text-stress);
      background: var(--bg-secondary);

      li {
        list-style: none;
      }
    }
  }
}
</style>