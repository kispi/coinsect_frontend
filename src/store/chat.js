const chat = {
  state: () => ({
    chat: {
      messages: [],
      autoScrollable: null,
      incomingMessage: null,
      lastReadMessage: null,
      ding: null,
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
      Object.keys(chat).forEach(key => state.chat[key] = chat[key])
    },
    setWebsocketConnections(state, websocketConnections) {
      Object.keys(websocketConnections).forEach(key => state.websocketConnections[key] = websocketConnections[key])
    },
  },
}

export default chat