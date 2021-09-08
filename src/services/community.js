import * as $http from 'axios'
import crudService from './crud'

const post = crudService.post

const toggleReaction = (postId, type) => $http.post('reactions', { postId, type })

export default {
  post,
  toggleReaction,
}