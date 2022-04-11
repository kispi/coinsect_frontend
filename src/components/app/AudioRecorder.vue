<template>
  <div
    class="audio-recorder"
    :class="{'playing-disabled': recording || !audioUrl}">
    <audio
      ref="refAudio"
      :src="audioUrl"
      @ended="onPause"
      @pause="onPause"
    />
    <div class="recorder-container">
      <button
        @click="onClickRecord"
        class="btn btn-audio-interface record-pause">
        <i class="fa" :class="recording ? 'fa-stop' : 'fa-circle'"/>
      </button>
      <div class="current-time f-mono">
        {{ formatPlaybackTime(playbackTime) }}
      </div>
      <button
        v-if="audioUrl"
        @click="onClickPlay"
        class="btn btn-audio-interface play">
        <i class="fa" :class="playing ? 'fa-pause' : 'fa-play'"/>
      </button>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, ref } from 'vue'

export default {
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const refAudio = ref(null)

    const interv = ref(null)

    const playbackTime = ref(0)

    const playing = ref(null)

    const recording = ref(null)

    const stream = ref(null)

    const source = ref(null)

    const audioUrl = ref(null)

    const media = ref(null)

    const analyser = ref(null)

    const lz = t => plugins.$helpers.template.withLeadingZero(t, 2)

    const formatPlaybackTime = s => {
      const m = Math.floor(s / 60)
      s -= 60 * m

      return `${lz(m)}:${s >= 10 ? '' : '0'}${s.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    }

    const recordStart = async () => {
      if (typeof window.AudioContext === 'undefined') {
        plugins.$toast.error('녹음을 지원하지 않는 브라우저입니다.')
        return
      }

      const ctx = new window.AudioContext()
      analyser.value = ctx.createScriptProcessor(0, 1, 1)

      try {
        const newStream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(newStream, {
          audioBitsPerSecond: 128000,
        })
        mediaRecorder.start()
        stream.value = newStream
        media.value = mediaRecorder
        source.value = ctx.createMediaStreamSource(stream.value)
        source.value.connect(analyser.value)
        analyser.value.connect(ctx.destination)
        analyser.value.onaudioprocess = e => {
          recording.value = true
          playbackTime.value = e.playbackTime
        }
      } catch (e) {
        plugins.$toast.error('녹음 중 알 수 없는 문제가 발생했습니다.')
      }
    }

    const recordEnd = () => {
      media.value.ondataavailable = e => {
        audioUrl.value = URL.createObjectURL(e.data)
        recording.value = false
      }

      stream.value.getAudioTracks().forEach(track => track.stop())

      media.value.stop()

      analyser.value.disconnect()

      source.value.disconnect()
    }

    const onClickRecord = () => {
      recording.value = !recording.value
      if (recording.value) recordStart()
      else recordEnd()
    }

    const onPause = () => {
      playing.value = false
      clearInterval(interv.value)
    }

    const onClickPlay = () => {
      playing.value = !playing.value
      if (playing.value) {
        interv.value = setInterval(() => {
          playbackTime.value = refAudio.value.currentTime
        }, 10)

        refAudio.value.play()
      }
      else refAudio.value.pause()
    }

    return {
      refAudio,
      recording,
      playing,
      audioUrl,
      playbackTime,
      onPause,
      onClickRecord,
      onClickPlay,
      formatPlaybackTime,
    }
  },
}
</script>

<style lang="scss">
.audio-recorder {
  .recorder-container {
    width: 196px;
    overflow: hidden;
    border-radius: 8px;
    background: var(--background-light);
    display: flex;
    align-items: center;
    border: 1px solid var(--text-stress);

    .record-pause,
    .current-time {
      flex: 0 0 auto;
    }
  }

  .current-time {
    font-size: 16px;
    color: var(--text-stress);
    width: 64px;
  }

  .btn-audio-interface {
    background: none;
    width: 64px;
    height: 64px;

    i {
      font-size: 24px;
      color: var(--text-stress);

      &.fa-circle {
        color: var(--danger);
      }
    }
  }

  &.playing-disabled{
    .app-slider,
    .btn-audio-interface.play {
      opacity: 0.5;
      pointer-events: none;
    }
  }
}
</style>