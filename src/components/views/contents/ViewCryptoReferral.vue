<template>
  <div class="view-crypto-referral">
    <div class="page-title"></div>
    <div class="section m-t-0">
      <div class="description m-b-8">
        도대체 그놈의 레퍼럴이 뭔데 이렇게 말이 많은걸까요?<br>
        레퍼럴은 추천인 제도입니다. 다른 사람에게 거래소에 가입하도록 하는 영업의 일종이죠.<br>
        다른 사람이 내 레퍼럴 코드를 입력해서 가입하면, 그 사람도 매매시 수수료 할인 혜택을 받을 수 있고, 추천받은 사람은 추천자가 내는 매매 수수료의 일부(거래소마다 다르며, 계약하기 나름으로 보통 40~60%선)를 받을 수 있습니다.<br>
        따라서 추천자가 매매시 지불하는 수수료의 일부를 내가 추천해준 사람이 먹는다는 사실이 불쾌한게 아니라면, <b>레퍼럴 코드를 입력하고 거래소를 이용하는게 이득</b>입니다.<br>
        (셀퍼럴: self-referral => 본인의 부계정이나 가족 등 지인의 계정을 레퍼럴로 지정해서 이용할 수도 있으나, 이 경우 실수로 동일 IP로 접속한다든지 하는 경우나 신고 등으로 적발되면 영구 이용정지 등의 제한을 받을 수 있습니다.)<br>
      </div>
    </div>
    <div class="section">
      <div class="section-title m-t-16">2022년 말 기준 주요 거래소별 할인 요율</div>
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
            :key="exchange.name"
            v-for="exchange in exchanges">
            <td>
              <div class="flex-row items-center">
                <AppImg :src="exchange.img" class="flex-wrap m-r-8"/>{{ exchange.key }}
              </div>
            </td>
            <td>{{ exchange.n.m * 100 }}% / {{ exchange.n.t * 100 }}%</td>
            <td>{{ exchange.d.m * 100 }}% / {{ exchange.d.t * 100 }}%</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="section">
      <div class="section-title">레퍼럴 수익 계산기</div>
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
      <div class="description m-t-24">
        포지션 규모 * 매매 횟수 * 추천인 수 * 매매일 수 * 시장가 수수료 * 커미션<br>
        = <b class="result">${{ Math.round(payload.positionSize * payload.tradingFrequency * payload.numReferrer * payload.numDays * payload.exchange.d.t * payload.commisionRate).toLocaleString() }}</b><br><br>
        이해를 돕기 위한 예제 시나리오:<br>
        - $1,000 증거금을 입금해서<br>
        - 20배로 1비트정도를 잡고(비트 $20,000이라 가정)<br>
        - 하루 1회 샀다 팔았다 총 2회 매매하는 추천인이<br>
        - 100명 있는 비트겟 인플루언서의<br>
        - 1일 수익을 계산해보자.<br>
        - 커미션은 50%로 가정<br><br>
        결론:<br>
        - 레퍼럴 코드를 입력하는건 실제로 가입자의 매매 수수료를 줄여준다.<br>
        - 유명한 인플루언서들은 위 계산식의 입력값들이 기본 예시보다 훨씬 클거라고 쉽게 추측이 가능하다.<br>
        - 그러니 읍읍 급의 인플루언서들은 하루에 몇백씩 날리더라도 그게 큰 타격이 되지 않을 정도의 엄청난 레퍼럴 수익을 올리며, 따라서 일반인의 상식으로는 이해가 안갈 리스크의 무지성 매매가 가능하다.<br>
        - 거래소 입장에서도 괜히 모의시드 따위를 줘서 나중에 큰 스캔들이 터질 건덕지를 만들 리스크를 감수할 필요조차 없이 이미 이들을 두둑히 챙겨주고 있는 것이다. (모의시드는 헛소문일 확률이 높습니다. 트래블룰조차 통과되지 않는 잡거래소들은 혹시 모르겠습니다.)<br>
        - 매매를 자주 하는 것 자체가 거래소에 수수료를 퍼주는 짓이며, 굳이 잦은 매매를 해야겠다면 내가 정말 후원하고 싶은 인플루언서의 레퍼럴 코드를 쓰는 것을 권장한다.<br>
        - 다만, 당신이 돈을 벌든 강제청산당하든 추천받은 사람은 수수료를 챙겨간다.
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, ref } from 'vue'

export default {
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const exImg = ex => plugins.$helpers.withCdn(`images/exchanges/${ex}.png`)

    const exchanges = ref([
      { key: 'Binance', n: { m: 0.0002, t: 0.0004 }, d: { m: 0.00016, t: 0.00032 }, img: exImg('BINANCE') },
      { key: 'Bybit', n: { m: 0.0001, t: 0.0006 }, d: { m: 0.0001, t: 0.00048 }, img: exImg('BYBIT') },
      { key: 'Bitget', n: { m: 0.0004, t: 0.0008 }, d: { m: 0.0002, t: 0.0004 }, img: exImg('BITGET'), $$selected: true },
    ])

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
      onSelectExchange,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-crypto-referral {
  max-width: 720px;
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

  .description {
    font-size: 12px;
    line-height: 20px;
  }

  .result {
    font-size: 20px;
    line-height: 32px;
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
  }

  .inputs {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 8px;

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