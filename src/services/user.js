import { $http } from '@/modules/axios'

const user = {
  create: user => $http.post('users', user),
  all: params => $http.get('users', { params }),
  detail: userId => $http.get(`users/${userId}`),
  update: user => $http.put('users', user),
  delete: userId => $http.delete(`users/${userId}`),
}

export default user