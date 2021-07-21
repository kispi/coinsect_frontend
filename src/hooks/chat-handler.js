import { ref, getCurrentInstance, nextTick } from 'vue'
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

  const refAppChatBody = ref(null)

  const profile = ref({
    nickname: null,
    image: null,
  })

  const connection = ref(null)

  const connected = ref(null)

  const token = ref(null)

  const recommendNickname = () => {
    const randIdx = Math.floor(Math.random() * nicknameRecommendations.length)
    const randNo = Math.floor(Math.random() * 100 + 1)
    return `${nicknameRecommendations[randIdx]}${randNo}`.slice(0, 8)
  }

  const recommendSymbol = () => {
    const randIdx = Math.floor(Math.random() * Object.keys(store.getters.symbols).length)
    return Object.keys(store.getters.symbols)[randIdx]
  }

  const scrollToBottom = () => {
    nextTick(() => {
      if (refAppChatBody.value) refAppChatBody.value.scrollTop = refAppChatBody.value.scrollHeight
    })
  }

  const addMessage = message => {
    messages.value.push({
      profile: (message.user || {}).profile,
      isMine: (message.user || {}).token === token.value,
      text: message.text,
      timestamp: message.ts,
      type: message.type,
    })

    scrollToBottom()
  }

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
      case 'text':
        addMessage(message)
        break
      case 'auth':
        token.value = message.user.token
        setLocalAccount()
        break
    }

    store.commit('setNumActiveUsers', message.numConnections)
  }

  const connect = () => {
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
    }

    connection.value.onclose = () => {
      connected.value = false
      setTimeout(connect, 1000)
    }
  }

  const loadRecentMessages = async () => {
    try {
      const data = await plugins.$http.get('messages/latest')
      data.forEach(addMessage)
    } catch (e) {}
  }

  const init = () => {
    if (Object.keys(store.getters.symbols).length === 0) return

    const user = plugins.$helpers.localStorage.getMeta('user')
    if (user) {
      token.value = user.token
      profile.value = user.profile
    } else {
      profile.value = {
        nickname: recommendNickname(),
        image: `https://static.upbit.com/logos/${recommendSymbol()}.png`,
      }
    }

    store.commit('setChatFolded', plugins.$helpers.localStorage.getMeta('chatFolded'))

    loadRecentMessages()
    connect()
  }

  return {
    refAppChatBody,
    connected,
    profile,
    messages,
    setLocalAccount,
    scrollToBottom,
    recommendNickname,
    sendWebsocketMessage,
    init,
  }
}

export default useChatHandler