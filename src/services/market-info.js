import * as $http from 'axios'

const marketInfo = {
  indices: () => $http.get('market_info/indices'),
  marketcaps: params => $http.get('https://api.coingecko.com/api/v3/coins/markets', { params }),
}

export default marketInfo