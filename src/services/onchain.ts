import { $http } from '@/modules/axios'

const onchain = {
  whaleAlert: (params: { limit: number, where: string }) => $http.get('onchain/whale_alert', { params }),
}

export default onchain