import { $http } from '@/modules/axios'
import crudService from './crud'

const post = crudService.post

const toggleReaction = ({ postId, type, nickname }) => $http.post('reactions', { postId, type, nickname })

const checkPassword = {
  post: ({ sharingKey, password }) => $http.post(`posts/${sharingKey}/check_password`, { password }),
  reply: ({ id, password }) => $http.post(`replies/${id}/check_password`, { password }),
}

const remove = {
  post: ({ sharingKey, password }) => $http.delete(`posts/${sharingKey}`, { data: { password } }),
  reply: ({ id, password }) => $http.delete(`replies/${id}`, { data: { password } }),
}

export default {
  post,
  remove,
  checkPassword,
  toggleReaction,
}