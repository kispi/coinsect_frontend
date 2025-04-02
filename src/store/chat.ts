import { Message } from '@/types'
import helpers from '@/helpers'
import { Module } from 'vuex'
import { RootState } from '.'

export interface VuexStateChat {
  chat: {
    connection?: WebSocket | null
    connected: boolean | null
    messages: Message[]
    autoScrollable: boolean | null
    incomingMessage: Message | null
    lastWebsocketMessage: Message | null
    lastReadMessage: Message | null
    writingReplyTo: Message | null // 값이 존재한다면, 이 메시지에 답장을 쓰고있는 것이다.
    preventAutoReconnect: boolean | null
  }
}

const chat: Module<VuexStateChat, RootState> = {
  state: () => ({
    chat: {
      connection: null,
      connected: null,
      messages: [],
      autoScrollable: null,
      incomingMessage: null,
      lastWebsocketMessage: null,
      lastReadMessage: null,
      writingReplyTo: null,
      preventAutoReconnect: null,
    },
  }),
  getters: {
    chat: state => state.chat,
  },
  mutations: {
    setChat(state, chat) {
      Object.keys(chat).forEach(key => {
        state.chat[key as keyof VuexStateChat['chat']] = chat[key]
        if (key === 'lastReadMessage') helpers.localStorage.setMeta('lastReadMessage', chat[key])
      })
    },
  },
}

export default chat