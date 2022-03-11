import * as $http from 'axios'

const marketInfo = {
  indices: () => $http.get('market_info/indices'),
  leaderboard: () => $http.get('market_info/leaderboard'),
  marketcaps: params => $http.get('https://api.coinmarketcap.com/data-api/v3/cryptocurrency/listing', { params }),
  symbols: () => $http.get('market_info/symbols'),
}

export default marketInfo