import { $http } from '@/modules/axios'
import crudService from './crud'

const post = crudService.post

// postId, replyId중 하나만 넣어야 함
const toggleReaction = ({ postId, replyId, type, nickname }) => $http.post('reactions', { postId, replyId, type, nickname })

const checkPassword = {
  post: ({ sharingKey, password }) => $http.post(`posts/${sharingKey}/check_password`, { password }),
  reply: ({ id, password }) => $http.post(`replies/${id}/check_password`, { password }),
}

const remove = {
  post: ({ sharingKey, password }) => $http.delete(`posts/${sharingKey}`, { data: { password } }),
  reply: ({ id, password }) => $http.delete(`replies/${id}`, { data: { password } }),
}

export default {
  board: {
    all: () => $http.get('boards'),
  },
  post,
  remove,
  checkPassword,
  toggleReaction,
}