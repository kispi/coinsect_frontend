import { ref, getCurrentInstance, onUnmounted } from 'vue'
import { useStore } from 'vuex'

const useChatHandler = () => {
  const plugins = getCurrentInstance().appContext.config.globalProperties

  const store = useStore()

  const messages = ref([])

  const connection = ref(null)

  const connected = ref(null)

  const loadingMessages = ref(null)

  const fullyLoaded = ref(null)

  const pingInterv = ref(null)

  const d = ts => plugins.$helpers.dayjs(ts).format('YYYY-MM-DD')

  const showSeparator = (curMessage, prevMessage) => {
    if (!curMessage || !curMessage.timestamp) return false

    return prevMessage && curMessage && (d(prevMessage.timestamp) !== d(curMessage.timestamp))
  }

  const preparedMessage = message => ({
    id: message.id,
    profile: (message.user || {}).profile,
    token: (message.user || {}).token,
    isMine: (message.user || {}).token === store.getters.me.token,
    text: message.text,
    timestamp: message.ts,
    type: message.type,
  })

  const sendWebsocketMessage = message => {
    message.user = { token: store.getters.me.token } // 보낸 사람의 토큰만 채팅서버로 알려줌 (기존에는 프로필 다보냄)
    connection.value.send(JSON.stringify(message))
  }

  const handleMessage = message => {
    switch (message.type) {
      case 'alert':
      case 'text': {
        const curMessage = preparedMessage(message)
        const prevMessage = messages.value[messages.value.length - 1]
        curMessage.$$showSeparator = showSeparator(curMessage, prevMessage)

        // 여기서는 배열의 끝에 넣는 것이므로 Array.push가 맞음
        messages.value.push(curMessage)
        plugins.$bus.$emit('incoming-message', curMessage)
        break
      }
      case 'auth':
        plugins.$helpers.localStorage.setMeta('token', message.user.token)
        store.commit('setMe', message.user)
        break
      case 'account':
        store.commit('setMe', message.user)
        break
    }

    store.commit('setNumActiveUsers', message.numConnections)
  }

  const setAccount = profile => {
    connection.value.send(JSON.stringify({
      type: 'account',
      user: {
        token: store.getters.me.token,
        profile,
      },
    }))
  }

  const connect = async token => {
    const endpoint = process.env.VUE_APP_API_DOMAIN.replace('http', 'ws')

    connection.value = new WebSocket(`${endpoint}/chat${token ? `?token=${token}` : ''}`)

    connection.value.onmessage = event => {
      try {
        const json = JSON.parse(event.data)
        handleMessage(json)
      } catch (e) {
        console.error(e)
      }
    }

    connection.value.onopen = () => {
      connected.value = true
      pingInterv.value = setInterval(() => {
        connection.value.send(JSON.stringify({
          type: 'ping',
        }))
      }, 1000 * 30)

      messages.value = []
      loadMessages()
    }

    connection.value.onclose = () => {
      connected.value = false
      clearInterval(pingInterv.value)
      setTimeout(connect, 1000)
    }
  }

  const loadMessages = async () => {
    if (loadingMessages.value || fullyLoaded.value) return

    const firstMessageId = (messages.value[0] || {}).id
    try {
      loadingMessages.value = true
      const data = await plugins.$http.get('messages', { params: { firstMessageId } })
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
    connect(plugins.$helpers.localStorage.getMeta('token'))
  }

  onUnmounted(() => {
    clearInterval(pingInterv.value)
  })

  return {
    connected,
    messages,
    loadMessages,
    setAccount,
    sendWebsocketMessage,
    init,
  }
}

export default useChatHandler