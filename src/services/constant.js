import { $http } from '@/modules/axios'

const constant = {
  wallets: () => $http.get('wallets'),
}

export default constant