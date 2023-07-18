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
          <li><a href="https://bingx.com/en-us/act/task/6726462354/?ch=act_newuserjuly&ref=coinsect" target="_blank">7월 신규가입 이벤트(600 USDT)</a></li>
          <li><a href="https://bingx.com/en-sa/act/template/4639?ref=OYEUJ6XS&randomId=1270977198" target="_blank">7월 입금 이벤트(500 USDT)</a></li>
          <li>coinsect 레퍼럴 코드로 가입하시면 위 두 이벤트는 자동 적용되며, 각 페이지를 보시면 보너스를 받기 위한 조건을 알 수 있습니다.</li>
        </ul>
      </div>
      <ul class="disclaimer">
        <li
          :key="benefit"
          v-for="benefit in benefits"
          v-html="benefit"
        />
      </ul>
      <ul class="f-12 m-t-40">
        <li>암호화폐 거래소 레퍼럴 시스템에 관해 더 궁금하다면 <a href="/contents/crypto-referral" target="_blank" class="text-underline">크립토 레퍼럴</a> 페이지를 참조하세요.</li>
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

    const x = (props.options.exchange || '').toLowerCase()

    const hasEvent = computed(() => x === 'bingx' && plugins.$helpers.dayjs().isBefore('2023-08-01'))

    const benefits = computed(() => {
      if (x === 'bybit') return ['트래블룰 통과: 업비트, 빗썸, 코인원, 코빗', '수수료 20% 할인 (0.01% / 0.048%)', '입금액 / 거래량에 따라 최대 30,000 USDT 보너스']
      if (x === 'bingx') return ['트래블룰 통과: 빗썸, 코인원', '수수료 45% 페이백 (0.011% / 0.0275%)', '입금액 / 거래량에 따라 최대 5,000 USDT 보너스']
    })

    const exchange = computed(() => {
      const exchange = x
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
      benefits,
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