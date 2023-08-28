<template>
  <div class="view-crypto-referral">
    <div class="page-title"></div>
    <div class="section m-t-0">
      <div class="m-b-8">
        레퍼럴은 추천인 제도로, 다른 사람에게 거래소에 가입하도록 하는 영업입니다.<br>
        다른 사람이 내 레퍼럴 코드를 입력해서 가입하면, 그 사람도 수수료 할인 혜택을 받을 수 있고, 나도 그 사람이 내는 수수료의 일부를 받을 수 있습니다.(거래소마다 다르며, 계약하기 나름으로 보통 40~60%선)<br>
        따라서 <b>레퍼럴 코드를 사용해서 가입하여 거래소를 이용하는게 수수료 할인 혜택 때문에 이득</b>입니다.<br>
        (셀퍼럴: self-referral => 본인의 부계정이나 가족 등 지인의 계정을 레퍼럴로 지정해서 이용할 수도 있으나, 이 경우 실수로 동일 IP로 접속한다든지 하는 경우나 신고 등으로 적발되면 영구 이용정지 등의 제한을 받을 수 있습니다.)<br><br>
        아주 간단한 예시를 들면, 내가 <b>바이빗에서 한달간 지정가로만 거래해서 거래량 $1,000,000를 채웠다면 수수료는 $100이고, 이것의 50%인 $50을 인플루언서가 받게 됩니다. 이런 사람이 천명이라면 그 인플루언서는 매달 $50,000을 벌겠죠?</b>
      </div>
    </div>
    <div class="section">
      <div class="section-title m-t-16">주요 거래소별 할인 요율</div>
      <table>
        <thead>
          <tr>
            <th>거래소</th>
            <th>지정가 / 시장가</th>
            <th>지정가 / 시장가(할인)</th>
          </tr>
        </thead>
        <tbody>
          <tr
            @click="onClickExchange(exchange)"
            :class="{'cursor-pointer': exchange.link}"
            :key="exchange.name"
            v-for="exchange in exchanges">
            <td>
              <div class="flex-row items-center">
                <AppImg :src="exchange.img" class="flex-wrap m-r-8"/>{{ exchange.key }}
              </div>
            </td>
            <td>{{ asPercent(exchange.n.m) }}% / {{ asPercent(exchange.n.t) }}%</td>
            <td>{{ asPercent(exchange.d.m) }}% / {{ asPercent(exchange.d.t) }}%</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="section">
      <div class="section-title">레퍼럴 수익 계산기</div>
      <div>
        예시:<br>
        - $1,000 증거금을 입금해서 20배로 1비트정도를 잡고(비트 $20,000이라 가정)<br>
        - '시장가'로 하루 1회 샀다 팔았다 총 2회 매매하는 추천인이<br>
        - 100명 있는 비트겟 인플루언서의<br>
        - 1일 수익을 계산해보자.<br>
        - 커미션은 50%로 가정<br><br>
      </div>
      <div class="referral-calculator">
        <div class="inputs">
          <div class="form-control">
            <label>거래소</label>
            <AppDropdown
              :dropdownItems="exchanges"
              @select-dropdown-item="onSelectExchange"
            />
          </div>
          <div class="form-control">
            <label>수수료 커미션</label>
            <input v-model="payload.commisionRate" type="number" min="0" max="1"/>
          </div>
          <div class="form-control">
            <label>포지션 규모($)</label>
            <input v-model="payload.positionSize" type="number"/>
          </div>
          <div class="form-control">
            <label>매매 횟수</label>
            <input v-model="payload.tradingFrequency" type="number" pattern="\d*"/>
          </div>
          <div class="form-control">
            <label>추천인 수</label>
            <input v-model="payload.numReferrer" type="number" pattern="\d*"/>
          </div>
          <div class="form-control">
            <label>매매일 수</label>
            <input v-model="payload.numDays" type="number"/>
          </div>
        </div>
      </div>
      <div class="m-t-24">
        포지션 규모 * 매매 횟수 * 추천인 수 * 매매일 수 * 시장가 수수료 * 커미션<br>
        = ${{ payload.positionSize.toLocaleString() }} * {{ payload.tradingFrequency }} * {{ payload.numReferrer }} * {{ payload.numDays }} * {{ payload.exchange.d.t }} * {{ payload.commisionRate }}<br>
        = <b class="result">${{ Math.round(payload.positionSize * payload.tradingFrequency * payload.numReferrer * payload.numDays * payload.exchange.d.t * payload.commisionRate).toLocaleString() }}</b><br><br>
        요약:<br>
        - 레퍼럴 코드를 입력하면 수수료 혜택을 받을 수 있다.<br>
        - 실시간 시청자가 몇천명이 되는 연예인급 인플루언서들은 하루에 몇백씩 날리더라도 그게 큰 타격이 되지 않을 정도의 엄청난 레퍼럴 수익을 올리며, 따라서 일반인의 기준으로는 이해가 안갈 리스크의 무지성 매매가 가능하다.<br>
        - <RouterLink :to="'/community/iVE5o84sTRmbRzGOCvN-XQ'" class="c-brand-primary">방송인들은 종종 출금인증을 하곤 한다.</RouterLink> 모의시드라면 있을수가 없는 일이다.<br>
        - 인플루언서 입장에서도 자기 레퍼럴로 가입한 사람들이 청산당하지 않고 오래 매매해야 좋다.<br>
        - 매매를 자주 하는 것 자체가 거래소에 수수료를 퍼주는 것이며, 굳이 잦은 매매를 해야겠다면 내가 정말 후원하고 싶은 인플루언서의 레퍼럴 코드를 쓰자.<br>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  setup() {
    const { plugins } = useGlobalHooks()

    const exImg = ex => plugins.$helpers.withCdn(`images/exchanges/${ex}.png`)

    const asPercent = val => (val * 100).toLocaleString(undefined, { maximumFractionDigits: 4 })

    const exchanges = ref([
      { key: 'Binance', n: { m: 0.0002, t: 0.0004 }, d: { m: 0.00016, t: 0.00032 }, img: exImg('BINANCE'), $$selected: true },
      { key: 'Bybit', n: { m: 0.0001, t: 0.0006 }, d: { m: 0.0001, t: 0.00048 }, img: exImg('BYBIT'), link: 'https://partner.bybit.com/b/coinsect' },
      { key: 'Bitget', n: { m: 0.0004, t: 0.0008 }, d: { m: 0.0002, t: 0.0004 }, img: exImg('BITGET') },
      { key: 'BingX', n: { m: 0.0002, t: 0.0005 }, d: { m: 0.00011, t: 0.000275 }, img: exImg('BINGX'), link: 'https://bingx.com/en-us/partner/coinsect' },
    ])

    const onClickExchange = exchange => {
      if (!exchange.link) return

      window.open(exchange.link, '_blank')
    }

    const payload = ref({
      exchange: exchanges.value.find(ex => ex.$$selected),
      commisionRate: 0.5,
      positionSize: 20000,
      tradingFrequency: 2,
      numReferrer: 100,
      numDays: 1,
    })

    const onSelectExchange = e => {
      payload.value.exchange = exchanges.value.find(ex => ex.key === e.key)
    }

    return {
      payload,
      exchanges,
      asPercent,
      onSelectExchange,
      onClickExchange,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-crypto-referral {
  margin: auto;
  color: var(--text-stress);

  .section-title {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .section {
    margin: 40px 0;
  }

  .result {
    font-size: 20px;
  }

  table {
    width: 100%;
    text-align: left;

    td,
    th {
      padding: 8px;
    }

    img {
      width: 16px;
      height: 16px;
    }

    tr {
      &:hover {
        background: var(--background-light);
      }
    }
  }

  .inputs {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;

    input {
      border-radius: 4px;
    }
  }

  @media (max-width: 479px) {
    table {
      font-size: 12px;
    }
  }
}
</style>