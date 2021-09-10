import * as $http from 'axios'
import crudService from './crud'

const post = crudService.post

const toggleReaction = (postId, type) => $http.post('reactions', { postId, type })

const checkPassword = {
  post: ({ id, password }) => $http.post(`posts/${id}/check_password`, { password }),
  reply: ({ id, password }) => $http.post(`replies/${id}/check_password`, { password }),
}

const remove = {
  post: ({ id, password }) => $http.delete(`posts/${id}`, { data: { password } }),
  reply: ({ id, password }) => $http.delete(`replies/${id}`, { data: { password } }),
}

export default {
  post,
  remove,
  checkPassword,
  toggleReaction,
}