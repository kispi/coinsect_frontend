<template>
  <div class="view-voice-recorder">
    <div class="voice-recorder section">
      <div class="section-title">
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/AudioContext" target="_blank">AudioContext</a>
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder" target="_blank">MediaRecorder</a>
        API
      </div>
      <AudioRecorder class="display-table"/>
      <div class="m-t-16 f-12">
        마이크 사용을 <b>허용</b>해야 녹음이 가능합니다.<br>
        만약 본의 아니게 차단한 경우, 브라우저 설정에서 찾아 다시 허용해주시면 됩니다.<br>
        크롬 기준 <b>[설정]</b> -> <b>[개인정보 및 보안]</b> -> <b>[사이트 설정]</b>에서 변경 가능합니다.
      </div>
    </div>
    <div class="voice-recognition section">
      <div class="section-title"><a href="https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition/grammars" target="_blank">webkitSpeechRecognition</a></div>
      <button class="btn btn-primary" @click="onClickRecognition">{{ active ? '음성인식중지(영어)' : '음성인식시작(영어)' }}</button>
      <div class="pre-line m-t-8">인식된 음성: {{ text || '-' }}</div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  setup() {
    const { plugins } = useGlobalHooks()

    const text = ref(null)

    const recognition = ref(null)

    const active = ref(null)

    const onClickRecognition = () => {
      if (active.value) {
        recognition.value.stop()
        active.value = false
      } else {
        recognition.value.start()
        active.value = true
      }
    }

    const init = () => {
      if (typeof webkitSpeechRecognition === 'undefined') {
        plugins.$toast.error('음성 인식은 크롬 브라우저에서만 사용 가능합니다.')
        return
      }

      recognition.value = new webkitSpeechRecognition()
      recognition.value.lang = 'en-US' // 'ko-KR'
      recognition.value.continuous = true
      recognition.value.onresult = (event) => text.value = event.results[event.results.length - 1][0].transcript
    }

    onMounted(init)

    return {
      active,
      text,
      onClickRecognition,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-voice-recorder {
  .section-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
  }

  .section {
    &:not(:last-child) {
      margin-bottom: 40px;
      padding-bottom: 40px;
      border-bottom: 1px solid var(--border-base);
    }
  }
}
</style>