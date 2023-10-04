import { $http } from '@/modules/axios'

const onchain = {
  whaleAlert: params => $http.get('onchain/whale_alert', { params }),
}

export default onchain