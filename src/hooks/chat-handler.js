import { ref, onUnmounted, computed } from 'vue'
import useGlobalHooks from './global-hooks'

const useChatHandler = () => {
  const { plugins, store, router } = useGlobalHooks()

  const messages = computed(() => store.getters.chat.messages)

  const filteredMessages = computed(() => messages.value.filter(m => !store.getters.settings.blockedUsers[m.user.token]))

  const connection = computed(() => store.getters.chat.connection)

  const loadingMessages = ref(null)

  const fullyLoaded = ref(null)

  const token = ref(null)

  const pingInterv = ref(null)

  const alertProfile = {
    image: 'https://coinsect.io/favicon/logo.png',
    nickname: '알림',
  }

  const numUnreads = computed(() => {
    return (messages.value || []).filter(message => {
      if (!store.getters.chat.lastReadMessage) return

      return message.timestamp > store.getters.chat.lastReadMessage.timestamp
    }).length
  })

  const isMine = message => {
    if (!message.user) return

    if (store.getters.me && message.user.id) return store.getters.me.id === message.user.id

    return message.user.token === store.getters.chatUser.token
  }

  const preparedMessage = message => ({
    id: message.id,
    user: {
      id: (message.user || {}).id,
      profile: message.type === 'alert' ? alertProfile : (message.user || {}).profile,
      token: (message.user || {}).token,
    },
    isMine: isMine(message),
    text: message.text,
    timestamp: message.ts,
    type: message.type,
    meta: message.meta,
    $$reactions: (message.summary || {}).reactions,
  })

  const sendWebsocketMessage = message => {
    message.user = { token: store.getters.chatUser.token } // 보낸 사람의 토큰만 채팅서버로 알려줌 (기존에는 프로필 다보냄)
    if ((store.getters.header || {}).token) message.user.jwt = store.getters.header.token

    const replyTo = store.getters.chat.writingReplyTo
    if (replyTo) {
      message.meta = JSON.stringify({
        replyTo: {
          id: replyTo.id,
          text: replyTo.text,
          nickname: replyTo.user.profile.nickname,
        },
      })
      store.commit('setChat', { writingReplyTo: null })
    }
    connection.value.send(JSON.stringify(message))
  }

  const updateSentiment = async (type, force) => {
    const p = store.getters.chatUser.profile
    if ((p.sentiment || {}).type === type && !force) return

    p.sentiment = { type }
    store.dispatch('setAccount', p)
    plugins.$toast.success('기분을 업데이트했습니다')
    store.commit('setSettings', { sentimentVoted: true })
  }

  const checkSentimentVoted = user => {
    const sentimentVoted = (user.profile || {}).sentiment && plugins.$helpers.dayjs(user.profile.sentiment.expireAt).isAfter(plugins.$helpers.dayjs())
    store.commit('setSettings', { sentimentVoted })
  }

  const handleMessage = message => {
    store.commit('setChatStats', message.stats)

    switch (message.type) {
      case 'sessionExpired':
        plugins.$toast.error('최종 로그인 이후 7일이 경과하여 세션이 만료되었습니다. 다시 로그인해주세요!')
        setTimeout(() => store.dispatch('signOut'), 3000)
        break
      case 'alert':
      case 'image':
      case 'text': {
        const curMessage = preparedMessage(message)
        if (curMessage.text) {
          // 여기서는 배열의 끝에 넣는 것이므로 Array.push가 맞음
          messages.value.push(curMessage)
        }

        // 메시지가 너무 많아지면 DOM이 많아져서 성능에 문제가 생기므로 500개 초과시 100개로 다시 잘라줌.
        if (
          messages.value.length > 500 &&
          (store.getters.chat.autoScrollable || store.getters.settings.chatFolded)
        ) {
          store.commit('setChat', { messages: messages.value.slice(-100) })
        }

        store.commit('setChat', { lastWebsocketMessage: curMessage })
        break
      }
      case 'auth':
        checkSentimentVoted(message.user)
        plugins.$helpers.localStorage.setMeta('user', message.user)
        store.commit('setChatUser', message.user)
        ping()

        if (store.getters.me) {
          const m = store.getters.me
          store.dispatch('setAccount', {
            nickname: m.profile.nickname,
            image: m.profile.image,
          }).catch(e => plugins.$toast.error(e.data.message))
        }
        break
      case 'userSetting':
        store.commit('setChatUserSetting', message.meta)
        break
      case 'users':
        store.commit('setChatUsers', message)
        break
      case 'hideMessage': {
        const targetMessageId = (message.meta || {}).messageId
        if (!targetMessageId) return

        const targetMessage = (messages.value || []).find(m => m.id === targetMessageId)
        if (targetMessage) targetMessage.$$hide = true
        break
      }
      case 'updateReaction': {
        const targetMessage = store.getters.chat.messages.find(m => m.id === (message.meta || {}).messageId)
        const newReactions = (message.meta || {}).updatedReactions
        if (!targetMessage) return

        targetMessage.$$reactions = newReactions
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

  const updateUserSetting = async () => {
    try {
      const userSetting = await plugins.$http.put(`webchat/user_settings/${store.getters.chatUser.token}`, store.getters.chatUserSetting)
      store.commit('setChatUserSetting', userSetting)
    } catch (e) {
      plugins.$toast.error(e.data.message)
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

      if (!store.getters.chat.preventAutoReconnect) setTimeout(connect, 5000)

      store.commit('setChat', { preventAutoReconnect: false })
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
      const msgBuf = []
      data.forEach(msg => msgBuf.unshift(preparedMessage(msg)))
      store.commit('setChat', { messages: msgBuf.concat(messages.value) })

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
    connect()
  }

  onUnmounted(() => {
    clearInterval(pingInterv.value)
  })

  return {
    messages,
    filteredMessages,
    loadingMessages,
    numUnreads,
    ping,
    loadMessages,
    setAccount,
    updateSentiment,
    updateUserSetting,
    sendWebsocketMessage,
    init,
  }
}

export default useChatHandler