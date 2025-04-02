import { $http } from '@/modules/axios'
import { Wallet } from '@/types'

const constant = {
  wallets: () => $http.get('wallets') as Promise<{
    total: number
    data: Wallet[]
  }>,
}

export default constant