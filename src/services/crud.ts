import { $http } from '@/modules/axios'
import helpers from '@/helpers'

const crudTargets = [
  'person',
  'post',
  'reply',
].map(key => ({
  model: key,
  endpoint: helpers.template.case.toSnake(helpers.template.case.pluralize(key)),
}))

const crud = {} as any
crudTargets.forEach(target => {
  const model = target.model
  const endpoint = target.endpoint
  crud[model] = {
    create: (modelObj: any) => $http.post(`${endpoint}`, modelObj),
    all: (params: any) => $http.get(`${endpoint}`, { params }),
    detail: (modelId: number, params: any) => $http.get(`${endpoint}/${modelId}`, { params }),
    update: (modelObj: any) => $http.put(`${endpoint}/${(modelObj.sharingKey || modelObj.id)}`, modelObj),
    delete: (modelId: number) => $http.delete(`${endpoint}/${modelId}`),
  }
})

export default crud