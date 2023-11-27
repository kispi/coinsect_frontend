import { $http } from '@/modules/axios'
import helpers from '@/helpers'

const crudTargets = [
  'person',
  'post',
  'reply',
  'pricePrediction',
].map(key => ({
  model: key,
  endpoint: helpers.template.case.toSnake(helpers.template.case.pluralize(key)),
}))

const crud = {}
crudTargets.forEach(target => {
  const model = target.model
  const endpoint = target.endpoint
  crud[model] = {
    create: (modelObj) => $http.post(`${endpoint}`, modelObj),
    all: (params) => $http.get(`${endpoint}`, { params }),
    detail: (modelId, params) => $http.get(`${endpoint}/${modelId}`, { params }),
    update: (modelObj) => $http.put(`${endpoint}/${(modelObj.sharingKey || modelObj.id)}`, modelObj),
    delete: (modelId) => $http.delete(`${endpoint}/${modelId}`),
  }
})

export default crud