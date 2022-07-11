import { $http } from '@/modules/axios'

const onchain = {
  richlist: {
    bitcoin: () => $http.get('onchain/richlist/bitcoin'),
  },
}

export default onchain