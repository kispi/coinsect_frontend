<template>
  <div
    class="app-chat-message"
    :class="{'mine': message.isMine}">
    <div class="content">
      <AppChatProfile v-if="showProfile" :user="message.user" :useBan="true"/>
      <div class="text-and-timestamp">
        <template v-if="!message.$$hide">
          <template v-if="message.type === 'image'">
            <div
              v-if="$store.getters.settings.chatHideImage"
              class="text hidden">이미지를 보지 않습니다.<br>(채팅 설정에서 변경 가능합니다)</div>
            <AppImg
              v-else
              :src="message.text"
              @click="onClickImage(message.text)"
            />
          </template>
          <div
            v-if="['text', 'alert'].indexOf(message.type) >= 0 && (message.text || '').length > 0"
            class="text">
            <div
              v-if="(meta || {}).replyTo"
              class="meta-reply-to"
              @click="$emit('click-replied-message', meta.replyTo)">
              <div class="mrt-nickname">To: {{ meta.replyTo.nickname }}</div>
              <div
                class="m-t-4 lines-1">
                <AppImg
                  v-if="$helpers.isImageUrl(meta.replyTo.text)"
                  :src="meta.replyTo.text"
                />
                <div v-else class="o-50">{{ meta.replyTo.text }}</div>
              </div>
            </div>
            <div v-html="$helpers.dom.linkify(message.text)" @click.prevent="onClickMessage"/>
          </div>
        </template>
        <div v-else class="text hidden">
          {{ $translate('DELETED_BY_ADMIN') }}
        </div>
        <div class="additional">
          <div
            v-if="showTimestamp"
            class="timestamp f-mono"
            :class="message.isMine ? 'm-r-8' : 'm-l-8'"
            v-html="$helpers.dayjs(message.timestamp).format('HH:mm')"
          />
          <div
            v-if="message.type !== 'alert'"
            class="functions">
            <i class="far fa-reply" @click="$emit('click-function', { type: 'reply', message })"/>
            <!-- <i class="fa fa-heart" @click="$emit('click-function', { type: 'reaction', message })"/> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'

export default {
  emits: ['click-function', 'click-replied-message'],
  props: ['prevMessage', 'message', 'nextMessage'],
  setup(props) {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const router = useRouter()

    const d = ts => plugins.$helpers.dayjs(ts).format('YYYY-MM-DD HH:mm')

    const onClickImage = url => window.open(url, '_blank', 'noreferrer')

    const onClickMessage = e => {
      const link = (e.target.attributes['href'] || {}).value
      if (!link) return

      if (link.includes('coinsect.io')) {
        const path = link.split('coinsect.io')[1]
        if (path) router.push(path)
        return
      }

      window.open(link, '_blank', 'noreferrer')
    }

    const meta = computed(() => {
      try {
        const parsed = JSON.parse(props.message.meta)
        return parsed
      } catch (e) {}
    })

    const showProfile = computed(() => {
      if (props.message.isMine) return

      if (!props.message.user.profile) return

      if (!props.prevMessage) return true

      return props.prevMessage.user.token !== props.message.user.token ||
        d(props.prevMessage.timestamp) !== d(props.message.timestamp)
    })

    const showTimestamp = computed(() => {
      if (!props.nextMessage) return true

      // 직전 메시지와 다음 메시지를 다른 유저가 보낸 경우
      if (props.nextMessage.user.token !== props.message.user.token) return true

      // 직전 메시지와 다음 메시지의 유저가 같으나 타임스탬프도 1분 이상 차이가 나는 경우
      return d(props.nextMessage.timestamp) !== d(props.message.timestamp)
    })

    return {
      meta,
      showProfile,
      showTimestamp,
      onClickMessage,
      onClickImage,
    }
  },
}
</script>

<style lang="scss">
.app-chat-message {
  font-size: 12px;
  display: flex;

  &:not(:hover) {
    .functions {
      display: none;
    }
  }

  .content {
    width: 100%;

    .app-chat-profile {
      margin-top: 12px;
      margin-bottom: 8px;
    }
  }

  .text-and-timestamp {
    display: flex;
    align-items: flex-end;
    margin: 4px 0;

    img {
      width: 160px; // 크기를 미리 지정해줘야 cumulative layout shift를 방지해서 scrollToBottom이 올바로 최하단으로 스크롤하도록 할 수 있다.
      height: 160px;
      border-radius: 8px;
      border: 1px solid var(--border-base);
      cursor: pointer;
    }

    .text {
      background: var(--background-light);
      padding: 4px 8px;
      border-radius: 4px;
      max-width: 200px;
      color: var(--text-stress);
      white-space: pre-line;

      &.hidden {
        background: var(--danger);
      }
    }

    .additional {
      flex: 0 0 auto;
      font-size: 10px;
      display: flex;
      align-items: flex-end;
    }
  }

  .meta-reply-to {
    font-size: 10px;
    border-bottom: 1px solid var(--border-base);
    margin-bottom: 4px;
    padding-bottom: 4px;
    cursor: pointer;
  }

  .functions {
    display: flex;
    align-items: center;
    background: var(--background-light);
    border-radius: 4px;
    margin: 0 0 0 8px;

    i {
      padding: 4px;
      font-size: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      &:not(:last-child) {
        border-left: 1px solid var(--border-base);
      }

      &:hover {
        color: var(--brand-primary-hover);
      }
    }

    .fa-reply {
      transform: rotate(180deg);
    }
  }

  &.mine {
    justify-content: flex-end;

    .functions {
      margin: 0 8px 0 0;
    }

    .text-and-timestamp {
      flex-direction: row-reverse;

      .additional {
        flex-direction: row-reverse;
      }
    }
  }
}
</style>