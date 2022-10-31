import { $http } from '@/modules/axios'

const user = {
  me: () => $http.get('users/me'),
  accountStats: () => $http.get('users/me/stats'),
  userStats: id => $http.get(`users/${id}/stats`),
  update: user => $http.put('users/me', user),
  delete: () => $http.delete('users/me'),
  signInKakao: payload => $http.post('users/sign_in_kakao', payload),
}

export default user