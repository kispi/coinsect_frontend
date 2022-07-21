import { ref, getCurrentInstance, onUnmounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const useChatHandler = () => {
  const plugins = getCurrentInstance().appContext.config.globalProperties

  const store = useStore()

  const router = useRouter()

  const messages = computed(() => store.getters.chat.messages)

  const filteredMessages = computed(() => messages.value.filter(m => !store.getters.settings.blockedUsers[m.token]))

  const connection = computed(() => store.getters.websocketConnections.chat)

  const connected = ref(null)

  const loadingMessages = ref(null)

  const fullyLoaded = ref(null)

  const token = ref(null)

  const pingInterv = ref(null)

  const d = ts => plugins.$helpers.dayjs(ts).format('YYYY-MM-DD')

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

  const openModalSentiment = user => {
    if ((user.profile || {}).sentiment && plugins.$helpers.dayjs(user.profile.sentiment.expireAt).isAfter(plugins.$helpers.dayjs())) return

    plugins.$modal.custom({
      component: 'ModalSentiment',
    }).then(type => {
      if (!type) return

      store.getters.chatUser.profile.sentiment = { type }
      setAccount(store.getters.chatUser.profile)
      plugins.$toast.success(`참여해주셔서 감사합니다. ${type === 'long' ? '떡상' : '떡락'}을 기원합니다.`)
    })
  }

  const handleMessage = message => {
    store.commit('setChatStats', message.stats)

    switch (message.type) {
      case 'alert':
      case 'image':
      case 'text': {
        const curMessage = preparedMessage(message)
        const prevMessage = messages.value[messages.value.length - 1]
        curMessage.$$showSeparator = showSeparator(curMessage, prevMessage)

        // 여기서는 배열의 끝에 넣는 것이므로 Array.push가 맞음
        messages.value.push(curMessage)
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
    store.commit('setWebsocketConnections', {
      chat: new WebSocket(`${endpoint}/webchat${token.value ? `?token=${token.value}` : ''}`),
    })

    connection.value.onmessage = event => {
      try {
        const json = JSON.parse(event.data)
        handleMessage(json)
      } catch (e) {}
    }

    connection.value.onopen = () => {
      connected.value = true
      pingInterv.value = setInterval(ping, 1000 * 30)

      store.commit('setChat', { messages: [] })
      loadMessages()
    }

    connection.value.onclose = () => {
      connected.value = false
      clearInterval(pingInterv.value)
      setTimeout(connect, 5000)
    }
  }

  const loadMessages = async () => {
    if (loadingMessages.value || fullyLoaded.value) return

    const firstMessageId = (messages.value[0] || {}).id
    try {
      loadingMessages.value = true
      const data = await plugins.$http.get('webchat/messages', { params: { firstMessageId } })
      if ((data || []).length === 0) {
        fullyLoaded.value = true
        return
      }

      data.forEach(message => messages.value.unshift(preparedMessage(message)))
      messages.value.forEach((_, idx) => {
        const prevMessage = messages.value[idx - 1]
        const curMessage = messages.value[idx]
        if (prevMessage && curMessage) curMessage.$$showSeparator = showSeparator(curMessage, prevMessage)
      })

      if (!firstMessageId) {
        plugins.$bus.$emit('first-load-messages')
      }
    } finally {
      loadingMessages.value = false
    }
  }

  const init = () => {
    token.value = (plugins.$helpers.localStorage.getMeta('user') || {}).token
    connect()
  }

  onUnmounted(() => {
    clearInterval(pingInterv.value)
  })

  return {
    connection,
    connected,
    messages,
    filteredMessages,
    ping,
    loadMessages,
    setAccount,
    sendWebsocketMessage,
    init,
  }
}

export default useChatHandler