import * as $http from 'axios'

const marketInfo = {
  indices: () => $http.get('market_info/indices'),
  marketcaps: source => $http.get('market_info/marketcaps', { params: { source } }),
}

export default marketInfo