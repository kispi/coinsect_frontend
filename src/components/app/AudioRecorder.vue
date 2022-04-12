<template>
  <div
    class="audio-recorder"
    :class="{
      'playing-disabled': recordStatus.ing || !audioUrl,
      'recording-disabled': playing,
    }">
    <audio
      ref="refAudio"
      :src="audioUrl"
      @ended="onPause"
      @pause="onPause"
    />
    <div class="recorder-container">
      <div class="recorder-border overlay a"/>
      <div class="recorder-border overlay b"/>
      <div class="recorder-border overlay c"/>
      <div class="stats">
        <i
          @click="onClickRecord"
          class="fa record-pause"
          :class="recordStatus.ing ? 'fa-stop' : 'fa-circle'"
        />
        <div class="current-time f-mono flex-fill">
          {{ formatPlaybackTime(playbackTime) }}
        </div>
        <i
          @click="onClickDownload"
          class="fal download fa-download flex-wrap"
        />
        <i
          @click="onClickPlay"
          class="fa play-stop"
          :class="playing ? 'fa-pause' : 'fa-play'"
        />
      </div>
      <div class="controls">
        <div
          :ref="e => slider.ref = e"
          class="current-time-slider"
          @touchstart="onMousedown"
          @mousedown="onMousedown">
          <div class="bar background">
            <div class="bar fill" :style="{ width: `calc(${slider.ratio * 100}%)`}"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, ref, onMounted, onUnmounted, watch } from 'vue'

export default {
  setup() {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const refAudio = ref(null)

    const slider = ref({
      ref: null,
      size: null,
      ratio: null,
      nextX: null,
      dragging: null,
    })

    const interv = ref(null)

    const playbackTime = ref(0)

    const playing = ref(null)

    const recordStatus = ref({
      ing: false,
      interv: null,
    })

    const stream = ref(null)

    const source = ref(null)

    const audioUrl = ref(null)

    const media = ref(null)

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

      try {
        stream.value = await navigator.mediaDevices.getUserMedia({ audio: true })
        media.value = new MediaRecorder(stream.value, {
          audioBitsPerSecond: 128000,
        })
        media.value.start()
        recordStatus.value.ing = true
        audioUrl.value = null
        source.value = ctx.createMediaStreamSource(stream.value)
        recordStatus.value.interv = setInterval(() => {
          playbackTime.value = ctx.getOutputTimestamp().contextTime
        }, 10)
      } catch (e) {
        plugins.$toast.error('녹음 중 알 수 없는 문제가 발생했습니다.')
      }
    }

    const recordEnd = () => {
      media.value.ondataavailable = e => {
        clearInterval(recordStatus.value.interv)
        recordStatus.value.ing = false

        if (typeof window.ysFixWebmDuration !== 'undefined') {
          window.ysFixWebmDuration(e.data, refAudio.value.duration)
        }

        audioUrl.value = URL.createObjectURL(e.data)
      }

      stream.value.getAudioTracks().forEach(track => track.stop())

      media.value.stop()

      source.value.disconnect()
    }

    const onClickRecord = () => {
      if (!recordStatus.value.ing) recordStart()
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

    const onClickDownload = () => {
      const a = document.createElement('a')
      a.download = 'coinsect-recording'
      a.href = audioUrl.value
      a.click()
    }

    const setNext = e => {
      if (!slider.value.ref) return

      const rectX =  slider.value.ref.getBoundingClientRect().x
      slider.value.nextX = (e.touches ? e.touches[0].clientX : e.clientX) - rectX

      if (slider.value.nextX < 0) slider.value.nextX = 0
      if (slider.value.nextX > slider.value.size) slider.value.nextX = slider.value.size

      slider.value.ratio = slider.value.nextX / slider.value.size
      refAudio.value.currentTime = refAudio.value.duration * slider.value.ratio
      playbackTime.value = refAudio.value.currentTime
    }

    const onMousemove = e => {
      if (!slider.value.dragging) return

      refAudio.value.pause()
      setNext(e)
    }

    const onMousedown = e => {
      slider.value.dragging = true
      document.addEventListener('mousemove', onMousemove)
      document.addEventListener('touchmove', onMousemove)

      setNext(e)
    }

    const onMouseup = () => {
      slider.value.dragging = false
      document.removeEventListener('mousemove', onMousemove)
      document.removeEventListener('touchmove', onMousemove)
    }

    onMounted(() => {
      slider.value.size = slider.value.ref.getBoundingClientRect().width
      document.addEventListener('mouseup', onMouseup)
      document.addEventListener('touchend', onMouseup)

      plugins.$helpers.dom.loadScript({ url: '/scripts/fix-webm-duration.js' })
    })

    onUnmounted(() => {
      document.removeEventListener('mouseup', onMouseup)
      document.removeEventListener('touchend', onMouseup)
    })

    watch(
      () => playbackTime.value,
      newVal => {
        slider.value.ratio = newVal / refAudio.value.duration
      },
    )

    return {
      refAudio,
      slider,
      recordStatus,
      playing,
      audioUrl,
      playbackTime,
      onPause,
      onClickDownload,
      onClickRecord,
      onClickPlay,
      onMousedown,
      formatPlaybackTime,
    }
  },
}
</script>

<style lang="scss">
.audio-recorder {
  .recorder-container {
    user-select: none;
    position: relative;
    width: 320px;
    color: var(--black);
    background: var(--white);

    .stats,
    .controls {
      display: flex;
      align-items: center;
    }

    .stats {
      padding: 0 8px;
    }

    .controls {
      background: var(--white);
      padding: 0 16px;
    }

    .record-pause,
    .current-time {
      flex: 0 0 auto;
    }

    .recorder-border {
      pointer-events: none;

      &.a {
        border: 1px solid red;
      }

      &.b {
        border: 1px solid green;
        top: 2px;
        left: -2px;
        right: 2px;
        bottom: -2px;
      }

      &.c {
        border: 1px solid blue;
        top: -2px;
        left: 2px;
        right: -2px;
        bottom: 2px;
      }
    }
  }

  .current-time {
    font-size: 16px;
  }

  .current-time-slider {
    flex: 1;
    height: 32px;
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;

    .fill {
      height: 100%;
      width: 50%;
      background: var(--gs-44);
      transition: none;
    }

    .background {
      position: absolute;
      overflow: hidden;
      border-radius: 12px;
      height: 12px;
      width: 100%;
      background: var(--gs-88);
    }
  }

  i {
    width: 48px;
    height: 48px;
    font-size: 24px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &.fa-circle {
      color: var(--danger);
    }

    &:hover {
      transform: scale(1.1);
    }
  }

  &.playing-disabled{
    .current-time-slider,
    .play-stop,
    .download {
      opacity: 0.5;
      pointer-events: none;
    }
  }

  &.recording-disabled {
    .record-pause {
      opacity: 0.5;
      pointer-events: none;
    }
  }
}
</style>