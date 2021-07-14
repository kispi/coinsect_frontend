import * as $http from 'axios'

const marketInfo = {
  indices: () => $http.get('market_info/indices'),
}

export default marketInfo