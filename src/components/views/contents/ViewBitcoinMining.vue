<template>
  <div class="view-bitcoin-mining">
    <div
      @click="showExplanation = !showExplanation"
      class="c-brand-primary cursor-pointer text-underline display-table m-b-8">
      {{ $translate('WHAT_IS_MINING') }}
    </div>
    <div
      v-if="showExplanation"
      class="explanation">
      <div
        class="description">
        - 비트코인 채굴은 <span>작업증명</span>(PoW: proof of work) 이라는 방식을 통해 이루어지는데, 먼저 <a href="https://namu.wiki/w/%ED%95%B4%EC%8B%9C" target="_blank">해시 함수</a>가 무엇인지에 대한 이해가 필요하다.<br>
        - 해시 함수란, <span>임의의 길이를 갖는 데이터</span>를 <span>고정된 길이의 데이터</span>로 매핑하는 함수를 말한다. 간단한 테스트로, 아래 텍스트 영역에 아무 데이터나 집어 넣어보면 그에 맞는 16진수 64자리의 해시값이 출력되는 것을 확인할 수 있다.<br>
        - 하나 눈여겨볼점은, '함수'이기 때문에 <span>동일한 입력이</span> 주어진 경우 항상 <span>동일한 결과</span>를 얻게 된다는 점이다. 이를테면 'hello world'를 치면 'b94d27b99...'을 얻는다. 결과가 'b94d27b99...'인데도 자기는 'hello world'를 입력했던게 아니라고 주장한다면 거짓임을 알 수 있다. (물론 이론적으로 가능은 하며, 이것을 해시 충돌이라고 한다.)
      </div>
      <div class="m-t-16 m-b-16">
        <textarea v-model="message" @keydown="doDigest" @paste="doDigest"/>
        <div class="sha-256">해시값: {{ digested }}</div>
      </div>
      <div class="description">
        비트코인 채굴은 바로 위의 <a href="https://namu.wiki/w/SHA" target="_blank">SHA256</a> 해시 함수를 통해 계산된 결과가 특정 조건을 만족하는 경우 완료된다. 이를테면 다음과 같다.<br>
        1. 위 텍스트 박스에 '이전 블록의 해시값', '블록 생성 시각', '임의의 난수' 등 몇 가지 요소가 조합된 데이터를 넣고 해시값을 계산해본다.<br>
        2. 그 결과가 특정한 값보다 <span>작다면</span> 성공이다. 쉽게 얘기하면 '해시값의 맨 앞에 연속된 0이 n개 이상이어야 한다'로 생각할 수도 있다. 이를테면 10진수를 여덟 자리로 표기할 경우 가장 큰 값은 99999999인데, 만약 계산결과가 12345라면 00012345으로 표기할 수 있고, 맨 앞에 연속한 0이 3개이므로 10만보다 작다는 것을 알 수 있다.<br>
        3. 이런식으로 특정 조건을 만족하는 1의 구성요소들을 갖고 주변 블록체인들에 전파해서 동의를 얻으면 블록 생성 권한을 얻고 비트코인을 보상으로 받는다.<br>
        4. 정확한 표현은 아니나, 대중적 이해의 수준에서는 보통 해시값 '맨 앞에 연속한 0의 개수' = '난이도' 정도로 설명하는 수준으로 족하다. (사실은 좀 더 복잡하다.)
        5. 해시값은 64자리 16진수이므로, 난이도 1이 증가할 때마다 채굴에 소모되는 시간은 대략 평균적으로 16배가 증가한다고 생각할 수 있다.
        6. 실제 비트코인 채굴은 저런 단순 해시값을 계산하는데 최적화된 특수장비(ASIC)를 통해 수행하므로, 우리가 사용하는 일반적인 CPU나 GPU등의 연산속도와는 차원이 다를 정도로 계산속도가 빠르다.
      </div>
      <div class="f-12 m-t-8">참조:
        <a href="https://medium.com/dnext-post/blockchain-core-series-pow-61227506a8c7" target="_blank">블록체인 코어 시리즈: 작업증명(PoW)</a>,
        <a href="https://btc.com/stats/diff" target="_blank">난이도 히스토리</a>
      </div>
    </div>
    <div class="simulator m-t-8">
      <div class="flex-row items-center m-t-16">
        <div class="flex-wrap">{{ $translate('DIFFICULTY') }}</div>
        <input v-model="difficulty" type="number" min="1" max="64" class="m-l-8 m-r-8">
        <button @click="onClickMine" class="btn btn-primary">{{ $translate('TEST_MINING') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'

export default {
  setup() {
    const showExplanation = ref(null)

    const difficulty = ref(4)

    const message = ref('hello world')

    const digested = ref(null)

    const digest = async message => {
      const msgUint8 = new TextEncoder().encode(message)
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
      return hashHex
    }

    const doDigest = e => {
      setTimeout(async () => {
        digested.value = null
        message.value = e.target.value
        if (typeof message.value !== 'string') return

        digested.value = await digest(message.value)
      })
    }

    const onClickMine = () => {
      
    }

    onMounted(() => digest(message.value).then(result => digested.value = result))

    return {
      showExplanation,
      message,
      difficulty,
      digested,
      digest,
      doDigest,
      onClickMine,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-bitcoin-mining {
  .description {
    line-height: 1.5;

    span {
      font-weight: 700;
    }
  }

  .sha-256 {
    font-size: 12px;
  }

  a {
    text-decoration: underline;
    color: var(--brand-primary);
  }

  .explanation {
    border: 1px solid var(--border-base);
    padding: 16px;
  }
}
</style>