import helpers from "@/helpers"

const chat = {
  state: () => ({
    chat: {
      messages: [],
      autoScrollable: null,
      incomingMessage: null,
      lastWebsocketMessage: null,
      lastReadMessage: null,
      writingReplyTo: null, // 값이 존재한다면, 이 메시지에 답장을 쓰고있는 것이다.
    },
    websocketConnections: {
      chat: null,
    },
  }),
  getters: {
    chat: state => state.chat,
    websocketConnections: state => state.websocketConnections,
  },
  mutations: {
    setChat(state, chat) {
      Object.keys(chat).forEach(key => {
        state.chat[key] = chat[key]
        if (key === 'lastReadMessage') helpers.localStorage.setMeta('lastReadMessage', chat[key])
      })
    },
    setWebsocketConnections(state, websocketConnections) {
      Object.keys(websocketConnections).forEach(key => state.websocketConnections[key] = websocketConnections[key])
    },
  },
}

export default chat