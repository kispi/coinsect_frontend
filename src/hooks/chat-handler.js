import { ref, getCurrentInstance, onUnmounted } from 'vue'
import { useStore } from 'vuex'

const nicknameRecommendations = [
  '가즈아', '흑우', '블랙카우', '손절장인', '익항올', '이말올', '이럴거면왜올림', '이럴거면왜내림', '대폰지', '결국폰지사기',
  '오늘도물타기', '물린뒤전망조사', '강제장투', '야미털기', '건전한조정', '코린이', '버거타임', '세력', '타노스빔', '우지한의', '떡락충', '침팬치',
  '메로나', '장대양봉', '스크류바', '장대음봉', '투더문', '기도매매', '우상향', '존버의신', '행복회로불탐', '리또속', '워뇨띠꿈나무', '했제충',
  '무지성롱', '어제청산당함', '청산당할예정', '데드캣', '단타의신', '그새팔았음', '뚝100불남음', '다시는안칠게요', '귀하의포지션이', '방금음전',
  '올해10만불',
]

const useChatHandler = () => {
  const plugins = getCurrentInstance().appContext.config.globalProperties

  const store = useStore()

  const messages = ref([])

  const profile = ref({
    nickname: null,
  })

  const connection = ref(null)

  const connected = ref(null)

  const loadingMessages = ref(null)

  const fullyLoaded = ref(null)

  const pingInterv = ref(null)

  const connectionInterv = ref(null)

  const token = ref(null)

  const recommendNickname = () => {
    const randIdx = Math.floor(Math.random() * nicknameRecommendations.length)
    const randNo = Math.floor(Math.random() * 100 + 1)
    return `${nicknameRecommendations[randIdx]}${randNo}`.slice(0, 8)
  }

  const d = ts => plugins.$helpers.dayjs(ts).format('YYYY-MM-DD')

  const showSeparator = (curMessage, prevMessage) => {
    if (!curMessage || !curMessage.timestamp) return false

    return prevMessage && curMessage && (d(prevMessage.timestamp) !== d(curMessage.timestamp))
  }

  const preparedMessage = message => ({
    id: message.id,
    profile: (message.user || {}).profile,
    token: (message.user || {}).token,
    isMine: (message.user || {}).token === token.value,
    text: message.text,
    timestamp: message.ts,
    type: message.type,
  })

  const sendWebsocketMessage = message => {
    message.user = {
      token: token.value,
      profile: profile.value,
    }
    connection.value.send(JSON.stringify(message))
  }

  const setLocalAccount = () => {
    plugins.$helpers.localStorage.setMeta('user', {
      token: token.value,
      profile: profile.value,
    })
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
        token.value = message.user.token
        setLocalAccount()
        break
    }

    store.commit('setNumActiveUsers', message.numConnections)
  }

  const connect = async () => {
    try {
      messages.value = []
      await loadMessages()
    } catch (e) {}

    const endpoint = process.env.VUE_APP_API_DOMAIN.replace('http', 'ws')

    connection.value = new WebSocket(`${endpoint}/chat${token.value ? `?token=${token.value}` : ''}`)

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
      clearInterval(connectionInterv.value)
    }

    connection.value.onclose = () => {
      connected.value = false
      clearInterval(pingInterv.value)
      connectionInterv.value = setInterval(connect, 1000)
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
    const user = plugins.$helpers.localStorage.getMeta('user')
    if (user) {
      token.value = user.token
      profile.value = user.profile
    } else {
      profile.value = {
        nickname: recommendNickname(),
      }
    }

    connect()
  }

  onUnmounted(() => {
    clearInterval(pingInterv.value)
  })

  return {
    connected,
    profile,
    messages,
    loadMessages,
    setLocalAccount,
    recommendNickname,
    sendWebsocketMessage,
    init,
  }
}

export default useChatHandler