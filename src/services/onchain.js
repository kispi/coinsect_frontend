import { $http } from '@/modules/axios'

const onchain = {
  richlist: {
    bitcoin: () => $http.get('onchain/richlist/bitcoin'),
    bitcoinCash: () => $http.get('onchain/richlist/bitcoin_cash'),
    dogecoin: () => $http.get('onchain/richlist/dogecoin'),
    litecoin: () => $http.get('onchain/richlist/litecoin'),
  },
}

export default onchain