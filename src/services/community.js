import * as $http from 'axios'
import crudService from './crud'

const post = crudService.post

const toggleReaction = (postId, type) => $http.post('reactions', { postId, type })

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