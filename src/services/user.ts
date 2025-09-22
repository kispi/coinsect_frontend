import { AccountStats, User } from '@/types'
import { $http } from '@/modules/axios'

const user = {
  me: () => $http.get('users/me'),
  accountStats: () => $http.get('users/me/stats') as Promise<{ stats: AccountStats }>,
  userStats: (id: number) => $http.get(`users/${id}/stats`) as Promise<{ stats: AccountStats }>,
  update: (user: User) => $http.put('users/me', user),
  delete: () => $http.delete('users/me'),
  signInKakao: (payload: { email: string, kakaoId: string }) => $http.post('users/sign_in_kakao', payload) as Promise<{ token: string }>,
}

export default user