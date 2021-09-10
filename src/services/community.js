import * as $http from 'axios'
import crudService from './crud'

const post = crudService.post

const toggleReaction = (postId, type) => $http.post('reactions', { postId, type })

const checkPassword = ({ id, type, password }) => $http.post('check_password', { id, type, password })

export default {
  post,
  checkPassword,
  toggleReaction,
}