import { Board } from '@/types'
import { $http } from '@/modules/axios'
import crudService from './crud'

// @ts-ignore
const post = crudService.post

// postId, replyId중 하나만 넣어야 함
const toggleReaction = {
  post: ({
    postId,
    type,
    nickname,
  }: {
    postId: number,
    type: string,
    nickname: string,
  }) => $http.post('reactions/posts', { postId, type, nickname }),
  reply: ({
    replyId,
    type,
    nickname,
  }: {
    replyId: number,
    type: string,
    nickname: string,
  }) => $http.post('reactions/replies', { replyId, type, nickname }),
  message: ({
    messageId,
    type,
    nickname,
  }: {
    messageId: number,
    type: string,
    nickname: string,
  }) => $http.post('reactions/messages', { messageId, type, nickname }),
}

const checkPassword = {
  post: ({
    sharingKey,
    password,
  }: {
    sharingKey: string,
    password: string,
  }) => $http.post(`posts/${sharingKey}/check_password`, { password }),
  reply: ({
    id,
    password,
  }: {
    id: number,
    password: string,
  }) => $http.post(`replies/${id}/check_password`, { password }),
}

const remove = {
  post: ({
    sharingKey,
    password,
  }: {
    sharingKey: string,
    password?: string, // 로그인 유저인 경우, token으로 인증하므로 password는 필요 없음
  }) => $http.delete(`posts/${sharingKey}`, { data: { password } }),
  reply: ({
    id,
    password,
  }: {
    id: number,
    password?: string, // 로그인 유저인 경우, token으로 인증하므로 password는 필요 없음
  }) => $http.delete(`replies/${id}`, { data: { password } }),
}

export default {
  board: {
    all: () => $http.get('boards') as Promise<{
      data: Board[]
      total: number
    }>,
  },
  post,
  remove,
  checkPassword,
  toggleReaction,
}