import { ref, getCurrentInstance, onUnmounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

// 훅 바깥에 있어야 전역으로 계속 메모리에 남음.
let sounds = [
  { type: 'long', audio: null, path: 'files/filled_hodu_1.mp3' },
  { type: 'long', audio: null, path: 'files/filled_ralo_long_1.mp3' },
  { type: 'short', audio: null, path: 'files/filled_hodu_short_1.mp3' },
  { type: 'short', audio: null, path: 'files/filled_hodu_short_2.mp3' },
]

const useChatHandler = () => {
  const plugins = getCurrentInstance().appContext.config.globalProperties

  const store = useStore()

  const router = useRouter()

  const messages = computed(() => store.getters.chat.messages)

  const filteredMessages = computed(() => messages.value.filter(m => !store.getters.settings.blockedUsers[m.token]))

  const connection = computed(() => store.getters.chat.connection)

  const loadingMessages = ref(null)

  const fullyLoaded = ref(null)

  const token = ref(null)

  const pingInterv = ref(null)

  const d = ts => plugins.$helpers.dayjs(ts).format('YYYY-MM-DD')

  const play = type => {
    const arr = sounds.filter(s => s.type === type)
    const randIdx = Math.floor(Math.random() * arr.length)
    const audio = arr[randIdx].audio
    if (audio) audio.play()
  }

  const populateSounds = () => {
    if (store.getters.isSSR || typeof Audio === 'undefined') return

    sounds.forEach(sound => {
      const audio = new Audio(plugins.$helpers.withCdn(sound.path))
      audio.volume = 0.2
      sound.audio = audio
    })
  }

  const showSeparator = (curMessage, prevMessage) => {
    if (!curMessage || !curMessage.timestamp) return false

    return prevMessage && curMessage && (d(prevMessage.timestamp) !== d(curMessage.timestamp))
  }

  const alertProfile = {
    image: 'https://coinsect.io/favicon/favicon.svg',
    nickname: '알림',
  }

  const preparedMessage = message => ({
    id: message.id,
    profile: message.type === 'alert' ? alertProfile : (message.user || {}).profile,
    token: (message.user || {}).token,
    isMine: (message.user || {}).token === store.getters.chatUser.token,
    text: message.text,
    timestamp: message.ts,
    type: message.type,
    meta: message.meta,
  })

  const sendWebsocketMessage = message => {
    message.user = { token: store.getters.chatUser.token } // 보낸 사람의 토큰만 채팅서버로 알려줌 (기존에는 프로필 다보냄)
    const replyTo = store.getters.chat.writingReplyTo
    if (replyTo) {
      message.meta = JSON.stringify({
        replyTo: {
          id: replyTo.id,
          text: replyTo.text,
          nickname: replyTo.profile.nickname,
        },
      })
      store.commit('setChat', { writingReplyTo: null })
    }
    connection.value.send(JSON.stringify(message))
  }

  const updateSentiment = async type => {
    const p = store.getters.chatUser.profile
    if ((p.sentiment || {}).type === type) return

    p.sentiment = { type }
    try {
      await setAccount(p)
      plugins.$toast.success(`${type === 'long' ? '롱' : '숏'}으로 가보자!`)
      play(type)
    } catch (e) {}
  }

  const openModalSentiment = user => {
    if (process.env.NODE_ENV !== 'production') return

    if ((user.profile || {}).sentiment && plugins.$helpers.dayjs(user.profile.sentiment.expireAt).isAfter(plugins.$helpers.dayjs())) return

    plugins.$modal.custom({
      component: 'ModalSentiment',
    }).then(type => {
      if (!type) return

      updateSentiment(type)
    })
  }

  const handleMessage = message => {
    store.commit('setChatStats', message.stats)

    switch (message.type) {
      case 'alert':
      case 'image':
      case 'text': {
        const curMessage = preparedMessage(message)
        if (curMessage.text) {
          const prevMessage = filteredMessages.value[filteredMessages.value.length - 1]
          curMessage.$$showSeparator = showSeparator(curMessage, prevMessage)

          // 여기서는 배열의 끝에 넣는 것이므로 Array.push가 맞음
          messages.value.push(curMessage)
        }
        store.commit('setChat', { lastWebsocketMessage: curMessage })
        break
      }
      case 'auth':
        openModalSentiment(message.user)
        plugins.$helpers.localStorage.setMeta('user', message.user)
        store.commit('setChatUser', message.user)
        ping()
        break
      case 'connections':
        store.commit('setChatConnections', message)
        break
      case 'hideMessage': {
        const targetMessageId = (message.meta || {}).messageId
        if (!targetMessageId) return

        const targetMessage = (messages.value || []).find(m => m.id === targetMessageId)
        if (targetMessage) targetMessage.$$hide = true
        break
      }
      case 'forceRefresh':
        plugins.$helpers.forceRefresh()
        break
    }
  }

  const setAccount = async profile => {
    try {
      const user = await plugins.$http.put(`webchat/users/${store.getters.chatUser.token}`, {
        profile,
      })
      store.commit('setChatUser', user)
    } catch (e) {
      return Promise.reject(e)
    }
  }

  const ping = () => {
    connection.value.send(JSON.stringify({
      type: 'ping',
      user: {
        path: router.currentRoute.value.path,
      },
    }))
  }

  const connect = async () => {
    const endpoint = process.env.VUE_APP_API_DOMAIN.replace('http', 'ws')

    // 나중엔 endpoint가 채팅서버로 바뀌어야함
    store.commit('setChat', {
      connection: new WebSocket(`${endpoint}/webchat${token.value ? `?token=${token.value}` : ''}`),
    })

    connection.value.onmessage = event => {
      try {
        const json = JSON.parse(event.data)
        handleMessage(json)
      } catch (e) {}
    }

    connection.value.onopen = () => {
      store.commit('setChat', { connected: true })
      pingInterv.value = setInterval(ping, 1000 * 30)

      store.commit('setChat', { messages: [] })
      loadMessages()
    }

    connection.value.onclose = () => {
      store.commit('setChat', { connected: false })
      clearInterval(pingInterv.value)
      setTimeout(connect, 5000)
    }
  }

  const loadMessages = async limit => {
    if (loadingMessages.value || fullyLoaded.value) return

    const firstMessageId = (messages.value[0] || {}).id
    try {
      loadingMessages.value = true
      const data = await plugins.$http.get('webchat/messages', { params: { firstMessageId, limit } })
      if ((data || []).length === 0) {
        fullyLoaded.value = true
        return
      }

      // 새로 온 메시지들에 대해 $$showSeparator 계산. 매번 messages.value를 직접 바꾸지 않고 msgBuf를 둠으로 '메시지 개수'회 렌더링이 아닌 한번만 렌더링함.
      let msgBuf = []
      data.forEach((_, idx) => {
        const prevMessage = data[idx - 1] ? preparedMessage(data[idx - 1]) : null
        const curMessage = data[idx] ? preparedMessage(data[idx]) : null
        if (prevMessage && curMessage) curMessage.$$showSeparator = showSeparator(curMessage, prevMessage)
        msgBuf.unshift(curMessage)
      })

      // 존재하던 메시지 중 가장 오래된 것과 새로 온 메시지 
      const oldestMessageBeforeConcat = messages.value[0]
      if (msgBuf[msgBuf.length - 1] && oldestMessageBeforeConcat) {
        oldestMessageBeforeConcat.$$showSeparator = showSeparator(oldestMessageBeforeConcat, msgBuf[msgBuf.length - 1])
      }

      store.commit('setChat', { messages: msgBuf.concat(messages.value) })
      msgBuf = []

      if (!firstMessageId) plugins.$bus.$emit('first-load-messages')
      return data
    } catch (e) {
      return Promise.reject(e)
    } finally {
      loadingMessages.value = false
    }
  }

  const init = () => {
    token.value = (plugins.$helpers.localStorage.getMeta('user') || {}).token
    populateSounds()
    connect()
  }

  onUnmounted(() => {
    clearInterval(pingInterv.value)
  })

  return {
    connection,
    messages,
    filteredMessages,
    loadingMessages,
    updateSentiment,
    ping,
    loadMessages,
    setAccount,
    sendWebsocketMessage,
    init,
    play,
  }
}

export default useChatHandler